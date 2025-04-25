import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  PieChart, 
  Download, 
  ExternalLink, 
  Calendar, 
  Clock, 
  FileText, 
  Star, 
  TrendingUp, 
  TrendingDown,
  User
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function ResultsTab() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <ResultsTabContent />
      </div>
    </DashboardLayout>
  );
}

export function ResultsTabContent() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedTest, setSelectedTest] = useState("all");

  // Dados mockados para os resultados de testes
  const testResults = [
    {
      id: "1",
      title: "Análise de Comunicação",
      score: 85,
      date: "2023-04-10",
      categories: [
        { name: "Comunicação Verbal", score: 88 },
        { name: "Comunicação Escrita", score: 82 },
        { name: "Escuta Ativa", score: 90 },
        { name: "Comunicação Não-Verbal", score: 78 },
        { name: "Feedback", score: 85 }
      ],
      strengths: [
        "Excelente capacidade de escuta ativa",
        "Boa articulação de ideias complexas",
        "Empatia na comunicação"
      ],
      weaknesses: [
        "Comunicação não-verbal pode ser melhorada",
        "Tendência a interromper em discussões de grupo"
      ],
      recommendations: [
        "Praticar técnicas de linguagem corporal",
        "Desenvolver habilidades de perguntas poderosas",
        "Buscar feedback sobre clareza de comunicação"
      ]
    },
    {
      id: "2",
      title: "Gestão de Conflitos",
      score: 78,
      date: "2023-03-22",
      categories: [
        { name: "Identificação de Conflitos", score: 82 },
        { name: "Estratégias de Resolução", score: 76 },
        { name: "Mediação", score: 74 },
        { name: "Negociação", score: 80 },
        { name: "Prevenção de Conflitos", score: 78 }
      ],
      strengths: [
        "Habilidade de identificar causas raízes de conflitos",
        "Bom senso de timing para intervenções"
      ],
      weaknesses: [
        "Desconforto em situações de alta tensão",
        "Pode evitar conflitos necessários",
        "Dificuldade em manter neutralidade"
      ],
      recommendations: [
        "Praticar técnicas de mediação",
        "Aprender mais sobre negociação baseada em interesses",
        "Desenvolver resiliência emocional em situações de conflito"
      ]
    },
    {
      id: "3",
      title: "Análise de Forças e Fraquezas",
      score: 92,
      date: "2023-03-15",
      categories: [
        { name: "Autoconhecimento", score: 95 },
        { name: "Clareza de Valores", score: 90 },
        { name: "Reconhecimento de Forças", score: 94 },
        { name: "Consciência de Limitações", score: 88 },
        { name: "Plano de Desenvolvimento", score: 85 }
      ],
      strengths: [
        "Excelente percepção de pontos fortes pessoais",
        "Honestidade sobre áreas para desenvolvimento",
        "Visão clara de valores pessoais"
      ],
      weaknesses: [
        "Planos de ação para desenvolvimento poderiam ser mais específicos",
        "Ocasionalmente subestima capacidades"
      ],
      recommendations: [
        "Criar planos de desenvolvimento mais estruturados e mensuráveis",
        "Buscar feedback regular para calibrar autopercepção",
        "Identificar oportunidades para utilizar forças em novos contextos"
      ]
    }
  ];

  // Dados para os gráficos
  const categoryScores = testResults.flatMap(test => 
    test.categories.map(category => ({
      testName: test.title,
      category: category.name,
      score: category.score
    }))
  );

  const testScores = testResults.map(test => ({
    name: test.title,
    score: test.score,
    date: test.date
  }));

  const radarData = selectedTest !== "all" 
    ? testResults.find(test => test.id === selectedTest)?.categories.map(cat => ({
        subject: cat.name,
        A: cat.score,
        fullMark: 100
      }))
    : testResults[0].categories.map(cat => ({
        subject: cat.name,
        A: cat.score,
        fullMark: 100
      }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resultados dos Testes</h2>
          <p className="text-muted-foreground mt-1">
            Visualize e analise seus resultados de testes comportamentais
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um teste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os testes</SelectItem>
              {testResults.map(test => (
                <SelectItem key={test.id} value={test.id}>{test.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Resumo</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Detalhes</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Tendências</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pontuação por Teste</CardTitle>
                <CardDescription>
                  Visualize seus resultados em cada teste realizado
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={testScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Pontuação" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Dados baseados nos testes completados
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Competências</CardTitle>
                <CardDescription>
                  Visualização de suas competências por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Pontuação"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {selectedTest === "all" ? "Mostrando dados do teste mais recente" : "Dados específicos do teste selecionado"}
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedTest === "all" ? (
              testResults.map(test => (
                <Card key={test.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(test.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold">{test.score}</h4>
                        <p className="text-xs text-muted-foreground">Pontuação</p>
                      </div>
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Destaques:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <p className="text-xs">{test.strengths[0]}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <p className="text-xs">{test.weaknesses[0]}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              testResults
                .filter(test => test.id === selectedTest)
                .map(test => (
                  <Card key={test.id} className="md:col-span-3">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(test.date)}
                            <Badge className="ml-2">
                              Pontuação: {test.score}/100
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Baixar PDF
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Pontos Fortes
                          </h3>
                          <ul className="space-y-2">
                            {test.strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Áreas para Desenvolvimento
                          </h3>
                          <ul className="space-y-2">
                            {test.weaknesses.map((weakness, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            Recomendações
                          </h3>
                          <ul className="space-y-2">
                            {test.recommendations.map((recommendation, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedTest === "all" ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Selecione um teste específico</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Por favor, selecione um teste específico no menu acima para visualizar detalhes completos.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            testResults
              .filter(test => test.id === selectedTest)
              .map(test => (
                <div key={test.id} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes do Teste</CardTitle>
                      <CardDescription>
                        Informações detalhadas sobre o teste {test.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Pontuações por Categoria</h3>
                          <div className="space-y-4">
                            {test.categories.map((category, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">{category.name}</span>
                                  <span className="text-sm font-medium">{category.score}/100</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${category.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Perfil de Competências</h3>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={90} data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                  name="Pontuação"
                                  dataKey="A"
                                  stroke="hsl(var(--primary))"
                                  fill="hsl(var(--primary))"
                                  fillOpacity={0.6}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-4">Análise Completa</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-base font-medium">Pontos Fortes</h4>
                            <ul className="mt-2 space-y-2">
                              {test.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                                  <span className="text-sm">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-medium">Áreas para Desenvolvimento</h4>
                            <ul className="mt-2 space-y-2">
                              {test.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <TrendingDown className="h-4 w-4 text-red-500 mt-0.5" />
                                  <span className="text-sm">{weakness}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-base font-medium">Recomendações</h4>
                            <ul className="mt-2 space-y-2">
                              {test.recommendations.map((recommendation, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                                  <span className="text-sm">{recommendation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Relatório Completo
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Desempenho</CardTitle>
              <CardDescription>
                Visualize sua evolução ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={testScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="hsl(var(--primary))" name="Pontuação" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Dados baseados nos últimos {testResults.length} testes completados
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparação por Categorias</CardTitle>
              <CardDescription>
                Compare seu desempenho em diferentes categorias ao longo dos testes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={categoryScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="hsl(var(--primary))" name="Pontuação" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Mostrando categorias de todos os testes completados
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResultsTab;