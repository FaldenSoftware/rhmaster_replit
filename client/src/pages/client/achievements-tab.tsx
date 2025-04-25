import { Award, BookOpen, LineChart, BarChart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AchievementsTab() {
  // Dados mockados para exemplo
  const achievements = [
    { 
      name: "Primeiro Teste", 
      description: "Completou seu primeiro teste comportamental", 
      icon: Award,
      date: "2023-03-22",
      badge: "/badges/first-test.svg" 
    },
    { 
      name: "Comunicador Eficaz", 
      description: "Obteve pontuação acima de 85% no teste de Comunicação", 
      icon: BookOpen,
      date: "2023-04-10",
      badge: "/badges/communicator.svg" 
    },
    { 
      name: "Em Ascensão", 
      description: "Completou 3 testes em seu plano de desenvolvimento", 
      icon: LineChart,
      date: "2023-04-18",
      badge: "/badges/rising-star.svg" 
    }
  ];

  const lockedAchievements = [
    { 
      name: "Mestre em Liderança", 
      description: "Complete todos os testes de liderança com média acima de 90%", 
      icon: Shield,
      requirements: "Complete mais 2 testes de liderança com média acima de 90%.",
      badge: "/badges/leadership-master-locked.svg" 
    },
    { 
      name: "Pontualidade Perfeita", 
      description: "Complete 5 testes antes da data limite", 
      icon: Shield,
      requirements: "Complete mais 2 testes antes da data limite.",
      badge: "/badges/punctuality-locked.svg" 
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Conquistas</h2>
        <p className="text-muted-foreground mt-2">
          Acompanhe seu progresso e conquistas obtidas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Conquistas</h3>
                <p className="text-2xl font-bold mt-1">3/5</p>
                <div className="mt-2">
                  <Progress value={60} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  60% das conquistas desbloqueadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Nível</h3>
                <p className="text-2xl font-bold mt-1">Intermediário</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Próximo nível: Avançado (2 conquistas restantes)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Último Desbloqueio</h3>
                <p className="text-2xl font-bold mt-1">Em Ascensão</p>
                <p className="text-xs text-muted-foreground mt-2">
                  18/04/2023
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Minhas Conquistas</CardTitle>
            <Button variant="outline" size="sm">
              Compartilhar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlocked">Desbloqueadas</TabsTrigger>
              <TabsTrigger value="locked">Bloqueadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="unlocked">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={index} className="bg-muted/30 overflow-hidden">
                      <div className="bg-primary h-2" />
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-4">
                            <Icon className="h-10 w-10 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Desbloqueada em {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="locked">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {lockedAchievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={index} className="bg-muted/10 overflow-hidden border-dashed">
                      <div className="bg-muted h-2" />
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="bg-muted/30 p-3 rounded-full mb-4">
                            <Icon className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-bold text-lg mb-1 text-muted-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          <div className="bg-muted/20 px-3 py-2 rounded-md w-full">
                            <p className="text-xs text-muted-foreground">
                              {achievement.requirements}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}