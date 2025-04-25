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
import { ClientInviteDialog } from "@/components/dashboard/client-invite-dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, UserCog, Search, Mail, EyeIcon, AlertCircle } from "lucide-react";

// Dados mockados para exemplo
const clients = [
  { 
    id: 1, 
    name: "Ana Beatriz", 
    email: "ana.beatriz@email.com", 
    completedTests: 3,
    pendingTests: 1,
    lastActive: "2023-04-22T10:30:00",
    status: "active"
  },
  { 
    id: 2, 
    name: "Ricardo Martins", 
    email: "ricardo.martins@email.com", 
    completedTests: 1,
    pendingTests: 2,
    lastActive: "2023-04-20T14:15:00",
    status: "active"
  },
  { 
    id: 3, 
    name: "Carla Silva", 
    email: "carla.silva@email.com", 
    completedTests: 2,
    pendingTests: 0,
    lastActive: "2023-04-18T09:45:00",
    status: "active"
  },
  { 
    id: 4, 
    name: "João Mendes", 
    email: "joao.mendes@email.com", 
    completedTests: 0,
    pendingTests: 0,
    lastActive: null,
    status: "pending"
  },
  { 
    id: 5, 
    name: "Paula Lima", 
    email: "paula.lima@email.com", 
    completedTests: 0,
    pendingTests: 0,
    lastActive: null,
    status: "pending"
  },
];

export function ClientsTab() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReset = (client: any) => {
    setSelectedClient(client);
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    // Aqui iria a lógica para resetar o cliente
    console.log(`Resetando cliente: ${selectedClient.name}`);
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Clientes</h2>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Convidar Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos os Clientes</CardTitle>
              <CardDescription>
                Gerencie seus clientes e veja o progresso deles
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Testes Completos</TableHead>
                <TableHead>Testes Pendentes</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      {client.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">
                          Convite Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{client.completedTests}</TableCell>
                    <TableCell>{client.pendingTests}</TableCell>
                    <TableCell>
                      {client.lastActive 
                        ? new Date(client.lastActive).toLocaleDateString() 
                        : "Nunca acessou"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="ghost" title="Ver Detalhes">
                          <EyeIcon className="h-4 w-4 text-slate-500" />
                        </Button>
                        {client.status === "pending" ? (
                          <Button size="icon" variant="ghost" title="Reenviar Convite">
                            <Mail className="h-4 w-4 text-slate-500" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" title="Resetar Senha" onClick={() => handleReset(client)}>
                            <UserCog className="h-4 w-4 text-slate-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClientInviteDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />

      <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirmar Reset de Senha
            </DialogTitle>
            <DialogDescription>
              Isso enviará um link de redefinição de senha para {selectedClient?.name}. 
              Tem certeza que deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmReset}>
              Confirmar Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}