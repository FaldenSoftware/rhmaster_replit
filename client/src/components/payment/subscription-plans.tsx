import { useState, useEffect, useCallback } from 'react';
import { PlanCard } from './plan-card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StripeElementsProvider } from '@/lib/stripe-context';
import { SubscriptionForm } from './subscription-form';

interface Plan {
  id: 'basic' | 'pro' | 'enterprise';
  title: string;
  price: number;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  isRecommended?: boolean;
}

interface SubscriptionPlansProps {
  currentPlan?: string;
  isUpgrade?: boolean;
}

export function SubscriptionPlans({ 
  currentPlan,
  isUpgrade = false
}: SubscriptionPlansProps) {
  const { toast } = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [autoRotateInterval, setAutoRotateInterval] = useState<NodeJS.Timeout | null>(null);

  // Preços mensais
  const monthlyPrices = {
    basic: 49.90,
    pro: 99.90,
    enterprise: 199.90
  };

  // Preços anuais (com desconto)
  const yearlyPrices = {
    basic: 39.90,
    pro: 79.90,
    enterprise: 159.90
  };

  // Definições dos planos
  const plans: Plan[] = [
    {
      id: 'basic',
      title: 'Básico',
      price: billingCycle === 'monthly' ? monthlyPrices.basic : yearlyPrices.basic,
      description: 'Ideal para mentores iniciantes',
      features: [
        { text: 'Até 5 clientes', included: true },
        { text: 'Testes de comportamento', included: true },
        { text: 'Dashboard básico', included: true },
        { text: 'Relatórios simplificados', included: true },
        { text: 'Suporte por e-mail', included: true },
        { text: 'Assistente de IA', included: false },
        { text: 'Testes personalizados', included: false },
        { text: 'Acompanhamento avançado', included: false },
      ],
    },
    {
      id: 'pro',
      title: 'Profissional',
      price: billingCycle === 'monthly' ? monthlyPrices.pro : yearlyPrices.pro,
      description: 'Para mentores em crescimento',
      features: [
        { text: 'Até 20 clientes', included: true },
        { text: 'Todos os testes disponíveis', included: true },
        { text: 'Dashboard completo', included: true },
        { text: 'Relatórios detalhados', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Assistente de IA', included: true },
        { text: 'Testes personalizados', included: false },
        { text: 'Acompanhamento avançado', included: false },
      ],
      isRecommended: true,
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      price: billingCycle === 'monthly' ? monthlyPrices.enterprise : yearlyPrices.enterprise,
      description: 'Para mentores profissionais',
      features: [
        { text: 'Até 50 clientes', included: true },
        { text: 'Todos os testes disponíveis', included: true },
        { text: 'Dashboard personalizado', included: true },
        { text: 'Relatórios avançados', included: true },
        { text: 'Suporte dedicado', included: true },
        { text: 'Assistente de IA avançado', included: true },
        { text: 'Testes personalizados', included: true },
        { text: 'Acompanhamento avançado', included: true },
      ],
    },
  ];

  // Atualizar o plano selecionado se o currentPlan mudar
  useEffect(() => {
    if (currentPlan) {
      setSelectedPlanId(currentPlan);
    }
  }, [currentPlan]);

  // Rotação automática a cada 3 segundos para o carrossel de planos
  useEffect(() => {
    // Só ativa a rotação automática se não estiver na página de upgrade
    if (!isUpgrade) {
      const interval = setInterval(() => {
        setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
      }, 3000); // 3 segundos para alternar

      setAutoRotateInterval(interval);

      return () => {
        if (autoRotateInterval) {
          clearInterval(autoRotateInterval);
        }
      };
    }
  }, [isUpgrade]);

  // Parar a rotação automática ao interagir com os tabs
  const handleTabChange = (value: string) => {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      setAutoRotateInterval(null);
    }
    setBillingCycle(value as 'monthly' | 'yearly');
  };

  const handleSubscribe = useCallback(async (planId: string) => {
    try {
      setIsLoading(true);
      setSelectedPlanId(planId);

      // Endpoint diferente para upgrade vs nova assinatura
      const endpoint = isUpgrade
        ? '/api/subscription/update-subscription'
        : '/api/subscription/create-subscription';

      const response = await apiRequest('POST', endpoint, { planId });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao processar a assinatura');
      }
      
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsDialogOpen(true);
      } else if (data.success) {
        // Caso a assinatura seja atualizada sem exigir um novo pagamento
        toast({
          title: 'Plano atualizado com sucesso!',
          description: `Seu plano foi alterado para ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
        });
        
        // Redirecionar ou atualizar a interface do usuário conforme necessário
        setTimeout(() => {
          window.location.href = '/mentor-dashboard/settings?subscription_success=true';
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: 'Erro na assinatura',
        description: error.message || 'Ocorreu um erro ao processar a assinatura',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isUpgrade, toast]);

  const handlePaymentSuccess = useCallback(() => {
    toast({
      title: 'Pagamento processado com sucesso!',
      description: 'Sua assinatura foi ativada.',
    });
    
    setIsDialogOpen(false);
    
    // Redirecionar para o dashboard após alguns segundos
    setTimeout(() => {
      window.location.href = '/mentor-dashboard/settings?subscription_success=true';
    }, 2000);
  }, [toast]);

  const handlePaymentError = useCallback((error: Error) => {
    toast({
      title: 'Erro no pagamento',
      description: error.message || 'Ocorreu um erro ao processar o pagamento',
      variant: 'destructive',
    });
  }, [toast]);

  return (
    <div className="w-full">
      <div className="mx-auto mb-8 text-center">
        <Tabs 
          value={billingCycle} 
          onValueChange={handleTabChange}
          className="inline-flex"
        >
          <TabsList>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="yearly">
              Anual <span className="ml-1 text-xs text-emerald-600 font-semibold">-20%</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            id={plan.id}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            isRecommended={plan.isRecommended}
            isLoading={isLoading && selectedPlanId === plan.id}
            isUserCurrentPlan={currentPlan === plan.id}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>

      {/* Modal de pagamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Concluir Assinatura</DialogTitle>
            <DialogDescription>
              Insira os dados do seu cartão para {isUpgrade ? 'atualizar' : 'ativar'} sua assinatura.
            </DialogDescription>
          </DialogHeader>
          
          {clientSecret && selectedPlanId && (
            <StripeElementsProvider clientSecret={clientSecret}>
              <SubscriptionForm 
                clientSecret={clientSecret} 
                planId={selectedPlanId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeElementsProvider>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}