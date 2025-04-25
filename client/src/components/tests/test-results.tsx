import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Award, Download, FileText } from "lucide-react";

interface ResultsData {
  testId: string;
  testTitle: string;
  completedDate: string;
  score: number;
  categoryScores: {
    name: string;
    score: number;
  }[];
  primaryType?: string;
  secondaryType?: string;
  summary: string;
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: string[];
}

interface TestResultsProps {
  results: ResultsData;
  onClose: () => void;
  onDownload: () => void;
}

export function TestResults({ results, onClose, onDownload }: TestResultsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };
  
  const COLORS = ['#006B6B', '#4CA1A1', '#C9A227', '#E5C76B'];
  
  const pieData = results.categoryScores.map(item => ({
    name: item.name,
    value: item.score
  }));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{results.testTitle} - Resultados</CardTitle>
            <CardDescription>Completado em {formatDate(results.completedDate)}</CardDescription>
          </div>
          <div className="flex items-center bg-primary/10 p-3 rounded-md">
            <Award className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm font-medium">Pontuação</div>
              <div className="text-2xl font-bold">{results.score}/100</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Progress value={results.score} className="h-2" />
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Resumo</h3>
              <p className="text-slate-700">{results.summary}</p>
              
              {results.primaryType && (
                <div className="mt-4">
                  <h4 className="font-medium">Tipo Principal</h4>
                  <p className="text-primary font-bold">{results.primaryType}</p>
                  
                  {results.secondaryType && (
                    <>
                      <h4 className="font-medium mt-2">Tipo Secundário</h4>
                      <p className="text-primary-light font-bold">{results.secondaryType}</p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Pontos Fortes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.strengthsAndWeaknesses.strengths.map((strength, index) => (
                    <li key={index} className="text-slate-700">{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Pontos a Desenvolver</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-slate-700">{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-4">Resultados por Categoria</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={results.categoryScores}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-4">Distribuição</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Recomendações para Desenvolvimento</h3>
              <ul className="space-y-4">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-700">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Voltar
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Relatório Completo
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
