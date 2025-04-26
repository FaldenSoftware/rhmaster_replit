import { Router } from "express";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { 
  tests, 
  questions, 
  options, 
  testAssignments, 
  testResponses, 
  testResponseAnswers, 
  testResults,
  gamificationPoints,
  pointsHistory,
  clients
} from "@shared/schema";

const router = Router();

// Função auxiliar para obter o ID do cliente a partir do ID do usuário
async function getClientIdFromUserId(userId: number): Promise<number> {
  try {
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.userId, userId));
    
    if (!client) {
      throw new Error(`Cliente não encontrado para o usuário ${userId}`);
    }
    
    return client.id;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    throw error;
  }
}

// Algoritmo para calcular os resultados do teste de Eneagrama
function calculateEnneagram(answers: Record<string, string>) {
  // Inicializar contadores para cada tipo
  const typeCounts = Array(9).fill(0);
  
  // Contar respostas para cada tipo
  Object.values(answers).forEach(typeStr => {
    const typeNumber = parseInt(typeStr);
    if (typeNumber >= 1 && typeNumber <= 9) {
      typeCounts[typeNumber - 1]++;
    }
  });
  
  // Encontrar o tipo predominante (maior contagem)
  let primaryType = 0;
  let highestCount = -1;
  
  typeCounts.forEach((count, index) => {
    if (count > highestCount) {
      highestCount = count;
      primaryType = index + 1;
    }
  });
  
  // Determinar a asa (tipo adjacente com maior contagem)
  const possibleWings = [
    primaryType === 1 ? 9 : primaryType - 1,
    primaryType === 9 ? 1 : primaryType + 1
  ];
  
  const wing = typeCounts[possibleWings[0] - 1] >= typeCounts[possibleWings[1] - 1] 
    ? possibleWings[0] 
    : possibleWings[1];
  
  // Determinar direções de integração e desintegração
  // Baseado no mapa tradicional do Eneagrama
  const integrationMap = {
    1: 7,
    2: 4,
    3: 6,
    4: 1,
    5: 8,
    6: 9,
    7: 5,
    8: 2,
    9: 3
  };
  
  const disintegrationMap = {
    1: 4,
    2: 8,
    3: 9,
    4: 2,
    5: 7,
    6: 3,
    7: 1,
    8: 5,
    9: 6
  };
  
  return {
    primaryType,
    wing,
    scores: typeCounts,
    integrationDirection: integrationMap[primaryType as keyof typeof integrationMap],
    disintegrationDirection: disintegrationMap[primaryType as keyof typeof disintegrationMap]
  };
}

// Obter ou criar o teste de Eneagrama
async function getOrCreateEnneagramTest(mentorId: number) {
  // Verificar se o teste já existe
  const [existingTest] = await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.type, "enneagram_test"),
        eq(tests.isTemplate, true)
      )
    );

  if (existingTest) {
    return existingTest;
  }

  // Criar o teste de Eneagrama
  const [newTest] = await db
    .insert(tests)
    .values({
      title: "Teste de Eneagrama",
      description: "Identifica seu tipo de personalidade de acordo com o sistema Eneagrama, revelando padrões profundos de pensamento, sentimento e comportamento.",
      type: "enneagram_test",
      estimatedTimeMinutes: 25,
      active: true,
      isTemplate: true,
      createdBy: mentorId,
      maxScore: 36, // 36 pares de afirmações
      instructions: "Escolha a afirmação que melhor descreve você em cada par. Responda de acordo com como você é habitualmente, não como gostaria de ser ou como acha que deveria ser.",
      tags: ["eneagrama", "personalidade", "autoconhecimento"]
    })
    .returning();

  return newTest;
}

// Rota para obter o teste em andamento
router.get("/in-progress", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    // Obter o ID do cliente a partir do ID do usuário
    const clientId = await getClientIdFromUserId(req.user.id);
    
    // Buscar atribuição de teste para o cliente
    const [assignment] = await db
      .select()
      .from(testAssignments)
      .where(
        and(
          eq(testAssignments.clientId, clientId),
          eq(testAssignments.status, "in_progress")
        )
      );

    if (!assignment) {
      return res.status(404).json({ message: "Nenhum teste em andamento encontrado" });
    }

    // Buscar teste
    const [test] = await db
      .select()
      .from(tests)
      .where(eq(tests.id, assignment.testId));

    if (!test || test.type !== "enneagram_test") {
      return res.status(404).json({ message: "Teste de Eneagrama não encontrado" });
    }

    // Buscar resposta em andamento
    const [response] = await db
      .select()
      .from(testResponses)
      .where(eq(testResponses.assignmentId, assignment.id));

    if (!response) {
      return res.status(404).json({ message: "Nenhuma resposta em andamento encontrada" });
    }

    // Buscar respostas já dadas
    const answerRecords = await db
      .select()
      .from(testResponseAnswers)
      .where(eq(testResponseAnswers.responseId, response.id));

    // Transformar no formato esperado pelo frontend
    const answers = {};
    answerRecords.forEach(answer => {
      if (answer.selectedOptions && answer.selectedOptions.length > 0) {
        answers[answer.questionId] = answer.selectedOptions[0];
      }
    });

    return res.json({
      answers,
      lastQuestionIndex: answerRecords.length,
      startTime: response.startedAt,
    });
  } catch (error) {
    console.error("Erro ao buscar teste em andamento:", error);
    return res.status(500).json({ message: "Erro ao buscar teste em andamento" });
  }
});

// Rota para salvar as respostas
router.post("/save", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const { answers, completed = false, lastQuestionIndex, startTime, endTime } = req.body;

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ message: "Nenhuma resposta fornecida" });
  }

  try {
    // Buscar ou criar o teste
    const test = await getOrCreateEnneagramTest(1); // Mentor ID padrão como 1 para o template

    // Buscar atribuição de teste existente ou criar uma nova
    let assignment = await db
      .select()
      .from(testAssignments)
      .where(
        and(
          eq(testAssignments.clientId, req.user.id),
          eq(testAssignments.testId, test.id),
          eq(testAssignments.status, "in_progress")
        )
      )
      .then(rows => rows[0]);

    if (!assignment) {
      // Criar nova atribuição
      assignment = await db
        .insert(testAssignments)
        .values({
          testId: test.id,
          clientId: req.user.id,
          assignedBy: req.user.id, // Auto-atribuição
          status: "in_progress",
          kanbanColumn: "doing",
          priority: "medium",
        })
        .returning()
        .then(rows => rows[0]);
    }

    // Buscar resposta existente ou criar uma nova
    let response = await db
      .select()
      .from(testResponses)
      .where(eq(testResponses.assignmentId, assignment.id))
      .then(rows => rows[0]);

    if (!response) {
      // Criar nova resposta
      response = await db
        .insert(testResponses)
        .values({
          assignmentId: assignment.id,
          clientId: req.user.id,
          startedAt: startTime ? new Date(startTime) : new Date(),
        })
        .returning()
        .then(rows => rows[0]);
    }

    // Salvar cada resposta
    for (const [questionId, optionId] of Object.entries(answers)) {
      // Verificar se já existe uma resposta para esta questão
      const existingAnswer = await db
        .select()
        .from(testResponseAnswers)
        .where(
          and(
            eq(testResponseAnswers.responseId, response.id),
            eq(testResponseAnswers.questionId, parseInt(questionId))
          )
        )
        .then(rows => rows[0]);

      if (existingAnswer) {
        // Atualizar resposta existente
        await db
          .update(testResponseAnswers)
          .set({
            selectedOptions: [optionId],
            updatedAt: new Date(),
          })
          .where(eq(testResponseAnswers.id, existingAnswer.id));
      } else {
        // Criar nova resposta
        await db
          .insert(testResponseAnswers)
          .values({
            responseId: response.id,
            questionId: parseInt(questionId),
            selectedOptions: [optionId],
            answeredAt: new Date(),
          });
      }
    }

    // Se o teste for marcado como concluído
    if (completed) {
      // Calcular os resultados
      const enneagramResult = calculateEnneagram(answers);

      // Atualizar o status do teste para concluído
      await db
        .update(testAssignments)
        .set({
          status: "completed",
          completedAt: new Date(),
          kanbanColumn: "done",
        })
        .where(eq(testAssignments.id, assignment.id));

      // Atualizar a resposta com o tempo total
      await db
        .update(testResponses)
        .set({
          submittedAt: new Date(),
          timeSpentSeconds: endTime 
            ? Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
            : null,
        })
        .where(eq(testResponses.id, response.id));

      // Descrições dos tipos para a avaliação
      const typeNames = {
        1: "O Perfeccionista",
        2: "O Prestativo",
        3: "O Realizador",
        4: "O Individualista",
        5: "O Investigador",
        6: "O Leal",
        7: "O Entusiasta",
        8: "O Desafiador",
        9: "O Pacificador"
      };

      // Salvar os resultados
      const [testResult] = await db
        .insert(testResults)
        .values({
          assignmentId: assignment.id,
          responseId: response.id,
          clientId: req.user.id,
          score: Math.round(enneagramResult.scores[enneagramResult.primaryType - 1]),
          percentage: Math.round((enneagramResult.scores[enneagramResult.primaryType - 1] / 36) * 100),
          assessment: `Seu tipo principal de Eneagrama é o Tipo ${enneagramResult.primaryType} - ${typeNames[enneagramResult.primaryType as keyof typeof typeNames]}, com uma asa do Tipo ${enneagramResult.wing}.`,
          strengths: getStrengthsByType(enneagramResult.primaryType),
          areasForImprovement: getAreasForImprovementByType(enneagramResult.primaryType),
          recommendations: getRecommendationsByType(enneagramResult.primaryType),
          enneagram: enneagramResult,
          analyzed: false,
        })
        .returning();

      // Adicionar pontos de gamificação
      await addGamificationPoints(req.user.id, 100, "Conclusão do Teste de Eneagrama");

      return res.json({
        message: "Teste concluído com sucesso",
        result: testResult,
      });
    }

    return res.json({
      message: "Respostas salvas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
    return res.status(500).json({ message: "Erro ao salvar respostas" });
  }
});

// Rota para obter o resultado do teste
router.get("/result", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    // Buscar resultado do teste para o usuário logado
    const [result] = await db
      .select({
        id: testResults.id,
        assessment: testResults.assessment,
        strengths: testResults.strengths,
        areasForImprovement: testResults.areasForImprovement,
        recommendations: testResults.recommendations,
        enneagram: testResults.enneagram,
        analyzed: testResults.analyzed,
        analyzedAt: testResults.analyzedAt,
        mentorFeedback: testResults.mentorFeedback,
      })
      .from(testResults)
      .where(eq(testResults.clientId, req.user.id))
      .orderBy(testResults.createdAt, "desc")
      .limit(1);

    if (!result || !result.enneagram) {
      return res.status(404).json({ message: "Nenhum resultado encontrado" });
    }

    return res.json(result.enneagram);
  } catch (error) {
    console.error("Erro ao buscar resultado:", error);
    return res.status(500).json({ message: "Erro ao buscar resultado do teste" });
  }
});

// Adicionar pontos de gamificação
async function addGamificationPoints(clientId: number, points: number, reason: string) {
  try {
    // Buscar pontos de gamificação existentes
    let gamification = await db
      .select()
      .from(gamificationPoints)
      .where(eq(gamificationPoints.clientId, clientId))
      .then(rows => rows[0]);

    if (!gamification) {
      // Criar novo registro de gamificação
      gamification = await db
        .insert(gamificationPoints)
        .values({
          clientId,
          totalPoints: points,
          weeklyPoints: points,
          monthlyPoints: points,
          lastActivity: new Date(),
        })
        .returning()
        .then(rows => rows[0]);
    } else {
      // Atualizar pontos existentes
      await db
        .update(gamificationPoints)
        .set({
          totalPoints: gamification.totalPoints + points,
          weeklyPoints: gamification.weeklyPoints + points,
          monthlyPoints: gamification.monthlyPoints + points,
          lastActivity: new Date(),
        })
        .where(eq(gamificationPoints.id, gamification.id));
    }

    // Registrar histórico de pontos
    await db
      .insert(pointsHistory)
      .values({
        clientId,
        points,
        reason,
        timestamp: new Date(),
      });

    return true;
  } catch (error) {
    console.error("Erro ao adicionar pontos de gamificação:", error);
    return false;
  }
}

// Funções auxiliares para gerar feedback com base no tipo de Eneagrama
function getStrengthsByType(type: number): string[] {
  const strengths: Record<number, string[]> = {
    1: [
      "Ética e integridade fortes",
      "Atenção aos detalhes e precisão",
      "Compromisso com a qualidade",
      "Desejo de melhorar as coisas",
      "Sentido claro de certo e errado"
    ],
    2: [
      "Empatia e compreensão das necessidades dos outros",
      "Generosidade e disposição para ajudar",
      "Habilidades interpessoais bem desenvolvidas",
      "Capacidade de criar conexões emocionais",
      "Sensibilidade às dinâmicas relacionais"
    ],
    3: [
      "Foco em resultados e eficiência",
      "Adaptabilidade a diferentes ambientes",
      "Capacidade de inspirar e motivar os outros",
      "Orientação para metas e conquistas",
      "Pragmatismo e produtividade"
    ],
    4: [
      "Criatividade e expressão autêntica",
      "Profunda consciência emocional",
      "Capacidade de encontrar significado",
      "Empatia com o sofrimento humano",
      "Apreciação pela beleza e originalidade"
    ],
    5: [
      "Pensamento analítico e observação",
      "Capacidade de síntese de informações complexas",
      "Independência intelectual",
      "Objetividade e distanciamento emocional",
      "Habilidade para desenvolver expertise"
    ],
    6: [
      "Lealdade e compromisso",
      "Preparação e antecipação de problemas",
      "Atenção à segurança e proteção",
      "Pensamento sistêmico e avaliação de riscos",
      "Defesa de pessoas e causas importantes"
    ],
    7: [
      "Entusiasmo e pensamento positivo",
      "Adaptabilidade e versatilidade",
      "Criatividade e geração de ideias",
      "Capacidade de motivar e energizar",
      "Visão de novas possibilidades"
    ],
    8: [
      "Assertividade e tomada de decisão",
      "Liderança e capacidade de assumir controle",
      "Proteção dos mais vulneráveis",
      "Franqueza e honestidade direta",
      "Resiliência e força interior"
    ],
    9: [
      "Mediação e harmonização de conflitos",
      "Capacidade de ver múltiplas perspectivas",
      "Paciência e temperamento calmo",
      "Aceitação e não-julgamento",
      "Criação de ambientes pacíficos"
    ]
  };
  
  return strengths[type] || [];
}

function getAreasForImprovementByType(type: number): string[] {
  const areas: Record<number, string[]> = {
    1: [
      "Tendência ao perfeccionismo excessivo",
      "Autocrítica e julgamento severo",
      "Dificuldade em lidar com erros",
      "Rigidez e resistência a diferentes perspectivas",
      "Repressão da raiva e ressentimento"
    ],
    2: [
      "Dificuldade em reconhecer necessidades próprias",
      "Tendência a buscar aprovação e reconhecimento",
      "Manipulação através da generosidade",
      "Problemas com limites pessoais",
      "Orgulho disfarçado de humildade"
    ],
    3: [
      "Priorização da imagem em detrimento da autenticidade",
      "Identificação excessiva com conquistas",
      "Dificuldade em lidar com fracassos",
      "Negligência de relacionamentos pessoais",
      "Autoengano sobre motivações e desejos"
    ],
    4: [
      "Tendência à melancolia e sentimentos de inadequação",
      "Auto-absorção e dramatização emocional",
      "Inveja e comparação com os outros",
      "Dificuldade com rotinas e tarefas mundanas",
      "Idealização e decepção nos relacionamentos"
    ],
    5: [
      "Isolamento social e distanciamento emocional",
      "Avareza com tempo, energia e conhecimento",
      "Paralisia por análise excessiva",
      "Dificuldade com expressão emocional",
      "Negligência de necessidades físicas"
    ],
    6: [
      "Ansiedade e catastrofização",
      "Dúvida e indecisão frequentes",
      "Desconfiança das próprias percepções",
      "Projeção de medos em situações neutras",
      "Dependência de figuras de autoridade ou rebelião contra elas"
    ],
    7: [
      "Dificuldade em lidar com experiências dolorosas",
      "Distrações e falta de foco",
      "Compromisso superficial com pessoas e projetos",
      "Impulsividade e busca de prazer imediato",
      "Planejamento excessivo sem implementação"
    ],
    8: [
      "Intimidação e comportamento dominador",
      "Conflito com figuras de autoridade",
      "Dificuldade em mostrar vulnerabilidade",
      "Excessivo controle e negação de fraquezas",
      "Insensibilidade ao impacto nos outros"
    ],
    9: [
      "Procrastinação e inércia",
      "Dificuldade em estabelecer prioridades",
      "Evitação de conflitos necessários",
      "Negligência das próprias necessidades",
      "Resistência passiva a mudanças"
    ]
  };
  
  return areas[type] || [];
}

function getRecommendationsByType(type: number): string {
  const recommendations: Record<number, string> = {
    1: "Reconheça que a perfeição é inatingível e cultive compaixão por si mesmo e pelos outros. Pratique aceitar imperfeições como parte natural da vida. Desenvolva uma consciência do seu crítico interno e aprenda a transformar julgamentos em observações neutras. Dedique tempo a atividades prazerosas sem focar em desempenho ou produtividade. Explore práticas de mindfulness para conectar-se com o momento presente sem julgamento.",
    
    2: "Desenvolva o hábito de identificar e atender às suas próprias necessidades antes de ajudar os outros. Pratique dizer 'não' quando necessário, sem sentir culpa ou necessidade de explicações extensas. Cultive relacionamentos que sejam recíprocos, onde você também possa receber apoio. Explore suas motivações ao ajudar os outros, distinguindo entre generosidade autêntica e busca de aprovação. Reconheça seu valor intrínseco, independente do que faz pelos outros.",
    
    3: "Reserve tempo para reflexão sobre quem você é além de suas conquistas e papel social. Cultive relacionamentos onde você possa ser autêntico sem necessidade de impressionar. Pratique vulnerabilidade compartilhando sentimentos reais em vez de projetar uma imagem ideal. Defina sucesso em seus próprios termos, não apenas por reconhecimento externo. Aprenda a valorizar o processo tanto quanto os resultados.",
    
    4: "Desenvolva disciplina para completar tarefas mundanas, reconhecendo que significado pode ser encontrado mesmo nas atividades cotidianas. Pratique gratidão pelo que você tem em vez de focar no que está faltando. Cultive relacionamentos saudáveis sem idealizações ou expectativas irrealistas. Busque equilíbrio emocional, permitindo-se sentir sem ser dominado pelas emoções. Desenvolva talentos criativos como expressão construtiva da sua singularidade.",
    
    5: "Pratique participação ativa no mundo em vez de apenas observá-lo. Desenvolva presença física e consciência corporal através de atividades físicas regulares. Cultive conexões emocionais mais profundas, compartilhando mais de si mesmo com pessoas de confiança. Pratique tomar decisões com informações limitadas, sem buscar conhecimento exaustivo. Reconheça que energia e recursos se renovam através do compartilhamento.",
    
    6: "Desenvolva confiança em sua própria percepção e julgamento, validando sua experiência interna. Pratique mindfulness para distinguir entre preocupações reais e ansiedades infundadas. Cultive coragem enfrentando medos em pequenas doses controladas. Busque evidências que contradizem suas preocupações, não apenas as que as confirmam. Desenvolva fontes internas de segurança através de afirmações positivas e autocompaixão.",
    
    7: "Cultive a capacidade de estar totalmente presente, mesmo em situações desconfortáveis. Pratique comprometer-se profundamente com projetos e relacionamentos, mesmo quando o entusiasmo inicial diminuir. Desenvolva disciplina para concluir o que começa antes de iniciar algo novo. Explore emoções difíceis com curiosidade em vez de evitá-las. Pratique gratidão pelo momento presente em vez de sempre buscar a próxima experiência.",
    
    8: "Cultive vulnerabilidade e abertura emocional com pessoas de confiança. Pratique escuta ativa sem interromper ou dominar conversas. Desenvolva sensibilidade ao impacto que sua intensidade tem nos outros. Reconheça quando controle e força não são necessários ou produtivos. Explore formas construtivas de usar sua energia e liderança para capacitar os outros.",
    
    9: "Desenvolva maior consciência de suas próprias opiniões, desejos e prioridades. Pratique tomar decisões e agir sem consulta ou aprovação externa excessiva. Aprenda a reconhecer e expressar raiva e discordância de forma construtiva. Estabeleça metas pessoais claras e crie sistemas para acompanhar seu progresso. Cultive assertividade e presença ativa em sua vida."
  };
  
  return recommendations[type] || "Trabalhe no autoconhecimento contínuo, observando padrões de pensamento, sentimento e comportamento. Busque feedback honesto de pessoas próximas e desenvolva práticas diárias que apoiem seu crescimento pessoal.";
}

export default router;