import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SubscriptionPlans } from '@/components/payment/subscription-plans';
import { Loader2 } from 'lucide-react';
import { StripeProvider } from '@/lib/stripe-context';
import { apiRequest } from '@/lib/queryClient';
import { Redirect } from 'wouter';

export default function SubscriptionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  useEffect(() => {
    // Só carrega informações de assinatura se o usuário for um mentor autenticado
    if (user && user.role === 'mentor') {
      fetchSubscriptionData();
    } else {
      setIsLoadingSubscription(false);
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await apiRequest('GET', '/api/subscription/current-subscription');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data.plan);
      } else {
        // Se não tiver assinatura, não é erro, apenas não temos plano ativo
        if (response.status === 404) {
          setCurrentPlan(null);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da assinatura:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Redireciona para a página de login se não estiver autenticado
  if (!authLoading && !user) {
    return <Redirect to="/auth" />;
  }

  // Redireciona clientes para o dashboard deles, apenas mentores podem assinar
  if (!authLoading && user && user.role !== 'mentor') {
    return <Redirect to="/client-dashboard" />;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {(authLoading || isLoadingSubscription) ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      ) : (
        <StripeProvider>
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold">Escolha Seu Plano</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Selecione o plano ideal para expandir seu trabalho como mentor. 
                Todos os planos incluem testes de comportamento, 
                dashboard de acompanhamento e suporte personalizado.
              </p>
            </div>

            <SubscriptionPlans currentPlan={currentPlan || undefined} />
          </div>
        </StripeProvider>
      )}
    </div>
  );
}