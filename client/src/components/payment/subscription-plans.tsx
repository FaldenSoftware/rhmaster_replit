import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { PlanCard, PlanFeature } from './plan-card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipos de plano disponíveis
export const PLAN_IDS = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

// Informações sobre os planos disponíveis
const PLANS = {
  [PLAN_IDS.BASIC]: {
    id: PLAN_IDS.BASIC,
    name: 'Básico',
    description: 'Para mentores individuais iniciando',
    price: 39.90,
    maxClients: 10,
    features: [
      { name: 'Até 10 clientes', included: true },
      { name: 'Acesso a testes comportamentais', included: true },
      { name: 'Dashboard básico', included: true },
      { name: 'Assistente IA para mentor', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Testes avançados', included: false },
      { name: 'Relatórios personalizados', included: false },
      { name: 'Suporte prioritário', included: false },
    ],
  },
  [PLAN_IDS.PRO]: {
    id: PLAN_IDS.PRO,
    name: 'Profissional',
    description: 'Para mentores com carteira de clientes',
    price: 89.90,
    maxClients: 30,
    features: [
      { name: 'Até 30 clientes', included: true },
      { name: 'Acesso a testes comportamentais', included: true },
      { name: 'Dashboard avançado', included: true },
      { name: 'Assistente IA para mentor e clientes', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'Testes avançados', included: true },
      { name: 'Relatórios personalizados', included: true },
      { name: 'API de integração', included: false },
    ],
  },
  [PLAN_IDS.ENTERPRISE]: {
    id: PLAN_IDS.ENTERPRISE,
    name: 'Empresarial',
    description: 'Para equipes e grandes organizações',
    price: 199.90,
    maxClients: 100,
    features: [
      { name: 'Até 100 clientes', included: true },
      { name: 'Acesso a testes comportamentais', included: true },
      { name: 'Dashboard personalizado', included: true },
      { name: 'Assistente IA premium', included: true },
      { name: 'Suporte dedicado', included: true },
      { name: 'Testes avançados e personalizados', included: true },
      { name: 'Relatórios analíticos completos', included: true },
      { name: 'API de integração', included: true },
    ],
  },
};

type SubscriptionPlansProps = {
  onSelectPlan: (planId: string) => void;
  initialSelectedPlan?: string;
  highlightCurrentPlan?: boolean;
  autoRotate?: boolean;
};

export function SubscriptionPlans({
  onSelectPlan,
  initialSelectedPlan,
  highlightCurrentPlan = false,
  autoRotate = false
}: SubscriptionPlansProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(initialSelectedPlan);
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);

  // Obter a assinatura atual do usuário
  const { data: currentSubscription, isLoading } = useQuery({
    queryKey: ['/api/subscription/current-subscription'],
    enabled: !!user && highlightCurrentPlan && user.role === 'mentor',
  });

  // Efeito para rotação automática dos planos
  useEffect(() => {
    if (!autoRotate) return;
    
    const planIds = Object.keys(PLANS);
    const interval = setInterval(() => {
      setAutoRotateIndex((prev) => (prev + 1) % planIds.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRotate]);

  useEffect(() => {
    if (autoRotate) {
      const planIds = Object.keys(PLANS);
      setSelectedPlan(planIds[autoRotateIndex]);
    }
  }, [autoRotateIndex, autoRotate]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {Object.values(PLANS).map((plan, index) => {
        const isCurrent = 
          highlightCurrentPlan && 
          currentSubscription?.plan === plan.id;
        
        const isSelected = 
          selectedPlan === plan.id;
          
        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <PlanCard
              id={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              popular={plan.id === PLAN_IDS.PRO}
              current={isCurrent}
              onSelect={handleSelectPlan}
              disabled={isCurrent}
            />
          </motion.div>
        );
      })}
    </div>
  );
}