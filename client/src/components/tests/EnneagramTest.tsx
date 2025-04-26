import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TestLayout } from "./TestLayout";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

// Definição das questões do teste de Eneagrama (pares de afirmações)
const questions = [
  {
    id: 1,
    options: [
      { id: "1", text: "Tendo a ser perfeccionista e a me preocupar em fazer as coisas corretamente." },
      { id: "9", text: "Tendo a ser complacente e aceitar as coisas como são para manter a paz." }
    ]
  },
  {
    id: 2,
    options: [
      { id: "2", text: "Tendo a me concentrar nas necessidades dos outros e em como ajudá-los." },
      { id: "3", text: "Tendo a me concentrar em metas, conquistas e como ser bem-sucedido." }
    ]
  },
  {
    id: 3,
    options: [
      { id: "3", text: "Apresento-me bem e me importo com minha imagem e como os outros me percebem." },
      { id: "4", text: "Sou sensível, introspectivo e muitas vezes me concentro no que está faltando." }
    ]
  },
  {
    id: 4,
    options: [
      { id: "4", text: "Tendo a me concentrar na singularidade, significado pessoal e sentimentos profundos." },
      { id: "5", text: "Tendo a me concentrar na observação, análise e acúmulo de conhecimento." }
    ]
  },
  {
    id: 5,
    options: [
      { id: "5", text: "Valorizo minha privacidade, tempo para pensar e conservar minha energia." },
      { id: "6", text: "Sou leal, vigilante e me preparo para possíveis problemas ou ameaças." }
    ]
  },
  {
    id: 6,
    options: [
      { id: "6", text: "Tendo a antecipar problemas e preocupações, buscando segurança e apoio." },
      { id: "7", text: "Busco novas experiências, oportunidades e mantenho minhas opções abertas." }
    ]
  },
  {
    id: 7,
    options: [
      { id: "7", text: "Sou otimista, versátil e gosto de iniciar novos projetos empolgantes." },
      { id: "8", text: "Sou assertivo, decidido e gosto de assumir o controle de situações." }
    ]
  },
  {
    id: 8,
    options: [
      { id: "8", text: "Confio em mim mesmo, enfrento desafios diretamente e protejo os mais vulneráveis." },
      { id: "9", text: "Busco harmonizar-me com os outros e valorizo a estabilidade e tranquilidade." }
    ]
  },
  {
    id: 9,
    options: [
      { id: "9", text: "Sou calmo, paciente e evito conflitos e perturbações." },
      { id: "1", text: "Tenho princípios claros, sou organizado e busco melhorar as coisas." }
    ]
  },
  {
    id: 10,
    options: [
      { id: "1", text: "Tendo a ser crítico comigo mesmo e com os outros quando as coisas não estão certas." },
      { id: "2", text: "Tendo a agradar os outros e adaptar-me às suas necessidades." }
    ]
  },
  {
    id: 11,
    options: [
      { id: "2", text: "Demonstro facilmente afeto e me sinto bem ao ajudar os outros." },
      { id: "4", text: "Sou bastante consciente de meus sentimentos e busco expressá-los de forma autêntica." }
    ]
  },
  {
    id: 12,
    options: [
      { id: "3", text: "Adapto-me facilmente para ser eficiente e obter resultados rápidos." },
      { id: "5", text: "Observo cuidadosamente antes de agir e valorizo minha privacidade." }
    ]
  },
  {
    id: 13,
    options: [
      { id: "4", text: "Busco expressar minha individualidade e experiências emocionais profundas." },
      { id: "6", text: "Busco segurança, certeza e confiabilidade nas situações." }
    ]
  },
  {
    id: 14,
    options: [
      { id: "5", text: "Prefiro observar e analisar do que participar imediatamente." },
      { id: "7", text: "Prefiro experimentar várias atividades interessantes e manter minhas opções abertas." }
    ]
  },
  {
    id: 15,
    options: [
      { id: "6", text: "Posso ser cauteloso e cético, sempre preparado para possíveis problemas." },
      { id: "8", text: "Posso ser direto e assertivo, assumindo o controle quando necessário." }
    ]
  },
  {
    id: 16,
    options: [
      { id: "7", text: "Planejo atividades divertidas e evito situações dolorosas ou limitantes." },
      { id: "9", text: "Adapto-me às outras pessoas e busco estabilidade e paz interior." }
    ]
  },
  {
    id: 17,
    options: [
      { id: "8", text: "Expresso-me com confiança e defendo o que acredito ser justo." },
      { id: "1", text: "Esforço-me para ser correto, organizado e fiel aos meus princípios." }
    ]
  },
  {
    id: 18,
    options: [
      { id: "3", text: "Procuro ser eficiente, competente e bem-sucedido em tudo que faço." },
      { id: "6", text: "Sou leal, cuidadoso e antecipo possíveis problemas para me preparar." }
    ]
  },
  {
    id: 19,
    options: [
      { id: "1", text: "Noto facilmente o que precisa ser corrigido ou melhorado." },
      { id: "7", text: "Noto facilmente novas possibilidades e oportunidades interessantes." }
    ]
  },
  {
    id: 20,
    options: [
      { id: "2", text: "Sinto-me melhor quando os outros reconhecem minha ajuda e apreciação." },
      { id: "8", text: "Sinto-me melhor quando posso determinar meu próprio caminho e fazer as coisas acontecerem." }
    ]
  },
  {
    id: 21,
    options: [
      { id: "4", text: "Valorizo expressões artísticas, autenticidade emocional e significado pessoal." },
      { id: "9", text: "Valorizo harmonia, estabilidade e aceitar as coisas como são." }
    ]
  },
  {
    id: 22,
    options: [
      { id: "2", text: "Estou atento às necessidades das pessoas e gosto de me sentir indispensável." },
      { id: "5", text: "Estou atento a detalhes e informações, e gosto de observar antes de participar." }
    ]
  },
  {
    id: 23,
    options: [
      { id: "3", text: "Adapto-me rapidamente para ter sucesso e causar boa impressão nos outros." },
      { id: "9", text: "Adapto-me facilmente aos outros para manter a paz e a harmonia." }
    ]
  },
  {
    id: 24,
    options: [
      { id: "5", text: "Preciso de tempo sozinho para recarregar minhas energias e organizar meus pensamentos." },
      { id: "8", text: "Preciso sentir que tenho controle sobre minha vida e influência em meu ambiente." }
    ]
  },
  {
    id: 25,
    options: [
      { id: "6", text: "Sou leal e comprometido com as pessoas e grupos importantes para mim." },
      { id: "7", text: "Sou entusiasmado e gosto de ter várias opções e novas experiências." }
    ]
  },
  {
    id: 26,
    options: [
      { id: "1", text: "Esforço-me para fazer tudo corretamente e seguir altos padrões morais." },
      { id: "3", text: "Esforço-me para ser excepcional e alcançar metas ambiciosas." }
    ]
  },
  {
    id: 27,
    options: [
      { id: "4", text: "Tendo a me concentrar no que falta em minha vida e no que é profundo e significativo." },
      { id: "8", text: "Tendo a me concentrar em proteger o que valorizo e manter minha força e independência." }
    ]
  },
  {
    id: 28,
    options: [
      { id: "1", text: "Posso me irritar quando as coisas são feitas de maneira incorreta ou descuidada." },
      { id: "5", text: "Posso me distanciar quando me sinto sobrecarregado com as exigências dos outros." }
    ]
  },
  {
    id: 29,
    options: [
      { id: "2", text: "Frequentemente coloco as necessidades dos outros acima das minhas." },
      { id: "7", text: "Frequentemente busco novas experiências e mantenho várias opções abertas." }
    ]
  },
  {
    id: 30,
    options: [
      { id: "6", text: "Sou alerta a possíveis problemas e questiono as intenções por trás das ações." },
      { id: "9", text: "Aceito as coisas como são e crio harmonia ao me adaptar às situações." }
    ]
  },
  {
    id: 31,
    options: [
      { id: "1", text: "Prefiro seguir regras claras e procedimentos estabelecidos." },
      { id: "4", text: "Prefiro expressar minha individualidade e buscar significados profundos." }
    ]
  },
  {
    id: 32,
    options: [
      { id: "2", text: "Dou muito de mim mesmo para obter aprovação e sentir-me amado." },
      { id: "6", text: "Sou cauteloso e buscando garantias para me sentir seguro." }
    ]
  },
  {
    id: 33,
    options: [
      { id: "3", text: "Adapto minha imagem para ser bem-sucedido em diferentes situações." },
      { id: "7", text: "Busco experiências variadas e evito limitações e o tédio." }
    ]
  },
  {
    id: 34,
    options: [
      { id: "5", text: "Valorizo minha independência intelectual e preciso de tempo para processar informações." },
      { id: "9", text: "Valorizo a paz interior e externa, e aceito as coisas como são." }
    ]
  },
  {
    id: 35,
    options: [
      { id: "3", text: "Concentro-me em metas e resultados, sendo eficiente e pragmático." },
      { id: "8", text: "Concentro-me em manter minha força e controle sobre meu ambiente." }
    ]
  },
  {
    id: 36,
    options: [
      { id: "7", text: "Gosto de planejar experiências interessantes e manter minhas opções abertas." },
      { id: "6", text: "Gosto de planejar com antecedência e estar preparado para possíveis problemas." }
    ]
  }
];

// Tipo para as respostas do formulário
type FormValues = {
  [key: number]: string;
};

// Esquema de validação
const createValidationSchema = (currentStep: number) => {
  return z.object({
    [currentStep]: z.string({
      required_error: "Por favor, selecione uma opção",
    }),
  });
};

export function EnneagramTest() {
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
    queryKey: ["/api/tests/enneagram/in-progress"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/enneagram/in-progress");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Carregar resultado do teste (se já completado)
  const { data: testResult } = useQuery({
    queryKey: ["/api/tests/enneagram/result"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/enneagram/result");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Salvar as respostas
  const saveMutation = useMutation({
    mutationFn: async (data: { answers: FormValues; completed: boolean }) => {
      const res = await apiRequest("POST", "/api/tests/enneagram/save", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tests/enneagram/in-progress"] });
      if (isLastQuestion) {
        queryClient.invalidateQueries({ queryKey: ["/api/tests/enneagram/result"] });
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
    const typeDescriptions: Record<number, { name: string, description: string }> = {
      1: {
        name: "O Perfeccionista",
        description: "Você é íntegro, idealista e orientado por princípios. Busca constantemente o aperfeiçoamento pessoal e tem um forte senso de certo e errado. Seu desafio é equilibrar sua busca pela excelência com maior aceitação e paciência."
      },
      2: {
        name: "O Prestativo",
        description: "Você é altruísta, caloroso e empático. Encontra significado ao ajudar os outros e construir relacionamentos. Seu desafio é reconhecer suas próprias necessidades e estabelecer limites saudáveis."
      },
      3: {
        name: "O Realizador",
        description: "Você é ambicioso, adaptável e orientado para o sucesso. É eficiente e focado em resultados. Seu desafio é equilibrar conquistas externas com autenticidade interior e valorizar-se além de suas realizações."
      },
      4: {
        name: "O Individualista",
        description: "Você é criativo, introspectivo e emocionalmente honesto. Valoriza a autenticidade e busca significado pessoal profundo. Seu desafio é equilibrar a expressão emocional com estabilidade e aceitar o cotidiano."
      },
      5: {
        name: "O Investigador",
        description: "Você é perspicaz, curioso e analítico. Valoriza o conhecimento e a privacidade, processando informações antes de agir. Seu desafio é equilibrar a vida mental com a participação no mundo físico e emocional."
      },
      6: {
        name: "O Leal",
        description: "Você é comprometido, responsável e vigilante. Antecipa problemas potenciais e valoriza segurança e confiabilidade. Seu desafio é desenvolver mais confiança em si mesmo e lidar com a ansiedade de forma construtiva."
      },
      7: {
        name: "O Entusiasta",
        description: "Você é otimista, versátil e espontâneo. Busca experiências estimulantes e mantém múltiplas opções abertas. Seu desafio é encontrar satisfação no presente e comprometer-se com escolhas mais profundas."
      },
      8: {
        name: "O Desafiador",
        description: "Você é assertivo, decidido e protetor. Assume o controle de situações e defende causas importantes. Seu desafio é expressar vulnerabilidade e moderar sua intensidade em relacionamentos."
      },
      9: {
        name: "O Pacificador",
        description: "Você é receptivo, estável e harmonizador. Aceita múltiplas perspectivas e cria ambientes pacíficos. Seu desafio é reconhecer suas próprias prioridades e desenvolver maior assertividade."
      }
    };

    const chartData = testResult.scores.map((score, index) => ({
      name: `Tipo ${index + 1}`,
      value: score
    }));

    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Resultado do Teste de Eneagrama</h2>
            <p className="mb-4">
              Seu teste foi concluído com sucesso. Abaixo está a análise do seu tipo de Eneagrama:
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-xl mb-2">
                Seu tipo principal: {testResult.primaryType} - {typeDescriptions[testResult.primaryType]?.name}
              </h3>
              <p className="text-gray-700">
                {typeDescriptions[testResult.primaryType]?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Asa: Tipo {testResult.wing}</h3>
                <p className="text-sm">
                  Sua asa é o tipo adjacente que influencia seu tipo principal, adicionando características complementares à sua personalidade.
                </p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Direções de Integração/Desintegração</h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Integração (Crescimento):</span> Tipo {testResult.integrationDirection}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Desintegração (Estresse):</span> Tipo {testResult.disintegrationDirection}
                </p>
              </div>
            </div>
            
            <div className="mt-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Distribuição dos tipos</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#006B6B" name="Pontuação" />
                  </BarChart>
                </ResponsiveContainer>
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
      title="Teste de Eneagrama"
      description="Este teste ajudará a identificar seu tipo de personalidade de acordo com o sistema Eneagrama."
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
            <p className="text-base mb-2">Escolha a afirmação que melhor descreve você:</p>
          </div>

          <FormField
            control={form.control}
            name={`${currentQuestion.id}`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option) => (
                      <FormItem
                        key={option.id}
                        className="flex items-start space-x-3 space-y-0 bg-accent/30 p-4 rounded-md"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <div className="leading-6 font-normal cursor-pointer flex-1">{option.text}</div>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
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