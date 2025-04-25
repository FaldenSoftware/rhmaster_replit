import React, { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
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
import {
  CheckCircle2,
  Globe,
  Keyboard,
  Lock,
  Mail,
  PaintBucket,
  Save,
  Bell,
  Moon,
  Sun,
  User,
  UserPlus,
  Laptop,
  CircleDollarSign,
  CreditCard,
  Receipt
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function SettingsTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <SettingsTabContent />
      </div>
    </DashboardLayout>
  );
}

// Esquema de validação para o formulário de perfil
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  bio: z.string().max(500, {
    message: "Bio deve ter no máximo 500 caracteres.",
  }).optional(),
  title: z.string().min(2, {
    message: "Título deve ter pelo menos 2 caracteres.",
  }).optional(),
  website: z.string().url({
    message: "URL inválida. Inclua http:// ou https://.",
  }).optional().or(z.literal("")),
  company: z.string().optional(),
});

// Esquema de validação para o formulário de aparência
const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Por favor selecione um tema.",
  }),
  fontSize: z.enum(["small", "medium", "large"], {
    required_error: "Por favor selecione um tamanho de fonte.",
  }),
  colorScheme: z.enum(["default", "green", "blue", "purple", "orange"], {
    required_error: "Por favor selecione um esquema de cores.",
  }),
});

// Esquema de validação para o formulário de notificações
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  newClientNotifications: z.boolean().default(true),
  testCompletionNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  emailDigest: z.enum(["daily", "weekly", "monthly", "never"], {
    required_error: "Por favor selecione uma frequência.",
  }),
});

// Esquema de validação para o formulário de senha
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Senha atual deve ter pelo menos 8 caracteres.",
  }),
  newPassword: z.string().min(8, {
    message: "Nova senha deve ter pelo menos 8 caracteres.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirmação de senha deve ter pelo menos 8 caracteres.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

// Esquema de validação para o formulário de pagamento
const paymentFormSchema = z.object({
  plan: z.enum(["free", "basic", "pro", "enterprise"], {
    required_error: "Por favor selecione um plano.",
  }),
  billingCycle: z.enum(["monthly", "annual"], {
    required_error: "Por favor selecione um ciclo de cobrança.",
  }),
});

// Tipos dos forms
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function SettingsTabContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Formulário de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Marcos Belmiro",
      email: "mbr_silva@hotmail.com",
      bio: "Especialista em desenvolvimento de lideranças e coach executivo com mais de 10 anos de experiência.",
      title: "Coach Executivo e Mentor de Lideranças",
      website: "https://leadermind.com.br",
      company: "LeaderMind Consultoria",
    },
  });

  // Formulário de aparência
  const appearanceForm = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: theme as "light" | "dark" | "system",
      fontSize: "medium",
      colorScheme: "default",
    },
  });

  // Formulário de notificações
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      newClientNotifications: true,
      testCompletionNotifications: true,
      marketingEmails: false,
      emailDigest: "weekly",
    },
  });

  // Formulário de senha
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Formulário de pagamento
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      plan: "pro",
      billingCycle: "annual",
    },
  });

  // Handlers para submissão dos formulários
  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Perfil atualizado:", data);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso!",
    });
  };

  const onAppearanceSubmit = (data: AppearanceFormValues) => {
    console.log("Aparência atualizada:", data);
    setTheme(data.theme);
    toast({
      title: "Aparência atualizada",
      description: "Suas preferências de aparência foram atualizadas!",
    });
  };

  const onNotificationsSubmit = (data: NotificationsFormValues) => {
    console.log("Notificações atualizadas:", data);
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram atualizadas!",
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log("Senha atualizada:", data);
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso!",
    });
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const onPaymentSubmit = (data: PaymentFormValues) => {
    console.log("Plano atualizado:", data);
    toast({
      title: "Plano atualizado",
      description: "Seu plano de assinatura foi atualizado com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências de conta e perfil
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center justify-center gap-2">
            <PaintBucket className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center justify-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center justify-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Assinatura</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Público</CardTitle>
              <CardDescription>
                Estas informações serão exibidas publicamente para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este é o nome que será exibido em seu perfil.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu-email@exemplo.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este é o email associado à sua conta.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título Profissional</FormLabel>
                        <FormControl>
                          <Input placeholder="Título profissional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte um pouco sobre você"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Escreva uma breve biografia sobre você. Isso será exibido em seu perfil público.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da interface do usuário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-8">
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer hover:border-primary ${field.value === 'light' ? 'border-primary' : 'border-muted'}`}
                              onClick={() => field.onChange("light")}
                            >
                              <div className="flex h-12 w-full items-center justify-center rounded-md bg-[#fff] mb-2">
                                <Sun className="h-6 w-6 text-yellow-500" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Claro</span>
                                {field.value === "light" && (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer hover:border-primary ${field.value === 'dark' ? 'border-primary' : 'border-muted'}`}
                              onClick={() => field.onChange("dark")}
                            >
                              <div className="flex h-12 w-full items-center justify-center rounded-md bg-slate-950 mb-2">
                                <Moon className="h-6 w-6 text-slate-400" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Escuro</span>
                                {field.value === "dark" && (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer hover:border-primary ${field.value === 'system' ? 'border-primary' : 'border-muted'}`}
                              onClick={() => field.onChange("system")}
                            >
                              <div className="flex h-12 w-full items-center justify-center rounded-md bg-gradient-to-r from-[#fff] to-slate-950 mb-2">
                                <Laptop className="h-6 w-6 text-slate-600" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Sistema</span>
                                {field.value === "system" && (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <FormDescription>
                          Selecione o tema que melhor se adapta à sua preferência.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={appearanceForm.control}
                    name="fontSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho da Fonte</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tamanho de fonte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Pequeno</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Ajuste o tamanho da fonte para melhorar a legibilidade.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={appearanceForm.control}
                    name="colorScheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Esquema de Cores</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um esquema de cores" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Padrão (Verde-Dourado)</SelectItem>
                            <SelectItem value="green">Verde</SelectItem>
                            <SelectItem value="blue">Azul</SelectItem>
                            <SelectItem value="purple">Roxo</SelectItem>
                            <SelectItem value="orange">Laranja</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Escolha um esquema de cores que combine com sua marca.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Aparência
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Preferências de Email</h3>
                      <p className="text-sm text-muted-foreground">Gerencie quais tipos de email você deseja receber.</p>
                    </div>
                    <Separator />
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Notificações por Email</FormLabel>
                            <FormDescription>
                              Receba notificações por email sobre atividades importantes.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="newClientNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Novos Clientes</FormLabel>
                            <FormDescription>
                              Receba notificações quando novos clientes se registrarem.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="testCompletionNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Conclusão de Testes</FormLabel>
                            <FormDescription>
                              Receba notificações quando seus clientes completarem testes.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Emails de Marketing</FormLabel>
                            <FormDescription>
                              Receba emails sobre novos recursos, dicas e atualizações.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Resumo de Atividades</h3>
                      <p className="text-sm text-muted-foreground">Controle a frequência de resumos de atividades.</p>
                    </div>
                    <Separator />
                    <FormField
                      control={notificationsForm.control}
                      name="emailDigest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequência de Resumos</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma frequência" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Diariamente</SelectItem>
                              <SelectItem value="weekly">Semanalmente</SelectItem>
                              <SelectItem value="monthly">Mensalmente</SelectItem>
                              <SelectItem value="never">Nunca</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Escolha com que frequência você deseja receber resumos das atividades dos seus clientes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Atualize sua senha para maior segurança.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use pelo menos 8 caracteres com letras, números e símbolos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <Lock className="h-4 w-4 mr-2" />
                    Atualizar Senha
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>
                Gerencie dispositivos onde você está conectado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <Laptop className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Windows - Chrome</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil • Ativo agora</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Atual
                  </Badge>
                </div>
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <Laptop className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">MacOS - Safari</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil • Há 2 dias</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Encerrar</Button>
                </div>
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    <Laptop className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">iPhone - Safari Mobile</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil • Há 5 dias</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Encerrar</Button>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Encerrar Todas as Outras Sessões
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Pagamento */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Assinatura</CardTitle>
              <CardDescription>
                Gerencie seu plano de assinatura atual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Badge className="bg-primary text-white mr-2">Atual</Badge>
                    <h3 className="text-lg font-bold">Plano Pro</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">R$ 97,00<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <p className="text-sm text-muted-foreground">Cobrado anualmente</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Seu plano Pro renova em 12 de Janeiro de 2024. Você pode gerenciar ou cancelar sua assinatura a qualquer momento.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Atualizar Meio de Pagamento
                  </Button>
                  <Button variant="outline" size="sm">
                    <Receipt className="h-4 w-4 mr-1" />
                    Ver Histórico de Faturas
                  </Button>
                </div>
              </div>

              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-8">
                  <FormField
                    control={paymentForm.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mudar Plano</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Gratuito</SelectItem>
                            <SelectItem value="basic">Básico - R$ 47/mês</SelectItem>
                            <SelectItem value="pro">Pro - R$ 97/mês</SelectItem>
                            <SelectItem value="enterprise">Enterprise - R$ 197/mês</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Você pode alterar seu plano a qualquer momento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="billingCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciclo de Cobrança</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um ciclo de cobrança" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="annual">Anual (2 meses grátis)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Escolher o plano anual oferece um desconto de 2 meses.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Atualizar Plano
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Cancelar Assinatura</CardTitle>
              <CardDescription>
                Cancelar sua assinatura resultará na perda de acesso a recursos premium.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">
                Cancelar Assinatura
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsTab;