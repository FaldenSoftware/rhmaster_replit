import React, { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Users, 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Activity
} from "lucide-react";

export function AnalyticsTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <AnalyticsTabContent />
      </div>
    </DashboardLayout>
  );
}

export function AnalyticsTabContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("month");

  // Dados mockados para visualização
  const testCompletionData = [
    { month: 'Jan', completed: 65, assigned: 95 },
    { month: 'Fev', completed: 72, assigned: 105 },
    { month: 'Mar', completed: 81, assigned: 110 },
    { month: 'Abr', completed: 85, assigned: 120 },
    { month: 'Mai', completed: 95, assigned: 125 },
    { month: 'Jun', completed: 98, assigned: 130 },
  ];

  const clientProgressData = [
    { name: 'Ana', progress: 92 },
    { name: 'Carlos', progress: 85 },
    { name: 'Pedro', progress: 76 },
    { name: 'Julia', progress: 88 },
    { name: 'Ricardo', progress: 65 },
    { name: 'Mariana', progress: 71 },
  ];

  const testTypeData = [
    { name: 'Liderança', value: 45 },
    { name: 'Comunicação', value: 25 },
    { name: 'Emocional', value: 20 },
    { name: 'Conflitos', value: 10 },
  ];

  const clientPerformanceData = [
    { name: 'Ana', lideranca: 85, comunicacao: 92, emocional: 78 },
    { name: 'Carlos', lideranca: 88, comunicacao: 75, emocional: 82 },
    { name: 'Pedro', lideranca: 72, comunicacao: 80, emocional: 75 },
    { name: 'Julia', lideranca: 95, comunicacao: 88, emocional: 90 },
    { name: 'Ricardo', lideranca: 65, comunicacao: 70, emocional: 68 },
    { name: 'Mariana', lideranca: 78, comunicacao: 85, emocional: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Analise dados e métricas sobre os testes e desempenho dos clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Taxa de Conclusão</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">85%</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 15% vs. período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Média de Pontuação</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">78.2</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 3.5 pts vs. período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Clientes Ativos</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">15</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 2 novos este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Realizados</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">124</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-amber-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>↓ 5% vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Testes Concluídos vs. Atribuídos</CardTitle>
                <CardDescription>
                  Taxa de conclusão de testes ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Testes Atribuídos</TableHead>
                      <TableHead>Testes Concluídos</TableHead>
                      <TableHead>Taxa de Conclusão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCompletionData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.assigned}</TableCell>
                        <TableCell>{item.completed}</TableCell>
                        <TableCell>
                          {Math.round((item.completed / item.assigned) * 100)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Tipos de Teste</CardTitle>
                <CardDescription>
                  Porcentagem de cada tipo de teste realizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testTypeData.map((item, index) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso dos Clientes</CardTitle>
              <CardDescription>
                Nível de progresso de cada cliente no programa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientProgressData.map((client) => (
                  <div key={client.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{client.name}</span>
                      <span className="text-sm text-muted-foreground">{client.progress}%</span>
                    </div>
                    <Progress value={client.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Completude por Tipo de Teste</CardTitle>
              <CardDescription>
                Porcentagem de conclusão por cada tipo de teste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mr-2">
                        85%
                      </Badge>
                      <span className="text-sm font-medium">Testes de Liderança</span>
                    </div>
                    <span className="text-sm text-muted-foreground">85 de 100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mr-2">
                        92%
                      </Badge>
                      <span className="text-sm font-medium">Testes de Comunicação</span>
                    </div>
                    <span className="text-sm text-muted-foreground">92 de 100</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mr-2">
                        78%
                      </Badge>
                      <span className="text-sm font-medium">Testes de Inteligência Emocional</span>
                    </div>
                    <span className="text-sm text-muted-foreground">78 de 100</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mr-2">
                        65%
                      </Badge>
                      <span className="text-sm font-medium">Testes de Resolução de Conflitos</span>
                    </div>
                    <span className="text-sm text-muted-foreground">65 de 100</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Comparativo dos Clientes</CardTitle>
              <CardDescription>
                Scores de diferentes habilidades por cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Liderança</TableHead>
                    <TableHead>Comunicação</TableHead>
                    <TableHead>Inteligência Emocional</TableHead>
                    <TableHead>Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientPerformanceData.map((client) => {
                    const media = Math.round((client.lideranca + client.comunicacao + client.emocional) / 3);
                    return (
                      <TableRow key={client.name}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.lideranca}</TableCell>
                        <TableCell>{client.comunicacao}</TableCell>
                        <TableCell>{client.emocional}</TableCell>
                        <TableCell>
                          <Badge className={media >= 85 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                            {media}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsTab;