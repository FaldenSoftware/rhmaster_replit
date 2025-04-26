import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TestLayout } from "./TestLayout";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

// Definição das questões do teste de inteligência emocional
const questions = [
  // Autoconsciência
  {
    id: 1,
    text: "Consigo identificar minhas emoções no momento em que as sinto.",
    dimension: "autoconsciencia"
  },
  {
    id: 2,
    text: "Entendo como minhas emoções afetam meu comportamento e desempenho.",
    dimension: "autoconsciencia"
  },
  {
    id: 3,
    text: "Reconheço meus pontos fortes e fracos com precisão.",
    dimension: "autoconsciencia"
  },
  {
    id: 4,
    text: "Estou aberto a feedback e novas perspectivas sobre mim mesmo.",
    dimension: "autoconsciencia"
  },
  {
    id: 5,
    text: "Tenho uma boa compreensão de como os outros me percebem.",
    dimension: "autoconsciencia"
  },
  {
    id: 6,
    text: "Consigo refletir sobre as razões por trás das minhas reações emocionais.",
    dimension: "autoconsciencia"
  },
  
  // Autocontrole
  {
    id: 7,
    text: "Mantenho a calma em situações de pressão ou estresse.",
    dimension: "autocontrole"
  },
  {
    id: 8,
    text: "Consigo controlar impulsos emocionais que poderiam prejudicar meu trabalho.",
    dimension: "autocontrole"
  },
  {
    id: 9,
    text: "Recupero-me rapidamente de contratempos e frustrações.",
    dimension: "autocontrole"
  },
  {
    id: 10,
    text: "Penso antes de reagir quando provocado ou criticado.",
    dimension: "autocontrole"
  },
  {
    id: 11,
    text: "Adapto-me bem a mudanças e situações incertas.",
    dimension: "autocontrole"
  },
  {
    id: 12,
    text: "Mantenho foco e clareza mental mesmo em momentos difíceis.",
    dimension: "autocontrole"
  },
  
  // Automotivação
  {
    id: 13,
    text: "Persisto diante de obstáculos para alcançar meus objetivos.",
    dimension: "automotivacao"
  },
  {
    id: 14,
    text: "Tenho padrões pessoais elevados que me motivam a melhorar constantemente.",
    dimension: "automotivacao"
  },
  {
    id: 15,
    text: "Mantenho o otimismo mesmo diante de dificuldades.",
    dimension: "automotivacao"
  },
  {
    id: 16,
    text: "Busco oportunidades para crescer e me desenvolver profissionalmente.",
    dimension: "automotivacao"
  },
  {
    id: 17,
    text: "Alinho meu trabalho com meus valores e propósitos pessoais.",
    dimension: "automotivacao"
  },
  {
    id: 18,
    text: "Tomo iniciativa e me motivo sem depender de reconhecimento externo.",
    dimension: "automotivacao"
  },
  
  // Empatia
  {
    id: 19,
    text: "Consigo perceber como as outras pessoas estão se sentindo, mesmo quando não dizem.",
    dimension: "empatia"
  },
  {
    id: 20,
    text: "Escuto atentamente para entender o ponto de vista dos outros.",
    dimension: "empatia"
  },
  {
    id: 21,
    text: "Demonstro interesse genuíno pelo bem-estar dos outros.",
    dimension: "empatia"
  },
  {
    id: 22,
    text: "Considero as emoções dos outros ao tomar decisões que os afetam.",
    dimension: "empatia"
  },
  {
    id: 23,
    text: "Percebo as dinâmicas sociais em grupos e organizações.",
    dimension: "empatia"
  },
  {
    id: 24,
    text: "Respeito e valorizo pessoas com diferentes experiências e perspectivas.",
    dimension: "empatia"
  },
  
  // Habilidades Sociais
  {
    id: 25,
    text: "Comunico-me claramente e efetivamente em diversas situações.",
    dimension: "habilidadesSociais"
  },
  {
    id: 26,
    text: "Construo relacionamentos de confiança com diferentes tipos de pessoas.",
    dimension: "habilidadesSociais"
  },
  {
    id: 27,
    text: "Colaboro bem em equipe, contribuindo para os objetivos coletivos.",
    dimension: "habilidadesSociais"
  },
  {
    id: 28,
    text: "Abordo conflitos de maneira construtiva, buscando soluções.",
    dimension: "habilidadesSociais"
  },
  {
    id: 29,
    text: "Influencio positivamente os outros com minhas ideias.",
    dimension: "habilidadesSociais"
  },
  {
    id: 30,
    text: "Ajudo a criar um ambiente positivo nos grupos onde trabalho.",
    dimension: "habilidadesSociais"
  }
];

// Tipo para as respostas do formulário
type FormValues = {
  [key: number]: number;
};

// Esquema de validação
const createValidationSchema = (currentStep: number) => {
  return z.object({
    [currentStep]: z.number({
      required_error: "Por favor, selecione um valor",
    }).min(1).max(5),
  });
};

// Interface para os resultados do teste
interface EmotionalIntelligenceResult {
  autoconsciencia: number;
  autocontrole: number;
  automotivacao: number;
  empatia: number;
  habilidadesSociais: number;
  total: number;
}

export function EmotionalIntelligenceTest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<FormValues>({});
  const [isPaused, setIsPaused] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date>(new Date());
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Para validar apenas a questão atual
  const validationSchema = createValidationSchema(currentQuestion.id);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: answers,
  });

  // Carregar respostas existentes (se houver)
  const { data: savedResponse, isLoading: isLoadingResponse } = useQuery({
    queryKey: ["/api/tests/emotional-intelligence/in-progress"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/emotional-intelligence/in-progress");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Carregar resultado do teste (se já completado)
  const { data: testResult } = useQuery({
    queryKey: ["/api/tests/emotional-intelligence/result"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/emotional-intelligence/result");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Salvar as respostas
  const saveMutation = useMutation({
    mutationFn: async (data: { answers: FormValues; completed: boolean }) => {
      const res = await apiRequest("POST", "/api/tests/emotional-intelligence/save", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tests/emotional-intelligence/in-progress"] });
      if (isLastQuestion) {
        queryClient.invalidateQueries({ queryKey: ["/api/tests/emotional-intelligence/result"] });
      }
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Carregar as respostas salvas ao iniciar o teste
  useEffect(() => {
    if (savedResponse) {
      setAnswers(savedResponse.answers);
      form.reset(savedResponse.answers);
      if (savedResponse.lastQuestionIndex !== undefined) {
        setCurrentQuestionIndex(
          Math.min(savedResponse.lastQuestionIndex, questions.length - 1)
        );
      }
      if (savedResponse.startTime) {
        setTestStartTime(new Date(savedResponse.startTime));
      }
    }
  }, [savedResponse, form]);

  // Salvar automaticamente a cada 30 segundos
  useEffect(() => {
    if (isPaused || Object.keys(answers).length === 0) return;

    const timer = setInterval(() => {
      handleSave();
    }, 30000);

    return () => clearInterval(timer);
  }, [answers, isPaused]);

  const handleSave = async () => {
    if (Object.keys(answers).length === 0) return;

    await saveMutation.mutateAsync({
      answers,
      completed: false,
      lastQuestionIndex: currentQuestionIndex,
      startTime: testStartTime.toISOString(),
    });
  };

  const handleSubmit = async (values: FormValues) => {
    // Combinamos as respostas existentes com a nova resposta
    const updatedAnswers = { ...answers, ...values };
    setAnswers(updatedAnswers);

    // Se não é a última questão, avance para a próxima
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Certifique-se de salvar o progresso
      await saveMutation.mutateAsync({
        answers: updatedAnswers,
        completed: false,
        lastQuestionIndex: currentQuestionIndex + 1,
        startTime: testStartTime.toISOString(),
      });
    } else {
      // É a última questão, salvar e marcar como concluído
      await saveMutation.mutateAsync({
        answers: updatedAnswers,
        completed: true,
        lastQuestionIndex: currentQuestionIndex,
        startTime: testStartTime.toISOString(),
        endTime: new Date().toISOString(),
      });
      toast({
        title: "Teste concluído!",
        description: "Suas respostas foram enviadas com sucesso.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    handleSave();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  // Se já temos um resultado, mostrar a tela de resultado
  if (testResult) {
    const chartData = [
      {
        subject: "Autoconsciência",
        A: testResult.autoconsciencia,
        fullMark: 100,
      },
      {
        subject: "Autocontrole",
        A: testResult.autocontrole,
        fullMark: 100,
      },
      {
        subject: "Automotivação",
        A: testResult.automotivacao,
        fullMark: 100,
      },
      {
        subject: "Empatia",
        A: testResult.empatia,
        fullMark: 100,
      },
      {
        subject: "Habilidades Sociais",
        A: testResult.habilidadesSociais,
        fullMark: 100,
      },
    ];

    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Resultado do Teste de Inteligência Emocional</h2>
            <p className="mb-4">
              Seu teste foi concluído com sucesso. Abaixo está a análise das suas cinco dimensões de inteligência emocional:
            </p>
            
            <div className="mt-6 bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Pontuação Geral: {testResult.total}%</h3>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Pontuação"
                      dataKey="A"
                      stroke="#006B6B"
                      fill="#006B6B"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Dimensões mais fortes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(testResult)
                    .filter(([key]) => key !== "total")
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <li key={key}>
                        {formatDimensionName(key)}: {value}%
                      </li>
                    ))
                  }
                </ul>
              </div>
              
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Áreas para desenvolvimento</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(testResult)
                    .filter(([key]) => key !== "total")
                    .sort(([, a], [, b]) => (a as number) - (b as number))
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <li key={key}>
                        {formatDimensionName(key)}: {value}%
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <Button variant="default" onClick={() => window.location.href = "/dashboard"}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TestLayout
      title="Teste de Inteligência Emocional"
      description="Este teste avalia suas habilidades em cinco dimensões da inteligência emocional: autoconsciência, autocontrole, automotivação, empatia e habilidades sociais."
      currentStep={currentQuestionIndex + 1}
      totalSteps={questions.length}
      onSave={handleSave}
      onPause={handlePause}
      onResume={handleResume}
      loading={isLoadingResponse}
      isPaused={isPaused}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </h3>
            <p className="text-lg">{currentQuestion.text}</p>
          </div>

          <FormField
            control={form.control}
            name={`${currentQuestion.id}`}
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value || 3]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between">
                      <div className="text-center">
                        <span className="block font-medium">1</span>
                        <span className="text-xs text-muted-foreground">Discordo totalmente</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium">2</span>
                        <span className="text-xs text-muted-foreground">Discordo</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium">3</span>
                        <span className="text-xs text-muted-foreground">Neutro</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium">4</span>
                        <span className="text-xs text-muted-foreground">Concordo</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium">5</span>
                        <span className="text-xs text-muted-foreground">Concordo totalmente</span>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-center">
                  Valor selecionado: <span className="font-medium">{field.value || 3}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button type="submit">
              {isLastQuestion ? (
                <>
                  Finalizar <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Próxima <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </TestLayout>
  );
}

function formatDimensionName(dimension: string): string {
  const map: Record<string, string> = {
    autoconsciencia: "Autoconsciência",
    autocontrole: "Autocontrole",
    automotivacao: "Automotivação",
    empatia: "Empatia",
    habilidadesSociais: "Habilidades Sociais"
  };
  
  return map[dimension] || dimension;
}