import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { stripeService } from '../stripe-service';
import Stripe from 'stripe';

// Validadores
const createSubscriptionSchema = z.object({
  planId: z.enum(['basic', 'pro', 'enterprise']),
});

const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
  cancelImmediate: z.boolean().default(false),
});

// Criação do router de assinaturas
export const subscriptionRouter = Router();

// Obtém a assinatura atual do usuário
subscriptionRouter.get('/current-subscription', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  try {
    const user = req.user;
    
    // Verifica se é um mentor e se tem assinatura
    if (user.role !== 'mentor' || !user.stripeSubscriptionId) {
      return res.status(200).json(null);
    }
    
    // Busca os dados da assinatura no Stripe
    const subscription = await stripeService.getSubscription(user.stripeSubscriptionId);
    
    if (!subscription) {
      return res.status(200).json(null);
    }
    
    // Busca os clientes associados a este mentor
    const clients = await storage.getClientsByMentorId(user.id);
    
    // Extrai o plano da assinatura (do metadata)
    const plan = subscription.metadata.plan as 'basic' | 'pro' | 'enterprise';
    
    // Calcula dias restantes e determina o status de renovação automática
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    const daysRemaining = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Obtém o número máximo de clientes permitidos para o plano
    const maxClients = stripeService.getMaxClientsForPlan(plan);
    
    // Monta o objeto de resposta
    const subscriptionInfo = {
      id: user.id,
      plan,
      status: subscription.status,
      maxClients,
      clientCount: clients.length,
      startDate: new Date(subscription.start_date * 1000).toISOString(),
      autoRenew: !subscription.cancel_at_period_end,
      daysRemaining,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    };
    
    return res.status(200).json(subscriptionInfo);
  } catch (error: any) {
    console.error('Erro ao buscar assinatura:', error);
    return res.status(500).json({ 
      message: 'Erro ao buscar informações da assinatura',
      error: error.message
    });
  }
});

// Cria uma nova assinatura
subscriptionRouter.post('/create-subscription', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  try {
    const result = createSubscriptionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: result.error.format() 
      });
    }
    
    const { planId } = result.data;
    const user = req.user;
    
    // Verifica se é um mentor
    if (user.role !== 'mentor') {
      return res.status(403).json({ 
        message: 'Apenas mentores podem criar assinaturas' 
      });
    }
    
    // Determina se é uma nova assinatura ou atualização
    let subscription;
    
    if (user.stripeSubscriptionId) {
      // Atualiza a assinatura existente
      subscription = await stripeService.updateSubscription(user, planId);
    } else {
      // Cria uma nova assinatura
      subscription = await stripeService.createSubscription(user, planId);
    }
    
    // Retorna o client secret para iniciar o pagamento
    return res.status(200).json({
      clientSecret: subscription.clientSecret,
      subscriptionId: subscription.subscriptionId
    });
  } catch (error: any) {
    console.error('Erro ao criar assinatura:', error);
    return res.status(500).json({ 
      message: 'Erro ao criar assinatura',
      error: error.message
    });
  }
});

// Cancela uma assinatura
subscriptionRouter.post('/cancel-subscription', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  try {
    const result = cancelSubscriptionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: result.error.format() 
      });
    }
    
    const { reason, cancelImmediate } = result.data;
    const user = req.user;
    
    // Verifica se o usuário tem uma assinatura
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ 
        message: 'Nenhuma assinatura ativa encontrada' 
      });
    }
    
    // Cancela a assinatura
    const success = await stripeService.cancelSubscription(
      user.stripeSubscriptionId,
      !cancelImmediate  // Se não for cancelamento imediato, cancela ao final do período
    );
    
    if (!success) {
      return res.status(500).json({ 
        message: 'Erro ao cancelar assinatura' 
      });
    }
    
    // Atualiza o registro do motivo do cancelamento, se fornecido
    if (reason) {
      // Podemos salvar o motivo do cancelamento se necessário
      // await storage.saveSubscriptionCancellationReason(user.id, reason);
    }
    
    return res.status(200).json({ 
      success: true,
      canceledImmediate: cancelImmediate 
    });
  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error);
    return res.status(500).json({ 
      message: 'Erro ao cancelar assinatura',
      error: error.message
    });
  }
});

// Reativa uma assinatura cancelada mas ainda não expirada
subscriptionRouter.post('/reactivate-subscription', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  try {
    const user = req.user;
    
    // Verifica se o usuário tem uma assinatura
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ 
        message: 'Nenhuma assinatura encontrada' 
      });
    }
    
    // Reativa a assinatura
    const success = await stripeService.reactivateSubscription(user.stripeSubscriptionId);
    
    if (!success) {
      return res.status(500).json({ 
        message: 'Erro ao reativar assinatura' 
      });
    }
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Erro ao reativar assinatura:', error);
    return res.status(500).json({ 
      message: 'Erro ao reativar assinatura',
      error: error.message
    });
  }
});

// Obtém o histórico de faturas
subscriptionRouter.get('/invoices', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  try {
    const user = req.user;
    
    // Verifica se o usuário tem uma assinatura
    if (!user.stripeSubscriptionId) {
      return res.status(200).json([]);
    }
    
    // Busca as faturas
    const invoices = await stripeService.listInvoices(user.stripeSubscriptionId);
    
    // Mapeia para o formato desejado
    const formattedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      created: invoice.created * 1000, // Convertendo para milissegundos
      amountDue: invoice.amount_due / 100, // Convertendo de centavos
      amountPaid: invoice.amount_paid / 100,
      status: invoice.status,
      periodStart: invoice.period_start * 1000,
      periodEnd: invoice.period_end * 1000,
      receiptUrl: invoice.hosted_invoice_url
    }));
    
    return res.status(200).json(formattedInvoices);
  } catch (error: any) {
    console.error('Erro ao buscar faturas:', error);
    return res.status(500).json({ 
      message: 'Erro ao buscar histórico de faturas',
      error: error.message
    });
  }
});

// Webhook para eventos do Stripe
subscriptionRouter.post('/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  
  // Verifica se o payload é válido
  if (!req.body || !signature) {
    return res.status(400).json({ message: 'Webhook inválido' });
  }
  
  try {
    // Processa o evento
    const { event, error } = await stripeService.handleWebhookEvent(
      // Necessário acessar o raw body para validar a assinatura
      (req as any).rawBody,
      signature
    );
    
    if (error) {
      console.error('Erro ao processar webhook:', error);
      return res.status(400).json({ message: error.message });
    }
    
    // Confirma o recebimento do evento
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook do Stripe:', error);
    return res.status(500).json({ 
      message: 'Erro ao processar webhook',
      error: error.message
    });
  }
});