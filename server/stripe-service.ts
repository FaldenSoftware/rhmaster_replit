import Stripe from 'stripe';
import { storage } from './storage';
import { User } from '@shared/schema';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY não configurada! Muitas operações do Stripe falharão.');
}

// Inicializa o cliente Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Mapeia os IDs dos planos para preços e limites
const PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_1POJexI0yI2TzLGJjfU89ksf', // ID real do produto Basic no Stripe
    maxClients: 5,
    price: 49.90
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_1POJf8I0yI2TzLGJ9fWkdvdC', // ID real do produto Pro no Stripe
    maxClients: 20,
    price: 99.90
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_1POJfWI0yI2TzLGJhAOrbFj4', // ID real do produto Enterprise no Stripe
    maxClients: 50,
    price: 199.90
  }
};

export const stripeService = {
  /**
   * Cria ou atualiza um cliente no Stripe
   */
  async getOrCreateCustomer(user: User): Promise<string> {
    // Se o usuário já tiver um ID de cliente do Stripe, use-o
    if (user.stripeCustomerId) {
      try {
        // Verifica se o cliente ainda existe no Stripe
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        if (!customer.deleted) {
          return user.stripeCustomerId;
        }
      } catch (error) {
        console.error('Erro ao buscar cliente do Stripe:', error);
      }
    }

    // Cria um novo cliente no Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id.toString()
      }
    });

    // Atualiza o ID do cliente no banco de dados
    // Aqui presumimos que exista uma função para atualizar o ID do cliente Stripe no usuário
    const updatedUser = await storage.updateUserStripeCustomerId(user.id, customer.id);

    return customer.id;
  },

  /**
   * Cria uma assinatura para um mentor
   */
  async createSubscription(user: User, planId: 'basic' | 'pro' | 'enterprise'): Promise<{
    subscriptionId: string;
    clientSecret: string | null;
  }> {
    if (!PLANS[planId]) {
      throw new Error(`Plano inválido: ${planId}`);
    }

    const customerId = await this.getOrCreateCustomer(user);

    // Cria a assinatura com pagamento pendente
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: PLANS[planId].priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id.toString(),
        planId
      }
    });

    // Registra a assinatura no banco de dados
    await storage.updateUserStripeInfo(user.id, {
      stripeSubscriptionId: subscription.id
    });

    // @ts-ignore - O TS não reconhece o expand de latest_invoice.payment_intent
    const clientSecret = subscription.latest_invoice.payment_intent?.client_secret || null;

    return {
      subscriptionId: subscription.id,
      clientSecret
    };
  },

  /**
   * Atualiza uma assinatura para um novo plano
   */
  async updateSubscription(
    user: User,
    planId: 'basic' | 'pro' | 'enterprise'
  ): Promise<{
    subscriptionId: string;
    clientSecret: string | null;
    success: boolean;
  }> {
    if (!user.stripeSubscriptionId) {
      throw new Error('Usuário não possui uma assinatura ativa');
    }

    if (!PLANS[planId]) {
      throw new Error(`Plano inválido: ${planId}`);
    }

    try {
      // Recupera a assinatura atual
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      // Atualiza os itens da assinatura para o novo plano
      const updatedSubscription = await stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: PLANS[planId].priceId,
            },
          ],
          proration_behavior: 'create_prorations',
          metadata: {
            ...subscription.metadata,
            planId,
          },
          expand: ['latest_invoice.payment_intent'],
        }
      );

      // Atualiza o plano do usuário no banco de dados
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: updatedSubscription.id 
      });

      // @ts-ignore - Ignorando erro do TypeScript aqui
      const clientSecret = updatedSubscription.latest_invoice?.payment_intent?.client_secret || null;

      return {
        subscriptionId: updatedSubscription.id,
        clientSecret,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      throw new Error('Erro ao atualizar assinatura. Contate o suporte.');
    }
  },

  /**
   * Cancela uma assinatura
   */
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<boolean> {
    try {
      if (cancelAtPeriodEnd) {
        // Cancela no final do período
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      } else {
        // Cancela imediatamente
        await stripe.subscriptions.cancel(subscriptionId);
      }

      // Busca usuário pela assinatura para atualizar seu status no banco
      const user = await storage.getUserByStripeSubscriptionId(subscriptionId);
      if (user) {
        if (cancelAtPeriodEnd) {
          // Marca como cancelamento agendado
          // Não precisamos fazer nada aqui, pois não temos uma coluna para isso
        } else {
          // Marca como inativo imediatamente - vamos apenas remover o ID da assinatura
          await storage.updateUserStripeInfo(user.id, {
            stripeSubscriptionId: null
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw new Error('Erro ao cancelar assinatura. Contate o suporte.');
    }
  },

  /**
   * Reativa uma assinatura cancelada que ainda não chegou ao fim do período
   */
  async reactivateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      // Busca usuário pela assinatura para atualizar seu status no banco
      const user = await storage.getUserByStripeSubscriptionId(subscriptionId);
      if (user) {
        // Assinatura reativada - não precisamos fazer nada especial aqui
      // pois só estamos rastreando o ID da assinatura
      }

      return true;
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error);
      throw new Error('Erro ao reativar assinatura. Contate o suporte.');
    }
  },

  /**
   * Busca uma assinatura no Stripe
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'default_payment_method'],
      });
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      throw new Error('Erro ao buscar dados da assinatura. Contate o suporte.');
    }
  },

  /**
   * Busca uma fatura no Stripe
   */
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      return await stripe.invoices.retrieve(invoiceId);
    } catch (error) {
      console.error('Erro ao buscar fatura:', error);
      throw new Error('Erro ao buscar fatura. Contate o suporte.');
    }
  },

  /**
   * Processa um webhook de evento do Stripe
   */
  async handleWebhookEvent(payload: Buffer, signature: string): Promise<{
    received: boolean;
    event?: Stripe.Event;
    error?: Error;
  }> {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return { received: false, error: new Error('STRIPE_WEBHOOK_SECRET não está configurado') };
    }

    try {
      // Verifica a assinatura do webhook para garantir que veio do Stripe
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // Processa o evento com base no tipo
      switch (event.type) {
        // Assinatura criada
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        // Assinatura atualizada
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        // Assinatura deletada
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        // Pagamento de fatura bem-sucedido
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        // Falha no pagamento de fatura
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
      }

      return { received: true, event };
    } catch (error: any) {
      console.error('Erro ao processar webhook do Stripe:', error);
      return { received: false, error };
    }
  },

  /**
   * Manipulador para evento de assinatura criada
   */
  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    const planId = subscription.metadata.planId as 'basic' | 'pro' | 'enterprise';
    if (!planId || !PLANS[planId]) return;

    // Atualiza o status da assinatura do usuário
    const user = await storage.getUser(parseInt(userId));
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: subscription.id
      });
    }
  },

  /**
   * Manipulador para evento de assinatura atualizada
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    // Atualiza o status da assinatura do usuário
    const user = await storage.getUser(parseInt(userId));
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: subscription.id
      });
    }
  },

  /**
   * Manipulador para evento de assinatura deletada
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    // Marca a assinatura como cancelada
    const user = await storage.getUser(parseInt(userId));
    if (user) {
      await storage.updateUserStripeInfo(user.id, {
        stripeSubscriptionId: null
      });
    }
  },

  /**
   * Manipulador para evento de pagamento de fatura bem-sucedido
   */
  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    // Busca a assinatura para obter o ID do usuário
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = subscription.metadata.userId;
      if (!userId) return;

      // Registra a fatura no sistema
      const user = await storage.getUser(parseInt(userId));
      if (user) {
        // Aqui você poderia registrar a fatura no seu banco de dados
        // e enviar uma notificação ou e-mail para o usuário
        // Mas como não temos ainda a tabela de faturas, vamos apenas logar
        console.log('Fatura paga:', {
          userId: user.id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid / 100, // Convertendo de centavos para a moeda
          status: invoice.status || 'paid',
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          createdAt: new Date(invoice.created * 1000),
          paidAt: invoice.status === 'paid' ? new Date() : undefined,
          description: invoice.description || `Fatura #${invoice.number}`
        });

        // Se a fatura foi paga, atualiza o status da assinatura para ativo
        if (invoice.status === 'paid' && subscription.status === 'incomplete') {
          // Nossa interface não tem um método updateUserSubscription, então usamos updateUserStripeInfo
          await storage.updateUserStripeInfo(user.id, {
            stripeSubscriptionId: subscription.id
          });
        }
      }
    } catch (error) {
      console.error('Erro ao processar pagamento de fatura:', error);
    }
  },

  /**
   * Manipulador para evento de falha no pagamento de fatura
   */
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    // Busca a assinatura para obter o ID do usuário
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = subscription.metadata.userId;
      if (!userId) return;

      // Registra a falha no pagamento e atualiza o status
      const user = await storage.getUser(parseInt(userId));
      if (user) {
        // Registra a fatura com status de falha
        // Aqui também não temos a tabela, então apenas logamos
        console.log('Fatura com falha de pagamento:', {
          userId: user.id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_due / 100, // Convertendo de centavos para a moeda
          status: 'failed',
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000),
          createdAt: new Date(invoice.created * 1000),
          description: invoice.description || `Fatura #${invoice.number} (Falha no pagamento)`
        });

        // Não precisamos fazer nada especial para indicar problema de pagamento
        // já que só estamos rastreando o ID da assinatura

        // Aqui você pode enviar uma notificação para o usuário sobre o problema no pagamento
      }
    } catch (error) {
      console.error('Erro ao processar falha de pagamento:', error);
    }
  },

  /**
   * Busca as faturas de uma assinatura
   */
  async listInvoices(subscriptionId: string): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await stripe.invoices.list({
        subscription: subscriptionId,
        limit: 10,
      });
      return invoices.data;
    } catch (error) {
      console.error('Erro ao listar faturas:', error);
      throw new Error('Erro ao buscar histórico de faturas. Contate o suporte.');
    }
  },

  /**
   * Cria um novo método de pagamento
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      return await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });
    } catch (error) {
      console.error('Erro ao criar setup intent:', error);
      throw new Error('Erro ao configurar método de pagamento. Contate o suporte.');
    }
  },

  /**
   * Lista métodos de pagamento de um cliente
   */
  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Erro ao listar métodos de pagamento:', error);
      throw new Error('Erro ao buscar métodos de pagamento. Contate o suporte.');
    }
  },

  /**
   * Atualiza o método de pagamento padrão
   */
  async updateDefaultPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<Stripe.Customer> {
    try {
      return await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar método de pagamento padrão:', error);
      throw new Error('Erro ao atualizar método de pagamento. Contate o suporte.');
    }
  },

  /**
   * Obtém detalhes de um Product no Stripe
   */
  async getProduct(productId: string): Promise<Stripe.Product> {
    try {
      return await stripe.products.retrieve(productId);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Erro ao buscar detalhes do produto. Contate o suporte.');
    }
  },

  /**
   * Utilitário para calcular valor máximo de clientes baseado no plano
   */
  getMaxClientsForPlan(plan: 'basic' | 'pro' | 'enterprise'): number {
    return PLANS[plan]?.maxClients || 5; // Padrão para 5 clientes se o plano não for encontrado
  }
};