import Stripe from 'stripe';
import { User, Mentor, Subscription, Payment } from '@shared/schema';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Price IDs das assinaturas no Stripe
// Estes IDs seriam configurados no dashboard do Stripe
const SUBSCRIPTION_PRICES = {
  basic: process.env.STRIPE_PRICE_ID_BASIC,
  pro: process.env.STRIPE_PRICE_ID_PRO,
  enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE,
};

// Mapeamento de planos para limites de clientes
const PLAN_CLIENT_LIMITS = {
  basic: 5,
  pro: 20,
  enterprise: 50,
};

export const stripeService = {
  /**
   * Cria ou atualiza um cliente no Stripe
   */
  async getOrCreateCustomer(user: User): Promise<string> {
    // Se o usuário já tem um ID de cliente no Stripe, retorna esse ID
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Se não tem, cria um novo cliente no Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id.toString(),
      },
    });

    return customer.id;
  },

  /**
   * Cria uma assinatura para um mentor
   */
  async createSubscription(user: User, mentorId: number, planId: 'basic' | 'pro' | 'enterprise'): Promise<{
    subscriptionId: string,
    clientSecret: string | null
  }> {
    // Garante que temos o stripe customer id
    const customerId = await this.getOrCreateCustomer(user);

    const priceId = SUBSCRIPTION_PRICES[planId];
    if (!priceId) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    // Cria a assinatura no Stripe com pagamento pendente
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id.toString(),
        mentorId: mentorId.toString(),
        plan: planId
      },
      trial_period_days: 7, // 7 dias de período de teste grátis
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  },

  /**
   * Atualiza uma assinatura para um novo plano
   */
  async updateSubscription(
    subscriptionId: string,
    planId: 'basic' | 'pro' | 'enterprise'
  ): Promise<{
    updated: boolean,
    clientSecret: string | null
  }> {
    const priceId = SUBSCRIPTION_PRICES[planId];
    if (!priceId) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    try {
      // Busca a assinatura existente
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Atualiza para o novo plano
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'create_prorations',
        metadata: {
          ...subscription.metadata,
          plan: planId
        }
      });

      // Se precisar de uma nova forma de pagamento
      let clientSecret = null;
      if (updatedSubscription.latest_invoice) {
        const invoice = await stripe.invoices.retrieve(
          updatedSubscription.latest_invoice as string,
          { expand: ['payment_intent'] }
        );
        
        if (invoice.payment_intent) {
          const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
          clientSecret = paymentIntent.client_secret;
        }
      }

      return {
        updated: true,
        clientSecret
      };
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  /**
   * Cancela uma assinatura
   */
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<boolean> {
    try {
      // Se cancelAtPeriodEnd for true, a assinatura será cancelada no final do período atual,
      // caso contrário, será cancelada imediatamente
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
      });

      // Se for cancelar imediatamente
      if (!cancelAtPeriodEnd) {
        await stripe.subscriptions.cancel(subscriptionId);
      }

      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  /**
   * Reativa uma assinatura cancelada que ainda não chegou ao fim do período
   */
  async reactivateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      // Isso só funciona se a assinatura ainda não expirou (cancel_at_period_end = true)
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      return true;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  },

  /**
   * Busca uma assinatura no Stripe
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'latest_invoice'],
    });
  },

  /**
   * Busca uma fatura no Stripe
   */
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return await stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent', 'subscription'],
    });
  },

  /**
   * Processa um webhook de evento do Stripe
   */
  async handleWebhookEvent(payload: Buffer, signature: string): Promise<{
    type: string;
    data: any;
  }> {
    let event;

    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!endpointSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      }

      // Verifica a assinatura do webhook
      event = stripe.webhooks.constructEvent(
        payload, 
        signature, 
        endpointSecret
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    return {
      type: event.type,
      data: event.data.object,
    };
  },

  /**
   * Busca as faturas de uma assinatura
   */
  async listInvoices(subscriptionId: string): Promise<Stripe.Invoice[]> {
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 10,
    });
    
    return invoices.data;
  },

  /**
   * Cria um novo método de pagamento
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    return await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });
  },

  /**
   * Lista métodos de pagamento de um cliente
   */
  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    return paymentMethods.data;
  },

  /**
   * Atualiza o método de pagamento padrão
   */
  async updateDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<boolean> {
    try {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating default payment method:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de um Product no Stripe
   */
  async getProduct(productId: string): Promise<Stripe.Product> {
    return await stripe.products.retrieve(productId);
  },

  /**
   * Utilitário para calcular valor máximo de clientes baseado no plano
   */
  getMaxClientsForPlan(plan: 'basic' | 'pro' | 'enterprise'): number {
    return PLAN_CLIENT_LIMITS[plan] || 1;
  }
};