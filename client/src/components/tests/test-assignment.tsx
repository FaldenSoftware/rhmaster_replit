import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ClipboardList, Loader2 } from "lucide-react";

const assignmentSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  testId: z.string().min(1, "Teste é obrigatório"),
  dueDate: z.date().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

// Mock data - in a real app would come from API
const clients = [
  { id: "1", name: "Ana Beatriz" },
  { id: "2", name: "Ricardo Martins" },
  { id: "3", name: "Carla Silva" },
];

// Mock data - in a real app would come from API
const tests = [
  { id: "1", title: "Perfil Comportamental" },
  { id: "2", title: "Inteligência Emocional" },
  { id: "3", title: "Eneagrama" },
];

export function TestAssignment() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      clientId: "",
      testId: "",
    },
  });

  if (!user || user.role !== "mentor") return null;

  const onSubmit = async (values: AssignmentFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/client-tests", {
        clientId: parseInt(values.clientId),
        testId: parseInt(values.testId),
        assignedBy: user.id,
        assignedAt: new Date().toISOString(),
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      });
      
      toast({
        title: "Teste atribuído",
        description: "O teste foi atribuído com sucesso ao cliente selecionado.",
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao atribuir teste",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atribuir o teste",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ClipboardList className="mr-2 h-4 w-4" />
          Atribuir Teste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atribuir teste a um cliente</DialogTitle>
          <DialogDescription>
            Selecione o cliente, o teste que deseja atribuir e defina um prazo opcional.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="testId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teste</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um teste" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tests.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Prazo (opcional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atribuindo...
                  </>
                ) : (
                  "Atribuir teste"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
