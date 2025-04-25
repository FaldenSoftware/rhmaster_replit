import { Users, Brain, BarChart, LampDesk, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Users,
      title: "Convide seus clientes",
      description: "Envie convites personalizados para seus clientes acessarem a plataforma e iniciarem sua jornada de desenvolvimento."
    },
    {
      icon: Brain,
      title: "Atribua testes",
      description: "Selecione os testes comportamentais mais adequados para cada cliente, de acordo com suas necessidades de desenvolvimento."
    },
    {
      icon: BarChart,
      title: "Analise resultados",
      description: "Obtenha insights valiosos sobre o perfil e progresso de seus clientes através de relatórios detalhados e visualizações claras."
    },
    {
      icon: LampDesk,
      title: "Transforme mentorias",
      description: "Use os dados para personalizar suas mentorias, focando nos pontos certos e maximizando o desenvolvimento de seus líderes."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">PROCESSO</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Uma jornada simplificada para transformar a mentoria em resultados mensuráveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-8 -right-8 transform translate-x-1/2 -translate-y-1/2 hidden md:block">
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-slate-300" />
                  )}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-100 w-full">
                <span className="inline-block w-8 h-8 rounded-full bg-primary text-white text-center leading-8 font-bold mb-3">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-slate-100 p-8 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Um fluxo de trabalho intuitivo que simplifica sua jornada
              </h3>
              <p className="text-slate-600 mb-6">
                Nossa plataforma foi desenhada para ser intuitiva e fácil de usar, tanto para você quanto para seus clientes. 
                Com poucos cliques, você terá acesso a um universo de dados e insights que transformarão sua abordagem 
                de mentoria e desenvolvimento de lideranças.
              </p>
              <ul className="space-y-3">
                {[
                  "Interface intuitiva e fácil de navegar",
                  "Notificações automáticas para aumentar o engajamento",
                  "Suporte técnico disponível 24/7",
                  "Atualizações regulares com novos recursos"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-6 w-6 text-primary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Dashboard RH Master" 
                className="rounded-md w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}