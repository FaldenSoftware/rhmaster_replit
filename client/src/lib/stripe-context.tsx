import { createContext, useContext, ReactNode, useState } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from '@/hooks/use-theme';

// Certifique-se de que a chave pública do Stripe está disponível
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Chave pública do Stripe não configurada! Defina VITE_STRIPE_PUBLIC_KEY no arquivo .env');
}

// Carregue o objeto Stripe fora do componente para evitar recriação em cada renderização
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

type StripeContextType = {
  isLoading: boolean;
};

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function useStripeContext() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext deve ser usado dentro de um StripeProvider');
  }
  return context;
}

type StripeProviderProps = {
  children: ReactNode;
};

export function StripeProvider({ children }: StripeProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StripeContext.Provider value={{ isLoading }}>
      {children}
    </StripeContext.Provider>
  );
}

type StripeElementsProviderProps = {
  children: ReactNode;
  clientSecret: string;
};

export function StripeElementsProvider({ children, clientSecret }: StripeElementsProviderProps) {
  const { theme } = useTheme();
  
  // Defina as opções para os elementos do Stripe, incluindo o tema
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === 'dark' ? 'night' : 'stripe',
      variables: {
        colorPrimary: '#006B6B', // Verde-azulado
        colorBackground: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        colorText: theme === 'dark' ? '#ffffff' : '#1a1a1a',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}