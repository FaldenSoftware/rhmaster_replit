import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  MoreHorizontal,
  PlusCircle,
  Eye,
  BarChart,
  Clock,
  Users,
  FileText,
  FileEdit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

// Definição do tipo para os testes
type TestData = {
  id: number;
  title: string;
  description: string;
  type: "behavioral" | "assessment";
  status: "active" | "draft";
  questionsCount: number;
  assignedCount: number;
  completedCount: number;
  createdAt: string;
};

// Dados mockados para exemplo
const tests: TestData[] = [
  {
    id: 1,
    title: "Avaliação de Perfil de Liderança",
    description: "Avalia o estilo de liderança e identifica pontos fortes e áreas de desenvolvimento",
    type: "behavioral",
    status: "active",
    questionsCount: 25,
    assignedCount: 12,
    completedCount: 8,
    createdAt: "2023-03-15T10:00:00"
  },
  {
    id: 2,
    title: "Inteligência Emocional",
    description: "Mede a capacidade de reconhecer, entender e gerenciar emoções próprias e de outros",
    type: "assessment",
    status: "active",
    questionsCount: 20,
    assignedCount: 15,
    completedCount: 10,
    createdAt: "2023-03-20T14:30:00"
  },
  {
    id: 3,
    title: "Estilos de Comunicação",
    description: "Identifica o estilo predominante de comunicação e áreas de melhoria",
    type: "behavioral",
    status: "active",
    questionsCount: 18,
    assignedCount: 8,
    completedCount: 6,
    createdAt: "2023-04-05T09:15:00"
  },
  {
    id: 4,
    title: "Gerenciamento de Conflitos",
    description: "Avalia abordagens para resolução de conflitos em ambiente profissional",
    type: "assessment",
    status: "draft",
    questionsCount: 15,
    assignedCount: 0,
    completedCount: 0,
    createdAt: "2023-04-18T16:45:00"
  }
];

export function TestsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTests = tests.filter(test => {
    // Filtrar por busca
    const matchesSearch = 
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por status
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return test.status === "active" && matchesSearch;
    if (activeTab === "draft") return test.status === "draft" && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Testes</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie seus testes e atribua-os aos clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Testes</p>
                <p className="text-2xl font-bold text-slate-900">{tests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Atribuídos</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tests.reduce((sum, test) => sum + test.assignedCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Completos</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tests.reduce((sum, test) => sum + test.completedCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="hidden sm:flex"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Teste
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Seus Testes</CardTitle>
          <CardDescription>
            Lista de todos os seus testes e suas estatísticas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-2">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="pt-2">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teste</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Atribuídos</TableHead>
                      <TableHead className="hidden md:table-cell">Taxa de Conclusão</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ClipboardList className="h-10 w-10 mb-2" />
                            <p>Nenhum teste encontrado</p>
                            <Button variant="link" className="mt-2">
                              Criar um novo teste
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTests.map((test) => {
                        const completionRate = test.assignedCount > 0 
                          ? Math.round((test.completedCount / test.assignedCount) * 100) 
                          : 0;
                          
                        return (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p>{test.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{test.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {test.type === "behavioral" ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Comportamental</Badge>
                              ) : (
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Avaliação</Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {test.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">Rascunho</Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {test.assignedCount} cliente{test.assignedCount !== 1 ? 's' : ''}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="w-full max-w-24">
                                  <Progress value={completionRate} className="h-2" />
                                </div>
                                <span className="text-xs">{completionRate}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="h-4 w-4 mr-2" />
                                    Atribuir a Clientes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart className="h-4 w-4 mr-2" />
                                    Ver Estatísticas
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Testes recentemente completados pelos seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...tests]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 2)
                .map(test => (
                  <div key={test.id} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-slate-900">{test.title}</h4>
                      <p className="text-sm text-muted-foreground">{test.completedCount} de {test.assignedCount} clientes completaram este teste</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Progress 
                          value={test.assignedCount > 0 ? (test.completedCount / test.assignedCount) * 100 : 0} 
                          className="h-2 w-[150px]" 
                        />
                        <span className="text-xs font-medium">
                          {test.assignedCount > 0 ? Math.round((test.completedCount / test.assignedCount) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Ver Todo Histórico</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}