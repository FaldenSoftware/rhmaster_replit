import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

export function PricingSection() {
  // Toggle between monthly and annual billing
  const [annual, setAnnual] = useState(false);
  
  // Discounted rate for annual plans (20% off)
  const annualDiscount = 0.8;
  
  const plans = [
    {
      name: "Básico",
      description: "Para mentores individuais iniciando sua jornada.",
      monthlyPrice: 39.90,
      features: [
        "Até 10 clientes",
        "Acesso a testes comportamentais",
        "Dashboard básico",
        "Assistente IA para mentor",
        "Suporte por email"
      ],
      limitations: [
        "Testes avançados",
        "Relatórios personalizados",
        "Suporte prioritário"
      ],
      color: "bg-white"
    },
    {
      name: "Profissional",
      description: "Para mentores com carteira de clientes.",
      monthlyPrice: 89.90,
      popular: true,
      features: [
        "Até 30 clientes",
        "Acesso a testes comportamentais",
        "Dashboard avançado",
        "Assistente IA para mentor e clientes",
        "Suporte prioritário",
        "Testes avançados",
        "Relatórios personalizados"
      ],
      limitations: [
        "API de integração"
      ],
      color: "bg-white"
    },
    {
      name: "Empresarial",
      description: "Para equipes e grandes organizações.",
      monthlyPrice: 199.90,
      features: [
        "Até 100 clientes",
        "Acesso a testes comportamentais",
        "Dashboard personalizado",
        "Assistente IA premium",
        "Suporte dedicado",
        "Testes avançados e personalizados",
        "Relatórios analíticos completos",
        "API de integração"
      ],
      limitations: [],
      color: "bg-white"
    }
  ];

  // Função para renderizar um plano
  const renderPlan = (plan: typeof plans[0], index: number) => {
    const price = annual 
      ? Math.round(plan.monthlyPrice * annualDiscount)
      : plan.monthlyPrice;
    
    const yearlyPrice = Math.round(plan.monthlyPrice * annualDiscount * 12);
    
    return (
      <div 
        key={index}
        className={`bg-white rounded-xl border ${
          plan.popular ? "border-primary shadow-lg relative" : "border-slate-200"
        }`}
      >
        {plan.popular && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-primary-foreground text-xs font-bold py-1 px-3 transform rotate-6 shadow-lg m-2">
            Mais Popular
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
          <p className="text-slate-500 mt-2 h-12">{plan.description}</p>
          
          <div className="mt-6 mb-6">
            <div className="flex items-end">
              <span className="text-4xl font-bold text-slate-900">
                R${price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-slate-500 ml-2 mb-1">
                /{annual ? 'mês*' : 'mês'}
              </span>
            </div>
            {annual && (
              <p className="text-xs text-slate-500 mt-1">
                *Cobrado anualmente como 
                R${yearlyPrice.toFixed(2).replace('.', ',')}/ano
              </p>
            )}
          </div>
          
          <Link href="/auth">
            <Button 
              className={`w-full ${plan.popular ? "bg-primary" : ""}`}
              variant={plan.popular ? "default" : "outline"}
            >
              Selecionar Plano
            </Button>
          </Link>
          
          <div className="mt-6 space-y-2">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-start">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-0.5" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
            {plan.limitations.map((limitation, i) => (
              <div key={i} className="flex items-start">
                <X className="h-4 w-4 text-slate-400 flex-shrink-0 mr-2 mt-0.5" />
                <span className="text-sm text-slate-500">{limitation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">PLANOS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Planos flexíveis que crescem com você e sua prática de mentoria
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <div className="bg-white p-1 rounded-full border border-slate-200 inline-flex">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !annual 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  annual 
                    ? "bg-primary text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Anual 
                <span className="ml-1 text-xs font-bold opacity-90">
                  (20% OFF)
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Informações complementares acima dos planos */}
        <div className="max-w-3xl mx-auto mb-10 bg-white p-4 rounded-lg border border-slate-200 text-center">
          <p className="text-slate-600">
            Todos os planos incluem período de avaliação gratuito de 14 dias, 
            sem necessidade de cartão de crédito para começar.
          </p>
        </div>

        {/* Grid de planos - Mobile (empilhados) e Desktop (lado a lado) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map(renderPlan)}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-lg border border-slate-200 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Precisa de um plano customizado?
          </h3>
          <p className="text-slate-600 mb-6">
            Se você gerencia uma equipe de mentores ou tem necessidades específicas, 
            podemos criar um plano sob medida para sua organização.
          </p>
          <Button size="lg">
            Contate Nosso Time de Vendas
          </Button>
        </div>
      </div>
    </section>
  );
}