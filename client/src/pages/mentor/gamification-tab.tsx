import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Clock,
  Target,
  ArrowUpRight,
  Settings,
  PlusCircle,
  BadgeCheck,
  Users,
  Zap,
  Gift,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gamificação</h2>
          <p className="text-muted-foreground mt-1">
            Aumente o engajamento dos seus clientes com elementos de gamificação
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Desafio
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Participação</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">85%</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pontos Gerados</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">12,450</h3>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600">
                  <span className="text-xl">↑</span> 24% este mês
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Conquistas</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">38</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600">
                  <span className="text-xl">↑</span> 8 novas este mês
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Recompensas</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">15</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600">
                  <span className="text-xl">↑</span> 3 resgatadas este mês
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Mais Engajados</CardTitle>
              <CardDescription>
                Ranking dos clientes com maior pontuação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Carlos Oliveira</p>
                      <p className="text-sm text-muted-foreground">5 conquistas neste mês</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold">4,250 pts</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 text-slate-800 rounded-full w-8 h-8 flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Ana Silva</p>
                      <p className="text-sm text-muted-foreground">3 conquistas neste mês</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold">3,720 pts</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 text-slate-800 rounded-full w-8 h-8 flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Fernanda Lima</p>
                      <p className="text-sm text-muted-foreground">4 conquistas neste mês</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold">2,980 pts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Conquistas Disponíveis</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Conquista
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Básico</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2">Primeiro Teste</CardTitle>
                <CardDescription>Completar o primeiro teste comportamental</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>100 pontos</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-600">5 clientes conquistaram</div>
                <Badge variant="outline">Ativo</Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Intermediário</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2">Mestre do Feedback</CardTitle>
                <CardDescription>Oferecer feedback detalhado em 5 testes</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>250 pontos</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-600">3 clientes conquistaram</div>
                <Badge variant="outline">Ativo</Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Avançado</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2">Consistência Exemplar</CardTitle>
                <CardDescription>Completar testes por 4 semanas seguidas</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>500 pontos</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-600">1 cliente conquistou</div>
                <Badge variant="outline">Ativo</Badge>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Desafios Ativos</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Desafio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">Em andamento</Badge>
                    <CardTitle>Maratona de Liderança</CardTitle>
                    <CardDescription>Complete três testes de liderança em uma semana</CardDescription>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Progresso</div>
                    <div className="text-sm font-medium">8/10 clientes</div>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Termina em 5 dias</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">750 pontos</span>
                </div>
                <Button variant="secondary" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Lembrar clientes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mb-2">Novo</Badge>
                    <CardTitle>Desafio de Feedback</CardTitle>
                    <CardDescription>Dê feedback detalhado sobre suas sessões de mentoria</CardDescription>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Progresso</div>
                    <div className="text-sm font-medium">3/10 clientes</div>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Termina em 12 dias</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">500 pontos</span>
                </div>
                <Button variant="secondary" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Lembrar clientes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Recompensas Disponíveis</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Recompensa
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Popular</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-center my-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Sessão Extra de Mentoria</CardTitle>
                <CardDescription className="text-center">
                  30 minutos adicionais de mentoria individual
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-bold">1,000 pontos</span>
                </div>
                <Badge variant="outline" className="mx-auto">8 resgatados</Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Editar Recompensa</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Exclusivo</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-center my-4">
                  <div className="p-4 bg-amber-100 rounded-full">
                    <BadgeCheck className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Certificado Premium</CardTitle>
                <CardDescription className="text-center">
                  Certificado personalizado de conclusão de programa
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-bold">2,500 pontos</span>
                </div>
                <Badge variant="outline" className="mx-auto">3 resgatados</Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Editar Recompensa</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Novo</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Desativar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-center my-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Workshop Exclusivo</CardTitle>
                <CardDescription className="text-center">
                  Acesso a workshop exclusivo de liderança avançada
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-bold">5,000 pontos</span>
                </div>
                <Badge variant="outline" className="mx-auto">1 resgatado</Badge>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Editar Recompensa</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GamificationTab;