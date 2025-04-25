import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, UsersRound, ClipboardList, TrendingUp, Mail, User, Settings } from "lucide-react";
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
import { ClientsTab } from "./mentor/clients-tab";
import { TestsTab } from "./mentor/tests-tab";
import { ProfileTab } from "./mentor/profile-tab";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { name: 'Jan', completedTests: 12, activeClients: 5 },
  { name: 'Fev', completedTests: 19, activeClients: 7 },
  { name: 'Mar', completedTests: 25, activeClients: 10 },
  { name: 'Abr', completedTests: 32, activeClients: 12 },
  { name: 'Mai', completedTests: 30, activeClients: 11 },
  { name: 'Jun', completedTests: 40, activeClients: 15 },
];

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList className="flex h-10 items-center justify-start p-0 bg-transparent w-full">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Clientes
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Testes
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Meu Perfil
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <Chart
                data={data}
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
                <Bar dataKey="completedTests" name="Testes Completados" fill="hsl(var(--chart-1))" />
                <Bar dataKey="activeClients" name="Clientes Ativos" fill="hsl(var(--chart-2))" />
              </Chart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <ClientsTab />
        </TabsContent>

        <TabsContent value="tests">
          <TestsTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
