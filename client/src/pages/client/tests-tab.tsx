import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TestCard } from "@/components/dashboard/test-card";
import { 
  ClipboardList, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from "lucide-react";

// Dados mockados para exemplo
const testAssignments = [
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
  },
  {
    id: 3,
    title: "Comunicação Estratégica",
    description: "Avalia habilidades de comunicação em diferentes contextos organizacionais.",
    status: "completed",
    completedDate: "2023-04-18T14:30:00",
    score: 87,
    estimatedTime: 12,
    assignedBy: "Marcos Silva"
  },
  {
    id: 4,
    title: "Gestão de Conflitos",
    description: "Identifica os métodos preferenciais para lidar com situações de conflito.",
    status: "completed",
    completedDate: "2023-04-10T16:45:00",
    score: 92,
    estimatedTime: 10,
    assignedBy: "Marcos Silva"
  },
  {
    id: 5,
    title: "Perfil de Tomada de Decisão",
    description: "Analisa o processo decisório e identifica tendências cognitivas.",
    status: "expired",
    dueDate: "2023-04-15T23:59:59",
    estimatedTime: 15,
    assignedBy: "Marcos Silva"
  }
];

const completedTestsCount = testAssignments.filter(test => test.status === "completed").length;
const totalTestsCount = testAssignments.length;
const completionRate = Math.round((completedTestsCount / totalTestsCount) * 100);

export function ClientTestsTab() {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredTests = testAssignments.filter(test => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return test.status === "assigned" || test.status === "in_progress";
    if (activeTab === "completed") return test.status === "completed";
    if (activeTab === "expired") return test.status === "expired";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Meus Testes</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie e complete seus testes atribuídos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Testes</p>
                <p className="text-2xl font-bold text-slate-900">{totalTestsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Completos</p>
                <p className="text-2xl font-bold text-slate-900">{completedTestsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Testes Atribuídos</CardTitle>
          <CardDescription>
            Gerencie e complete os testes atribuídos pelo seu mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="expired">Expirados</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
            
            <TabsContent value={activeTab} className="space-y-4 pt-2">
              {filteredTests.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum teste encontrado</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Não há testes {activeTab === "all" ? "" : 
                      activeTab === "pending" ? "pendentes" : 
                      activeTab === "completed" ? "concluídos" : "expirados"} 
                    no momento.
                  </p>
                </div>
              ) : (
                filteredTests.map(test => (
                  <TestCard
                    key={test.id}
                    title={test.title}
                    description={test.description}
                    status={test.status as any}
                    dueDate={test.dueDate}
                    completedDate={test.completedDate}
                    score={test.score}
                    estimatedTime={test.estimatedTime}
                    onView={() => console.log(`Visualizando teste ${test.id}`)}
                    onStart={() => console.log(`Iniciando teste ${test.id}`)}
                    onContinue={() => console.log(`Continuando teste ${test.id}`)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso</CardTitle>
          <CardDescription>
            Acompanhe seu progresso e desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Taxa de Conclusão Geral</h4>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Pontuação Média</h4>
                <span className="text-sm font-medium">89.5%</span>
              </div>
              <Progress value={89.5} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Competências Desenvolvidas</h4>
                <span className="text-sm font-medium">4/10</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            Ver Relatório Completo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}