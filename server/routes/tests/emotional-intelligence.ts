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

// Algoritmo para calcular os resultados do teste de inteligência emocional
function calculateEmotionalIntelligence(answers: Record<string, number>) {
  // Agrupar questões por dimensão
  const dimensions = questions.reduce((acc, question) => {
    if (!acc[question.dimension]) {
      acc[question.dimension] = [];
    }
    acc[question.dimension].push(question.id);
    return acc;
  }, {} as Record<string, number[]>);

  // Calcular pontuação para cada dimensão
  const results = {
    autoconsciencia: 0,
    autocontrole: 0,
    automotivacao: 0,
    empatia: 0,
    habilidadesSociais: 0,
    total: 0
  };
  
  // Para cada dimensão, calcular a média das respostas
  let totalScore = 0;
  let totalQuestions = 0;
  
  Object.entries(dimensions).forEach(([dimension, questionIds]) => {
    if (!results.hasOwnProperty(dimension)) return;
    
    let dimensionScore = 0;
    let answeredQuestions = 0;
    
    questionIds.forEach(id => {
      if (answers[id]) {
        dimensionScore += answers[id];
        answeredQuestions++;
        totalScore += answers[id];
        totalQuestions++;
      }
    });
    
    if (answeredQuestions > 0) {
      // Converter para escala 0-100
      const dimensionAvg = (dimensionScore / answeredQuestions);
      const normalizedScore = Math.round(((dimensionAvg - 1) / 4) * 100);
      results[dimension as keyof typeof results] = normalizedScore;
    }
  });
  
  // Calcular pontuação total
  if (totalQuestions > 0) {
    const totalAvg = (totalScore / totalQuestions);
    results.total = Math.round(((totalAvg - 1) / 4) * 100);
  }
  
  return results;
}

// Questões agrupadas por dimensão para o teste de inteligência emocional
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

// Obter ou criar o teste de inteligência emocional
async function getOrCreateEmotionalIntelligenceTest(mentorId: number) {
  // Verificar se o teste já existe
  const [existingTest] = await db
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.type, "emotional_intelligence_test"),
        eq(tests.isTemplate, true)
      )
    );

  if (existingTest) {
    return existingTest;
  }

  // Criar o teste de inteligência emocional
  const [newTest] = await db
    .insert(tests)
    .values({
      title: "Teste de Inteligência Emocional",
      description: "Avalia suas habilidades em cinco dimensões da inteligência emocional: autoconsciência, autocontrole, automotivação, empatia e habilidades sociais.",
      type: "emotional_intelligence_test",
      estimatedTimeMinutes: 20,
      active: true,
      isTemplate: true,
      createdBy: mentorId,
      maxScore: 150, // 30 questões x 5 pontos máximos
      instructions: "Leia cada afirmação e indique o quanto ela se aplica a você em uma escala de 1 (discordo totalmente) a 5 (concordo totalmente).",
      tags: ["inteligência emocional", "autoconhecimento", "liderança"]
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

    if (!test || test.type !== "emotional_intelligence_test") {
      return res.status(404).json({ message: "Teste de inteligência emocional não encontrado" });
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
      if (answer.scaleValue) {
        answers[answer.questionId] = answer.scaleValue;
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
    const test = await getOrCreateEmotionalIntelligenceTest(1); // Mentor ID padrão como 1 para o template

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
          clientId: clientId, // Usando o ID do cliente obtido
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
          clientId: clientId, // Usando o ID do cliente obtido
          startedAt: startTime ? new Date(startTime) : new Date(),
        })
        .returning()
        .then(rows => rows[0]);
    }

    // Salvar cada resposta
    for (const [questionId, value] of Object.entries(answers)) {
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
            scaleValue: value as number,
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
            scaleValue: value as number,
            answeredAt: new Date(),
          });
      }
    }

    // Se o teste for marcado como concluído
    if (completed) {
      // Calcular os resultados
      const emotionalIntelligenceResult = calculateEmotionalIntelligence(answers);

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

      // Determinar pontos fortes e áreas para desenvolvimento
      const dimensions = ["autoconsciencia", "autocontrole", "automotivacao", "empatia", "habilidadesSociais"];
      const sortedDimensions = dimensions.sort((a, b) => 
        emotionalIntelligenceResult[b as keyof typeof emotionalIntelligenceResult] - 
        emotionalIntelligenceResult[a as keyof typeof emotionalIntelligenceResult]
      );
      
      const strengths = sortedDimensions.slice(0, 2).map(dim => {
        return `${formatDimensionName(dim)}: ${emotionalIntelligenceResult[dim as keyof typeof emotionalIntelligenceResult]}%`;
      });

      const areasForImprovement = sortedDimensions.slice(-2).map(dim => {
        return `${formatDimensionName(dim)}: ${emotionalIntelligenceResult[dim as keyof typeof emotionalIntelligenceResult]}%`;
      });

      // Salvar os resultados
      const [testResult] = await db
        .insert(testResults)
        .values({
          assignmentId: assignment.id,
          responseId: response.id,
          clientId: clientId, // Usando o ID do cliente obtido
          score: Math.round(emotionalIntelligenceResult.total * (150 / 100)), // Converter percentual para pontos (máx 150)
          percentage: emotionalIntelligenceResult.total,
          assessment: `Sua pontuação total de inteligência emocional é ${emotionalIntelligenceResult.total}%. ${getGeneralFeedback(emotionalIntelligenceResult.total)}`,
          strengths,
          areasForImprovement,
          recommendations: generateRecommendations(emotionalIntelligenceResult),
          emotionalIntelligence: emotionalIntelligenceResult,
          analyzed: false,
        })
        .returning();

      // Adicionar pontos de gamificação
      await addGamificationPoints(clientId, 100, "Conclusão do Teste de Inteligência Emocional");

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
    // Obter o ID do cliente a partir do ID do usuário
    const clientId = await getClientIdFromUserId(req.user.id);
    
    // Buscar resultado do teste para o cliente
    const [result] = await db
      .select({
        id: testResults.id,
        assessment: testResults.assessment,
        strengths: testResults.strengths,
        areasForImprovement: testResults.areasForImprovement,
        recommendations: testResults.recommendations,
        emotionalIntelligence: testResults.emotionalIntelligence,
        analyzed: testResults.analyzed,
        analyzedAt: testResults.analyzedAt,
        mentorFeedback: testResults.mentorFeedback,
      })
      .from(testResults)
      .where(eq(testResults.clientId, clientId))
      .orderBy(testResults.createdAt, "desc")
      .limit(1);

    if (!result || !result.emotionalIntelligence) {
      return res.status(404).json({ message: "Nenhum resultado encontrado" });
    }

    return res.json(result.emotionalIntelligence);
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

// Funções auxiliares para feedback e recomendações
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

function getGeneralFeedback(totalScore: number): string {
  if (totalScore >= 90) {
    return "Você demonstra um nível excepcional de inteligência emocional, com grande capacidade de reconhecer e gerenciar suas emoções e relações interpessoais.";
  } else if (totalScore >= 75) {
    return "Você tem um bom nível de inteligência emocional, com habilidades bem desenvolvidas para lidar com emoções próprias e alheias.";
  } else if (totalScore >= 60) {
    return "Você apresenta um nível moderado de inteligência emocional, com algumas áreas bem desenvolvidas e outras que podem ser aprimoradas.";
  } else if (totalScore >= 40) {
    return "Você demonstra um nível básico de inteligência emocional, com oportunidades significativas para desenvolvimento.";
  } else {
    return "Você está no início da jornada de desenvolvimento da inteligência emocional, com diversas áreas que podem ser fortalecidas.";
  }
}

function generateRecommendations(results: any): string {
  const dimensions = ["autoconsciencia", "autocontrole", "automotivacao", "empatia", "habilidadesSociais"];
  const sortedDimensions = dimensions.sort((a, b) => results[a] - results[b]);
  const lowestDimension = sortedDimensions[0];
  
  const recommendations: Record<string, string> = {
    autoconsciencia: "Para desenvolver sua autoconsciência, recomendamos a prática regular de reflexão e autoavaliação. Mantenha um diário de emoções para registrar como você se sente em diferentes situações. Busque feedback sincero de pessoas próximas e pratique a escuta sem defensividade. Considere também práticas de mindfulness ou meditação para aumentar sua percepção emocional.",
    
    autocontrole: "Para melhorar seu autocontrole, identifique seus gatilhos emocionais e desenvolva estratégias específicas para cada um. Pratique técnicas de respiração profunda e pausas conscientes antes de reagir em situações desafiadoras. Estabeleça rotinas de cuidado pessoal que incluam atividade física regular, sono adequado e alimentação balanceada, pois estes fatores influenciam diretamente nossa capacidade de regulação emocional.",
    
    automotivacao: "Para fortalecer sua automotivação, clarifique seus valores e propósitos pessoais, alinhando-os com suas atividades diárias. Estabeleça metas significativas e divida-as em etapas mensuráveis. Celebre pequenas conquistas ao longo do caminho e pratique o diálogo interno positivo. Busque inspiração em modelos que admira e cultive uma mentalidade de crescimento, vendo desafios como oportunidades de aprendizado.",
    
    empatia: "Para desenvolver sua empatia, pratique a escuta ativa sem interrupções ou julgamentos. Faça um esforço consciente para entender diferentes perspectivas, especialmente quando discorda de alguém. Observe linguagem corporal e sinais não verbais nas interações. Leia livros e assista filmes sobre experiências diferentes das suas, e pratique colocar-se mentalmente no lugar dos outros em situações cotidianas.",
    
    habilidadesSociais: "Para aprimorar suas habilidades sociais, pratique comunicação assertiva que respeite tanto seus direitos quanto os dos outros. Desenvolva técnicas de resolução colaborativa de conflitos. Amplie sua rede de contatos participando de grupos e atividades diversas. Estude princípios de comunicação efetiva e prática apresentações em diferentes contextos. Ofereça ajuda e construa relacionamentos baseados em reciprocidade e confiança."
  };
  
  return recommendations[lowestDimension] || "Recomendamos trabalhar no desenvolvimento equilibrado de todas as dimensões da inteligência emocional, priorizando as áreas com menor pontuação através de práticas diárias consistentes e feedback contínuo.";
}

export default router;