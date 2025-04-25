import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  username: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["mentor"]),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos para continuar",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "mentor",
      termsAccepted: false,
    },
  });

  const onSubmitLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const onSubmitRegister = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Cadastro</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Bem-vindo de volta</h2>
          <p className="text-muted-foreground text-sm">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Button variant="link" className="p-0 h-auto text-xs" type="button">
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Você é um cliente?{" "}
            <span className="text-primary cursor-pointer" onClick={() => setActiveTab("login")}>
              Entre com as credenciais enviadas pelo seu mentor
            </span>
          </p>
        </div>
      </TabsContent>

      <TabsContent value="register" className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Crie sua conta de mentor</h2>
          <p className="text-muted-foreground text-sm">
            Cadastre-se para começar a transformar seus clientes
          </p>
        </div>

        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={registerForm.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Eu aceito os termos de uso e a política de privacidade
                    </FormLabel>
                    <FormDescription>
                      Ao criar uma conta, você concorda com nossos{" "}
                      <span className="text-primary cursor-pointer">Termos de Serviço</span> e{" "}
                      <span className="text-primary cursor-pointer">Política de Privacidade</span>.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta de Mentor"
              )}
            </Button>
          </form>
        </Form>

        <div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já possui uma conta?{" "}
            <span className="text-primary cursor-pointer" onClick={() => setActiveTab("login")}>
              Entre aqui
            </span>
          </p>
        </div>

        <Separator className="my-4" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            <span className="font-semibold">Nota:</span> Somente mentores podem registrar-se diretamente.
          </p>
          <p className="mt-1">
            Clientes devem receber um convite de um mentor para acessar a plataforma.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}