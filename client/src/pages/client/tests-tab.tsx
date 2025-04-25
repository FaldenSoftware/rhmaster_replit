import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestCard } from "@/components/dashboard/test-card";

export function ClientTestsTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <ClientTestsTabContent />
      </div>
    </DashboardLayout>
  );
}

export function ClientTestsTabContent() {
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");

  // Dados mockados para exemplo
  const assignedTests = [
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

  const completedTests = [
    {
      id: 3,
      title: "Análise de Comunicação",
      description: "Avalia padrões de comunicação e eficácia em diferentes contextos.",
      status: "completed",
      completedDate: "2023-04-10T14:35:00",
      score: 85,
      estimatedTime: 15,
      assignedBy: "Marcos Silva"
    },
    {
      id: 4,
      title: "Gestão de Conflitos",
      description: "Avalia estilos de abordagem e resolução de conflitos interpessoais.",
      status: "completed",
      completedDate: "2023-03-22T09:15:00",
      score: 78,
      estimatedTime: 15,
      assignedBy: "Marcos Silva"
    },
    {
      id: 5,
      title: "Análise de Forças e Fraquezas",
      description: "Identifica principais pontos fortes e áreas para desenvolvimento pessoal.",
      status: "completed",
      completedDate: "2023-03-15T16:45:00",
      score: 92,
      estimatedTime: 10,
      assignedBy: "Marcos Silva"
    }
  ];

  // Filtrar com base na pesquisa
  const filteredAssigned = assignedTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Meus Testes</h2>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie os testes atribuídos a você
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar testes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <Tabs defaultValue="assigned" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assigned" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Pendentes</span>
            <Badge className="ml-1 bg-primary/90 text-primary-foreground hover:bg-primary/90">
              {filteredAssigned.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            <span>Concluídos</span>
            <Badge className="ml-1 bg-primary/90 text-primary-foreground hover:bg-primary/90">
              {filteredCompleted.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-6 space-y-4">
          {filteredAssigned.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Nenhum teste pendente</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Você não tem testes pendentes ou atribuídos no momento. Quando seu mentor atribuir novos testes, eles aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAssigned.map(test => (
              <TestCard
                key={test.id}
                title={test.title}
                description={test.description}
                status={test.status as any}
                dueDate={test.dueDate}
                estimatedTime={test.estimatedTime}
                onStart={() => console.log(`Iniciando teste ${test.id}`)}
                onContinue={() => console.log(`Continuando teste ${test.id}`)}
                onView={() => console.log(`Visualizando teste ${test.id}`)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {filteredCompleted.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <BadgeCheck className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Nenhum teste concluído</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Você ainda não concluiu nenhum teste. Comece completando os testes pendentes atribuídos a você.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCompleted.map(test => (
              <TestCard
                key={test.id}
                title={test.title}
                description={test.description}
                status={test.status as any}
                completedDate={test.completedDate}
                score={test.score}
                onView={() => console.log(`Visualizando resultado do teste ${test.id}`)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ClientTestsTab;