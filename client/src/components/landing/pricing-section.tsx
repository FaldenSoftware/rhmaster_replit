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
      name: "Starter",
      description: "Perfeito para mentores independentes em início de carreira.",
      monthlyPrice: 97,
      features: [
        "Até 10 clientes ativos",
        "5 testes comportamentais incluídos",
        "Relatórios básicos",
        "Email de suporte",
        "Gamificação básica"
      ],
      limitations: [
        "Sem personalização white-label",
        "Sem integração de calendário",
        "Sem análise de progresso avançada",
        "Sem recursos de comunidade"
      ]
    },
    {
      name: "Mentor Pro",
      description: "Ideal para mentores profissionais que buscam escalabilidade.",
      monthlyPrice: 197,
      popular: true,
      features: [
        "Até 30 clientes ativos",
        "Testes comportamentais ilimitados",
        "Relatórios avançados personalizados",
        "Suporte prioritário",
        "Gamificação completa",
        "Análise de progresso detalhada",
        "Personalização básica com branding",
        "Integração de calendário",
        "Biblioteca completa de recursos"
      ],
      limitations: [
        "Sem API para integração externa",
        "Sem acesso aos recursos Enterprise"
      ]
    },
    {
      name: "Enterprise",
      description: "Para empresas de consultoria e programas corporativos de mentoria.",
      monthlyPrice: 497,
      features: [
        "Clientes ilimitados",
        "Testes comportamentais ilimitados",
        "White-label completo",
        "Relatórios personalizados avançados",
        "Suporte VIP com gerente dedicado",
        "Gamificação com customização total",
        "APIs para integração",
        "Recursos de comunidade",
        "SSO e controles administrativos",
        "Treinamento e onboarding da equipe",
        "SLA personalizado"
      ],
      limitations: []
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border ${
                plan.popular
                  ? "border-primary relative shadow-lg transform md:-translate-y-4 scale-105 z-10"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full">
                  Mais Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 mt-2 min-h-[48px]">{plan.description}</p>
                
                <div className="mt-6 mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-slate-900">
                      {annual 
                        ? `R$${Math.round(plan.monthlyPrice * annualDiscount)}`
                        : `R$${plan.monthlyPrice}`
                      }
                    </span>
                    <span className="text-slate-500 ml-2">
                      /{annual ? 'mês*' : 'mês'}
                    </span>
                  </div>
                  {annual && (
                    <p className="text-xs text-slate-500 mt-1">
                      *Cobrado anualmente como 
                      R${Math.round(plan.monthlyPrice * annualDiscount * 12)}/ano
                    </p>
                  )}
                </div>
                
                <Link href="/auth">
                  <Button 
                    className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Fale Conosco" : "Começar Agora"}
                  </Button>
                </Link>
                
                <div className="mt-8 space-y-4">
                  <p className="font-medium text-slate-700">Inclui:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <p className="font-medium text-slate-700 mt-6 pt-4 border-t border-slate-100">
                        Não inclui:
                      </p>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start">
                          <X className="h-5 w-5 text-slate-300 flex-shrink-0 mr-2" />
                          <span className="text-slate-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-lg border border-slate-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Precisa de um plano customizado?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
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