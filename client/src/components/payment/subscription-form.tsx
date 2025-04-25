import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SubscriptionFormProps {
  clientSecret: string;
  planId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function SubscriptionForm({ 
  clientSecret, 
  planId, 
  onSuccess, 
  onError 
}: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!stripe) {
      return;
    }
    
    if (!clientSecret) {
      setError('Client secret não fornecido');
      return;
    }
    
    // Verifica o status do pagamento quando o componente é carregado
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Pagamento concluído com sucesso!");
          setIsComplete(true);
          onSuccess?.();
          break;
        case "processing":
          setMessage("Seu pagamento está sendo processado.");
          break;
        case "requires_payment_method":
          // Quando chega aqui, é o estado inicial normal, não configuramos mensagem
          break;
        default:
          setError("Algo deu errado. Por favor, tente novamente.");
          break;
      }
    });
  }, [stripe, clientSecret, onSuccess]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js ainda não carregou
      // Desabilite o formulário de envio até que o Stripe.js tenha carregado
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/mentor-dashboard/settings?subscription_success=true&plan=${planId}`,
      },
      redirect: 'if_required',
    });
    
    if (result.error) {
      // Mostra erro para o cliente
      setError(result.error.message || 'Ocorreu um erro ao processar o pagamento');
      onError?.(new Error(result.error.message || 'Ocorreu um erro ao processar o pagamento'));
    } else if (result.paymentIntent?.status === 'succeeded') {
      // O pagamento foi bem-sucedido
      setMessage('Pagamento concluído com sucesso!');
      setIsComplete(true);
      onSuccess?.();
    }
    
    setIsLoading(false);
  };
  
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {message && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border p-4 bg-card">
        <PaymentElement id="payment-element" />
      </div>
      
      <Button 
        className="w-full mt-4" 
        disabled={isLoading || !stripe || !elements || isComplete} 
        type="submit"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Pagamento Concluído
          </>
        ) : (
          'Finalizar Pagamento'
        )}
      </Button>
    </form>
  );
}