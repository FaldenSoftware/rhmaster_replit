import React, { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Mail,
  UserPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  RefreshCcw,
  Trash2,
  Share2,
  Copy
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

export function InvitesTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <InvitesTabContent />
      </div>
    </DashboardLayout>
  );
}

const inviteSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  name: z.string().min(2, { message: "Nome precisa ter pelo menos 2 caracteres" }),
  message: z.string().optional(),
  testIds: z.array(z.string()).optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export function InvitesTabContent() {
  const [activeTab, setActiveTab] = useState("pending");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
      testIds: [],
    },
  });

  const onSubmit = async (values: InviteFormValues) => {
    try {
      // Implementação futura: chamar API para enviar convite
      console.log("Enviando convite:", values);
      
      // Simular sucesso
      toast({
        title: "Convite enviado!",
        description: `Um email foi enviado para ${values.email}`,
      });
      
      // Fechar o diálogo e resetar o form
      setInviteDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar convite",
        description: "Não foi possível enviar o convite. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Dados de exemplo para os convites
  const pendingInvites = [
    {
      id: 1,
      email: "ana.silva@exemplo.com",
      name: "Ana Silva",
      dateSent: "2023-04-20T10:30:00",
      status: "pending"
    },
    {
      id: 2,
      email: "carlos.santos@exemplo.com",
      name: "Carlos Santos",
      dateSent: "2023-04-21T14:20:00",
      status: "pending"
    },
    {
      id: 3,
      email: "julia.pereira@exemplo.com",
      name: "Julia Pereira",
      dateSent: "2023-04-22T09:15:00",
      status: "pending"
    }
  ];

  const acceptedInvites = [
    {
      id: 4,
      email: "rafael.oliveira@exemplo.com",
      name: "Rafael Oliveira",
      dateSent: "2023-04-15T11:20:00",
      dateAccepted: "2023-04-16T15:45:00",
      status: "accepted"
    },
    {
      id: 5,
      email: "mariana.costa@exemplo.com",
      name: "Mariana Costa",
      dateSent: "2023-04-17T08:30:00",
      dateAccepted: "2023-04-17T10:45:00",
      status: "accepted"
    }
  ];

  const expiredInvites = [
    {
      id: 6,
      email: "paulo.mendes@exemplo.com",
      name: "Paulo Mendes",
      dateSent: "2023-03-20T10:30:00",
      status: "expired"
    },
    {
      id: 7,
      email: "fernanda.alves@exemplo.com",
      name: "Fernanda Alves",
      dateSent: "2023-03-22T15:40:00",
      status: "expired"
    }
  ];

  // Exemplo de testes disponíveis para atribuir
  const availableTests = [
    { id: "test1", name: "Avaliação de Perfil de Liderança" },
    { id: "test2", name: "Inteligência Emocional" },
    { id: "test3", name: "Comunicação Eficaz" },
    { id: "test4", name: "Resolução de Conflitos" },
    { id: "test5", name: "Tomada de Decisão" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "hoje";
    } else if (diffDays === 1) {
      return "ontem";
    } else {
      return `há ${diffDays} dias`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Convites</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie convites para seus clientes
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Convidar novo cliente</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo cliente se juntar à plataforma.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem personalizada (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Mensagem para o convite" {...field} />
                      </FormControl>
                      <FormDescription>
                        Uma mensagem personalizada que será enviada junto com o convite.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="testIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atribuir testes (opcional)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange([...field.value || [], value])}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione testes para atribuir" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTests.map((test) => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Testes selecionados: {(field.value || []).length}
                      </FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(field.value || []).map((testId) => {
                          const test = availableTests.find((t) => t.id === testId);
                          return (
                            <Badge key={testId} variant="secondary" className="flex items-center gap-1">
                              {test?.name}
                              <XCircle 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => field.onChange(field.value?.filter((id) => id !== testId))}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Enviar Convite</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            Pendentes
            <Badge variant="secondary" className="ml-1">{pendingInvites.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center gap-1">
            Aceitos
            <Badge variant="secondary" className="ml-1">{acceptedInvites.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-1">
            Expirados
            <Badge variant="secondary" className="ml-1">{expiredInvites.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convites Pendentes</CardTitle>
              <CardDescription>
                Convites que ainda não foram aceitos pelos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.name}</TableCell>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(invite.dateSent)}</span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeSince(invite.dateSent)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="h-3 w-3" />
                          Pendente
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" title="Copiar link">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Reenviar">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Cancelar" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convites Aceitos</CardTitle>
              <CardDescription>
                Convites que foram aceitos pelos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Aceito em</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acceptedInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.name}</TableCell>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{formatDate(invite.dateSent)}</TableCell>
                      <TableCell>{formatDate(invite.dateAccepted!)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Aceito
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convites Expirados</CardTitle>
              <CardDescription>
                Convites que expiraram sem serem aceitos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.name}</TableCell>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{formatDate(invite.dateSent)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 bg-slate-100 text-slate-700">
                          <XCircle className="h-3 w-3" />
                          Expirado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Send className="h-3 w-3 mr-1" />
                            Reenviar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InvitesTab;