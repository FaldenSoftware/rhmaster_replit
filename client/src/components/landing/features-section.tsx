import { 
  BarChart, 
  Brain, 
  Users, 
  Award, 
  BookOpen, 
  MessagesSquare,
  Shield,
  LineChart,
  Sparkles 
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Testes Comportamentais",
      description: "Aplique testes cientificamente validados para entender o perfil de seus líderes e identificar áreas de melhoria."
    },
    {
      icon: BarChart,
      title: "Análise de Desempenho",
      description: "Acompanhe o progresso de seus clientes com métricas detalhadas e visualizações intuitivas."
    },
    {
      icon: Users,
      title: "Gerenciamento de Clientes",
      description: "Organize seus clientes, acompanhe seu progresso e envie convites personalizados."
    },
    {
      icon: Award,
      title: "Gamificação Motivacional",
      description: "Mantenha seus clientes engajados com conquistas, desafios e recompensas personalizadas."
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Recursos",
      description: "Acesse uma ampla coleção de materiais, exercícios e atividades para seus clientes."
    },
    {
      icon: MessagesSquare,
      title: "Comunicação Integrada",
      description: "Mantenha contato constante com seus clientes através de nossa plataforma segura."
    },
    {
      icon: LineChart,
      title: "Relatórios Personalizados",
      description: "Gere relatórios detalhados e personalizados para cada cliente, facilitando a visualização de progresso."
    },
    {
      icon: Shield,
      title: "Segurança de Dados",
      description: "Todas as informações dos seus clientes são armazenadas com criptografia e seguindo as melhores práticas de segurança."
    },
    {
      icon: Sparkles,
      title: "IA Assistiva",
      description: "Utilize nossos assistentes de IA para gerar insights e recomendações personalizadas para cada cliente."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">RECURSOS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ferramentas poderosas para mentores excepcionais
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Acompanhe o desenvolvimento de seus clientes, obtenha insights valiosos
            e transforme sua mentoria em resultados tangíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-6 border border-slate-100 transition-all duration-200 hover:shadow-md hover:border-primary/20">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}