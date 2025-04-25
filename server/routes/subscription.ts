import { Router, Request, Response, NextFunction } from 'express';
import { stripeService } from '../stripe-service';
import { storage } from '../storage';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users, mentors, subscriptions, payments } from '@shared/schema';

export const subscriptionRouter = Router();

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
}

// Middleware para verificar se o usuário é um mentor
function isMentor(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Acesso negado. Apenas mentores podem acessar este recurso.' });
  }
  next();
}

// Criar uma nova assinatura
subscriptionRouter.post('/create-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId || !['basic', 'pro', 'enterprise'].includes(planId)) {
      return res.status(400).json({ message: 'Plano inválido' });
    }
    
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Verificar se já existe uma assinatura ativa
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    // Se já existir uma assinatura, retorna erro
    if (existingSubscription && existingSubscription.status !== 'canceled' && existingSubscription.status !== 'expired') {
      return res.status(400).json({ 
        message: 'Você já possui uma assinatura ativa',
        subscriptionId: existingSubscription.id
      });
    }
    
    // Criar a assinatura no Stripe
    const { subscriptionId, clientSecret } = await stripeService.createSubscription(
      req.user, 
      mentorRecord.id, 
      planId as 'basic' | 'pro' | 'enterprise'
    );
    
    // Calcular o número máximo de clientes com base no plano
    const maxClients = stripeService.getMaxClientsForPlan(planId as 'basic' | 'pro' | 'enterprise');
    
    // Criar o registro de assinatura no banco de dados
    await db.insert(subscriptions).values({
      mentorId: mentorRecord.id,
      plan: planId,
      status: 'trial', // Começa com período de teste
      maxClients,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: planId, // Armazenamos o ID do plano para referência
      // O período gratuito é de 7 dias, então a data de término é hoje + 7 dias
      stripeCurrentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    
    // Atualizar o registro do usuário com o customerID do Stripe
    if (!req.user.stripeCustomerId) {
      const customerId = await stripeService.getOrCreateCustomer(req.user);
      await db.update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, req.user.id));
    }
    
    res.status(200).json({
      success: true,
      subscriptionId,
      clientSecret,
      plan: planId
    });
  } catch (error: any) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ message: error.message || 'Erro ao criar assinatura' });
  }
});

// Atualizar uma assinatura (upgrade/downgrade de plano)
subscriptionRouter.post('/update-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId || !['basic', 'pro', 'enterprise'].includes(planId)) {
      return res.status(400).json({ message: 'Plano inválido' });
    }
    
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Verificar se existe uma assinatura ativa
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    if (!existingSubscription || !existingSubscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    // Se a assinatura não estiver ativa ou em período de teste
    if (existingSubscription.status !== 'active' && existingSubscription.status !== 'trial') {
      return res.status(400).json({ message: 'Assinatura não está ativa' });
    }
    
    // Atualizar a assinatura no Stripe
    const { updated, clientSecret } = await stripeService.updateSubscription(
      existingSubscription.stripeSubscriptionId,
      planId as 'basic' | 'pro' | 'enterprise'
    );
    
    if (updated) {
      // Calcular o número máximo de clientes com base no plano
      const maxClients = stripeService.getMaxClientsForPlan(planId as 'basic' | 'pro' | 'enterprise');
      
      // Atualizar o registro de assinatura no banco de dados
      await db.update(subscriptions)
        .set({
          plan: planId,
          maxClients,
          stripePriceId: planId,
          updatedAt: new Date()
        })
        .where(eq(subscriptions.id, existingSubscription.id));
      
      res.status(200).json({
        success: true,
        subscriptionId: existingSubscription.stripeSubscriptionId,
        clientSecret,
        plan: planId
      });
    } else {
      res.status(400).json({ message: 'Não foi possível atualizar a assinatura' });
    }
  } catch (error: any) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({ message: error.message || 'Erro ao atualizar assinatura' });
  }
});

// Cancelar uma assinatura
subscriptionRouter.post('/cancel-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const { cancelImmediate = false } = req.body;
    
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Verificar se existe uma assinatura ativa
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    if (!existingSubscription || !existingSubscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    // Se a assinatura já estiver cancelada
    if (existingSubscription.status === 'canceled' || existingSubscription.status === 'expired') {
      return res.status(400).json({ message: 'Assinatura já está cancelada' });
    }
    
    // Cancelar a assinatura no Stripe
    const cancelAtPeriodEnd = !cancelImmediate;
    const canceled = await stripeService.cancelSubscription(
      existingSubscription.stripeSubscriptionId,
      cancelAtPeriodEnd
    );
    
    if (canceled) {
      // Atualizar o registro de assinatura no banco de dados
      await db.update(subscriptions)
        .set({
          status: cancelAtPeriodEnd ? 'active' : 'canceled', // Se for cancelar no final do período, mantém como ativa por enquanto
          stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
          updatedAt: new Date(),
          cancellationReason: req.body.reason || null
        })
        .where(eq(subscriptions.id, existingSubscription.id));
      
      res.status(200).json({
        success: true,
        message: cancelAtPeriodEnd 
          ? 'Sua assinatura será cancelada no final do período de faturamento atual' 
          : 'Sua assinatura foi cancelada imediatamente'
      });
    } else {
      res.status(400).json({ message: 'Não foi possível cancelar a assinatura' });
    }
  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: error.message || 'Erro ao cancelar assinatura' });
  }
});

// Reativar uma assinatura cancelada que ainda não chegou ao fim do período
subscriptionRouter.post('/reactivate-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Verificar se existe uma assinatura
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    if (!existingSubscription || !existingSubscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    // Se a assinatura não estiver configurada para cancelar no fim do período
    if (!existingSubscription.stripeCancelAtPeriodEnd) {
      return res.status(400).json({ 
        message: 'Esta assinatura não pode ser reativada porque já foi completamente cancelada ou não está configurada para cancelar no final do período'
      });
    }
    
    // Reativar a assinatura no Stripe
    const reactivated = await stripeService.reactivateSubscription(
      existingSubscription.stripeSubscriptionId
    );
    
    if (reactivated) {
      // Atualizar o registro de assinatura no banco de dados
      await db.update(subscriptions)
        .set({
          stripeCancelAtPeriodEnd: false,
          updatedAt: new Date(),
          cancellationReason: null
        })
        .where(eq(subscriptions.id, existingSubscription.id));
      
      res.status(200).json({
        success: true,
        message: 'Sua assinatura foi reativada com sucesso'
      });
    } else {
      res.status(400).json({ message: 'Não foi possível reativar a assinatura' });
    }
  } catch (error: any) {
    console.error('Erro ao reativar assinatura:', error);
    res.status(500).json({ message: error.message || 'Erro ao reativar assinatura' });
  }
});

// Obter a assinatura atual do mentor
subscriptionRouter.get('/current-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Buscar a assinatura do mentor
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    // Se tiver ID da assinatura no Stripe, busca os detalhes adicionais
    let stripeSubscription = null;
    if (subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripeService.getSubscription(subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Erro ao buscar assinatura no Stripe:', error);
        // Continua sem os detalhes do Stripe se houver erro
      }
    }
    
    // Calcular os dias restantes do período atual
    let daysRemaining = 0;
    if (subscription.stripeCurrentPeriodEnd) {
      const currentPeriodEnd = new Date(subscription.stripeCurrentPeriodEnd);
      const now = new Date();
      daysRemaining = Math.max(0, Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }
    
    // Formatar a assinatura para resposta
    const formattedSubscription = {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      maxClients: subscription.maxClients,
      clientCount: subscription.clientCount,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
      daysRemaining,
      cancelAtPeriodEnd: subscription.stripeCancelAtPeriodEnd,
      currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
      // Adicionar detalhes do Stripe se disponíveis
      stripeDetails: stripeSubscription ? {
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAt: stripeSubscription.cancel_at ? new Date(stripeSubscription.cancel_at * 1000) : null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      } : null
    };
    
    res.status(200).json(formattedSubscription);
  } catch (error: any) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar assinatura' });
  }
});

// Obter o histórico de faturas
subscriptionRouter.get('/invoices', isAuthenticated, isMentor, async (req, res) => {
  try {
    // Buscar o ID do mentor associado ao usuário
    const mentorRecord = await db.query.mentors.findFirst({
      where: eq(mentors.userId, req.user.id)
    });
    
    if (!mentorRecord) {
      return res.status(404).json({ message: 'Registro de mentor não encontrado' });
    }
    
    // Buscar a assinatura do mentor
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorRecord.id)
    });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }
    
    // Buscar faturas no Stripe
    const invoices = await stripeService.listInvoices(subscription.stripeSubscriptionId);
    
    // Formatar faturas para resposta
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amountDue: invoice.amount_due / 100, // Convertendo de centavos para a moeda base
      amountPaid: invoice.amount_paid / 100,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      periodStart: new Date(invoice.period_start * 1000),
      periodEnd: new Date(invoice.period_end * 1000),
      receiptUrl: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf
    }));
    
    res.status(200).json(formattedInvoices);
  } catch (error: any) {
    console.error('Erro ao buscar faturas:', error);
    res.status(500).json({ message: error.message || 'Erro ao buscar faturas' });
  }
});

// Webhook para processar eventos do Stripe
subscriptionRouter.post('/webhooks', async (req, res) => {
  // Obtenha a assinatura da requisição enviada pelo Stripe
  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return res.status(400).json({ message: 'Assinatura do webhook não encontrada' });
  }
  
  try {
    // Validar e processar o evento
    const event = await stripeService.handleWebhookEvent(
      req.body,
      signature
    );
    
    // Processar os diferentes tipos de eventos
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data);
        break;
      
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    res.status(400).json({ message: error.message });
  }
});

// Funções para lidar com eventos do Stripe
async function handleSubscriptionCreated(subscription: any) {
  const { metadata } = subscription;
  
  // Se não houver metadados, não podemos vincular a assinatura
  if (!metadata || !metadata.mentorId) {
    console.log('Assinatura criada sem metadados de mentorId');
    return;
  }
  
  try {
    const mentorId = parseInt(metadata.mentorId);
    
    // Buscar a assinatura no banco de dados
    const dbSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.mentorId, mentorId)
    });
    
    if (!dbSubscription) {
      console.log(`Assinatura não encontrada para o mentor ${mentorId}`);
      return;
    }
    
    // Atualizar o registro com os dados do Stripe
    await db.update(subscriptions)
      .set({
        stripeSubscriptionId: subscription.id,
        status: subscription.status === 'trialing' ? 'trial' : 'active',
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, dbSubscription.id));
    
    console.log(`Assinatura ${subscription.id} criada e atualizada para o mentor ${mentorId}`);
  } catch (error) {
    console.error('Erro ao processar subscription.created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  // Buscar a assinatura pelo ID do Stripe
  const dbSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, subscription.id)
  });
  
  if (!dbSubscription) {
    console.log(`Assinatura ${subscription.id} não encontrada no banco de dados`);
    return;
  }
  
  try {
    // Mapear o status do Stripe para o nosso enum
    let status = dbSubscription.status;
    if (subscription.status === 'active') status = 'active';
    else if (subscription.status === 'trialing') status = 'trial';
    else if (subscription.status === 'canceled') status = 'canceled';
    else if (subscription.status === 'unpaid') status = 'inactive';
    else if (subscription.status === 'past_due') status = 'inactive';
    
    // Atualizar o registro com os dados do Stripe
    await db.update(subscriptions)
      .set({
        status,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, dbSubscription.id));
    
    console.log(`Assinatura ${subscription.id} atualizada`);
  } catch (error) {
    console.error('Erro ao processar subscription.updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  // Buscar a assinatura pelo ID do Stripe
  const dbSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, subscription.id)
  });
  
  if (!dbSubscription) {
    console.log(`Assinatura ${subscription.id} não encontrada no banco de dados`);
    return;
  }
  
  try {
    // Atualizar o registro no banco de dados
    await db.update(subscriptions)
      .set({
        status: 'canceled',
        endDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, dbSubscription.id));
    
    console.log(`Assinatura ${subscription.id} marcada como cancelada`);
  } catch (error) {
    console.error('Erro ao processar subscription.deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  // Apenas processa se for uma fatura de assinatura
  if (!invoice.subscription) {
    return;
  }
  
  // Buscar a assinatura pelo ID do Stripe
  const dbSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, invoice.subscription)
  });
  
  if (!dbSubscription) {
    console.log(`Assinatura ${invoice.subscription} não encontrada no banco de dados`);
    return;
  }
  
  try {
    // Se for o primeiro pagamento após o período de teste
    if (dbSubscription.status === 'trial') {
      await db.update(subscriptions)
        .set({
          status: 'active',
          updatedAt: new Date()
        })
        .where(eq(subscriptions.id, dbSubscription.id));
    }
    
    // Atualizar o registro com os dados do pagamento
    await db.update(subscriptions)
      .set({
        lastBillingDate: new Date(),
        nextBillingDate: new Date(invoice.next_payment_attempt * 1000) || null,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, dbSubscription.id));
    
    // Criar um registro de pagamento
    await db.insert(payments).values({
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_paid / 100, // Converter de centavos para a moeda base
      currency: invoice.currency,
      status: 'completed',
      transactionId: invoice.payment_intent,
      paymentMethod: 'card', // Padrão para Stripe
      paymentDate: new Date(),
      invoiceNumber: invoice.number,
      receiptUrl: invoice.hosted_invoice_url,
    });
    
    console.log(`Pagamento registrado para assinatura ${invoice.subscription}`);
  } catch (error) {
    console.error('Erro ao processar invoice.payment_succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  // Apenas processa se for uma fatura de assinatura
  if (!invoice.subscription) {
    return;
  }
  
  // Buscar a assinatura pelo ID do Stripe
  const dbSubscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, invoice.subscription)
  });
  
  if (!dbSubscription) {
    console.log(`Assinatura ${invoice.subscription} não encontrada no banco de dados`);
    return;
  }
  
  try {
    // Criar um registro de pagamento falho
    await db.insert(payments).values({
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_due / 100, // Converter de centavos para a moeda base
      currency: invoice.currency,
      status: 'failed',
      transactionId: invoice.payment_intent,
      paymentMethod: 'card', // Padrão para Stripe
      paymentDate: new Date(),
      invoiceNumber: invoice.number,
      receiptUrl: invoice.hosted_invoice_url,
      notes: `Falha de pagamento: ${invoice.last_payment_error?.message || 'Razão desconhecida'}`,
    });
    
    // Se a fatura estiver atrasada por muito tempo, a assinatura pode ser alterada para inativa
    if (invoice.next_payment_attempt === null) {
      await db.update(subscriptions)
        .set({
          status: 'inactive',
          updatedAt: new Date()
        })
        .where(eq(subscriptions.id, dbSubscription.id));
    }
    
    console.log(`Falha de pagamento registrada para assinatura ${invoice.subscription}`);
  } catch (error) {
    console.error('Erro ao processar invoice.payment_failed:', error);
  }
}