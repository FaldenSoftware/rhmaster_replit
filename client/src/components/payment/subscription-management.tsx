import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CreditCard, FileText, Loader2, RefreshCcw, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlans } from './subscription-plans';
import { cn } from '@/lib/utils';

interface SubscriptionData {
  id: number;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'trial' | 'canceled' | 'expired';
  maxClients: number;
  clientCount: number;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  daysRemaining: number;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: string;
}

interface InvoiceData {
  id: string;
  number: string;
  status: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  created: string;
  dueDate: string | null;
  periodStart: string;
  periodEnd: string;
  receiptUrl: string | null;
  pdf: string | null;
}

export function SubscriptionManagement() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelImmediate, setCancelImmediate] = useState(false);

  // Carregar dados da assinatura
  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  // Verificar se existe um parâmetro de sucesso na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription_success') === 'true') {
      toast({
        title: 'Assinatura processada com sucesso!',
        description: 'Seu plano foi ativado.',
      });
      
      // Limpar o parâmetro da URL sem recarregar a página
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Recarregar os dados da assinatura
      fetchSubscriptionData();
    }
  }, [toast]);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/subscription/current-subscription');
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        
        // Carregar faturas após obter assinatura
        fetchInvoices();
      } else {
        // Se for 404, é porque não tem assinatura ainda
        if (response.status === 404) {
          setSubscription(null);
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao buscar dados da assinatura');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar assinatura',
        description: error.message || 'Ocorreu um erro ao buscar dados da sua assinatura',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setIsInvoicesLoading(true);
      const response = await apiRequest('GET', '/api/subscription/invoices');
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar faturas');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar faturas',
        description: error.message || 'Ocorreu um erro ao buscar suas faturas',
        variant: 'destructive',
      });
    } finally {
      setIsInvoicesLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCanceling(true);
      const response = await apiRequest('POST', '/api/subscription/cancel-subscription', {
        reason: cancelReason,
        cancelImmediate
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Assinatura cancelada',
          description: data.message || 'Sua solicitação de cancelamento foi processada com sucesso',
        });
        
        // Recarregar os dados da assinatura
        fetchSubscriptionData();
        setShowCancelDialog(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao cancelar assinatura');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao cancelar assinatura',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsReactivating(true);
      const response = await apiRequest('POST', '/api/subscription/reactivate-subscription');
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Assinatura reativada',
          description: data.message || 'Sua assinatura foi reativada com sucesso',
        });
        
        // Recarregar os dados da assinatura
        fetchSubscriptionData();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao reativar assinatura');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao reativar assinatura',
        description: error.message || 'Ocorreu um erro ao processar sua solicitação',
        variant: 'destructive',
      });
    } finally {
      setIsReactivating(false);
    }
  };

  // Mapear o status para uma cor e texto mais amigável
  const getStatusDetails = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return {
        label: 'Cancelamento Agendado',
        color: 'bg-amber-500',
        description: 'A assinatura será cancelada ao final do período atual',
      };
    }
    
    switch (status) {
      case 'active':
        return {
          label: 'Ativa',
          color: 'bg-green-500',
          description: 'Sua assinatura está ativa e será renovada automaticamente',
        };
      case 'trial':
        return {
          label: 'Período de Teste',
          color: 'bg-blue-500',
          description: 'Você está no período de teste gratuito',
        };
      case 'canceled':
        return {
          label: 'Cancelada',
          color: 'bg-red-500',
          description: 'Sua assinatura foi cancelada',
        };
      case 'inactive':
        return {
          label: 'Inativa',
          color: 'bg-gray-500',
          description: 'Sua assinatura está temporariamente inativa',
        };
      case 'expired':
        return {
          label: 'Expirada',
          color: 'bg-gray-500',
          description: 'Sua assinatura expirou',
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-500',
          description: 'Status desconhecido',
        };
    }
  };

  // Formatar nomes dos planos
  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Básico';
      case 'pro': return 'Profissional';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Função para formatar valor monetário
  const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
          <CardDescription>Você ainda não possui uma assinatura ativa</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sem assinatura ativa</AlertTitle>
            <AlertDescription>
              Para acessar todos os recursos da plataforma, você precisa escolher um plano de assinatura.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setShowUpgradeDialog(true)}>
            Escolher um Plano
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const statusDetails = getStatusDetails(subscription.status, subscription.cancelAtPeriodEnd);
  const usagePercentage = (subscription.clientCount / subscription.maxClients) * 100;

  return (
    <div className="space-y-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle>Assinatura</CardTitle>
              <CardDescription>Gerenciar sua assinatura atual</CardDescription>
            </div>
            <Badge className={cn("mt-2 sm:mt-0", statusDetails.color)}>
              {statusDetails.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Plano Atual</h3>
              <p className="text-xl font-bold">{getPlanName(subscription.plan)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-sm">{statusDetails.description}</p>
            </div>
            
            {subscription.status === 'trial' && (
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Período de Teste</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Dias restantes: {subscription.daysRemaining}</span>
                    <span>{subscription.daysRemaining} de 7 dias</span>
                  </div>
                  <Progress value={(subscription.daysRemaining / 7) * 100} className="h-2" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Uso de Clientes</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Clientes ativos</span>
                  <span>{subscription.clientCount} de {subscription.maxClients}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Próxima Cobrança</h3>
              <p className="text-sm">
                {subscription.cancelAtPeriodEnd
                  ? 'Nenhuma cobrança futura'
                  : formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Início da Assinatura</h3>
              <p className="text-sm">{formatDate(subscription.startDate)}</p>
            </div>
            
            {subscription.endDate && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Término da Assinatura</h3>
                <p className="text-sm">{formatDate(subscription.endDate)}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(true)}>
                Alterar Plano
              </Button>
              <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                Cancelar Assinatura
              </Button>
            </>
          )}
          
          {subscription.cancelAtPeriodEnd && (
            <Button 
              variant="outline" 
              onClick={handleReactivateSubscription}
              disabled={isReactivating}
            >
              {isReactivating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reativando...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reativar Assinatura
                </>
              )}
            </Button>
          )}
          
          {['canceled', 'expired', 'inactive'].includes(subscription.status) && (
            <Button onClick={() => setShowUpgradeDialog(true)}>
              Assinar Novamente
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Seção de faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturas</CardTitle>
          <CardDescription>Visualize suas faturas anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          {isInvoicesLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma fatura encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
                >
                  <div className="space-y-1 mb-2 sm:mb-0">
                    <p className="font-medium">Fatura #{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(invoice.created)} - {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Badge
                      className={cn(
                        invoice.status === 'paid' ? 'bg-green-500' : 
                        invoice.status === 'open' ? 'bg-blue-500' : 'bg-red-500'
                      )}
                    >
                      {invoice.status === 'paid' ? 'Pago' : invoice.status === 'open' ? 'Em aberto' : 'Falha'}
                    </Badge>
                    
                    <div className="flex gap-2 ml-auto">
                      {invoice.receiptUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={invoice.receiptUrl} target="_blank" rel="noopener noreferrer">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Recibo
                          </a>
                        </Button>
                      )}
                      
                      {invoice.pdf && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={invoice.pdf} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog para upgrade/alteração de plano */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              {subscription && subscription.status === 'active' ? 'Alterar Plano' : 'Escolher um Plano'}
            </DialogTitle>
            <DialogDescription>
              {subscription && subscription.status === 'active'
                ? 'Escolha um novo plano para sua assinatura. Você será cobrado proporcionalmente pela diferença.'
                : 'Escolha um plano que melhor atenda às suas necessidades.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <SubscriptionPlans 
              currentPlan={subscription?.plan} 
              isUpgrade={true}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua assinatura? 
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Conte-nos por que está cancelando..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cancel-immediate"
                checked={cancelImmediate}
                onChange={(e) => setCancelImmediate(e.target.checked)}
              />
              <label htmlFor="cancel-immediate" className="text-sm">
                Cancelar imediatamente (sem reembolso do período atual)
              </label>
            </div>
            
            <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                {cancelImmediate
                  ? "Sua assinatura será cancelada imediatamente e você perderá o acesso aos recursos premium. Não haverá reembolso pelo período atual já pago."
                  : "Sua assinatura continuará ativa até o final do período atual. Após isso, você perderá o acesso aos recursos premium."}
              </AlertDescription>
            </Alert>
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
              disabled={isCanceling}
            >
              {isCanceling ? (
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
    </div>
  );
}