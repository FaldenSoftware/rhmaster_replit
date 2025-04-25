# Documentação de Integração com Banco de Dados PostgreSQL

## Visão Geral

O RH Master utiliza PostgreSQL como sistema de banco de dados relacional para armazenar todos os dados da aplicação. A integração é realizada através do ORM Drizzle, que fornece uma interface tipo-segura para interagir com o banco de dados.

## Estrutura do Banco de Dados

O esquema do banco de dados está definido em `shared/schema.ts` e inclui as seguintes tabelas principais:

- **users**: Armazena informações básicas de todos os usuários
- **mentors**: Informações específicas para usuários do tipo mentor
- **clients**: Informações específicas para usuários do tipo cliente
- **tests**: Testes disponíveis na plataforma
- **test_assignments**: Atribuições de testes aos clientes
- **conversations**: Conversas entre usuários e assistentes de IA
- **messages**: Mensagens enviadas em cada conversa
- **suggestions**: Sugestões geradas pelos assistentes de IA

## Configuração

A conexão com o banco de dados é gerenciada pelo arquivo `server/db.ts`, que cria um pool de conexões e exporta uma instância do Drizzle configurada com o esquema da aplicação.

## Ambiente de Desenvolvimento

No ambiente de desenvolvimento, a aplicação pode funcionar em dois modos:

1. **Armazenamento em Memória** (MemStorage): Usado quando não há um banco de dados PostgreSQL configurado
2. **Armazenamento em Banco de Dados** (DatabaseStorage): Usado quando a variável de ambiente `DATABASE_URL` está definida

## Scripts Úteis

O projeto inclui vários scripts para ajudar a gerenciar o banco de dados:

### Testar Conexão
```bash
npx tsx scripts/test-database.ts
```
Este script verifica se a conexão com o banco de dados está funcionando e lista as tabelas existentes.

### Criar Tipos Enumerados
```bash
npx tsx scripts/push-schema.ts
```
Este script cria os tipos enumerados no banco de dados, que são necessários antes de criar as tabelas.

### Aplicar Migrações
```bash
npx drizzle-kit push
```
Este comando aplica as alterações de esquema ao banco de dados.

### Criar Usuários Iniciais
```bash
npx tsx scripts/create-initial-users.ts
```
Este script cria os usuários iniciais (admin e cliente) no banco de dados.

### Popular o Banco de Dados
```bash
npx tsx scripts/seed-db.ts
```
Este script popula o banco de dados com dados de exemplo para testes e desenvolvimento.

## Modelos de Dados

Os modelos de dados são definidos utilizando o Drizzle ORM e estão disponíveis em `shared/schema.ts`. Cada modelo inclui:

1. **Tabela**: Definição da tabela no banco de dados
2. **Relações**: Configuração das relações entre tabelas
3. **Schema de Inserção**: Schema Zod para validação de dados de inserção
4. **Tipos**: Tipos TypeScript gerados automaticamente para os modelos

## Implementação de Storage

A aplicação utiliza uma interface `IStorage` definida em `server/storage.ts` que pode ser implementada de diferentes formas:

- **MemStorage**: Implementação em memória para desenvolvimento local
- **DatabaseStorage**: Implementação que utiliza o banco de dados PostgreSQL

## Migrações

As migrações são gerenciadas automaticamente pelo Drizzle Kit. Para criar uma nova migração:

1. Atualize o esquema em `shared/schema.ts`
2. Execute `npx drizzle-kit generate` para gerar arquivos de migração
3. Execute `npx drizzle-kit push` para aplicar as migrações ao banco de dados

## Funcionalidades Avançadas

### Gatilhos (Triggers)

O banco de dados inclui alguns gatilhos para funcionalidades avançadas:

- **Gamificação**: Atualização automática de pontos ao completar testes
- **Atualizações de Níveis**: Atualização automática de níveis com base em pontos

### Índices

Vários índices foram criados para otimizar consultas frequentes:

- Índices em chaves estrangeiras para melhorar o desempenho de JOINs
- Índices em campos usados frequentemente em cláusulas WHERE
- Índices únicos para garantir a integridade dos dados

## Troubleshooting

### Problemas Comuns

1. **Erro de Conexão**:
   - Verifique se a variável de ambiente `DATABASE_URL` está configurada corretamente
   - Verifique se o servidor PostgreSQL está em execução

2. **Erro de Migração**:
   - Execute `npx tsx scripts/push-schema.ts` para criar os tipos enumerados antes de aplicar as migrações
   - Verifique se as alterações no esquema são compatíveis com as tabelas existentes

3. **Erro de Inserção**:
   - Verifique se os dados atendem às restrições definidas no esquema
   - Verifique se as chaves estrangeiras referenciam registros existentes

### Comandos Úteis para Debug

```sql
-- Listar todas as tabelas
SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';

-- Listar todos os tipos enumerados
SELECT t.typname AS enum_name, e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
ORDER BY t.typname, e.enumsortorder;

-- Verificar estrutura de uma tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'nome_da_tabela';
```

## Boas Práticas

1. **Sempre use transações** para operações que envolvem múltiplas alterações no banco de dados
2. **Valide os dados** antes de inserir no banco de dados
3. **Use parâmetros nomeados** para evitar injeção de SQL
4. **Feche conexões** ao terminar de usar o banco de dados em scripts
5. **Use migrações** para alterar o esquema do banco de dados em vez de editar manualmente