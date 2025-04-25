import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestAssignmentKanban from "./test-assignment-kanban";
import { ClipboardList, Activity, ListTodo } from "lucide-react";

export function TestsTab() {
  const [activeTestTab, setActiveTestTab] = useState("assignment");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Testes</h2>
      </div>

      <Tabs value={activeTestTab} onValueChange={setActiveTestTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Atribuição</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Resultados</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span>Biblioteca</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignment">
          <TestAssignmentKanban />
        </TabsContent>

        <TabsContent value="results">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Resultados de Testes</h3>
            <p className="text-slate-600">
              Visualize e analise os resultados dos testes que seus clientes completaram.
              Esta seção mostrará gráficos de desempenho, pontuações e relatórios detalhados.
            </p>
            
            <div className="mt-6 p-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-700 mb-2">Sem resultados ainda</h4>
                <p className="text-slate-500 max-w-md">
                  Quando seus clientes completarem os testes atribuídos, os resultados aparecerão aqui.
                  Atribua testes na aba Atribuição.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Biblioteca de Testes</h3>
            <p className="text-slate-600">
              Explore nossa biblioteca completa de testes comportamentais e avaliações.
              Esta seção permitirá que você visualize detalhes, previsualize questões e crie novos testes personalizados.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-500 text-white rounded-full mr-3">
                    <ListTodo className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">Perfil Comportamental</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Análise completa de comportamentos e traços de personalidade em diversos contextos.
                </p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>45 questões</span>
                  <span>25 min</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-red-500 text-white rounded-full mr-3">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">Inteligência Emocional</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Avaliação da capacidade de reconhecer e gerenciar emoções próprias e alheias.
                </p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>36 questões</span>
                  <span>20 min</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-500 text-white rounded-full mr-3">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold">Eneagrama</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Identificação de padrões de personalidade e motivações subjacentes.
                </p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>60 questões</span>
                  <span>30 min</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}