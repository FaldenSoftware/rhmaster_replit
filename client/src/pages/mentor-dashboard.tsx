import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, UsersRound, ClipboardList, TrendingUp, Mail } from "lucide-react";
import { 
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { name: 'Jan', completedTests: 12, activeClients: 5 },
  { name: 'Fev', completedTests: 19, activeClients: 7 },
  { name: 'Mar', completedTests: 25, activeClients: 10 },
  { name: 'Abr', completedTests: 32, activeClients: 12 },
  { name: 'Mai', completedTests: 30, activeClients: 11 },
  { name: 'Jun', completedTests: 40, activeClients: 15 },
];

export default function MentorDashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Mentor</h1>
        <div className="flex space-x-2">
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Convidar Cliente
          </Button>
          <Button variant="outline">
            <ClipboardList className="mr-2 h-4 w-4" />
            Atribuir Teste
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Clientes</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">15</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <UsersRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 12% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Atribuídos</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">48</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 8% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Completos</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">32</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↑ 16% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Taxa de Conclusão</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">67%</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-amber-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>↓ 3% este mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividade de Testes</CardTitle>
            <CardDescription>Visão geral dos testes completados nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <Chart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completedTests" name="Testes Completados" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="activeClients" name="Clientes Ativos" fill="hsl(var(--chart-2))" />
                </Chart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Seus clientes mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">AB</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Ana Beatriz</h4>
                    <p className="text-xs text-slate-500">3 testes completados</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">RM</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Ricardo Martins</h4>
                    <p className="text-xs text-slate-500">1 teste completado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">CS</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Carla Silva</h4>
                    <p className="text-xs text-slate-500">2 testes completados</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="font-semibold text-slate-500">JM</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">João Mendes</h4>
                    <p className="text-xs text-slate-500">Convite enviado há 2 dias</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="font-semibold text-slate-500">PL</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Paula Lima</h4>
                    <p className="text-xs text-slate-500">Convite enviado ontem</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
