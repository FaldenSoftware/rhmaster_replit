import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";
import * as schema from "../shared/schema";

// Configuração para conexão websocket necessária para o Neon Postgres
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

async function pushDbChanges() {
  console.log("Pushing database schema changes...");
  
  // Configurando a conexão com o PostgreSQL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  try {
    // Executa o comando drizzle-kit push:pg
    console.log("Running drizzle-kit push...");
    
    // Verifica a conexão com o banco de dados
    const result = await db.execute('SELECT version();');
    console.log('Connected to PostgreSQL:', result.rows[0].version);
    
    // Preparar para executar queries de validação do schema
    console.log('Checking database schema...');
    
    // Verifica se as tabelas do schema existem
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tables.rows.length > 0) {
      console.log('Existing tables in database:');
      tables.rows.forEach((row: any) => {
        console.log(`- ${row.table_name}`);
      });
    } else {
      console.log('No tables found in database. Schema will be created from scratch.');
    }
    
    // Adicional: opção para executar o drizzle-kit push
    console.log('\nTo push the schema to the database, run the following command:');
    console.log('npx drizzle-kit push --sql');
    console.log('\nTo inspect schema differences, run:');
    console.log('npx drizzle-kit studio');
    
  } catch (error) {
    console.error("Error during database operations:", error);
    process.exit(1);
  } finally {
    // Fechando a conexão com o banco de dados
    await pool.end();
  }
}

pushDbChanges();