import { 
  BarChart, 
  ClipboardList, 
  Award, 
  BookOpen, 
  LineChart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TestCard } from "@/components/dashboard/test-card";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";

export default function ClientDashboard() {
  const { user } = useAuth();
  
  // Dados mockados para exemplo
  const upcomingTests = [
    {
      id: 1,
      title: "Avaliação de Perfil de Liderança",
      description: "Avalia o estilo de liderança e identifica pontos fortes e áreas de desenvolvimento.",
      status: "assigned",
      dueDate: "2023-05-02T23:59:59",
      estimatedTime: 15,
      assignedBy: "Marcos Silva"
    },
    {
      id: 2,
      title: "Inteligência Emocional",
      description: "Mede a capacidade de reconhecer, entender e gerenciar emoções próprias e de outros.",
      status: "in_progress",
      dueDate: "2023-04-30T23:59:59",
      estimatedTime: 20,
      progress: 35,
      assignedBy: "Marcos Silva"
    }
  ];

  const achievements = [
    { 
      name: "Primeiro Teste", 
      description: "Completou seu primeiro teste comportamental", 
      icon: Award,
      date: "2023-03-22" 
    },
    { 
      name: "Comunicador Eficaz", 
      description: "Obteve pontuação acima de 85% no teste de Comunicação", 
      icon: BookOpen,
      date: "2023-04-10" 
    },
    { 
      name: "Em Ascensão", 
      description: "Completou 3 testes em seu plano de desenvolvimento", 
      icon: LineChart,
      date: "2023-04-18" 
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Olá, {user?.name || 'Cliente'}!</h2>
          <p className="text-muted-foreground">
            Bem-vindo ao seu dashboard. Acompanhe seu progresso e complete seus testes atribuídos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Progresso</h3>
                  <p className="text-2xl font-bold mt-1">60%</p>
                  <div className="mt-2">
                    <Progress value={60} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    3 de 5 testes concluídos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Conquistas</h3>
                  <p className="text-2xl font-bold mt-1">3</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Desbloqueie mais conquistas completando testes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Nota Média</h3>
                  <p className="text-2xl font-bold mt-1">89.5</p>
                  <p className="text-xs text-green-600 mt-2">
                    ↑ 5.2 desde o último teste
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Testes Pendentes</h3>
              <div className="space-y-4">
                {upcomingTests.map(test => (
                  <TestCard
                    key={test.id}
                    title={test.title}
                    description={test.description}
                    status={test.status as any}
                    dueDate={test.dueDate}
                    estimatedTime={test.estimatedTime}
                    onStart={() => console.log(`Iniciando teste ${test.id}`)}
                    onContinue={() => console.log(`Continuando teste ${test.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Suas Conquistas</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
