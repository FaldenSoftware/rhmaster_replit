import { User, Mail, Building, Briefcase, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function ClientProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Dados mockados para o perfil
  const userProfile = user || {
    name: "Ana Oliveira",
    email: "ana.oliveira@example.com",
    company: "Tech Solutions Inc.",
    position: "Gerente de Produto",
    bio: "Profissional com mais de 5 anos de experiência em gestão de produtos digitais. Especialista em metodologias ágeis e desenvolvimento de equipes.",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg"
  };

  const handleSaveProfile = () => {
    setSaving(true);
    
    // Simulando uma chamada de API
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Meu Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Esta foto será exibida no seu perfil</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary/20">
                <img
                  src={userProfile.profileImage}
                  alt={`Foto de perfil de ${userProfile.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Alterar</Button>
                <Button variant="outline" size="sm" className="text-destructive">Remover</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informações do Mentor</CardTitle>
              <CardDescription>Detalhes do seu mentor atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden bg-muted/20 p-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Foto do mentor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Marcos Silva</h4>
                    <p className="text-sm text-muted-foreground">Mentor de Liderança</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>marcos.silva@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>RH Master Consultoria</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Seu nome completo" 
                        className="pl-10"
                        defaultValue={userProfile.name}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        placeholder="Seu email" 
                        className="pl-10"
                        defaultValue={userProfile.email}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="company" 
                        placeholder="Nome da empresa" 
                        className="pl-10"
                        defaultValue={userProfile.company}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="position" 
                        placeholder="Seu cargo atual" 
                        className="pl-10"
                        defaultValue={userProfile.position}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Mini Biografia</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Um breve resumo sobre você"
                    rows={4}
                    defaultValue={userProfile.bio}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie suas configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Digite sua senha atual"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="Digite a nova senha"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}