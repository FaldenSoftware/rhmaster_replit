import { ClipboardList, Eye } from "lucide-react";
import { TestCard } from "@/components/dashboard/test-card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/dashboard-layout";

export function ClientTestsTab() {
  return (
    <DashboardLayout>
      <ClientTestsContent />
    </DashboardLayout>
  );
}

function ClientTestsContent() {
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
      title: "Comunicação Assertiva",
      description: "Avalia suas habilidades de comunicação em diferentes cenários profissionais.",
      status: "completed",
      dueDate: "2023-04-15T23:59:59",
      completedDate: "2023-04-14T14:32:10",
      estimatedTime: 25,
      score: 89,
      assignedBy: "Marcos Silva"
    },
    {
      id: 4,
      title: "Tomada de Decisão",
      description: "Avalia sua capacidade de tomar decisões eficazes em situações de pressão.",
      status: "completed",
      dueDate: "2023-04-05T23:59:59",
      completedDate: "2023-04-04T10:15:43",
      estimatedTime: 30,
      score: 92,
      assignedBy: "Marcos Silva"
    },
    {
      id: 5,
      title: "Gestão de Conflitos",
      description: "Avalia como você lida com conflitos e situações de tensão no ambiente de trabalho.",
      status: "completed",
      dueDate: "2023-03-25T23:59:59",
      completedDate: "2023-03-23T16:05:22",
      estimatedTime: 20,
      score: 85,
      assignedBy: "Marcos Silva"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Meus Testes</h2>
        <p className="text-muted-foreground mt-2">
          Visualize e complete seus testes atribuídos
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              Testes Pendentes
            </h3>
            <Button variant="outline" size="sm">
              Filtrar
            </Button>
          </div>
          
          <div className="space-y-4">
            {assignedTests.length > 0 ? (
              assignedTests.map(test => (
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
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Você não tem testes pendentes no momento.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Eye className="mr-2 h-5 w-5 text-primary" />
              Testes Completados
            </h3>
            <Button variant="outline" size="sm">
              Filtrar
            </Button>
          </div>
          
          <div className="space-y-4">
            {completedTests.length > 0 ? (
              completedTests.map(test => (
                <TestCard
                  key={test.id}
                  title={test.title}
                  description={test.description}
                  status={test.status as any}
                  completedDate={test.completedDate}
                  score={test.score}
                  onView={() => console.log(`Visualizando resultados do teste ${test.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">Você ainda não completou nenhum teste.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}