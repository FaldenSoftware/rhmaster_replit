import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  Heart,
  Target,
  Search,
  Filter,
  Plus,
  X,
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Tipos de testes
type TestType = {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  questionCount: number;
  icon: React.ElementType;
  color: string;
};

// Tipos de clientes
type Client = {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
  tests: AssignedTest[];
};

// Tipos de testes atribuídos
type AssignedTest = {
  id: string;
  testId: string;
  clientId: string;
  status: "pending" | "in_progress" | "completed";
  dueDate?: Date;
  assignedAt: Date;
  completedAt?: Date;
};

// Dados de exemplo para testes
const testsData: TestType[] = [
  {
    id: "test-1",
    title: "Perfil Comportamental",
    description: "Analisa comportamentos, preferências e tendências em diversos contextos.",
    estimatedTime: 25,
    questionCount: 45,
    icon: Brain,
    color: "bg-blue-500"
  },
  {
    id: "test-2",
    title: "Inteligência Emocional",
    description: "Avalia a capacidade de reconhecer e gerenciar emoções próprias e alheias.",
    estimatedTime: 20,
    questionCount: 36,
    icon: Heart,
    color: "bg-red-500"
  },
  {
    id: "test-3",
    title: "Eneagrama",
    description: "Identifica padrões de personalidade e motivações subjacentes.",
    estimatedTime: 30,
    questionCount: 60,
    icon: Target,
    color: "bg-green-500"
  }
];

// Dados de exemplo para clientes
const clientsData: Client[] = [
  {
    id: "client-1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    status: "active",
    tests: []
  },
  {
    id: "client-2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    status: "active",
    tests: []
  },
  {
    id: "client-3",
    name: "Mariana Santos",
    email: "mariana.santos@example.com",
    status: "active",
    tests: []
  },
  {
    id: "client-4",
    name: "Ricardo Gomes",
    email: "ricardo.gomes@example.com",
    status: "pending",
    tests: []
  },
  {
    id: "client-5",
    name: "Fernanda Lima",
    email: "fernanda.lima@example.com",
    status: "active",
    tests: []
  }
];

import { DashboardLayout } from "@/layouts/dashboard-layout";

export default function TestAssignmentKanban() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <TestAssignmentKanbanContent />
      </div>
    </DashboardLayout>
  );
}

export function TestAssignmentKanbanContent() {
  const [tests, setTests] = useState<TestType[]>(testsData);
  const [clients, setClients] = useState<Client[]>(clientsData);
  const [filteredClients, setFilteredClients] = useState<Client[]>(clientsData);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [currentDraggedTest, setCurrentDraggedTest] = useState<TestType | null>(null);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Efeito para filtrar clientes com base no filtro de status e pesquisa
  useEffect(() => {
    let filtered = [...clients];
    
    // Aplicar filtro de pesquisa
    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Aplicar filtro de status
    if (statusFilter !== "all") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter]);

  // Manipulador de evento para arrastar e soltar
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Retornar se não houver destino válido
    if (!destination) return;
    
    // Retornar se a origem e o destino forem iguais
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Se estiver arrastando da coluna de testes para a coluna de um cliente
    if (source.droppableId === "tests" && destination.droppableId.startsWith("client-")) {
      const clientId = destination.droppableId;
      const testId = draggableId;
      
      // Encontrar o cliente e o teste
      const client = clients.find(c => c.id === clientId);
      const test = tests.find(t => t.id === testId);
      
      if (client && test) {
        // Verificar se o teste já está atribuído a este cliente
        const isAlreadyAssigned = client.tests.some(t => t.testId === testId);
        
        if (isAlreadyAssigned) {
          toast({
            variant: "destructive",
            title: "Teste já atribuído",
            description: `${test.title} já está atribuído para ${client.name}.`
          });
          return;
        }
        
        // Abrir diálogo para confirmar atribuição e escolher data
        setCurrentDraggedTest(test);
        setCurrentClient(client);
        setIsAssignDialogOpen(true);
      }
    }
  };

  // Função para confirmar atribuição de teste
  const confirmAssignment = () => {
    if (currentDraggedTest && currentClient) {
      // Criar novo teste atribuído
      const newAssignedTest: AssignedTest = {
        id: `assigned-${Date.now()}`,
        testId: currentDraggedTest.id,
        clientId: currentClient.id,
        status: "pending",
        assignedAt: new Date(),
        dueDate: selectedDueDate
      };
      
      // Atualizar cliente com o novo teste
      const updatedClients = clients.map(client => {
        if (client.id === currentClient.id) {
          return {
            ...client,
            tests: [...client.tests, newAssignedTest]
          };
        }
        return client;
      });
      
      setClients(updatedClients);
      
      // Feedback para o usuário
      toast({
        title: "Teste atribuído com sucesso",
        description: `${currentDraggedTest.title} foi atribuído para ${currentClient.name}.`,
      });
      
      // Resetar estados
      setIsAssignDialogOpen(false);
      setCurrentDraggedTest(null);
      setCurrentClient(null);
      setSelectedDueDate(undefined);
    }
  };

  // Função para cancelar atribuição
  const cancelAssignment = () => {
    setIsAssignDialogOpen(false);
    setCurrentDraggedTest(null);
    setCurrentClient(null);
    setSelectedDueDate(undefined);
  };

  // Função para remover teste atribuído
  const removeAssignedTest = (clientId: string, assignedTestId: string) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          tests: client.tests.filter(test => test.id !== assignedTestId)
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    
    toast({
      title: "Teste removido",
      description: "O teste foi removido com sucesso.",
    });
  };

  // Renderizar cartão de teste
  const renderTestCard = (test: TestType, isDragging: boolean) => {
    const TestIcon = test.icon;
    
    return (
      <div className={`
        p-4 rounded-lg shadow-md bg-white border-l-4 ${test.color.replace('bg-', 'border-')}
        ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}
        transition-all duration-200
      `}>
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${test.color} text-white mr-3`}>
            <TestIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{test.title}</h3>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{test.description}</p>
        
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{test.estimatedTime} min</span>
          </div>
          <div className="flex items-center">
            <span>{test.questionCount} questões</span>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar cartão de teste atribuído
  const renderAssignedTestCard = (clientId: string, assignedTest: AssignedTest) => {
    const test = tests.find(t => t.id === assignedTest.testId);
    
    if (!test) return null;
    
    const TestIcon = test.icon;
    
    // Definir cor e rótulo de status
    let statusColor = "";
    let statusLabel = "";
    
    switch (assignedTest.status) {
      case "pending":
        statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
        statusLabel = "Pendente";
        break;
      case "in_progress":
        statusColor = "bg-blue-100 text-blue-800 border-blue-200";
        statusLabel = "Em Progresso";
        break;
      case "completed":
        statusColor = "bg-green-100 text-green-800 border-green-200";
        statusLabel = "Concluído";
        break;
    }
    
    return (
      <div className="p-3 rounded-lg shadow-sm bg-white border mb-3 relative group">
        <button 
          className="absolute top-2 right-2 p-1 rounded-full bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => removeAssignedTest(clientId, assignedTest.id)}
          aria-label="Remover teste"
        >
          <X className="h-3 w-3 text-slate-500" />
        </button>
        
        <div className="flex items-center">
          <div className={`p-1.5 rounded-full ${test.color} text-white mr-2`}>
            <TestIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-900">{test.title}</h4>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className={statusColor}>
            {statusLabel}
          </Badge>
          
          {assignedTest.dueDate && (
            <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(assignedTest.dueDate), "dd/MM/yyyy")}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4 md:mb-0">
          Atribuição de Testes
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">
          Arraste e solte os testes para atribuí-los aos seus clientes. Você pode definir prazos e acompanhar o status de conclusão.
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Coluna de Testes */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-4 rounded-lg h-full">
              <h2 className="font-semibold text-slate-700 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Testes Disponíveis
              </h2>
              
              <Droppable droppableId="tests" isDropDisabled={true}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {tests.map((test, index) => (
                      <Draggable key={test.id} draggableId={test.id} index={index}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            {renderTestCard(test, snapshot.isDragging)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Colunas de Clientes */}
          <div className="lg:col-span-3 xl:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Droppable key={client.id} droppableId={client.id}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        bg-slate-50 p-4 rounded-lg min-h-[200px] transition-colors
                        ${snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-800">{client.name}</h3>
                        <Badge 
                          variant={client.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {client.status === "active" ? "Ativo" : "Pendente"}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-slate-500 mb-4">{client.email}</p>
                      
                      <Separator className="mb-4" />
                      
                      {/* Testes atribuídos */}
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-3 flex items-center justify-between">
                          <span>Testes atribuídos ({client.tests.length})</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Arraste um teste para atribuir</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        {client.tests.length > 0 ? (
                          <div className="space-y-3">
                            {client.tests.map((assignedTest) => (
                              <div key={assignedTest.id}>
                                {renderAssignedTestCard(client.id, assignedTest)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-slate-300 rounded-lg">
                            <div className="bg-slate-100 p-2 rounded-full mb-3">
                              <AlertCircle className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500">
                              Arraste um teste aqui para atribuir a este cliente
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Diálogo de confirmação para atribuir teste */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atribuir Teste</DialogTitle>
            <DialogDescription>
              Configure os detalhes da atribuição do teste para o cliente.
            </DialogDescription>
          </DialogHeader>
          
          {currentDraggedTest && currentClient && (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-700 mb-1">Teste</h3>
                <div className="flex items-center p-2 rounded bg-slate-50">
                  <div className={`p-1.5 rounded-full ${currentDraggedTest.color} text-white mr-2`}>
                    <currentDraggedTest.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{currentDraggedTest.title}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-1">Cliente</h3>
                <div className="p-2 rounded bg-slate-50">
                  <p className="font-medium">{currentClient.name}</p>
                  <p className="text-sm text-slate-500">{currentClient.email}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Data de Vencimento (opcional)</h3>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDueDate ? (
                      format(selectedDueDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                  
                  {isCalendarOpen && (
                    <div className="absolute top-full mt-1 z-50">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDueDate}
                        onSelect={(date) => {
                          setSelectedDueDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        className="bg-white border shadow-lg rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={cancelAssignment}>
              Cancelar
            </Button>
            <Button onClick={confirmAssignment}>
              Confirmar Atribuição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}