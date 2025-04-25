-- Funções SQL para implementar migrações manuais no banco de dados RH Master

-- Função para executar migrations com controle de versão
CREATE OR REPLACE FUNCTION migrate_to_version(target_version INT) RETURNS VOID AS $$
DECLARE
    current_version INT;
BEGIN
    -- Criar tabela de controle de migrations se não existir
    CREATE TABLE IF NOT EXISTS schema_migrations (
        version INT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        description TEXT
    );
    
    -- Obter a versão atual
    SELECT MAX(version) INTO current_version FROM schema_migrations;
    
    -- Se não houver migrations, começar do zero
    IF current_version IS NULL THEN
        current_version := 0;
    END IF;
    
    RAISE NOTICE 'Current schema version: %. Target version: %', current_version, target_version;
    
    -- Não permitir downgrade através desta função
    IF target_version < current_version THEN
        RAISE EXCEPTION 'Downgrade is not supported. Current version: %. Target version: %', current_version, target_version;
    END IF;
    
    -- Executar as migrações incrementalmente
    IF target_version >= 1 AND current_version < 1 THEN
        RAISE NOTICE 'Applying migration version 1: Initial schema setup';
        -- Migration 1 já realizada pelo push do schema DrizzleORM
        INSERT INTO schema_migrations (version, description) VALUES (1, 'Initial schema setup');
    END IF;
    
    IF target_version >= 2 AND current_version < 2 THEN
        RAISE NOTICE 'Applying migration version 2: Adding gamification triggers';
        
        -- Criação dos triggers de gamificação
        CREATE OR REPLACE FUNCTION update_gamification_points() RETURNS TRIGGER AS $$
        BEGIN
            -- Inserir registro no histórico de pontos
            INSERT INTO points_history (client_id, points, source, source_id, description, created_at)
            VALUES (
                NEW.client_id, 
                CASE
                    WHEN NEW.percentage >= 90 THEN 100
                    WHEN NEW.percentage >= 75 THEN 75
                    WHEN NEW.percentage >= 60 THEN 50
                    ELSE 25
                END,
                'test_completion',
                NEW.id,
                'Teste concluído',
                NOW()
            );
            
            -- Atualizar os pontos totais
            UPDATE gamification_points 
            SET total_points = total_points + (
                CASE
                    WHEN NEW.percentage >= 90 THEN 100
                    WHEN NEW.percentage >= 75 THEN 75
                    WHEN NEW.percentage >= 60 THEN 50
                    ELSE 25
                END
            ),
            updated_at = NOW()
            WHERE client_id = NEW.client_id;
            
            -- Se não existir um registro de gamificação, criar um
            IF NOT FOUND THEN
                INSERT INTO gamification_points (client_id, total_points, level, streak, created_at, updated_at)
                VALUES (
                    NEW.client_id,
                    CASE
                        WHEN NEW.percentage >= 90 THEN 100
                        WHEN NEW.percentage >= 75 THEN 75
                        WHEN NEW.percentage >= 60 THEN 50
                        ELSE 25
                    END,
                    1,
                    0,
                    NOW(),
                    NOW()
                );
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Criação do trigger
        DROP TRIGGER IF EXISTS test_result_gamification_trigger ON test_results;
        CREATE TRIGGER test_result_gamification_trigger
        AFTER INSERT ON test_results
        FOR EACH ROW
        EXECUTE FUNCTION update_gamification_points();
        
        -- Registrar a migração
        INSERT INTO schema_migrations (version, description) VALUES (2, 'Adding gamification triggers');
    END IF;
    
    IF target_version >= 3 AND current_version < 3 THEN
        RAISE NOTICE 'Applying migration version 3: Adding level update trigger';
        
        -- Criar trigger para atualização de níveis
        CREATE OR REPLACE FUNCTION update_gamification_levels() RETURNS TRIGGER AS $$
        BEGIN
            -- Atualizar o nível com base nos pontos
            UPDATE gamification_points
            SET level = CASE
                WHEN NEW.total_points >= 10000 THEN 10
                WHEN NEW.total_points >= 5000 THEN 9
                WHEN NEW.total_points >= 2500 THEN 8
                WHEN NEW.total_points >= 1000 THEN 7
                WHEN NEW.total_points >= 500 THEN 6
                WHEN NEW.total_points >= 250 THEN 5
                WHEN NEW.total_points >= 100 THEN 4
                WHEN NEW.total_points >= 50 THEN 3
                WHEN NEW.total_points >= 25 THEN 2
                ELSE 1
            END
            WHERE id = NEW.id AND level < CASE
                WHEN NEW.total_points >= 10000 THEN 10
                WHEN NEW.total_points >= 5000 THEN 9
                WHEN NEW.total_points >= 2500 THEN 8
                WHEN NEW.total_points >= 1000 THEN 7
                WHEN NEW.total_points >= 500 THEN 6
                WHEN NEW.total_points >= 250 THEN 5
                WHEN NEW.total_points >= 100 THEN 4
                WHEN NEW.total_points >= 50 THEN 3
                WHEN NEW.total_points >= 25 THEN 2
                ELSE 1
            END;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Criação do trigger
        DROP TRIGGER IF EXISTS gamification_level_trigger ON gamification_points;
        CREATE TRIGGER gamification_level_trigger
        AFTER UPDATE OF total_points ON gamification_points
        FOR EACH ROW
        EXECUTE FUNCTION update_gamification_levels();
        
        -- Registrar a migração
        INSERT INTO schema_migrations (version, description) VALUES (3, 'Adding level update trigger');
    END IF;
    
    IF target_version >= 4 AND current_version < 4 THEN
        RAISE NOTICE 'Applying migration version 4: Adding performance indexes';
        
        -- Criar índices para melhorar a performance
        CREATE INDEX IF NOT EXISTS idx_test_assignments_client_status ON test_assignments(client_id, status);
        CREATE INDEX IF NOT EXISTS idx_test_results_client_id ON test_results(client_id);
        CREATE INDEX IF NOT EXISTS idx_points_history_client_created ON points_history(client_id, created_at);
        CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_timestamp ON ai_assistant_interactions(user_id, timestamp);
        CREATE INDEX IF NOT EXISTS idx_achievements_requirement ON achievements(requirement_value);
        CREATE INDEX IF NOT EXISTS idx_test_responses_client_id ON test_responses(client_id);
        
        -- Registrar a migração
        INSERT INTO schema_migrations (version, description) VALUES (4, 'Adding performance indexes');
    END IF;
    
    RAISE NOTICE 'Schema migration completed successfully to version %', target_version;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar o status das migrações
CREATE OR REPLACE FUNCTION check_migration_status() RETURNS TABLE (
    version INT,
    applied_at TIMESTAMP WITH TIME ZONE,
    description TEXT
) AS $$
BEGIN
    -- Criar tabela de migrations se não existir
    CREATE TABLE IF NOT EXISTS schema_migrations (
        version INT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        description TEXT
    );
    
    RETURN QUERY SELECT * FROM schema_migrations ORDER BY version;
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso:
-- SELECT * FROM check_migration_status();
-- SELECT migrate_to_version(4);