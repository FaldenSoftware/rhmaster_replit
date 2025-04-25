import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, AreaChart, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as PieChartRecharts,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const monthlyData = [
  { name: 'Jan', completedTests: 12, activeClients: 5 },
  { name: 'Fev', completedTests: 19, activeClients: 7 },
  { name: 'Mar', completedTests: 25, activeClients: 10 },
  { name: 'Abr', completedTests: 32, activeClients: 12 },
  { name: 'Mai', completedTests: 30, activeClients: 11 },
  { name: 'Jun', completedTests: 40, activeClients: 15 },
  { name: 'Jul', completedTests: 42, activeClients: 16 },
  { name: 'Ago', completedTests: 37, activeClients: 14 },
  { name: 'Set', completedTests: 45, activeClients: 17 },
  { name: 'Out', completedTests: 48, activeClients: 18 },
  { name: 'Nov', completedTests: 50, activeClients: 19 },
  { name: 'Dez', completedTests: 55, activeClients: 20 },
];

const testTypeData = [
  { name: 'Perfil Comportamental', value: 45 },
  { name: 'Inteligência Emocional', value: 30 },
  { name: 'Eneagrama', value: 15 },
  { name: 'Outros', value: 10 },
];

const performanceData = [
  {
    subject: 'Engajamento',
    value: 80,
    fullMark: 100,
  },
  {
    subject: 'Taxa de Conclusão',
    value: 75,
    fullMark: 100,
  },
  {
    subject: 'Feedback Positivo',
    value: 90,
    fullMark: 100,
  },
  {
    subject: 'Retenção de Clientes',
    value: 85,
    fullMark: 100,
  },
  {
    subject: 'Crescimento',
    value: 70,
    fullMark: 100,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  const [timeRange, setTimeRange] = useState("monthly");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Acompanhe o desempenho dos seus clientes e a eficácia do seu programa de mentoria
        </p>
      </div>

      <div className="flex justify-end">
        <Tabs defaultValue="monthly" value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="yearly">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Testes Concluídos</CardTitle>
            <CardDescription>Total no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold">435</div>
              <div className="text-sm text-green-600 flex items-center">
                <span className="text-xl">↑</span> 12% em relação ao período anterior
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Taxa de Conclusão</CardTitle>
            <CardDescription>Média do período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold">78%</div>
              <div className="text-sm text-green-600 flex items-center">
                <span className="text-xl">↑</span> 5% em relação ao período anterior
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Clientes Ativos</CardTitle>
            <CardDescription>Total atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold">20</div>
              <div className="text-sm text-green-600 flex items-center">
                <span className="text-xl">↑</span> 25% em relação ao período anterior
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progresso Mensal</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Testes concluídos e clientes ativos por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completedTests" name="Testes Concluídos" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="activeClients" name="Clientes Ativos" fill="hsl(var(--chart-2))" />
                </RechartsBar>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Distribuição por Tipo de Teste</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Breakdown dos testes atribuídos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChartRecharts>
                  <Pie
                    data={testTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChartRecharts>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tendência de Crescimento</CardTitle>
              <AreaChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Evolução de clientes e testes ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completedTests" name="Testes Concluídos" stroke="hsl(var(--chart-1))" />
                  <Line type="monotone" dataKey="activeClients" name="Clientes Ativos" stroke="hsl(var(--chart-2))" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Análise de Performance</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Indicadores-chave de desempenho da sua mentoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Performance" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsTab;