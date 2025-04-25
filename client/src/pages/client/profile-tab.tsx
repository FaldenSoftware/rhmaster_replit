import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Bell, 
  BadgeCheck, 
  Lock,
  Shield,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function ClientProfileTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <ClientProfileTabContent />
      </div>
    </DashboardLayout>
  );
}

export function ClientProfileTabContent() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Perfil */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Seu Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="Ana Oliveira" />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    AO
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-semibold mb-1">Ana Oliveira</h3>
              <p className="text-sm text-muted-foreground mb-4">ana.oliveira@example.com</p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-primary mr-2" />
                  <span>Cliente</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-primary mr-2" />
                  <span>Gerente de Marketing</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-primary mr-2" />
                  <span>São Paulo, SP</span>
                </div>
                <div className="flex items-center">
                  <Bell className="h-4 w-4 text-primary mr-2" />
                  <span>Notificações ativas</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Progresso de Desenvolvimento</CardTitle>
              <CardDescription>
                Seu status atual no programa de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Testes Comportamentais</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Habilidades de Liderança</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Inteligência Emocional</span>
                    <span className="text-sm text-muted-foreground">72%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                <BadgeCheck className="h-4 w-4 mr-2" />
                Ver Certificados
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Configurações */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Gerencie suas preferências de conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList>
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" defaultValue="Ana Oliveira" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="ana.oliveira@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" defaultValue="+55 11 98765-4321" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job">Cargo</Label>
                    <Input id="job" defaultValue="Gerente de Marketing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue="Profissional apaixonada por marketing com mais de 5 anos de experiência. Focada em desenvolver minhas habilidades de liderança e comunicação."
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button className="mt-4">
                    Salvar alterações
                  </Button>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Notificações por email</h3>
                        <p className="text-sm text-muted-foreground">
                          Receba atualizações sobre novos testes e resultados por email
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Lembretes de testes</h3>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes sobre testes com prazo próximo do vencimento
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Resultados e conquistas</h3>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando novos resultados e conquistas estiverem disponíveis
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Alterar senha</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha atual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova senha</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button className="mt-4">
                      <Lock className="h-4 w-4 mr-2" />
                      Atualizar senha
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-base font-medium text-destructive">Zona de perigo</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                      Esta ação não pode ser desfeita.
                    </p>
                    <Button variant="destructive">
                      <Shield className="h-4 w-4 mr-2" />
                      Excluir conta
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileTab;