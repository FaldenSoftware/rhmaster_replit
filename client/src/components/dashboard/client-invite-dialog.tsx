import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail } from "lucide-react";

const inviteSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  personalMessage: z.string().optional(),
  sendCopy: z.boolean().default(false),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface ClientInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientInviteDialog({ open, onOpenChange }: ClientInviteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: "",
      email: "",
      personalMessage: "",
      sendCopy: false,
    },
  });

  const onSubmit = async (values: InviteFormValues) => {
    setIsSubmitting(true);
    
    // Simular um delay de API
    setTimeout(() => {
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${values.name} (${values.email})`,
      });
      setIsSubmitting(false);
      form.reset();
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convidar Cliente</DialogTitle>
          <DialogDescription>
            Envie um convite para que um novo cliente possa acessar a plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem Personalizada (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Adicione uma mensagem personalizada ao convite..." 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Esta mensagem será incluída no e-mail de convite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sendCopy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Enviar uma cópia para mim
                    </FormLabel>
                    <FormDescription>
                      Você receberá uma cópia do convite em seu e-mail.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}