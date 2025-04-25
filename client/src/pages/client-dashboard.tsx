import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Award, Clock, CheckCircle2 } from "lucide-react";

export default function ClientDashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard do Cliente</h1>
        <Button>
          <ClipboardList className="mr-2 h-4 w-4" />
          Ver Todos os Testes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Atribuídos</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">5</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Testes Completados</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">3</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Progresso Total</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">60%</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Testes</CardTitle>
            <CardDescription>Testes que você precisa completar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Perfil Comportamental</h4>
                    <p className="text-sm text-slate-600 mt-1">Este teste ajuda a identificar seus comportamentos naturais em diferentes situações.</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-md">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Prazo</span>
                    <span className="text-amber-600">3 dias restantes</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">Iniciar Teste</Button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Eneagrama</h4>
                    <p className="text-sm text-slate-600 mt-1">Descubra seu tipo de personalidade e motivações segundo o Eneagrama.</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-md">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Prazo</span>
                    <span className="text-red-600">1 dia restante</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">Iniciar Teste</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testes Completados</CardTitle>
            <CardDescription>Seu progresso e resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Inteligência Emocional</h4>
                    <p className="text-sm text-slate-600 mt-1">Avaliação de como você percebe e gerencia emoções.</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Completado em</span>
                    <span>12/06/2023</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Resultado</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">Ver Detalhes</Button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">Estilos de Liderança</h4>
                    <p className="text-sm text-slate-600 mt-1">Identifica seu estilo predominante de liderança.</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Completado em</span>
                    <span>28/05/2023</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm mb-1">
                      <span>Estilo predominante:</span>
                      <span className="font-medium ml-1">Democrático</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">Ver Detalhes</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seu Mentor</CardTitle>
          <CardDescription>Informações sobre seu mentor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">CM</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 text-center sm:text-left">Carlos Mendes</h3>
              <p className="text-slate-600 mt-1 text-center sm:text-left">Especialista em Desenvolvimento de Liderança</p>
              <p className="text-sm text-slate-500 mt-3 text-center sm:text-left">
                Carlos é um consultor com mais de 10 anos de experiência em treinamento de líderes. 
                Ele irá acompanhar seu progresso e fornecer insights valiosos para seu desenvolvimento.
              </p>
              <div className="mt-4 flex justify-center sm:justify-start space-x-3">
                <Button variant="outline" size="sm">Enviar Mensagem</Button>
                <Button variant="outline" size="sm">Agendar Reunião</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
