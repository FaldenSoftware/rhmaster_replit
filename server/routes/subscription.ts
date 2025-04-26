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

// Rotas existentes...

export default router;