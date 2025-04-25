import { BarChart, LineChart, PieChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResultsTab() {
  // Dados mockados para exemplo
  const testResults = [
    {
      id: 1,
      title: "Comunicação Assertiva",
      date: "14/04/2023",
      score: 89,
      categories: [
        { name: "Comunicação verbal", score: 92 },
        { name: "Comunicação não-verbal", score: 85 },
        { name: "Escuta ativa", score: 90 },
        { name: "Empatia", score: 87 },
      ]
    },
    {
      id: 2,
      title: "Tomada de Decisão",
      date: "04/04/2023",
      score: 92,
      categories: [
        { name: "Análise crítica", score: 94 },
        { name: "Avaliação de risco", score: 88 },
        { name: "Criatividade", score: 90 },
        { name: "Ação sob pressão", score: 96 },
      ]
    },
    {
      id: 3,
      title: "Gestão de Conflitos",
      date: "23/03/2023",
      score: 85,
      categories: [
        { name: "Mediação", score: 88 },
        { name: "Negociação", score: 82 },
        { name: "Resiliência", score: 90 },
        { name: "Flexibilidade", score: 78 },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Resultados</h2>
        <p className="text-muted-foreground mt-2">
          Analise seus resultados e acompanhe seu progresso
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Nota Média</h3>
                <p className="text-2xl font-bold mt-1">88.7</p>
                <p className="text-xs text-green-600 mt-2">
                  ↑ 3.2 no último mês
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
                <h3 className="font-medium">Progresso</h3>
                <p className="text-2xl font-bold mt-1">Constante</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Melhoria consistente nos últimos 3 meses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Área Mais Forte</h3>
                <p className="text-2xl font-bold mt-1">Tomada de Decisão</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Pontuação média de 92
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico de Resultados</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-6 mt-6">
                {testResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{result.score}</span>
                        <span className="text-muted-foreground text-sm">/100</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      {result.categories.map((category, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{category.name}</span>
                            <span className="font-medium">{category.score}%</span>
                          </div>
                          <Progress value={category.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">Ver Relatório Completo</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="py-6 text-center">
                <p className="text-muted-foreground">
                  Selecione um resultado da lista para ver detalhes completos.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}