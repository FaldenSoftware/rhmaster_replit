import { db, testConnection } from "../server/db";
import { users, conversations, messages, suggestions } from "@shared/schema";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function testDatabase() {
  console.log("Testando conexão com o banco de dados PostgreSQL...");
  
  try {
    // Testar conexão básica
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error("❌ Falha na conexão com o banco de dados!");
      process.exit(1);
    }
    
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");
    
    // Verificar tabelas existentes
    console.log("\nVerificando tabelas existentes...");
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tables.rows.length > 0) {
      console.log('Tabelas encontradas:');
      tables.rows.forEach((row: any) => {
        console.log(`- ${row.table_name}`);
      });
    } else {
      console.log('Nenhuma tabela encontrada. O schema precisa ser criado.');
    }
    
    // Verificar se existem tipos enumerados
    console.log("\nVerificando tipos enumerados...");
    const enums = await db.execute(`
      SELECT t.typname AS enum_name, e.enumlabel AS enum_value
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `);
    
    if (enums.rows.length > 0) {
      console.log('Tipos enumerados encontrados:');
      const enumGroups: Record<string, string[]> = {};
      
      enums.rows.forEach((row: any) => {
        if (!enumGroups[row.enum_name]) {
          enumGroups[row.enum_name] = [];
        }
        enumGroups[row.enum_name].push(row.enum_value);
      });
      
      for (const [enumName, values] of Object.entries(enumGroups)) {
        console.log(`- ${enumName}: ${values.join(', ')}`);
      }
    } else {
      console.log('Nenhum tipo enumerado encontrado.');
    }
    
    // Tentar inserir um usuário de teste se a tabela existir
    const userTables = tables.rows.filter((row: any) => row.table_name === 'users');
    
    if (userTables.length > 0) {
      console.log("\nTestando inserção e consulta de dados...");
      
      try {
        // Verificar se já existe um usuário com o mesmo nome de usuário
        const existingUser = await db.select().from(users).where(eq(users.username, 'db_test_user'));
        
        if (existingUser.length === 0) {
          // Inserir usuário de teste
          await db.insert(users).values({
            username: 'db_test_user',
            password: 'password_hash',
            email: 'test@example.com',
            name: 'Teste do Banco',
            role: 'client',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log("✅ Usuário de teste inserido com sucesso!");
        } else {
          console.log("ℹ️ Usuário de teste já existe, pulando inserção.");
        }
        
        // Consultar usuário
        const result = await db.select().from(users).where(eq(users.username, 'db_test_user'));
        console.log("✅ Consulta realizada com sucesso:");
        console.log(result);
        
        // Limpar usuário de teste
        await db.delete(users).where(eq(users.username, 'db_test_user'));
        console.log("✅ Usuário de teste removido com sucesso!");
        
      } catch (error) {
        console.error("❌ Erro ao manipular dados:", error);
      }
    }
    
    console.log("\n📋 Resumo do teste:");
    console.log("- Conexão com banco de dados: ✅");
    console.log(`- Tabelas encontradas: ${tables.rows.length}`);
    console.log(`- Tipos enumerados encontrados: ${Object.keys(enums.rows.reduce((acc: any, row: any) => {
      acc[row.enum_name] = true;
      return acc;
    }, {})).length}`);
    
    if (tables.rows.length === 0) {
      console.log("\n⚠️ O banco de dados está vazio. Execute o comando abaixo para criar as tabelas:");
      console.log("npx drizzle-kit push:pg");
      console.log("\nOu execute o script de migração:");
      console.log("tsx scripts/migrate.ts");
    }
    
  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
  } finally {
    // Fechar a conexão com o banco de dados
    console.log("\nFechando conexão com o banco de dados...");
    await db.execute('SELECT 1').then(() => {
      console.log("✅ Conexão fechada com sucesso!");
      process.exit(0);
    }).catch((error) => {
      console.error("❌ Erro ao fechar conexão:", error);
      process.exit(1);
    });
  }
}

testDatabase();