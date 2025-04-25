import { 
  ClipboardList, 
  Users, 
  BarChart2, 
  Award, 
  CalendarDays, 
  Lightbulb 
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Testes Comportamentais",
    description: "Avalie o perfil de liderança dos seus clientes com testes validados e receba análises detalhadas."
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Sistema exclusivo de convites para adicionar e organizar seus clientes com facilidade e segurança."
  },
  {
    icon: BarChart2,
    title: "Dashboard Analítico",
    description: "Visualize o progresso de seus clientes com gráficos e métricas em um dashboard personalizado."
  },
  {
    icon: Award,
    title: "Gamificação",
    description: "Aumente o engajamento com elementos de gamificação e rankings exclusivos para mentores."
  },
  {
    icon: CalendarDays,
    title: "Interface Kanban",
    description: "Atribua testes e acompanhe o status de cada cliente com um sistema visual intuitivo."
  },
  {
    icon: Lightbulb,
    title: "Assistentes Virtuais de IA",
    description: "Conte com a ajuda de assistentes de IA para obter insights e otimizar seu trabalho."
  }
];

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Recursos Poderosos para Mentores</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Tudo o que você precisa para transformar seus clientes em líderes excepcionais, em uma única plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
