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
  Mail, 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal,
  Eye,
  Send,
  Clock,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientInviteDialog } from "@/components/dashboard/client-invite-dialog";

// Definição do tipo para os clientes
type ClientData = {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending";
  testsAssigned: number;
  testsCompleted: number;
  lastActivity?: string;
  invitedAt?: string;
};

// Dados mockados para exemplo
const clients: ClientData[] = [
  { 
    id: 1, 
    name: "Ana Beatriz", 
    email: "ana.beatriz@email.com", 
    status: "active", 
    testsAssigned: 5, 
    testsCompleted: 3, 
    lastActivity: "2023-04-25T14:30:00"
  },
  { 
    id: 2, 
    name: "Ricardo Martins", 
    email: "ricardo.martins@email.com", 
    status: "active", 
    testsAssigned: 4, 
    testsCompleted: 1, 
    lastActivity: "2023-04-23T16:45:00"
  },
  { 
    id: 3, 
    name: "Carla Silva", 
    email: "carla.silva@email.com", 
    status: "active", 
    testsAssigned: 6, 
    testsCompleted: 4, 
    lastActivity: "2023-04-22T09:15:00"
  },
  { 
    id: 4, 
    name: "João Mendes", 
    email: "joao.mendes@email.com", 
    status: "pending", 
    testsAssigned: 0, 
    testsCompleted: 0, 
    invitedAt: "2023-04-21T10:30:00"
  },
  { 
    id: 5, 
    name: "Paula Lima", 
    email: "paula.lima@email.com", 
    status: "pending", 
    testsAssigned: 0, 
    testsCompleted: 0, 
    invitedAt: "2023-04-24T11:20:00"
  }
];

export function ClientsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const filteredClients = clients.filter(client => {
    // Filtrar por busca
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por status
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return client.status === "active" && matchesSearch;
    if (activeTab === "pending") return client.status === "pending" && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie seus clientes e acompanhe seu progresso
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
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
          <Button 
            onClick={() => setShowInviteDialog(true)}
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Seus Clientes</CardTitle>
          <CardDescription>
            Lista de todos os seus clientes e seus status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-2">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="pt-2">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Testes Atribuídos</TableHead>
                      <TableHead className="hidden md:table-cell">Testes Completos</TableHead>
                      <TableHead className="hidden md:table-cell">Última Atividade</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UserPlus className="h-10 w-10 mb-2" />
                            <p>Nenhum cliente encontrado</p>
                            <Button 
                              variant="link" 
                              onClick={() => setShowInviteDialog(true)}
                              className="mt-2"
                            >
                              Convidar um cliente
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.status === "active" ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">Pendente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{client.testsAssigned}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.testsCompleted}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {client.status === "active" 
                              ? (client.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : "N/A")
                              : (client.invitedAt ? `Convidado em ${new Date(client.invitedAt).toLocaleDateString()}` : "Recentemente")
                            }
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
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ClipboardList className="h-4 w-4 mr-2" />
                                  Atribuir Teste
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Mensagem
                                </DropdownMenuItem>
                                {client.status === "pending" && (
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Reenviar Convite
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      <ClientInviteDialog 
        open={showInviteDialog} 
        onOpenChange={setShowInviteDialog} 
      />
    </div>
  );
}