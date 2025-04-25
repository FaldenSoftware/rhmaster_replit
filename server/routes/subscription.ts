import { Router } from "express";
import { storage } from "../storage";
import { stripeService } from "../stripe-service";
import { z } from "zod";

export const subscriptionRouter = Router();

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Não autenticado" });
  }
}

// Middleware para verificar se o usuário é um mentor
function isMentor(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user && req.user.role === 'mentor') {
    next();
  } else {
    res.status(403).json({ message: "Apenas mentores podem acessar esta funcionalidade" });
  }
}

// Schema para validar requisições de criação de assinatura
const createSubscriptionSchema = z.object({
  planId: z.enum(['basic', 'pro', 'enterprise'])
});

// Schema para validar requisições de atualização de assinatura
const updateSubscriptionSchema = z.object({
  planId: z.enum(['basic', 'pro', 'enterprise'])
});

// Schema para validar requisições de cancelamento de assinatura
const cancelSubscriptionSchema = z.object({
  reason: z.string().optional(),
  cancelImmediate: z.boolean().optional().default(false)
});

// Obter a assinatura atual do usuário
subscriptionRouter.get('/current-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Busca a assinatura do usuário no banco de dados
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    // Busca a assinatura
    const subscription = await storage.getMentorSubscription(mentor.id);
    if (!subscription) {
      return res.status(404).json({ message: "Assinatura não encontrada" });
    }
    
    // Se tiver um ID de assinatura do Stripe, busca detalhes adicionais
    let additionalData = {};
    if (subscription.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripeService.getSubscription(subscription.stripeSubscriptionId);
        
        // Calcula dias restantes
        const now = new Date();
        const endDate = subscription.stripeCurrentPeriodEnd 
          ? new Date(subscription.stripeCurrentPeriodEnd) 
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 dias

        const diffTime = Math.abs(endDate.getTime() - now.getTime());
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        additionalData = {
          daysRemaining,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString()
        };
      } catch (error) {
        console.error("Erro ao buscar detalhes do Stripe:", error);
        // Não retorna erro aqui, apenas continua sem dados adicionais
      }
    }
    
    // Retorna os dados da assinatura com os detalhes adicionais
    res.json({
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      maxClients: subscription.maxClients,
      clientCount: subscription.clientCount || 0,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate ? subscription.endDate.toISOString() : undefined,
      autoRenew: subscription.autoRenew,
      ...additionalData
    });
  } catch (error: any) {
    console.error("Erro ao buscar assinatura:", error);
    res.status(500).json({ message: `Erro ao buscar assinatura: ${error.message}` });
  }
});

// Criar nova assinatura
subscriptionRouter.post('/create-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Valida os dados da requisição
    const validation = createSubscriptionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: validation.error.errors });
    }
    
    const { planId } = validation.data;
    
    // Verifica se o usuário já tem uma assinatura ativa
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    const existingSubscription = await storage.getMentorSubscription(mentor.id);
    if (existingSubscription && existingSubscription.status === 'active') {
      return res.status(400).json({ message: "Usuário já possui uma assinatura ativa" });
    }
    
    // Cria a assinatura no Stripe
    const result = await stripeService.createSubscription(user, planId);
    
    res.json({
      subscriptionId: result.subscriptionId,
      clientSecret: result.clientSecret
    });
  } catch (error: any) {
    console.error("Erro ao criar assinatura:", error);
    res.status(500).json({ message: `Erro ao criar assinatura: ${error.message}` });
  }
});

// Atualizar assinatura (mudar de plano)
subscriptionRouter.post('/update-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Valida os dados da requisição
    const validation = updateSubscriptionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: validation.error.errors });
    }
    
    const { planId } = validation.data;
    
    // Verifica se o usuário tem uma assinatura ativa
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    const existingSubscription = await storage.getMentorSubscription(mentor.id);
    if (!existingSubscription || existingSubscription.status !== 'active') {
      return res.status(400).json({ message: "Usuário não possui uma assinatura ativa" });
    }
    
    // Atualiza a assinatura no Stripe
    const result = await stripeService.updateSubscription(user, planId);
    
    res.json({
      subscriptionId: result.subscriptionId,
      clientSecret: result.clientSecret,
      success: result.success
    });
  } catch (error: any) {
    console.error("Erro ao atualizar assinatura:", error);
    res.status(500).json({ message: `Erro ao atualizar assinatura: ${error.message}` });
  }
});

// Cancelar assinatura
subscriptionRouter.post('/cancel-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Valida os dados da requisição
    const validation = cancelSubscriptionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: validation.error.errors });
    }
    
    const { reason, cancelImmediate } = validation.data;
    
    // Verifica se o usuário tem uma assinatura ativa
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    const subscription = await storage.getMentorSubscription(mentor.id);
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: "Usuário não possui uma assinatura para cancelar" });
    }
    
    // Cancela a assinatura no Stripe
    const result = await stripeService.cancelSubscription(
      subscription.stripeSubscriptionId, 
      !cancelImmediate
    );
    
    // Se cancelado imediatamente, também registra a razão
    if (result && reason) {
      await storage.updateSubscriptionCancellationReason(subscription.id, reason);
    }
    
    res.json({ 
      success: result,
      message: cancelImmediate 
        ? "Assinatura cancelada com sucesso" 
        : "O cancelamento foi agendado para o final do período atual" 
    });
  } catch (error: any) {
    console.error("Erro ao cancelar assinatura:", error);
    res.status(500).json({ message: `Erro ao cancelar assinatura: ${error.message}` });
  }
});

// Reativar assinatura cancelada (apenas se ainda estiver no período ativo)
subscriptionRouter.post('/reactivate-subscription', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Verifica se o usuário tem uma assinatura cancelada
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    const subscription = await storage.getMentorSubscription(mentor.id);
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: "Usuário não possui uma assinatura" });
    }
    
    // Verifica se a assinatura está marcada para cancelamento no final do período
    if (!subscription.stripeCancelAtPeriodEnd) {
      return res.status(400).json({ message: "A assinatura não está agendada para cancelamento" });
    }
    
    // Reativa a assinatura no Stripe
    const result = await stripeService.reactivateSubscription(subscription.stripeSubscriptionId);
    
    res.json({ 
      success: result,
      message: "Assinatura reativada com sucesso"
    });
  } catch (error: any) {
    console.error("Erro ao reativar assinatura:", error);
    res.status(500).json({ message: `Erro ao reativar assinatura: ${error.message}` });
  }
});

// Obter histórico de faturas
subscriptionRouter.get('/invoices', isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Busca a assinatura do usuário
    const mentor = await storage.getMentorByUserId(user.id);
    if (!mentor) {
      return res.status(404).json({ message: "Perfil de mentor não encontrado" });
    }
    
    const subscription = await storage.getMentorSubscription(mentor.id);
    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ message: "Nenhuma assinatura encontrada" });
    }
    
    // Busca as faturas do Stripe
    const stripeInvoices = await stripeService.listInvoices(subscription.stripeSubscriptionId);
    
    // Formata os dados das faturas
    const invoices = stripeInvoices.map(invoice => ({
      id: invoice.id,
      number: invoice.number || `INV-${Math.floor(Math.random() * 10000)}`,
      status: invoice.status,
      amountDue: invoice.amount_due / 100, // converte de centavos para real
      amountPaid: invoice.amount_paid / 100,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000).toISOString(),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      periodStart: new Date(invoice.period_start * 1000).toISOString(),
      periodEnd: new Date(invoice.period_end * 1000).toISOString(),
      receiptUrl: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf,
    }));
    
    res.json(invoices);
  } catch (error: any) {
    console.error("Erro ao buscar faturas:", error);
    res.status(500).json({ message: `Erro ao buscar histórico de faturas: ${error.message}` });
  }
});

// Webhook para processar eventos do Stripe
subscriptionRouter.post('/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ message: "Stripe signature missing" });
  }
  
  try {
    // Processa o evento do webhook
    const result = await stripeService.handleWebhookEvent(req.rawBody as Buffer, signature);
    
    if (result.received) {
      res.status(200).json({ received: true });
    } else {
      console.error("Webhook error:", result.error);
      res.status(400).json({ message: "Webhook error", error: result.error?.message });
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: `Error processing webhook: ${error.message}` });
  }
});