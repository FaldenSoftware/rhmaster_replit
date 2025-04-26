import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PricingSection() {
  // Toggle between monthly and annual billing
  const [annual, setAnnual] = useState(false);
  
  // State for carousel
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const carouselInterval = useRef<NodeJS.Timeout | null>(null);
  
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
      ],
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
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
      ],
      color: "bg-primary"
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
      limitations: [],
      color: "bg-gradient-to-br from-purple-500 to-purple-800"
    }
  ];

  // Start the carousel to switch plans automatically every 3 seconds
  useEffect(() => {
    carouselInterval.current = setInterval(() => {
      setActivePlanIndex((prevIndex) => (prevIndex + 1) % plans.length);
    }, 3000);
    
    return () => {
      if (carouselInterval.current) {
        clearInterval(carouselInterval.current);
      }
    };
  }, [plans.length]);

  // Reset the interval when manually changing the active plan
  const handlePlanChange = (index: number) => {
    setActivePlanIndex(index);
    
    if (carouselInterval.current) {
      clearInterval(carouselInterval.current);
    }
    
    carouselInterval.current = setInterval(() => {
      setActivePlanIndex((prevIndex) => (prevIndex + 1) % plans.length);
    }, 3000);
  };

  // Go to previous plan
  const prevPlan = () => {
    const newIndex = (activePlanIndex - 1 + plans.length) % plans.length;
    handlePlanChange(newIndex);
  };

  // Go to next plan
  const nextPlan = () => {
    const newIndex = (activePlanIndex + 1) % plans.length;
    handlePlanChange(newIndex);
  };

  // Current active plan
  const activePlan = plans[activePlanIndex];

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

        {/* Mobile Carousel View */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activePlanIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className={`${activePlan.color} text-white rounded-xl overflow-hidden shadow-xl`}>
                {activePlan.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-primary-foreground text-xs font-bold py-1 px-3 transform rotate-6 shadow-lg m-2">
                    Oferta por tempo limitado!
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{activePlan.name}</h3>
                  <p className="opacity-80 mb-4">{activePlan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-5xl font-bold">
                        R${annual 
                          ? Math.round(activePlan.monthlyPrice * annualDiscount)
                          : activePlan.monthlyPrice
                        }
                      </span>
                      <span className="ml-2 opacity-80">/{annual ? 'mês*' : 'mês'}</span>
                    </div>
                    {annual && (
                      <p className="text-xs opacity-80 mt-1">
                        *Cobrado anualmente como 
                        R${Math.round(activePlan.monthlyPrice * annualDiscount * 12)}/ano
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {activePlan.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 flex-shrink-0 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/auth">
                    <Button 
                      className="w-full bg-white text-slate-900 hover:bg-slate-100"
                    >
                      {activePlan.name === "Enterprise" ? "Fale Conosco" : "Começar Teste Gratuito"}
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-center mt-4 opacity-80">
                    Cancele a qualquer momento durante o período de teste
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-6 space-x-2">
            {plans.map((_, index) => (
              <button 
                key={index}
                onClick={() => handlePlanChange(index)}
                className={`w-3 h-3 rounded-full ${index === activePlanIndex ? 'bg-primary' : 'bg-slate-300'}`}
                aria-label={`Ir para plano ${index + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={prevPlan}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Plano anterior"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>
          
          <button 
            onClick={nextPlan}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Próximo plano"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* Desktop View - Texto à esquerda e Cards de planos animados à direita */}
        <div className="hidden md:flex md:flex-row gap-8">
          {/* Coluna da esquerda com texto fixo */}
          <div className="w-1/3 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Escolha o plano ideal para o seu negócio</h3>
            <p className="text-slate-600 mb-6">
              Todos os planos incluem período de avaliação gratuito de 14 dias, 
              sem necessidade de cartão de crédito para começar.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                <span>Suporte personalizado durante todo o período de teste</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                <span>Cancele a qualquer momento durante o período de avaliação</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                <span>Migração gratuita de dados para planos Enterprise</span>
              </li>
            </ul>
          </div>
          
          {/* Coluna da direita com cards rotativos */}
          <div className="w-2/3 relative">
            {/* Cards animados */}
            <div className="flex justify-center items-center h-full">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePlanIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md"
                >
                  <div className={`bg-white rounded-xl border ${
                    plans[activePlanIndex].popular
                      ? "border-primary shadow-lg"
                      : "border-slate-200"
                  }`}>
                    {plans[activePlanIndex].popular && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-primary-foreground text-xs font-bold py-1 px-3 transform rotate-6 shadow-lg m-2">
                        Oferta por tempo limitado!
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900">{plans[activePlanIndex].name}</h3>
                      <p className="text-slate-500 mt-2 min-h-[48px]">{plans[activePlanIndex].description}</p>
                      
                      <div className="mt-6 mb-6">
                        <div className="flex items-end">
                          <span className="text-4xl font-bold text-slate-900">
                            {annual 
                              ? `R$${Math.round(plans[activePlanIndex].monthlyPrice * annualDiscount)}`
                              : `R$${plans[activePlanIndex].monthlyPrice}`
                            }
                          </span>
                          <span className="text-slate-500 ml-2">
                            /{annual ? 'mês*' : 'mês'}
                          </span>
                        </div>
                        {annual && (
                          <p className="text-xs text-slate-500 mt-1">
                            *Cobrado anualmente como 
                            R${Math.round(plans[activePlanIndex].monthlyPrice * annualDiscount * 12)}/ano
                          </p>
                        )}
                      </div>
                      
                      <Link href="/auth">
                        <Button 
                          className={`w-full ${plans[activePlanIndex].popular ? "bg-primary" : ""}`}
                          variant={plans[activePlanIndex].popular ? "default" : "outline"}
                        >
                          {plans[activePlanIndex].name === "Enterprise" ? "Fale Conosco" : "Começar Agora"}
                        </Button>
                      </Link>
                      
                      <div className="mt-8 space-y-4">
                        <p className="font-medium text-slate-700">Inclui:</p>
                        {plans[activePlanIndex].features.map((feature, i) => (
                          <div key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                            <span className="text-slate-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Indicadores de planos */}
            <div className="flex justify-center mt-6 space-x-2">
              {plans.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => handlePlanChange(index)}
                  className={`w-3 h-3 rounded-full ${index === activePlanIndex ? 'bg-primary' : 'bg-slate-300'}`}
                  aria-label={`Ir para plano ${index + 1}`}
                />
              ))}
            </div>
          </div>
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