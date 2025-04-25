import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Certifique-se de que a chave pública do Stripe está definida
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error(
    'VITE_STRIPE_PUBLIC_KEY não está definido! Verifique seu arquivo .env'
  );
}

// Carregar o Stripe fora do componente para evitar recriações desnecessárias
const stripePromise = loadStripe(stripePublicKey);

// Definição do contexto
type StripeContextType = {
  stripePromise: Promise<Stripe | null>;
};

const StripeContext = createContext<StripeContextType | null>(null);

// Hook para uso do contexto
export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe deve ser usado dentro de um StripeProvider');
  }
  return context;
};

// Componente Provider
export const StripeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
};

// Componente para envolver elementos que precisam do Stripe
export const StripeElementsProvider = ({ 
  children, 
  clientSecret 
}: { 
  children: ReactNode;
  clientSecret: string;
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#006B6B', // Verde-azulado
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
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
};