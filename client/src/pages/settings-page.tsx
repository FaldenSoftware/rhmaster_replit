import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { SubscriptionManagement } from '@/components/payment/subscription-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  
  // Redireciona usuários não autenticados
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="conta">Conta</TabsTrigger>
              {user.role === 'mentor' && (
                <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
              )}
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais e profissionais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-20">
                    Formulário de perfil em desenvolvimento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conta">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Conta</CardTitle>
                  <CardDescription>
                    Gerencie as configurações da sua conta e preferências de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-20">
                    Configurações de conta em desenvolvimento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user.role === 'mentor' && (
              <TabsContent value="assinatura">
                <SubscriptionManagement />
              </TabsContent>
            )}
            
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Configurações de notificações e alertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center py-20">
                    Configurações de notificações em desenvolvimento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}