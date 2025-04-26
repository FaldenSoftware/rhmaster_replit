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

// Algoritmo para calcular os resultados do perfil comportamental
function calculateBehavioralProfile(answers: Record<string, string>) {
  const profileCounts = {
    aguia: 0,
    gato: 0,
    lobo: 0,
    tubarao: 0
  };

  // Contar as respostas de cada tipo
  Object.values(answers).forEach(profile => {
    if (profileCounts.hasOwnProperty(profile)) {
      profileCounts[profile as keyof typeof profileCounts]++;
    }
  });

  // Calcular os percentuais
  const total = Object.values(profileCounts).reduce((sum, count) => sum + count, 0);
  const percentages = {
    aguia: Math.round((profileCounts.aguia / total) * 100),
    gato: Math.round((profileCounts.gato / total) * 100),
    lobo: Math.round((profileCounts.lobo / total) * 100),
    tubarao: Math.round((profileCounts.tubarao / total) * 100),
  };

  // Determinar o perfil predominante e secundário
  const sorted = Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  return {
    aguia: percentages.aguia,
    gato: percentages.gato,
    lobo: percentages.lobo,
    tubarao: percentages.tubarao,
    predominant: sorted[0] as "aguia" | "gato" | "lobo" | "tubarao",
    secondary: sorted[1] as "aguia" | "gato" | "lobo" | "tubarao"
  };
}

// Obter ou criar o teste comportamental
async function getOrCreateBehavioralProfileTest(mentorId: number) {
  // Verificar se o teste já existe
  const [existingTest] = await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.type, "behavior"),
        eq(tests.isTemplate, true)
      )
    );

  if (existingTest) {
    return existingTest;
  }

  // Criar o teste comportamental
  const [newTest] = await db
    .insert(tests)
    .values({
      title: "Teste de Perfil Comportamental",
      description: "Avalia seu estilo comportamental predominante entre os perfis: Águia, Gato, Lobo e Tubarão.",
      type: "behavior",
      estimatedTimeMinutes: 20,
      active: true,
      isTemplate: true,
      createdBy: mentorId,
      maxScore: 24,
      instructions: "Selecione a opção que melhor representa sua atitude ou comportamento em cada situação apresentada.",
      tags: ["comportamento", "liderança", "perfil"]
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
    
    // Buscar atribuição de teste para o usuário logado
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

    if (!test || test.type !== "behavior") {
      return res.status(404).json({ message: "Teste comportamental não encontrado" });
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
    // Obter o ID do cliente a partir do ID do usuário
    const clientId = await getClientIdFromUserId(req.user.id);
    
    // Buscar ou criar o teste
    const test = await getOrCreateBehavioralProfileTest(1); // Mentor ID padrão como 1 para o template

    // Buscar atribuição de teste existente ou criar uma nova
    let assignment = await db
      .select()
      .from(testAssignments)
      .where(
        and(
          eq(testAssignments.clientId, clientId),
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
          clientId: clientId,  // Usando o ID do cliente obtido
          assignedBy: 1, // Mentor ID 1
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
          clientId: clientId,  // Usando o ID do cliente obtido
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
      const profileResult = calculateBehavioralProfile(answers);

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

      // Salvar os resultados
      const [testResult] = await db
        .insert(testResults)
        .values({
          assignmentId: assignment.id,
          responseId: response.id,
          clientId: clientId,  // Usando o ID do cliente obtido
          score: Object.keys(answers).length, // Número de questões respondidas
          percentage: (Object.keys(answers).length / 24) * 100, // 24 questões total
          assessment: `Seu perfil predominante é ${profileResult.predominant} (${profileResult[profileResult.predominant]}%) com ${profileResult.secondary} (${profileResult[profileResult.secondary]}%) como secundário.`,
          strengths: getStrengthsByProfile(profileResult.predominant),
          areasForImprovement: getAreasForImprovementByProfile(profileResult.predominant),
          recommendations: getRecommendationsByProfile(profileResult.predominant),
          behavioral_profile: profileResult,
          analyzed: false,
        })
        .returning();

      // Adicionar pontos de gamificação
      await addGamificationPoints(clientId, 100, "Conclusão do Teste de Perfil Comportamental");

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
        behavioralProfile: testResults.behavioralProfile,
        analyzed: testResults.analyzed,
        analyzedAt: testResults.analyzedAt,
        mentorFeedback: testResults.mentorFeedback,
      })
      .from(testResults)
      .where(eq(testResults.clientId, req.user.id))
      .orderBy(testResults.createdAt, "desc")
      .limit(1);

    if (!result || !result.behavioralProfile) {
      return res.status(404).json({ message: "Nenhum resultado encontrado" });
    }

    return res.json(result.behavioralProfile);
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

// Funções auxiliares para gerar feedback com base no perfil
function getStrengthsByProfile(profile: string): string[] {
  const strengths: Record<string, string[]> = {
    aguia: [
      "Visão estratégica e de longo prazo",
      "Capacidade de inovação e pensamento criativo",
      "Habilidade para identificar tendências e padrões",
      "Capacidade de inspirar e motivar equipes",
      "Adaptabilidade a mudanças e situações novas"
    ],
    gato: [
      "Excelentes habilidades interpessoais",
      "Empatia e sensibilidade às necessidades dos outros",
      "Capacidade de criar ambientes harmoniosos",
      "Habilidades de escuta ativa e comunicação",
      "Facilidade para construir relacionamentos de confiança"
    ],
    lobo: [
      "Atenção aos detalhes e procedimentos",
      "Organização e metodologia estruturada",
      "Consistência e confiabilidade",
      "Foco na qualidade e nos padrões",
      "Capacidade de implementar sistemas e processos"
    ],
    tubarao: [
      "Determinação e foco em resultados",
      "Capacidade de tomar decisões rápidas",
      "Assertividade e objetividade",
      "Eficiência e pragmatismo",
      "Competitividade e ambição"
    ]
  };
  
  return strengths[profile] || [];
}

function getAreasForImprovementByProfile(profile: string): string[] {
  const areas: Record<string, string[]> = {
    aguia: [
      "Pode negligenciar detalhes importantes",
      "Tendência a mudar frequentemente de direção",
      "Pode parecer desconectado das necessidades imediatas da equipe",
      "Impaciência com processos e procedimentos",
      "Dificuldade em concluir projetos de longo prazo"
    ],
    gato: [
      "Pode evitar conflitos necessários",
      "Dificuldade em tomar decisões difíceis",
      "Pode ter problemas com imposição de limites",
      "Tendência a priorizar relacionamentos sobre resultados",
      "Pode ser hesitante ao implementar mudanças difíceis"
    ],
    lobo: [
      "Resistência a mudanças e novas abordagens",
      "Pode ser percebido como inflexível e burocrático",
      "Dificuldade em lidar com situações ambíguas",
      "Pode perder o panorama geral focando em detalhes",
      "Tendência ao perfeccionismo excessivo"
    ],
    tubarao: [
      "Pode ser percebido como insensível ou agressivo",
      "Tendência a dominar discussões e decisões",
      "Impaciência com processos de consenso",
      "Pode negligenciar o desenvolvimento das pessoas",
      "Foco excessivo em resultados de curto prazo"
    ]
  };
  
  return areas[profile] || [];
}

function getRecommendationsByProfile(profile: string): string {
  const recommendations: Record<string, string> = {
    aguia: "Desenvolva disciplina para acompanhar detalhes e implementar suas visões. Procure complementar suas ideias com planejamento estruturado. Aumente sua consciência sobre como suas mudanças de direção podem afetar a equipe. Dedique tempo para conectar-se individualmente com membros da equipe. Envolva pessoas com perfil Lobo para ajudar na execução de suas ideias.",
    
    gato: "Pratique dar feedback construtivo, mesmo em situações desconfortáveis. Desenvolva habilidades para tomar decisões difíceis quando necessário. Estabeleça limites claros e aprenda a dizer não. Equilibre sua preocupação com relacionamentos com a necessidade de resultados. Cerque-se de pessoas com perfil Tubarão para complementar sua abordagem em negociações e tomadas de decisão.",
    
    lobo: "Dedique tempo para entender o contexto estratégico além dos procedimentos. Pratique adaptabilidade e flexibilidade quando as circunstâncias mudarem. Desenvolva tolerância para ambiguidade e mudanças. Considere delegar tarefas detalhadas para focar em questões mais amplas. Aproxime-se de pessoas com perfil Águia para expandir sua visão de possibilidades.",
    
    tubarao: "Desenvolva habilidades de escuta ativa e empatia. Pratique incluir diferentes perspectivas antes de tomar decisões. Invista tempo no desenvolvimento de relacionamentos de longo prazo. Considere o impacto emocional de suas ações e comunicações. Busque pessoas com perfil Gato para complementar sua abordagem nas interações com a equipe."
  };
  
  return recommendations[profile] || "";
}

export default router;