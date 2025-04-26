import { 
  BarChart, 
  Brain, 
  Users, 
  Award, 
  BookOpen, 
  MessagesSquare,
  Shield,
  LineChart,
  Sparkles,
  CheckCircle,
  Target,
  Zap,
  TrendingUp,
  ClipboardCheck,
  Lightbulb,
  ArrowRight,
  Star,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function FeaturesSection() {
  const mainFeatures = [
    {
      icon: Brain,
      title: "Avaliação Comportamental",
      description: "Utilize testes cientificamente validados para mapear perfis de líderes e identificar áreas de desenvolvimento prioritárias.",
      benefits: [
        "Testes baseados em metodologias comprovadas",
        "Identificação precisa de pontos fortes e lacunas",
        "Recomendações personalizadas para cada líder"
      ]
    },
    {
      icon: BarChart,
      title: "Acompanhamento Inteligente",
      description: "Monitore o progresso de seus líderes com métricas objetivas e dashboards interativos que revelam tendências e oportunidades.",
      benefits: [
        "Visualização em tempo real do progresso",
        "Sistema Kanban para gestão de atividades",
        "Alertas automáticos sobre pontos de atenção"
      ]
    },
    {
      icon: Sparkles,
      title: "Assistente IA para Mentoria",
      description: "Potencialize sua capacidade como mentor com um assistente de IA que fornece insights baseados em padrões de dados reais.",
      benefits: [
        "Sugestões personalizadas para cada liderado",
        "Identificação de padrões comportamentais sutis",
        "Criação automática de planos de desenvolvimento"
      ]
    }
  ];

  const results = [
    { value: "+73%", label: "Aumento na eficácia de liderança" },
    { value: "-35%", label: "Redução em turnover de talentos" },
    { value: "2.6x", label: "ROI médio reportado" },
    { value: "4.9/5", label: "Satisfação dos clientes" }
  ];

  const secondaryFeatures = [
    {
      icon: Users,
      title: "Gerenciamento de Clientes",
      description: "Sistema completo para organizar seus liderados, monitorar progresso e facilitar a comunicação."
    },
    {
      icon: LineChart,
      title: "Relatórios Detalhados",
      description: "Gere relatórios personalizados para cada cliente, com métricas relevantes e insights acionáveis."
    },
    {
      icon: BookOpen,
      title: "Biblioteca de Recursos",
      description: "Acesso a materiais, exercícios e conteúdos para enriquecer o processo de desenvolvimento."
    },
    {
      icon: Shield,
      title: "Segurança e Privacidade",
      description: "Proteção completa de dados com criptografia e conformidade com a LGPD."
    }
  ];

  const businessBenefits = [
    { title: "Maior retenção de talentos", icon: <Users size={20} /> },
    { title: "Decisões baseadas em dados", icon: <BarChart size={20} /> },
    { title: "Desenvolvimento acelerado", icon: <Zap size={20} /> },
    { title: "Resultados mensuráveis", icon: <Target size={20} /> }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            Recursos exclusivos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-3xl mx-auto leading-tight">
            Transforme suas lideranças com ferramentas baseadas em ciência comportamental
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Uma plataforma completa que integra avaliação, acompanhamento e desenvolvimento 
            para gerar resultados mensuráveis para sua organização.
          </p>
        </div>

        {/* Recursos principais com benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mb-20">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="group">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-slate-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Seção de resultados */}
        <div className="bg-slate-50 rounded-2xl p-8 md:p-12 mb-20 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Resultados comprovados por centenas de mentores
              </h3>
              <p className="text-slate-600 mb-6">
                Os mentores que utilizam o RH Master conseguem resultados significativamente melhores 
                no desenvolvimento de suas lideranças, com métricas claras e mensuráveis.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {businessBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
                      {benefit.icon}
                    </div>
                    <span className="text-slate-700 font-medium">{benefit.title}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link href="/auth?tab=register">
                  <Button className="group">
                    Comece agora sem compromisso
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 mt-2">14 dias grátis. Sem necessidade de cartão.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {results.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <p className="text-sm text-slate-500 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recursos secundários */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Plataforma completa, tudo em um só lugar</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Além dos recursos principais, o RH Master oferece uma gama completa de funcionalidades
              para tornar sua mentoria mais eficiente e impactante.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA de conversão */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-8 md:p-12 text-white text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white mb-4">
            <Star className="h-3.5 w-3.5 fill-white" />
            Acesso imediato
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl mx-auto">
            Comece a transformar suas lideranças hoje mesmo
          </h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Junte-se a centenas de mentores que já estão elevando seus resultados com o RH Master.
            Teste grátis por 14 dias, sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/auth?tab=register" className="w-full">
              <Button className="w-full bg-white text-primary hover:bg-white/90 hover:text-primary border-0">
                Começar período gratuito
              </Button>
            </Link>
            <Link href="#demo" className="w-full">
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                Ver demonstração
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center mt-6 text-sm text-white/70">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            <span>Seguro, sem necessidade de cartão de crédito</span>
          </div>
        </div>
      </div>
    </section>
  );
}