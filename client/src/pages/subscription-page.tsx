import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionPlans, PLAN_IDS } from '@/components/payment/subscription-plans';
import { SubscriptionFormContainer } from '@/components/payment/subscription-form';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Busca informações atuais da assinatura (se existir)
  const { 
    data: currentSubscription, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/subscription/current-subscription'],
    enabled: !!user && user.role === 'mentor',
  });

  // Redireciona usuários não autorizados
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  // Apenas mentores podem acessar esta página
  if (user.role !== 'mentor') {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>
              Esta página está disponível apenas para mentores.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Exibe carregamento
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Manipulador para seleção de plano
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };
  
  // Manipulador para sucesso no pagamento
  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
    
    // Recarrega a página para mostrar a assinatura atualizada
    // Redirecionamento direto com delay para deixar o usuário ver a mensagem de sucesso
    setTimeout(() => {
      window.location.href = '/dashboard/settings';
    }, 1500);
  };
  
  // Manipulador para cancelamento do pagamento
  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  // Verifica se já existe uma assinatura ativa
  // Nesse caso, redireciona para a página de configurações onde a assinatura pode ser gerenciada
  if (currentSubscription && !showPaymentForm) {
    return <Redirect to="/dashboard/settings" />;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Planos de Assinatura</h1>
            <p className="text-muted-foreground">
              Escolha o plano que melhor atende às suas necessidades
            </p>
          </div>
          
          {error ? (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {(error as Error).message || 'Ocorreu um erro ao carregar os planos'}
              </AlertDescription>
            </Alert>
          ) : null}
          
          {showPaymentForm ? (
            <SubscriptionFormContainer
              planId={selectedPlan || PLAN_IDS.BASIC}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <SubscriptionPlans
              onSelectPlan={handleSelectPlan}
              initialSelectedPlan={PLAN_IDS.PRO}
              autoRotate={true}
            />
          )}
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem suporte por email e acesso à plataforma básica.
              <br />
              Você pode alterar ou cancelar sua assinatura a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}