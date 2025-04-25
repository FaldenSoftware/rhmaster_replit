import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  Star, 
  Medal, 
  Trophy, 
  Zap, 
  Target, 
  Calendar, 
  Share2, 
  Download, 
  Search, 
  Bookmark, 
  BookOpen,
  TrendingUp,
  UserCheck,
  Shield,
  LockKeyhole
} from "lucide-react";

export function AchievementsTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <AchievementsTabContent />
      </div>
    </DashboardLayout>
  );
}

export function AchievementsTabContent() {
  const [activeTab, setActiveTab] = useState("unlocked");
  const [searchQuery, setSearchQuery] = useState("");

  // Dados mockados para exemplo
  const unlockedAchievements = [
    {
      id: "1",
      title: "Primeiro Teste",
      description: "Completou seu primeiro teste comportamental",
      icon: Award,
      date: "2023-03-15",
      category: "Progresso",
      pointsAwarded: 100,
      badge: { color: "bg-green-500", text: "Inicial" }
    },
    {
      id: "2",
      title: "Comunicador Eficaz",
      description: "Obteve pontuação acima de 85% no teste de Comunicação",
      icon: BookOpen,
      date: "2023-04-10",
      category: "Excelência",
      pointsAwarded: 250,
      badge: { color: "bg-blue-500", text: "Intermediário" }
    },
    {
      id: "3",
      title: "Em Ascensão",
      description: "Completou 3 testes em seu plano de desenvolvimento",
      icon: TrendingUp,
      date: "2023-04-18",
      category: "Progresso",
      pointsAwarded: 150,
      badge: { color: "bg-blue-500", text: "Intermediário" }
    },
    {
      id: "4",
      title: "Autoconhecimento",
      description: "Alcançou pontuação acima de 90% no teste de Análise de Forças e Fraquezas",
      icon: UserCheck,
      date: "2023-03-15",
      category: "Excelência",
      pointsAwarded: 300,
      badge: { color: "bg-purple-500", text: "Avançado" }
    }
  ];

  const lockedAchievements = [
    {
      id: "5",
      title: "Mestre em Resolução de Conflitos",
      description: "Complete 5 testes de gestão de conflitos com pontuação média acima de 85%",
      icon: Shield,
      category: "Especialidade",
      requiredTasks: [
        { text: "Complete 2 testes de gestão de conflitos", completed: 1, required: 2 },
        { text: "Mantenha pontuação média acima de 85%", completed: 1, required: 1 }
      ],
      pointsValue: 400,
      badge: { color: "bg-purple-500", text: "Avançado" }
    },
    {
      id: "6",
      title: "Líder Completo",
      description: "Complete todos os testes básicos de liderança e obtenha pontuação média acima de 80%",
      icon: Trophy,
      category: "Excelência",
      requiredTasks: [
        { text: "Complete o teste de Liderança Situacional", completed: 0, required: 1 },
        { text: "Complete o teste de Delegação Eficaz", completed: 0, required: 1 },
        { text: "Complete o teste de Feedback Construtivo", completed: 0, required: 1 },
        { text: "Mantenha pontuação média acima de 80%", completed: 1, required: 1 }
      ],
      pointsValue: 500,
      badge: { color: "bg-purple-500", text: "Avançado" }
    },
    {
      id: "7",
      title: "Mestre da Inteligência Emocional",
      description: "Obtenha pontuação acima de 90% no teste avançado de Inteligência Emocional",
      icon: Zap,
      category: "Especialidade",
      requiredTasks: [
        { text: "Complete o teste básico de Inteligência Emocional", completed: 1, required: 1 },
        { text: "Complete o teste avançado de Inteligência Emocional", completed: 0, required: 1 },
        { text: "Obtenha pontuação acima de 90% no teste avançado", completed: 0, required: 1 }
      ],
      pointsValue: 400,
      badge: { color: "bg-amber-500", text: "Especial" }
    }
  ];

  // Calcular nível e progresso
  const totalPoints = unlockedAchievements.reduce((sum, achievement) => sum + achievement.pointsAwarded, 0);
  const userLevel = Math.floor(totalPoints / 500) + 1;
  const levelProgress = (totalPoints % 500) / 5;
  const nextLevelPoints = 500 - (totalPoints % 500);

  // Filtrar conquistas com base na pesquisa
  const filteredUnlocked = unlockedAchievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocked = lockedAchievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Conquistas</h2>
        <p className="text-muted-foreground mt-1">
          Acompanhe suas conquistas e desbloqueie novas recompensas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Nível de Desenvolvimento</CardTitle>
            <CardDescription>Seu progresso no programa de desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-lg font-bold">Nível {userLevel}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {totalPoints} pontos
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {nextLevelPoints} pontos para o próximo nível
                  </span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{unlockedAchievements.length}</p>
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Pontos totais</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Medal className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{userLevel}</p>
                  <p className="text-xs text-muted-foreground">Nível atual</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Próximas Conquistas</CardTitle>
            <CardDescription>Conquistas que você está perto de alcançar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lockedAchievements.slice(0, 2).map(achievement => {
              const Icon = achievement.icon;
              const completedTasks = achievement.requiredTasks.reduce((sum, task) => sum + (task.completed ? 1 : 0), 0);
              const totalTasks = achievement.requiredTasks.length;
              const progressPercent = (completedTasks / totalTasks) * 100;
              
              return (
                <div key={achievement.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-medium">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{completedTasks} de {totalTasks} requisitos</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Ver todas
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conquistas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="unlocked" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="unlocked" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Desbloqueadas</span>
            <Badge className="ml-1 bg-primary/90 text-primary-foreground hover:bg-primary/90">
              {filteredUnlocked.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4" />
            <span>Bloqueadas</span>
            <Badge className="ml-1 bg-primary/90 text-primary-foreground hover:bg-primary/90">
              {filteredLocked.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredUnlocked.length === 0 ? (
              <Card className="sm:col-span-2 md:col-span-3">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">Nenhuma conquista encontrada</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Não encontramos conquistas que correspondam à sua pesquisa.
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredUnlocked.map(achievement => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge className={`${achievement.badge.color} text-white`}>
                          {achievement.badge.text}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100">
                          {achievement.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2">
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(achievement.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span className="font-medium">+{achievement.pointsAwarded} pontos</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Share2 className="h-3 w-3 mr-1" />
                        Compartilhar conquista
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredLocked.length === 0 ? (
              <Card className="sm:col-span-2 md:col-span-3">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">Nenhuma conquista encontrada</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Não encontramos conquistas que correspondam à sua pesquisa.
                    </p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredLocked.map(achievement => {
                const Icon = achievement.icon;
                const completedTasks = achievement.requiredTasks.reduce((sum, task) => sum + task.completed, 0);
                const totalRequiredTasks = achievement.requiredTasks.reduce((sum, task) => sum + task.required, 0);
                const progressPercent = (completedTasks / totalRequiredTasks) * 100;
                
                return (
                  <Card key={achievement.id} className="bg-slate-50 dark:bg-slate-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge className={`${achievement.badge.color} text-white opacity-70`}>
                          {achievement.badge.text}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                          {achievement.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-full">
                          <Icon className="h-5 w-5 text-slate-500" />
                        </div>
                        <CardTitle className="text-lg text-slate-700 dark:text-slate-300">
                          {achievement.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="mt-2">
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-2">
                      <div className="space-y-2">
                        {achievement.requiredTasks.map((task, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${task.completed === task.required ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                              {task.completed === task.required && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-2.5 w-2.5 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs ${task.completed === task.required ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {task.text} ({task.completed}/{task.required})
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                          <span className="text-slate-700 dark:text-slate-300">{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-1" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center justify-between w-full text-sm">
                        <span className="flex items-center text-slate-600 dark:text-slate-400">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Valor: {achievement.pointsValue} pontos
                        </span>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Star className="h-3 w-3 mr-1" />
                          Marcar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AchievementsTab;