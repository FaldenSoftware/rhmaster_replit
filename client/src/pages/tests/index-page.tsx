import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Activity, GitBranch } from "lucide-react";

export default function TestsIndexPage() {
  const { user } = useAuth();

  // Redirecionar para login se não autenticado
  const [, setLocation] = useLocation();
  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Apenas clientes podem ver e realizar os testes
  if (user.role !== "client") {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Acesso Restrito</h1>
        <p className="mb-4">
          Esta área é destinada apenas aos clientes do RH Master.
        </p>
        <p>
          Os mentores podem visualizar os resultados dos testes através do dashboard.
        </p>
      </div>
    );
  }

  // Lista de testes disponíveis
  const availableTests = [
    {
      id: "behavioral-profile",
      title: "Perfil Comportamental",
      description: "Descubra seu estilo predominante entre os perfis: Águia, Gato, Lobo e Tubarão.",
      icon: <Activity className="h-8 w-8 text-primary" />,
      duration: "20 minutos",
      questions: 24,
    },
    {
      id: "emotional-intelligence",
      title: "Inteligência Emocional",
      description: "Avalie suas habilidades em cinco dimensões da inteligência emocional.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      duration: "20 minutos",
      questions: 30,
    },
    {
      id: "enneagram",
      title: "Eneagrama",
      description: "Identifique seu tipo de personalidade no sistema Eneagrama.",
      icon: <GitBranch className="h-8 w-8 text-primary" />,
      duration: "25 minutos",
      questions: 36,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Testes Comportamentais</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Escolha um dos testes abaixo para avaliar diferentes aspectos do seu comportamento e personalidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTests.map((test) => (
          <Card key={test.id} className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {test.icon}
              </div>
              <CardTitle className="text-xl text-center">{test.title}</CardTitle>
              <CardDescription className="text-center">
                {test.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração:</span>
                  <span className="font-medium">{test.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questões:</span>
                  <span className="font-medium">{test.questions}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/tests/${test.id}`}>Iniciar Teste</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sobre os Testes</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Os testes comportamentais são ferramentas valiosas para o autoconhecimento e desenvolvimento
            profissional. Ao compreender melhor seus próprios padrões de comportamento, você pode
            desenvolver estratégias mais eficazes para a comunicação, liderança e trabalho em equipe.
          </p>
          <p>
            Seus resultados serão compartilhados com seu mentor, que poderá oferecer insights e
            orientações personalizadas com base em suas características individuais.
          </p>
          <p>
            Responda às questões com sinceridade, refletindo sobre como você normalmente age, não
            como gostaria de ser ou acha que deveria ser.
          </p>
        </div>
      </div>
    </div>
  );
}