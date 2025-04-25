import { useState } from "react";
import { TestCard } from "@/components/dashboard/test-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

// Mock data - in a real app, this would come from your API
const mockTests = [
  {
    id: "1",
    title: "Perfil Comportamental",
    description: "Este teste ajuda a identificar seus comportamentos naturais em diferentes situações.",
    status: "assigned" as const,
    dueDate: "2023-07-15",
    estimatedTime: 30,
  },
  {
    id: "2",
    title: "Inteligência Emocional",
    description: "Avaliação de como você percebe e gerencia emoções.",
    status: "completed" as const,
    completedDate: "2023-06-12",
    score: 85,
    estimatedTime: 25,
  },
  {
    id: "3",
    title: "Estilos de Liderança",
    description: "Identifica seu estilo predominante de liderança.",
    status: "completed" as const,
    completedDate: "2023-05-28",
    score: 92,
    estimatedTime: 20,
  },
  {
    id: "4",
    title: "Eneagrama",
    description: "Descubra seu tipo de personalidade e motivações segundo o Eneagrama.",
    status: "in_progress" as const,
    dueDate: "2023-07-10",
    estimatedTime: 40,
  },
  {
    id: "5",
    title: "Teste de Comunicação",
    description: "Avalia seus padrões de comunicação e áreas para melhoria.",
    status: "expired" as const,
    dueDate: "2023-06-01",
    estimatedTime: 15,
  },
];

interface TestListProps {
  userRole: "mentor" | "client";
}

export function TestList({ userRole }: TestListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredTests = mockTests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           test.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAction = (testId: string, action: "view" | "start" | "continue") => {
    // In a real app, this would navigate to the test or update its status
    console.log(`Test ${testId}: ${action}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar testes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="status-filter" className="text-sm">Status:</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter" className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="assigned">Atribuídos</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Nenhum teste encontrado</h3>
          <p className="text-muted-foreground mt-1">
            Tente ajustar seus filtros ou critérios de busca.
          </p>
          {userRole === "client" && (
            <p className="mt-4">
              Todos os testes atribuídos pelo seu mentor aparecerão aqui.
            </p>
          )}
          {userRole === "mentor" && (
            <Button className="mt-4" variant="outline">
              Atribuir Novo Teste
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              title={test.title}
              description={test.description}
              status={test.status}
              dueDate={test.dueDate}
              completedDate={test.completedDate}
              score={test.score}
              estimatedTime={test.estimatedTime}
              onView={() => handleAction(test.id, "view")}
              onStart={() => handleAction(test.id, "start")}
              onContinue={() => handleAction(test.id, "continue")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
