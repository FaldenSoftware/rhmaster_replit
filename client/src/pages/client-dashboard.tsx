import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  ClipboardList, 
  Award, 
  BookOpen, 
  LineChart, 
  User 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TestCard } from "@/components/dashboard/test-card";
import { ClientTestsTab } from "./client/tests-tab";
import { ClientProfileTab } from "./client/profile-tab";
import { ResultsTab } from "./client/results-tab";
import { AchievementsTab } from "./client/achievements-tab";
import { useAuth } from "@/hooks/use-auth";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Inicializar dados do usuário para demonstração caso não esteja autenticado
  useEffect(() => {
    if (!user && !isLoading) {
      // Simular um usuário autenticado na memória do context (não afeta o backend)
      (window as any).mockUser = {
        id: 1,
        username: "ana.cliente",
        name: "Ana Oliveira",
        email: "ana.oliveira@example.com",
        role: "client",
        createdAt: new Date().toISOString()
      };
    }
  }, [user, isLoading]);

  // Quando o tab mudar, navegue para a rota apropriada
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Se não for dashboard, navegar para a subpágina
    if (tab !== "dashboard") {
      setLocation(`/client-dashboard/${tab}`);
    } else {
      // Voltar para o dashboard raiz
      setLocation("/client-dashboard");
    }
  };

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
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList className="flex h-10 items-center justify-start p-0 bg-transparent w-full overflow-x-auto">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Meus Testes
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Resultados
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Conquistas
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Meu Perfil
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Olá, Ana!</h2>
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
        </TabsContent>

        <TabsContent value="tests">
          <ClientTestsTab />
        </TabsContent>

        <TabsContent value="results">
          <ResultsTab />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsTab />
        </TabsContent>

        <TabsContent value="profile">
          <ClientProfileTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
