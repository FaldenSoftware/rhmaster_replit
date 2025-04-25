import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PlusCircle, Search, Clock, ClipboardList, Users, LucideIcon } from "lucide-react";

// Dados mockados para exemplo
const tests = [
  {
    id: 1,
    title: "Avaliação de Perfil de Liderança",
    description: "Avalia o estilo de liderança e identifica pontos fortes e áreas de desenvolvimento.",
    type: "Liderança",
    questionCount: 25,
    estimatedTime: 15,
    createdAt: "2023-03-15T08:00:00",
    assignedCount: 8,
    completedCount: 5
  },
  {
    id: 2,
    title: "Inteligência Emocional",
    description: "Mede a capacidade de reconhecer, entender e gerenciar emoções próprias e de outros.",
    type: "Comportamento",
    questionCount: 30,
    estimatedTime: 20,
    createdAt: "2023-03-20T10:15:00",
    assignedCount: 12,
    completedCount: 9
  },
  {
    id: 3,
    title: "Comunicação Estratégica",
    description: "Avalia habilidades de comunicação em diferentes contextos organizacionais.",
    type: "Comunicação",
    questionCount: 20,
    estimatedTime: 12,
    createdAt: "2023-04-05T14:30:00",
    assignedCount: 6,
    completedCount: 3
  },
  {
    id: 4,
    title: "Gestão de Conflitos",
    description: "Identifica os métodos preferenciais para lidar com situações de conflito.",
    type: "Liderança",
    questionCount: 18,
    estimatedTime: 10,
    createdAt: "2023-04-10T09:45:00",
    assignedCount: 4,
    completedCount: 2
  },
  {
    id: 5,
    title: "Perfil de Tomada de Decisão",
    description: "Analisa o processo decisório e identifica tendências cognitivas.",
    type: "Comportamento",
    questionCount: 22,
    estimatedTime: 15,
    createdAt: "2023-04-18T11:00:00",
    assignedCount: 3,
    completedCount: 1
  }
];

type TestAssignment = {
  id: number;
  testId: number;
  testTitle: string;
  clientName: string;
  clientEmail: string;
  status: "assigned" | "in_progress" | "completed" | "expired";
  assignedDate: string;
  dueDate: string | null;
  completedDate: string | null;
  score: number | null;
};

const assignments: TestAssignment[] = [
  {
    id: 1,
    testId: 1,
    testTitle: "Avaliação de Perfil de Liderança",
    clientName: "Ana Beatriz",
    clientEmail: "ana.beatriz@email.com",
    status: "completed",
    assignedDate: "2023-04-15T09:00:00",
    dueDate: "2023-04-22T23:59:59",
    completedDate: "2023-04-20T14:30:00",
    score: 87
  },
  {
    id: 2,
    testId: 2,
    testTitle: "Inteligência Emocional",
    clientName: "Ricardo Martins",
    clientEmail: "ricardo.martins@email.com",
    status: "in_progress",
    assignedDate: "2023-04-18T10:15:00",
    dueDate: "2023-04-25T23:59:59",
    completedDate: null,
    score: null
  },
  {
    id: 3,
    testId: 3,
    testTitle: "Comunicação Estratégica",
    clientName: "Carla Silva",
    clientEmail: "carla.silva@email.com",
    status: "assigned",
    assignedDate: "2023-04-20T15:30:00",
    dueDate: "2023-04-27T23:59:59",
    completedDate: null,
    score: null
  },
  {
    id: 4,
    testId: 1,
    testTitle: "Avaliação de Perfil de Liderança",
    clientName: "Ricardo Martins",
    clientEmail: "ricardo.martins@email.com",
    status: "completed",
    assignedDate: "2023-04-10T11:45:00",
    dueDate: "2023-04-17T23:59:59",
    completedDate: "2023-04-16T16:20:00",
    score: 92
  },
  {
    id: 5,
    testId: 4,
    testTitle: "Gestão de Conflitos",
    clientName: "Ana Beatriz",
    clientEmail: "ana.beatriz@email.com",
    status: "in_progress",
    assignedDate: "2023-04-19T09:30:00",
    dueDate: "2023-04-26T23:59:59",
    completedDate: null,
    score: null
  }
];

function TestInfoCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status: TestAssignment["status"]) {
  switch (status) {
    case "assigned":
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">Atribuído</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">Em Progresso</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
    case "expired":
      return <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-50">Expirado</Badge>;
    default:
      return null;
  }
}

export function TestsTab() {
  const [searchTestsQuery, setSearchTestsQuery] = useState("");
  const [searchAssignmentsQuery, setSearchAssignmentsQuery] = useState("");
  const [activeTab, setActiveTab] = useState("assignments");

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchTestsQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTestsQuery.toLowerCase()) ||
    test.type.toLowerCase().includes(searchTestsQuery.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment => 
    assignment.testTitle.toLowerCase().includes(searchAssignmentsQuery.toLowerCase()) ||
    assignment.clientName.toLowerCase().includes(searchAssignmentsQuery.toLowerCase()) ||
    assignment.clientEmail.toLowerCase().includes(searchAssignmentsQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Testes</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Atribuir Teste
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="assignments" className="flex-1">Atribuições</TabsTrigger>
          <TabsTrigger value="catalog" className="flex-1">Catálogo de Testes</TabsTrigger>
          <TabsTrigger value="results" className="flex-1">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Testes Atribuídos</CardTitle>
                  <CardDescription>
                    Gerencie os testes atribuídos aos seus clientes
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar atribuições..."
                    className="pl-8"
                    value={searchAssignmentsQuery}
                    onChange={(e) => setSearchAssignmentsQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teste</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Atribuição</TableHead>
                    <TableHead>Data Limite</TableHead>
                    <TableHead>Conclusão</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Nenhuma atribuição encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.testTitle}</TableCell>
                        <TableCell>{assignment.clientName}</TableCell>
                        <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                        <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {assignment.completedDate 
                            ? new Date(assignment.completedDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {assignment.score !== null ? `${assignment.score}%` : "-"}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Catálogo de Testes</CardTitle>
                  <CardDescription>
                    Testes disponíveis para atribuir aos seus clientes
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar testes..."
                    className="pl-8"
                    value={searchTestsQuery}
                    onChange={(e) => setSearchTestsQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <TestInfoCard 
                  title="Total de Testes" 
                  value={tests.length}
                  icon={ClipboardList}
                />
                <TestInfoCard 
                  title="Testes Atribuídos" 
                  value={assignments.length}
                  icon={Users}
                />
                <TestInfoCard 
                  title="Tempo Médio de Conclusão" 
                  value="14 min"
                  icon={Clock}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Questões</TableHead>
                    <TableHead>Tempo Estimado</TableHead>
                    <TableHead>Atribuições</TableHead>
                    <TableHead>Taxa de Conclusão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Nenhum teste encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{test.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                              {test.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{test.type}</TableCell>
                        <TableCell>{test.questionCount}</TableCell>
                        <TableCell>{test.estimatedTime} min</TableCell>
                        <TableCell>{test.assignedCount}</TableCell>
                        <TableCell>
                          {test.assignedCount > 0 
                            ? `${Math.round((test.completedCount / test.assignedCount) * 100)}%`
                            : "0%"}
                        </TableCell>
                        <TableCell>
                          <Button size="sm">
                            Atribuir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Resultados dos Testes</CardTitle>
              <CardDescription>
                Visualize e analise os resultados dos testes completados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Veja Resultados Detalhados</h3>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    Selecione um teste concluído na aba "Atribuições" para ver o relatório detalhado de resultados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}