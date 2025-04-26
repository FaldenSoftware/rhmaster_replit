import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { stripeService } from "../stripe-service";
import Stripe from "stripe";

const router = Router();

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autenticado" });
}

// Middleware para verificar se o usuário é um mentor
function isMentor(req: Request, res: Response, next: Function) {
  if (req.user && req.user.role === "mentor") {
    return next();
  }
  res.status(403).json({ message: "Acesso negado" });
}

// Rota para obter informações do período trial
router.get("/trial-info", isAuthenticated, isMentor, async (req, res) => {
  try {
    // Calcular a data de término do trial baseada na data de criação da conta
    const trialDays = 14; // 14 dias de trial
    const user = req.user!;
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    
    // Calcular a data de término do trial
    const trialEndDate = new Date(createdAt);
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);
    
    // Verificar se o trial ainda está ativo
    const isTrialActive = now < trialEndDate;
    
    // Calcular dias restantes
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / msPerDay));
    
    // Verificar se o usuário tem uma assinatura ativa
    const hasActiveSubscription = !!user.stripeSubscriptionId;
    
    // Se tiver uma assinatura, buscar detalhes dela
    let subscriptionPlan = undefined;
    if (hasActiveSubscription && user.stripeSubscriptionId) {
      try {
        const subscription = await stripeService.getSubscription(user.stripeSubscriptionId);
        // Extrair o plano pela descrição do produto
        const product = subscription.items.data[0]?.price.product;
        if (typeof product !== 'string') {
          const productDetails = await stripeService.getProduct(product.id);
          subscriptionPlan = productDetails.name.toLowerCase().includes('basic') 
            ? 'basic' 
            : productDetails.name.toLowerCase().includes('pro') 
              ? 'pro' 
              : 'enterprise';
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes da assinatura:', err);
      }
    }
    
    res.json({
      isTrialActive,
      daysRemaining,
      trialEndDate: trialEndDate.toISOString(),
      hasActiveSubscription,
      plan: subscriptionPlan
    });
  } catch (error) {
    console.error("Erro ao obter informações do trial:", error);
    res.status(500).json({ message: "Erro ao obter informações do trial" });
  }
});

// Rota para obter informações da assinatura atual
router.get("/current-subscription", isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    // Se o usuário não tem assinatura, retorna null
    if (!user.stripeSubscriptionId) {
      return res.json(null);
    }
    
    try {
      // Buscar detalhes da assinatura no Stripe
      const stripeSubscription = await stripeService.getSubscription(user.stripeSubscriptionId);
      
      // Extrair o plano pela descrição do produto
      let plan = 'basic';
      const product = stripeSubscription.items.data[0]?.price.product;
      if (typeof product !== 'string' && product) {
        const productDetails = await stripeService.getProduct(product.id);
        plan = productDetails.name.toLowerCase().includes('basic') 
          ? 'basic' 
          : productDetails.name.toLowerCase().includes('pro') 
            ? 'pro' 
            : 'enterprise';
      }
      
      // Obter o número atual de clientes
      const clients = await storage.getClientsByMentorId(user.id);
      
      // Determinar o número máximo de clientes com base no plano
      const maxClients = stripeService.getMaxClientsForPlan(plan as 'basic' | 'pro' | 'enterprise');
      
      // Criar objeto de resposta
      const subscription = {
        id: stripeSubscription.id,
        plan,
        status: stripeSubscription.status,
        maxClients,
        clientCount: clients.length,
        startDate: new Date(stripeSubscription.start_date * 1000).toISOString(),
        autoRenew: !stripeSubscription.cancel_at_period_end,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        daysRemaining: Math.ceil((stripeSubscription.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
      };
      
      res.json(subscription);
    } catch (error) {
      console.error("Erro ao buscar detalhes da assinatura:", error);
      res.json(null); // Em caso de erro, retorna null em vez de um erro 500
    }
  } catch (error) {
    console.error("Erro ao obter informações da assinatura:", error);
    res.status(500).json({ message: "Erro ao obter informações da assinatura" });
  }
});

// Rota para pegar ou criar uma intenção de pagamento para assinatura
router.post("/create-payment-intent", isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    const { planId } = req.body;
    
    console.log("Requisição criar intent recebida, plano:", planId);
    
    if (!planId) {
      return res.status(400).json({ message: "ID do plano é obrigatório" });
    }
    
    // Verificar se o plano é válido
    if (!['basic', 'pro', 'enterprise'].includes(planId)) {
      return res.status(400).json({ message: "Plano inválido" });
    }
    
    try {
      // Para fins de desenvolvimento, vamos criar uma assinatura diretamente
      // sem processar o pagamento pelo Stripe

      // Preços dos planos em reais
      const planPrices = {
        basic: 49.90,
        pro: 99.90,
        enterprise: 199.90
      };

      // Simulação de clientSecret para o frontend completar o fluxo
      // Em produção, o Stripe geraria isso para nós
      const clientSecret = `pi_simulated_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`Ativando plano ${planId} diretamente para o usuário ${user.id}`);
      
      // Atualiza diretamente no banco, sem Stripe, para fins de testes
      // Em produção, seria feito após confirmação do pagamento no webhook
      await storage.updateUserStripeCustomerId(user.id, `cus_simulated_${Date.now()}`);
      
      res.json({
        clientSecret: clientSecret,
        subscriptionId: `sub_simulated_${Date.now()}`,
        // Adicionando informações extras para o frontend saber que é um pagamento simulado
        simulated: true,
        planId: planId,
        amount: planPrices[planId as keyof typeof planPrices]
      });
    } catch (error: any) {
      console.error("Erro ao criar intenção de pagamento:", error);
      res.status(500).json({ message: error.message || "Erro ao criar intenção de pagamento" });
    }
  } catch (error) {
    console.error("Erro ao processar pedido de assinatura:", error);
    res.status(500).json({ message: "Erro ao processar pedido de assinatura" });
  }
});

// Rota para cancelar assinatura
router.post("/cancel-subscription", isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    const { cancelImmediate = false, reason = '' } = req.body;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: "Você não possui assinatura ativa" });
    }
    
    try {
      await stripeService.cancelSubscription(user.stripeSubscriptionId, !cancelImmediate);
      
      // Se for cancelar imediatamente, atualizar o banco
      if (cancelImmediate) {
        await storage.updateUserStripeInfo(user.id, { stripeSubscriptionId: null });
      }
      
      res.json({ success: true, message: "Assinatura cancelada com sucesso" });
    } catch (error: any) {
      console.error("Erro ao cancelar assinatura:", error);
      res.status(500).json({ message: error.message || "Erro ao cancelar assinatura" });
    }
  } catch (error) {
    console.error("Erro ao processar cancelamento de assinatura:", error);
    res.status(500).json({ message: "Erro ao processar cancelamento de assinatura" });
  }
});

// Rota para reativar assinatura
router.post("/reactivate-subscription", isAuthenticated, isMentor, async (req, res) => {
  try {
    const user = req.user!;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: "Você não possui assinatura para reativar" });
    }
    
    try {
      await stripeService.reactivateSubscription(user.stripeSubscriptionId);
      res.json({ success: true, message: "Assinatura reativada com sucesso" });
    } catch (error: any) {
      console.error("Erro ao reativar assinatura:", error);
      res.status(500).json({ message: error.message || "Erro ao reativar assinatura" });
    }
  } catch (error) {
    console.error("Erro ao processar reativação de assinatura:", error);
    res.status(500).json({ message: "Erro ao processar reativação de assinatura" });
  }
});

export default router;