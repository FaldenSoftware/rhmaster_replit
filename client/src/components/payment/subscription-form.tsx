import React, { useState, useEffect } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { PLAN_IDS } from './subscription-plans';

// Carregando o Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type SubscriptionFormContainerProps = {
  planId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// Componente container que carrega o Stripe
export function SubscriptionFormContainer({ 
  planId, 
  onSuccess, 
  onCancel 
}: SubscriptionFormContainerProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientSecret = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        // Verifica se o planId é válido
        if (!Object.values(PLAN_IDS).includes(planId as any)) {
          throw new Error('Plano inválido');
        }

        console.log('Iniciando solicitação de pagamento para plano:', planId);

        // Busca o client secret do Stripe para iniciar o pagamento
        const response = await apiRequest('POST', '/api/subscription/create-payment-intent', { 
          planId
        });

        if (!response.ok) {
          // Tenta obter informações de erro do response
          let errorMessage = 'Erro ao iniciar assinatura';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Se não for possível obter JSON, tenta obter texto
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch (textError) {
              // Manter a mensagem padrão se não conseguir obter texto
            }
          }
          throw new Error(errorMessage);
        }

        // Tenta obter dados JSON com tratamento robusto
        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.error('Erro ao obter resposta JSON:', e);
          try {
            const responseText = await response.text();
            if (responseText) {
              try {
                data = JSON.parse(responseText);
              } catch (jsonError) {
                console.error('Erro ao analisar resposta como JSON:', jsonError);
                throw new Error('Resposta inválida do servidor');
              }
            } else {
              throw new Error('Resposta vazia do servidor');
            }
          } catch (textError) {
            console.error('Erro ao obter resposta como texto:', textError);
            throw new Error('Erro de comunicação com o servidor');
          }
        }
        
        console.log('Resposta da API de pagamento:', data);
        
        if (!data || !data.clientSecret) {
          throw new Error('Dados de pagamento inválidos ou incompletos');
        }
        
        setClientSecret(data.clientSecret);
        setPaymentData(data);
      } catch (err: any) {
        console.error('Erro ao iniciar assinatura:', err);
        setError(err.message || 'Erro ao processar assinatura');
        
        toast({
          title: 'Erro ao iniciar assinatura',
          description: err.message || 'Não foi possível iniciar o processo de assinatura',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, [planId, user, toast]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Preparando assinatura</CardTitle>
          <CardDescription>Estamos preparando seu plano</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Erro ao iniciar assinatura</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onCancel} variant="outline" className="w-full">
            Voltar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!clientSecret) {
    return null;
  }

  // Verificar se é um cliente simulado para tratar de forma diferente
  const isSimulated = paymentData?.simulated === true;
  
  // Opções para o componente Elements
  const options: any = {
    clientSecret,
    // Se for simulado, estamos em modo de desenvolvimento, então usamos options diferentes
    ...(isSimulated ? { 
      mode: 'setup' as const,
      appearance: { theme: 'stripe' }
    } : {})
  };
  
  return (
    <Elements stripe={stripePromise} options={options}>
      <SubscriptionForm 
        clientSecret={clientSecret}
        isSimulated={isSimulated}
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
}

type SubscriptionFormProps = {
  clientSecret: string;
  isSimulated?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// Formulário de pagamento
function SubscriptionForm({ clientSecret, isSimulated = false, onSuccess, onCancel }: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // O Stripe.js ainda não carregou
      return;
    }

    // Limpa erros anteriores
    setPaymentError(null);
    setIsProcessing(true);

    // Obtém o elemento do cartão
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setPaymentError('Erro ao acessar o formulário de pagamento');
      setIsProcessing(false);
      return;
    }

    try {
      // Verifica se é um pagamento simulado (para desenvolvimento)
      if (isSimulated || clientSecret.startsWith('seti_') || clientSecret.startsWith('pi_simulated_')) {
        console.log('Processando pagamento simulado para desenvolvimento');
        
        // Simula um delay para parecer real
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Pagamento simulado bem-sucedido
        setPaymentSuccess(true);
        toast({
          title: 'Pagamento confirmado',
          description: 'Sua assinatura foi ativada com sucesso! (Ambiente de desenvolvimento)',
          variant: 'default',
        });
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        // Modo de produção - usa Stripe real
        try {
          // Confirma o pagamento com o Stripe
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: cardElement,
              },
            }
          );

          if (error) {
            // Exibe erro em caso de falha no pagamento
            setPaymentError(error.message || 'Erro ao processar o pagamento');
            toast({
              title: 'Falha no pagamento',
              description: error.message || 'Ocorreu um erro ao processar seu pagamento',
              variant: 'destructive',
            });
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Pagamento bem-sucedido
            setPaymentSuccess(true);
            toast({
              title: 'Pagamento confirmado',
              description: 'Sua assinatura foi ativada com sucesso!',
              variant: 'default',
            });
            
            if (onSuccess) {
              setTimeout(() => {
                onSuccess();
              }, 1500);
            }
          }
        } catch (stripeError) {
          console.error('Erro específico do Stripe:', stripeError);
          setPaymentError('Erro na comunicação com o Stripe. Por favor tente novamente.');
          toast({
            title: 'Erro no processamento',
            description: 'Ocorreu um erro na comunicação com o gateway de pagamento',
            variant: 'destructive',
          });
        }
      }
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      setPaymentError(err.message || 'Erro ao processar o pagamento');
      toast({
        title: 'Erro no processamento',
        description: err.message || 'Ocorreu um erro ao processar seu pagamento',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {paymentSuccess ? 'Pagamento Concluído' : 'Finalizar Assinatura'}
        </CardTitle>
        <CardDescription>
          {paymentSuccess 
            ? 'Sua assinatura foi ativada com sucesso!' 
            : 'Complete seus dados de pagamento para ativar sua assinatura'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {paymentSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-16 w-16 text-primary mb-4" />
            <p className="text-lg font-medium mb-2">Pagamento processado com sucesso!</p>
            <p className="text-sm text-muted-foreground">
              Sua assinatura está ativa e você já pode acessar todos os recursos do plano.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted p-4 rounded-md border">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium">Dados do Cartão</h3>
              </div>
              
              <div className="p-3 bg-background rounded border">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
              
              {paymentError && (
                <div className="mt-3 text-sm text-destructive">
                  {paymentError}
                </div>
              )}
              
              <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Seus dados são criptografados com segurança</span>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {paymentSuccess ? (
          <Button 
            onClick={onSuccess} 
            className="w-full sm:w-auto"
            variant="default"
          >
            Continuar
          </Button>
        ) : (
          <>
            <Button
              onClick={onCancel}
              variant="outline"
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!stripe || isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Pagamento'
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}