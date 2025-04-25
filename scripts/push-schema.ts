import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema";

// Configuração para conexão websocket necessária para o Neon Postgres
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

async function pushSchema() {
  console.log("Pushing schema to database...");
  
  // Configurando a conexão com o PostgreSQL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  try {
    // Aplicamos o esquema diretamente
    console.log("Creating tables and relationships...");
    
    // Forçamos o push do esquema diretamente
    const result = await db.execute(`
      -- Criando as enumerações
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('mentor', 'client', 'admin');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'pro', 'enterprise');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE test_type AS ENUM ('behavior', 'emotional_intelligence', 'leadership', 'enneagram', 'communication', 'custom');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE test_status AS ENUM ('assigned', 'in_progress', 'completed', 'expired');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE message_role AS ENUM ('user', 'assistant');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE message_feedback AS ENUM ('positive', 'negative', 'neutral');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE context_type AS ENUM ('test_results', 'client_progress', 'profile_analysis', 'test_taking', 'dashboard');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial', 'canceled', 'expired');
        EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
    
    console.log("Database schema updated!");
    console.log("To push all schema changes, run: npx drizzle-kit push");
  } catch (error) {
    console.error("Error pushing schema:", error);
    process.exit(1);
  } finally {
    // Fechando a conexão com o banco de dados
    await pool.end();
  }
}

pushSchema();