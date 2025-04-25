import { db } from "../server/db";
import { users, mentors, clients } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createInitialUsers() {
  console.log("Iniciando criação de usuários iniciais...");
  
  try {
    // Verificar se o usuário admin já existe
    const adminExists = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (adminExists.length > 0) {
      console.log("❗ Usuário 'admin' já existe, pulando criação.");
    } else {
      console.log("Criando usuário mentor administrador...");
      
      // Criar usuário admin
      const adminUser = {
        username: "admin",
        password: await hashPassword("admin"),
        email: "admin@rhmaster.com",
        name: "Marcos Silva",
        role: "mentor" as const,
        active: true,
        company: "RH Master Consultoria",
        position: "Diretor de Desenvolvimento",
        profile: { bio: "Mentor experiente com mais de 15 anos na área de RH." }
      };
      
      // Inserir na tabela users
      const [adminUserResult] = await db.insert(users).values(adminUser).returning();
      console.log("✅ Usuário admin criado com sucesso:", adminUserResult.id);
      
      // Inserir na tabela mentors
      await db.insert(mentors).values({
        userId: adminUserResult.id,
        bio: "Mentor experiente com mais de 15 anos na área de RH.",
        specialties: ["Liderança", "Comunicação", "Gestão de Equipes"],
        yearsExperience: 15,
        rating: 4.9,
        availableSlots: 10,
        verified: true
      });
      console.log("✅ Perfil de mentor criado com sucesso!");
    }
    
    // Verificar se o usuário cliente já existe
    const clientExists = await db.select().from(users).where(eq(users.username, "cliente"));
    
    if (clientExists.length > 0) {
      console.log("❗ Usuário 'cliente' já existe, pulando criação.");
    } else {
      console.log("Criando usuário cliente de teste...");
      
      // Buscar o id do mentor admin
      const [adminMentor] = await db.select({
        id: mentors.id,
        userId: mentors.userId
      }).from(mentors)
        .innerJoin(users, eq(mentors.userId, users.id))
        .where(eq(users.username, "admin"));
      
      if (!adminMentor) {
        throw new Error("Mentor admin não encontrado");
      }
      
      // Criar usuário cliente
      const clientUser = {
        username: "cliente",
        password: await hashPassword("admin"),
        email: "cliente@empresa.com",
        name: "Ana Oliveira",
        role: "client" as const,
        active: true,
        company: "Tech Solutions Inc.",
        position: "Gerente de Produto"
      };
      
      // Inserir na tabela users
      const [clientUserResult] = await db.insert(users).values(clientUser).returning();
      console.log("✅ Usuário cliente criado com sucesso:", clientUserResult.id);
      
      // Inserir na tabela clients
      await db.insert(clients).values({
        userId: clientUserResult.id,
        mentorId: adminMentor.id,
        department: "Produtos",
        jobTitle: "Gerente de Produto",
        focus: ["Liderança", "Comunicação"],
        onboardingCompleted: true,
        notes: "Cliente interessado em desenvolver habilidades de liderança."
      });
      console.log("✅ Perfil de cliente criado com sucesso!");
    }
    
    console.log("\n✅ Processo de criação de usuários iniciais concluído com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro durante a criação de usuários iniciais:", error);
  } finally {
    console.log("Fechando conexão com o banco de dados...");
    await db.execute('SELECT 1');
    process.exit(0);
  }
}

createInitialUsers();