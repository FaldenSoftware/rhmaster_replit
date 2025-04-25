import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Bell, Shield, LogOut, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileTab() {
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
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-semibold mb-1">{user?.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user?.username}</p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-primary mr-2" />
                  <span>Mentor</span>
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
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.username} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Conte um pouco sobre você e sua experiência como mentor" 
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
                          Receba atualizações sobre seus clientes por email
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Atualizações de testes</h3>
                        <p className="text-sm text-muted-foreground">
                          Seja notificado quando um cliente completar um teste
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Lembretes</h3>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes sobre testes com prazo próximo do vencimento
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