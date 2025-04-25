import { db } from "../server/db";
import { users, mentors, clients, tests, testAssignments } from "../shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log("Iniciando seed do banco de dados...");
  
  try {
    // Verificar existência de usuários
    const existingUsers = await db.select({ count: db.fn.count() }).from(users);
    const userCount = Number(existingUsers[0].count);
    
    if (userCount > 0) {
      console.log(`Já existem ${userCount} usuários no banco de dados.`);
      const continueSeeding = process.argv.includes("--force");
      
      if (!continueSeeding) {
        console.log("Para forçar o seed do banco, use o parâmetro --force");
        process.exit(0);
      } else {
        console.log("Forçando o seed do banco...");
      }
    }
    
    // Criar usuário admin (mentor)
    console.log("Criando usuário admin...");
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin"),
      email: "admin@rhmaster.com",
      name: "Marcos Silva",
      role: "mentor",
      active: true,
      profile: { bio: "Especialista em desenvolvimento de líderes" },
      company: "RH Master Consultoria",
      position: "Diretor de Desenvolvimento"
    }).returning();
    
    console.log("Criando perfil de mentor para o admin...");
    const [adminMentor] = await db.insert(mentors).values({
      userId: adminUser.id,
      bio: "Especialista com mais de 15 anos de experiência em RH",
      specialties: ["Liderança", "Gestão de equipes", "Comunicação"],
      yearsExperience: 15,
      rating: 4.9,
      availableSlots: 10,
      verified: true
    }).returning();
    
    // Criar usuário cliente
    console.log("Criando usuário cliente...");
    const [clientUser] = await db.insert(users).values({
      username: "cliente",
      password: await hashPassword("admin"),
      email: "cliente@empresa.com",
      name: "Ana Oliveira",
      role: "client",
      active: true,
      company: "Tech Solutions Inc.",
      position: "Gerente de Produto"
    }).returning();
    
    console.log("Criando perfil de cliente...");
    await db.insert(clients).values({
      userId: clientUser.id,
      mentorId: adminMentor.id,
      department: "Produtos",
      jobTitle: "Gerente de Produto",
      focus: ["Liderança", "Comunicação"],
      onboardingCompleted: true,
      notes: "Cliente interessada em desenvolver habilidades de liderança"
    });
    
    // Criar alguns testes
    console.log("Criando testes de exemplo...");
    const testTitles = [
      "Avaliação de Perfil de Liderança",
      "Comunicação Interpessoal",
      "Inteligência Emocional",
      "Gestão de Conflitos",
      "Tomada de Decisão"
    ];
    
    const testTypes = [
      "leadership",
      "communication",
      "emotional_intelligence",
      "behavior",
      "leadership"
    ];
    
    const testDescriptions = [
      "Avalia os estilos de liderança e identifica pontos fortes e áreas de melhoria",
      "Analisa habilidades de comunicação em diferentes contextos",
      "Mede a capacidade de reconhecer e gerenciar emoções",
      "Avalia métodos de resolução de conflitos e negociação",
      "Identifica padrões na tomada de decisões"
    ];
    
    const createdTests = [];
    
    for (let i = 0; i < testTitles.length; i++) {
      const [test] = await db.insert(tests).values({
        title: testTitles[i],
        description: testDescriptions[i],
        type: testTypes[i] as any,
        estimatedTimeMinutes: 30,
        active: true,
        createdBy: adminMentor.id,
        isTemplate: true,
        maxScore: 100,
        tags: ["desenvolvimento", "liderança"],
        instructions: "Responda com sinceridade todas as questões"
      }).returning();
      
      createdTests.push(test);
    }
    
    // Atribuir alguns testes ao cliente
    console.log("Atribuindo testes ao cliente...");
    for (let i = 0; i < 3; i++) {
      await db.insert(testAssignments).values({
        testId: createdTests[i].id,
        clientId: 1, // ID do cliente criado
        assignedBy: adminUser.id,
        status: "assigned",
        kanbanColumn: "to_do",
        priority: "medium",
        notes: "Por favor, complete este teste até o final da semana"
      });
    }
    
    console.log("✅ Seed concluído com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro durante o seed do banco de dados:", error);
  } finally {
    console.log("Fechando conexão com o banco de dados...");
    await db.execute('SELECT 1');
    process.exit(0);
  }
}

seedDatabase();