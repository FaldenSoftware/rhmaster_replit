import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SubscriptionPlans, PLAN_IDS } from './subscription-plans';
import { SubscriptionFormContainer } from './subscription-form';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Loader2, AlertCircle, CreditCard, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// Tipos para as informações de assinatura
type SubscriptionInfo = {
  id: number;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid';
  maxClients: number;
  clientCount: number;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  daysRemaining?: number;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
};

// Status de assinatura para exibição
const StatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Ativa', variant: 'default' },
  incomplete: { label: 'Incompleta', variant: 'outline' },
  incomplete_expired: { label: 'Expirada', variant: 'destructive' },
  past_due: { label: 'Pagamento Pendente', variant: 'destructive' },
  canceled: { label: 'Cancelada', variant: 'secondary' },
  unpaid: { label: 'Não Paga', variant: 'destructive' },
};

// Componente principal para gerenciamento de assinaturas
export function SubscriptionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Busca a assinatura atual
  const { 
    data: subscription, 
    isLoading, 
    error 
  } = useQuery<SubscriptionInfo>({
    queryKey: ['/api/subscription/current-subscription'],
    enabled: !!user && user.role === 'mentor',
  });

  // Mutação para cancelar a assinatura
  const cancelMutation = useMutation({
    mutationFn: async ({ reason, cancelImmediate }: { reason: string, cancelImmediate: boolean }) => {
      const response = await apiRequest('POST', '/api/subscription/cancel-subscription', {
        reason,
        cancelImmediate,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cancelar assinatura');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Assinatura cancelada',
        description: cancelImmediately 
          ? 'Sua assinatura foi cancelada com sucesso' 
          : 'Sua assinatura será cancelada ao final do período atual',
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/current-subscription'] });
      setShowCancelDialog(false);
      setCancelReason('');
      setCancelImmediately(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao cancelar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Mutação para reativar uma assinatura cancelada
  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/subscription/reactivate-subscription');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao reativar assinatura');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Assinatura reativada',
        description: 'Sua assinatura foi reativada com sucesso',
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/current-subscription'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao reativar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Manipuladores de eventos
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };
  
  const handleCancelSubscription = () => {
    cancelMutation.mutate({ 
      reason: cancelReason, 
      cancelImmediate: cancelImmediately 
    });
  };
  
  const handleReactivateSubscription = () => {
    reactivateMutation.mutate();
  };
  
  const handleUpgradeSuccess = () => {
    setShowPaymentForm(false);
    setShowUpgradeDialog(false);
    setSelectedPlan(null);
    
    toast({
      title: 'Assinatura atualizada',
      description: 'Seu plano foi atualizado com sucesso',
      variant: 'default',
    });
    
    queryClient.invalidateQueries({ queryKey: ['/api/subscription/current-subscription'] });
  };

  // Exibe carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Exibe mensagem de erro
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as informações da assinatura. 
          {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  // Se o usuário ainda não tem uma assinatura, mostra a seleção de planos
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
          <CardDescription>
            Você ainda não possui uma assinatura ativa. Selecione um plano para começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPaymentForm ? (
            <SubscriptionFormContainer
              planId={selectedPlan || PLAN_IDS.BASIC}
              onSuccess={handleUpgradeSuccess}
              onCancel={() => setShowPaymentForm(false)}
            />
          ) : (
            <SubscriptionPlans
              onSelectPlan={handlePlanSelection}
              initialSelectedPlan={PLAN_IDS.BASIC}
              autoRotate={true}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  // Determina se a assinatura está cancelada
  const isCanceled = subscription.status === 'canceled' || subscription.cancelAtPeriodEnd;
  
  // Determina se a assinatura pode ser alterada/atualizada
  const canUpgrade = subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
  
  // Determina se a assinatura pode ser reativada
  const canReactivate = subscription.status === 'active' && subscription.cancelAtPeriodEnd;

  return (
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Detalhes</TabsTrigger>
        <TabsTrigger value="billing">Faturas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>Assinatura</CardTitle>
                <CardDescription>
                  Detalhes da sua assinatura atual
                </CardDescription>
              </div>
              <Badge 
                variant={
                  StatusLabels[subscription.status]?.variant || 'outline'
                }
              >
                {StatusLabels[subscription.status]?.label || subscription.status}
                {subscription.cancelAtPeriodEnd && ' (Cancelamento Agendado)'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Plano</h3>
                <p className="text-lg font-semibold">
                  {subscription.plan === 'basic' && 'Básico'}
                  {subscription.plan === 'pro' && 'Profissional'}
                  {subscription.plan === 'enterprise' && 'Empresarial'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Clientes</h3>
                <p className="text-lg font-semibold">
                  {subscription.clientCount} / {subscription.maxClients}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Data de Início
                  </span>
                </h3>
                <p className="font-medium">
                  {new Date(subscription.startDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {subscription.cancelAtPeriodEnd ? 'Termina em' : 'Próxima cobrança'}
                  </span>
                </h3>
                <p className="font-medium">
                  {subscription.currentPeriodEnd 
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR') 
                    : subscription.endDate 
                      ? new Date(subscription.endDate).toLocaleDateString('pt-BR')
                      : 'Não disponível'}
                  
                  {subscription.daysRemaining !== undefined && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({subscription.daysRemaining} dias restantes)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {isCanceled && (
              <Alert variant="default" className="bg-muted">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cancelamento Agendado</AlertTitle>
                <AlertDescription>
                  Sua assinatura está agendada para cancelamento 
                  {subscription.currentPeriodEnd 
                    ? ` em ${new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}`
                    : ''}. 
                  {canReactivate && 'Você pode reativar sua assinatura até esta data.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            {!isCanceled ? (
              <>
                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancelar Assinatura</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancelar Assinatura</DialogTitle>
                      <DialogDescription>
                        Você tem certeza que deseja cancelar sua assinatura? 
                        Informe um motivo que nos ajude a melhorar.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <Textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Por que você está cancelando? (opcional)"
                        className="resize-none"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="cancelImmediately"
                          checked={cancelImmediately}
                          onChange={(e) => setCancelImmediately(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label 
                          htmlFor="cancelImmediately" 
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Cancelar imediatamente 
                          <span className="text-xs ml-1 text-destructive">
                            (Perderá acesso agora)
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCancelDialog(false)}
                      >
                        Voltar
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelSubscription}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Processando...
                          </>
                        ) : (
                          'Confirmar Cancelamento'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {canUpgrade && (
                  <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogTrigger asChild>
                      <Button>Alterar Plano</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Alterar Plano</DialogTitle>
                        <DialogDescription>
                          Selecione o plano para o qual deseja atualizar
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ScrollArea className="max-h-[70vh]">
                        <div className="py-4">
                          {showPaymentForm ? (
                            <SubscriptionFormContainer
                              planId={selectedPlan || subscription.plan}
                              onSuccess={handleUpgradeSuccess}
                              onCancel={() => setShowPaymentForm(false)}
                            />
                          ) : (
                            <SubscriptionPlans
                              onSelectPlan={handlePlanSelection}
                              initialSelectedPlan={subscription.plan}
                              highlightCurrentPlan={true}
                            />
                          )}
                        </div>
                      </ScrollArea>
                      
                      {!showPaymentForm && (
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowUpgradeDialog(false)}
                          >
                            Cancelar
                          </Button>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </>
            ) : (
              canReactivate && (
                <Button 
                  variant="default"
                  onClick={handleReactivateSubscription}
                  disabled={reactivateMutation.isPending}
                >
                  {reactivateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" /> 
                      Reativar Assinatura
                    </>
                  )}
                </Button>
              )
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="billing">
        <InvoiceList />
      </TabsContent>
    </Tabs>
  );
}

// Componente para listar as faturas
function InvoiceList() {
  const { user } = useAuth();
  
  // Busca as faturas do usuário
  const { 
    data: invoices, 
    isLoading 
  } = useQuery({
    queryKey: ['/api/subscription/invoices'],
    enabled: !!user && user.role === 'mentor',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturas</CardTitle>
          <CardDescription>
            Seu histórico de pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma fatura disponível
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Faturas</CardTitle>
        <CardDescription>
          Seu histórico de pagamentos e faturas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Nº</th>
                <th className="px-4 py-2 text-left font-medium">Data</th>
                <th className="px-4 py-2 text-left font-medium">Valor</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Período</th>
                <th className="px-4 py-2 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">{invoice.number}</td>
                  <td className="px-4 py-3">
                    {new Date(invoice.created).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    {invoice.amountPaid
                      ? `R$${invoice.amountPaid.toFixed(2)}` 
                      : `R$${invoice.amountDue.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' : 
                      invoice.status === 'open' ? 'outline' : 'destructive'
                    }>
                      {invoice.status === 'paid' ? 'Pago' : 
                       invoice.status === 'open' ? 'Pendente' : 'Falha'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">
                      {new Date(invoice.periodStart).toLocaleDateString('pt-BR')} - {' '}
                      {new Date(invoice.periodEnd).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {invoice.receiptUrl && (
                      <a 
                        href={invoice.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <CreditCard className="h-3 w-3" />
                        <span>Recibo</span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}