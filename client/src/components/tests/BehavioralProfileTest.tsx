import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TestLayout } from "./TestLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Definição das questões do teste de perfil comportamental
const questions = [
  {
    id: 1,
    text: "Em uma situação de liderança, eu prefiro:",
    options: [
      { id: "aguia", text: "Tomar decisões rápidas e ter uma visão global da situação." },
      { id: "gato", text: "Analisar cuidadosamente antes de agir e buscar consenso." },
      { id: "lobo", text: "Estabelecer regras claras e garantir que sejam seguidas." },
      { id: "tubarao", text: "Definir metas ambiciosas e focar nos resultados." }
    ]
  },
  {
    id: 2,
    text: "Quando surgem conflitos na equipe:",
    options: [
      { id: "gato", text: "Procuro entender os diversos pontos de vista e mediar o diálogo." },
      { id: "lobo", text: "Aplico as regras estabelecidas e indico a solução correta." },
      { id: "tubarao", text: "Tomo decisões rápidas para resolver o problema e seguir em frente." },
      { id: "aguia", text: "Analiso o contexto geral e proponho uma visão de longo prazo." }
    ]
  },
  {
    id: 3,
    text: "Em relação a prazos e cronogramas:",
    options: [
      { id: "lobo", text: "Sigo rigorosamente e cobro que os outros também o façam." },
      { id: "tubarao", text: "Foco na entrega de resultados, mesmo que seja necessário pressionar a equipe." },
      { id: "aguia", text: "Priorizo as atividades estratégicas e delego o restante." },
      { id: "gato", text: "Busco equilíbrio entre cumprir prazos e manter o bem-estar da equipe." }
    ]
  },
  {
    id: 4,
    text: "Quando preciso me comunicar com a equipe:",
    options: [
      { id: "tubarao", text: "Sou direto e objetivo, focando nas metas a serem alcançadas." },
      { id: "aguia", text: "Apresento o panorama geral e como o trabalho de cada um contribui." },
      { id: "gato", text: "Procuro criar um ambiente acolhedor para que todos se sintam à vontade." },
      { id: "lobo", text: "Sou claro sobre as expectativas e padrões de qualidade esperados." }
    ]
  },
  {
    id: 5,
    text: "Em reuniões, eu geralmente:",
    options: [
      { id: "aguia", text: "Trago visões inovadoras e foco no futuro da organização." },
      { id: "gato", text: "Observo a dinâmica do grupo e busco incluir todos nas discussões." },
      { id: "lobo", text: "Mantenho a pauta e garanto que os procedimentos sejam seguidos." },
      { id: "tubarao", text: "Concentro-me nas decisões que precisam ser tomadas para avançar." }
    ]
  },
  {
    id: 6,
    text: "Quando enfrento um problema complexo:",
    options: [
      { id: "gato", text: "Considero os impactos nas pessoas e busco soluções harmonizadoras." },
      { id: "lobo", text: "Recorro às melhores práticas e procedimentos estabelecidos." },
      { id: "tubarao", text: "Enfrento o problema diretamente e tomo decisões rápidas." },
      { id: "aguia", text: "Analiso o problema de múltiplos ângulos e busco soluções inovadoras." }
    ]
  },
  {
    id: 7,
    text: "No desenvolvimento da minha equipe:",
    options: [
      { id: "lobo", text: "Estabeleço regras claras e forneço instruções detalhadas." },
      { id: "tubarao", text: "Defino metas desafiadoras e recompenso o alto desempenho." },
      { id: "aguia", text: "Incentivo a autonomia e a visão estratégica." },
      { id: "gato", text: "Ofereço apoio personalizado e fomento um ambiente colaborativo." }
    ]
  },
  {
    id: 8,
    text: "Em situações de mudança organizacional:",
    options: [
      { id: "tubarao", text: "Foco em implementar as mudanças rapidamente e com eficiência." },
      { id: "aguia", text: "Vejo as oportunidades e ajudo a definir a nova direção." },
      { id: "gato", text: "Preocupo-me com como as pessoas se adaptarão e ofereço suporte." },
      { id: "lobo", text: "Asseguro que as transições sigam procedimentos adequados." }
    ]
  },
  {
    id: 9,
    text: "Quando preciso tomar decisões importantes:",
    options: [
      { id: "aguia", text: "Considero o panorama geral e as implicações de longo prazo." },
      { id: "gato", text: "Levo em conta como as pessoas serão afetadas e busco consenso." },
      { id: "lobo", text: "Baseio-me em regras, procedimentos e precedentes." },
      { id: "tubarao", text: "Foco nos resultados e tomo decisões rapidamente." }
    ]
  },
  {
    id: 10,
    text: "Quando recebo feedback negativo:",
    options: [
      { id: "gato", text: "Preocupo-me com o relacionamento e busco restaurá-lo." },
      { id: "lobo", text: "Verifico se segui corretamente as normas e procedimentos." },
      { id: "tubarao", text: "Concentro-me em como melhorar o desempenho rapidamente." },
      { id: "aguia", text: "Analiso como isso afeta meus objetivos de longo prazo." }
    ]
  },
  {
    id: 11,
    text: "Em projetos em equipe, eu valorizo mais:",
    options: [
      { id: "lobo", text: "O cumprimento de padrões e a qualidade das entregas." },
      { id: "tubarao", text: "A eficiência e o alcance rápido dos objetivos." },
      { id: "aguia", text: "A inovação e a visão estratégica." },
      { id: "gato", text: "A harmonia da equipe e o desenvolvimento das pessoas." }
    ]
  },
  {
    id: 12,
    text: "Quanto à organização do meu trabalho:",
    options: [
      { id: "tubarao", text: "Priorizo atividades com maior impacto nos resultados." },
      { id: "aguia", text: "Foco em iniciativas estratégicas e delego tarefas operacionais." },
      { id: "gato", text: "Equilibro minhas necessidades com as da equipe." },
      { id: "lobo", text: "Sigo processos estruturados e mantenho tudo documentado." }
    ]
  },
  {
    id: 13,
    text: "Na resolução de problemas da equipe:",
    options: [
      { id: "aguia", text: "Busco entender o contexto amplo antes de propor soluções." },
      { id: "gato", text: "Considero o aspecto humano e busco soluções inclusivas." },
      { id: "lobo", text: "Aplico metodologias comprovadas e processos estruturados." },
      { id: "tubarao", text: "Ajo rapidamente para remover obstáculos e seguir adiante." }
    ]
  },
  {
    id: 14,
    text: "Ao receber uma nova responsabilidade:",
    options: [
      { id: "gato", text: "Penso em como envolver as pessoas certas e criar colaboração." },
      { id: "lobo", text: "Estabeleço os procedimentos e padrões de qualidade necessários." },
      { id: "tubarao", text: "Defino metas ambiciosas e um plano para alcançá-las rapidamente." },
      { id: "aguia", text: "Analiso como isso se alinha à estratégia e cria novas oportunidades." }
    ]
  },
  {
    id: 15,
    text: "Em uma negociação, eu normalmente:",
    options: [
      { id: "lobo", text: "Baseio meus argumentos em precedentes e regras estabelecidas." },
      { id: "tubarao", text: "Sou firme e direto para conseguir o que quero." },
      { id: "aguia", text: "Busco soluções criativas que beneficiem ambas as partes." },
      { id: "gato", text: "Priorizo manter o relacionamento, mesmo que precise ceder em alguns pontos." }
    ]
  },
  {
    id: 16,
    text: "Quando algo dá errado no trabalho:",
    options: [
      { id: "tubarao", text: "Foco em corrigir rapidamente e continuar avançando." },
      { id: "aguia", text: "Analiso as causas sistêmicas e busco melhorias estratégicas." },
      { id: "gato", text: "Preocupo-me com o impacto nas pessoas e ofereço suporte." },
      { id: "lobo", text: "Examino o que saiu do protocolo e reforço os procedimentos." }
    ]
  },
  {
    id: 17,
    text: "No planejamento de longo prazo:",
    options: [
      { id: "aguia", text: "Tenho facilidade para visualizar tendências futuras e oportunidades." },
      { id: "gato", text: "Considero os aspectos humanos e como desenvolver a equipe." },
      { id: "lobo", text: "Crio processos detalhados com etapas claras a serem seguidas." },
      { id: "tubarao", text: "Estabeleço metas ambiciosas e marcos mensuráveis." }
    ]
  },
  {
    id: 18,
    text: "Quando preciso motivar minha equipe:",
    options: [
      { id: "gato", text: "Ofereço apoio personalizado e reconheço suas contribuições individuais." },
      { id: "lobo", text: "Estabeleço expectativas claras e reconheço quando seguem os padrões." },
      { id: "tubarao", text: "Crio competições saudáveis e ofereço recompensas pelo desempenho." },
      { id: "aguia", text: "Inspiro com uma visão empolgante do futuro e do propósito maior." }
    ]
  },
  {
    id: 19,
    text: "Em relação à inovação no trabalho:",
    options: [
      { id: "lobo", text: "Prefiro melhorias incrementais e bem testadas nos processos existentes." },
      { id: "tubarao", text: "Foco em inovações que trazem resultados rápidos e mensuráveis." },
      { id: "aguia", text: "Busco constantemente novas ideias e perspectivas disruptivas." },
      { id: "gato", text: "Valorizo inovações que melhoram o ambiente de trabalho e o bem-estar." }
    ]
  },
  {
    id: 20,
    text: "Quando preciso dar feedback a um colega:",
    options: [
      { id: "tubarao", text: "Sou direto e objetivo, focando no que precisa melhorar." },
      { id: "aguia", text: "Relaciono o desempenho individual com os objetivos estratégicos." },
      { id: "gato", text: "Sou cuidadoso com as palavras e considero o impacto emocional." },
      { id: "lobo", text: "Baseio meus comentários em padrões e procedimentos estabelecidos." }
    ]
  },
  {
    id: 21,
    text: "Em relação a regras e procedimentos:",
    options: [
      { id: "aguia", text: "Questiono quando limitam a inovação e o pensamento estratégico." },
      { id: "gato", text: "Adapto quando necessário para atender às necessidades das pessoas." },
      { id: "lobo", text: "Acredito que são essenciais para manter a ordem e a consistência." },
      { id: "tubarao", text: "Sigo quando me ajudam a alcançar resultados mais rapidamente." }
    ]
  },
  {
    id: 22,
    text: "Em uma crise ou emergência:",
    options: [
      { id: "gato", text: "Foco em manter a calma e dar suporte emocional à equipe." },
      { id: "lobo", text: "Sigo os protocolos estabelecidos e mantenho a ordem." },
      { id: "tubarao", text: "Tomo ações decisivas e rápidas para resolver a situação." },
      { id: "aguia", text: "Analiso o quadro completo e busco soluções inovadoras." }
    ]
  },
  {
    id: 23,
    text: "No desenvolvimento da minha carreira, priorizo:",
    options: [
      { id: "lobo", text: "Especialização, domínio técnico e reconhecimento pela consistência." },
      { id: "tubarao", text: "Avanço rápido, novos desafios e posições de maior influência." },
      { id: "aguia", text: "Ampliar minha visão estratégica e capacidade de liderar mudanças." },
      { id: "gato", text: "Desenvolver habilidades interpessoais e criar redes de relacionamento." }
    ]
  },
  {
    id: 24,
    text: "No ambiente de trabalho, me sinto mais realizado quando:",
    options: [
      { id: "tubarao", text: "Alcanço objetivos ambiciosos e supero expectativas." },
      { id: "aguia", text: "Contribuo com ideias inovadoras e ajudo a definir a estratégia." },
      { id: "gato", text: "Construo relacionamentos positivos e ajudo no desenvolvimento das pessoas." },
      { id: "lobo", text: "Estabeleço sistemas eficientes e mantenho altos padrões de qualidade." }
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
      required_error: "Por favor, selecione uma resposta",
    }),
  });
};

// Interface para os resultados do teste
interface BehavioralProfileResult {
  aguia: number;
  gato: number;
  lobo: number;
  tubarao: number;
  predominant: "aguia" | "gato" | "lobo" | "tubarao";
  secondary: "aguia" | "gato" | "lobo" | "tubarao";
}

export function BehavioralProfileTest() {
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
    queryKey: ["/api/tests/behavioral-profile/in-progress"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/behavioral-profile/in-progress");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Carregar resultado do teste (se já completado)
  const { data: testResult } = useQuery({
    queryKey: ["/api/tests/behavioral-profile/result"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/tests/behavioral-profile/result");
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  // Salvar as respostas
  const saveMutation = useMutation({
    mutationFn: async (data: { answers: FormValues; completed: boolean }) => {
      const res = await apiRequest("POST", "/api/tests/behavioral-profile/save", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tests/behavioral-profile/in-progress"] });
      if (isLastQuestion) {
        queryClient.invalidateQueries({ queryKey: ["/api/tests/behavioral-profile/result"] });
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
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Resultado do Teste de Perfil Comportamental</h2>
            <p className="mb-4">
              Seu teste foi concluído com sucesso. Consulte os resultados com o seu mentor para uma análise detalhada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Perfil Predominante: {testResult.predominant}</h3>
                <p>
                  Seu perfil predominante reflete sua tendência comportamental principal em ambientes profissionais.
                </p>
              </div>
              
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Perfil Secundário: {testResult.secondary}</h3>
                <p>
                  Seu perfil secundário complementa o predominante e influencia suas reações em diferentes contextos.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Distribuição dos Perfis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{testResult.aguia}%</div>
                  <div className="font-medium">Águia</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{testResult.gato}%</div>
                  <div className="font-medium">Gato</div>
                </div>
                <div className="bg-amber-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-700">{testResult.lobo}%</div>
                  <div className="font-medium">Lobo</div>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">{testResult.tubarao}%</div>
                  <div className="font-medium">Tubarão</div>
                </div>
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
      title="Teste de Perfil Comportamental"
      description="Este teste avaliará seu estilo comportamental predominante entre os perfis: Águia, Gato, Lobo e Tubarão."
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
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <FormItem
                        key={option.id}
                        className="flex items-start space-x-3 space-y-0 bg-accent/30 p-4 rounded-md"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          {option.text}
                        </FormLabel>
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