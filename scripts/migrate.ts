import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configuração para conexão websocket necessária para o Neon Postgres
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

async function runMigration() {
  console.log("Starting database migration...");
  
  // Configurando a conexão com o PostgreSQL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  // Executando a migração
  console.log("Pushing schema changes to the database...");
  
  try {
    // Usamos o método `migrate` para aplicar as migrações automaticamente
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    // Fechando a conexão com o banco de dados
    await pool.end();
  }
}

runMigration();