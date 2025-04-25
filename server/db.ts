import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuração necessária para o Neon Postgres
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configuração do pool de conexões PostgreSQL
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Criar a instância do Drizzle com o esquema
export const db = drizzle(pool, { schema });

// Função para fechar o pool de conexões
export async function closePool() {
  await pool.end();
}

// Função utilitária para testar a conexão
export async function testConnection() {
  try {
    const result = await db.execute('SELECT NOW();');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}