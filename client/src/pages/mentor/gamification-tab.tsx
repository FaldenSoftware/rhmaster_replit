import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Medal, 
  Users, 
  BadgeCheck, 
  Gift, 
  Flag
} from "lucide-react";

export function GamificationTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <GamificationTabContent />
      </div>
    </DashboardLayout>
  );
}

export function GamificationTabContent() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const leaderboardData = [
    { 
      id: 1, 
      name: "Ana Oliveira",
      avatar: "", 
      position: 1,
      points: 1250,
      level: 5,
      badges: 8,
      completionRate: 95,
      streak: 15
    },
    { 
      id: 2, 
      name: "Carlos Mendes",
      avatar: "", 
      position: 2,
      points: 1120,
      level: 4,
      badges: 7,
      completionRate: 92,
      streak: 12
    },
    { 
      id: 3, 
      name: "Julia Santos",
      avatar: "", 
      position: 3,
      points: 980,
      level: 4,
      badges: 6,
      completionRate: 88,
      streak: 9
    },
    { 
      id: 4, 
      name: "Pedro Almeida",
      avatar: "", 
      position: 4,
      points: 850,
      level: 3,
      badges: 5,
      completionRate: 85,
      streak: 7
    },
    { 
      id: 5, 
      name: "Mariana Costa",
      avatar: "", 
      position: 5,
      points: 780,
      level: 3,
      badges: 4,
      completionRate: 82,
      streak: 5
    }
  ];

  const badgesData = [
    {
      id: 1,
      name: "Mestre em Liderança",
      description: "Completou todos os testes de liderança com nota acima de 90%",
      icon: Crown,
      rarity: "Raro",
      points: 300,
      unlocked: 2,
      total: 15
    },
    {
      id: 2,
      name: "Comunicador Eficaz",
      description: "Obteve pontuação perfeita no teste de comunicação",
      icon: Star,
      rarity: "Épico",
      points: 500,
      unlocked: 1,
      total: 15
    },
    {
      id: 3,
      name: "Consistente",
      description: "Completou testes por 10 semanas consecutivas",
      icon: Flag,
      rarity: "Comum",
      points: 100,
      unlocked: 6,
      total: 15
    },
    {
      id: 4,
      name: "Mentor de Elite",
      description: "Teve 10 clientes completando todos os testes atribuídos em um mês",
      icon: Trophy,
      rarity: "Lendário",
      points: 1000,
      unlocked: 0,
      total: 15
    }
  ];

  const challengesData = [
    {
      id: 1,
      name: "Mentor do Mês",
      description: "Tenha a maior taxa de conclusão de testes entre todos os mentores",
      reward: "1000 pontos + Badge exclusiva",
      progress: 75,
      expires: "7 dias"
    },
    {
      id: 2,
      name: "Mestre dos Testes",
      description: "Atribua e tenha concluídos 20 testes em uma semana",
      reward: "500 pontos + 1 conteúdo premium",
      progress: 45,
      expires: "3 dias"
    },
    {
      id: 3,
      name: "Conquistador de Badges",
      description: "Desbloqueie 3 novas badges em um mês",
      reward: "300 pontos + destaque no placar",
      progress: 33,
      expires: "15 dias"
    }
  ];

  const rewardsData = [
    {
      id: 1,
      name: "Acesso Vitalício à Plataforma",
      description: "Acesso completo e vitalício a todos os recursos premium da plataforma",
      points: 10000,
      category: "Premium"
    },
    {
      id: 2,
      name: "Certificação de Mentor Elite",
      description: "Certificado digital e físico reconhecendo sua excelência como mentor",
      points: 5000,
      category: "Certificação"
    },
    {
      id: 3,
      name: "Curso Avançado de Liderança",
      description: "Acesso a um curso exclusivo ministrado por especialistas renomados",
      points: 2500,
      category: "Educacional"
    },
    {
      id: 4,
      name: "Destaque no Diretório de Mentores",
      description: "Seu perfil será destacado no diretório de mentores por 30 dias",
      points: 1500,
      category: "Visibilidade"
    }
  ];

  function getRarityColor(rarity: string) {
    switch(rarity) {
      case "Comum": return "bg-slate-200 text-slate-800";
      case "Raro": return "bg-blue-100 text-blue-800";
      case "Épico": return "bg-purple-100 text-purple-800";
      case "Lendário": return "bg-amber-100 text-amber-800";
      default: return "bg-slate-200 text-slate-800";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Gamificação</h2>
        <p className="text-muted-foreground mt-1">
          Acompanhe rankings, conquistas e desafios para motivar seus clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Seus Pontos</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">3,250</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <span>↑ 550 pontos este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Seu Nível</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">8</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progresso para nível 9</span>
                <span className="text-xs text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Conquistas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">12/20</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Medal className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <span>2 novas conquistas desbloqueadas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Clientes</CardTitle>
              <CardDescription>
                Os clientes com melhor desempenho nas atividades e testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((client) => (
                  <div 
                    key={client.id} 
                    className={`p-4 rounded-lg border flex items-center gap-4 ${
                      client.position === 1 ? "bg-amber-50 border-amber-200" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {client.position}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{client.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/10 border-none">
                          Nível {client.level}
                        </Badge>
                        <span>{client.points} pontos</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <BadgeCheck className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm">{client.badges} badges</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {client.completionRate}% de conclusão
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges e Conquistas</CardTitle>
              <CardDescription>
                Badges que seus clientes podem desbloquear completando testes e desafios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badgesData.map((badge) => (
                  <div key={badge.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        badge.unlocked > 0 ? "bg-primary/10" : "bg-slate-100"
                      }`}>
                        {React.createElement(badge.icon, {
                          className: `h-6 w-6 ${badge.unlocked > 0 ? "text-primary" : "text-slate-400"}`
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{badge.name}</h4>
                          <Badge className={`${getRarityColor(badge.rarity)}`}>
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {badge.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs">
                            <Star className="h-3 w-3 text-amber-500 mr-1" />
                            <span>{badge.points} pontos</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Desbloqueado: {badge.unlocked}/{badge.total} clientes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <Gift className="h-4 w-4 mr-2" />
                Criar Nova Badge
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desafios Ativos</CardTitle>
              <CardDescription>
                Complete desafios para ganhar pontos e recompensas exclusivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {challengesData.map((challenge) => (
                  <div key={challenge.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Flag className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{challenge.name}</h4>
                        <p className="text-sm text-muted-foreground my-1">
                          {challenge.description}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Progresso</span>
                            <span className="text-xs text-muted-foreground">{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-primary">
                            <Gift className="h-3 w-3 mr-1" />
                            <span>{challenge.reward}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Expira em: {challenge.expires}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <Flag className="h-4 w-4 mr-2" />
                Criar Novo Desafio
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loja de Recompensas</CardTitle>
              <CardDescription>
                Troque seus pontos por recompensas exclusivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewardsData.map((reward) => (
                  <div key={reward.id} className="border rounded-lg p-4">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Gift className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{reward.name}</h4>
                          <Badge className="mt-1 bg-blue-100 text-blue-800">
                            {reward.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="font-medium">{reward.points} pontos</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          Resgatar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GamificationTab;