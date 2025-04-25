import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "wouter";

const plans = [
  {
    name: "Plano Básico",
    description: "Ideal para mentores iniciando sua jornada digital",
    price: "R$79",
    period: "/mês",
    popular: false,
    features: [
      { name: "Até 5 clientes", available: true },
      { name: "3 testes comportamentais", available: true },
      { name: "Dashboard básico", available: true },
      { name: "Sistema de convites", available: true },
      { name: "Assistente virtual de IA", available: false },
      { name: "Relatórios avançados", available: false },
    ],
  },
  {
    name: "Plano Profissional",
    description: "Perfeito para mentores com carteira de clientes estabelecida",
    price: "R$149",
    period: "/mês",
    popular: true,
    features: [
      { name: "Até 20 clientes", available: true },
      { name: "Todos os testes comportamentais", available: true },
      { name: "Dashboard completo", available: true },
      { name: "Sistema de gamificação avançado", available: true },
      { name: "Assistente virtual de IA", available: true },
      { name: "Personalização da marca", available: false },
    ],
  },
  {
    name: "Plano Enterprise",
    description: "Para mentores e consultores com grande volume de clientes",
    price: "R$299",
    period: "/mês",
    popular: false,
    features: [
      { name: "Clientes ilimitados", available: true },
      { name: "Todos os testes comportamentais", available: true },
      { name: "Dashboard completo com relatórios avançados", available: true },
      { name: "Sistema de gamificação premium", available: true },
      { name: "Assistente virtual de IA avançado", available: true },
      { name: "Personalização completa da marca", available: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section id="planos" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Planos Flexíveis para Cada Mentor</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Escolha o plano ideal para suas necessidades e comece a transformar sua mentoria hoje mesmo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col h-full ${plan.popular ? 'border-2 border-primary relative scale-105 z-10 shadow-lg' : 'border border-slate-200'}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-secondary text-slate-900 font-medium text-xs px-3 py-1 rounded-bl-lg">
                  MAIS POPULAR
                </div>
              )}
              <CardHeader className={plan.popular ? 'bg-primary/5' : ''}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.available ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-slate-300 mt-1 mr-2" />
                      )}
                      <span className={feature.available ? '' : 'text-slate-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-secondary hover:bg-secondary-light text-slate-900' : ''}`}
                    variant={plan.popular ? 'default' : 'default'}
                  >
                    Escolher Plano
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
