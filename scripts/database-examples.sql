-- Exemplos de consultas SQL para operações comuns no RH Master

-- 1. Listar todos os clientes de um mentor específico
SELECT c.id, u.name, u.email, u.username, c.department, c.job_title 
FROM clients c
JOIN users u ON c.user_id = u.id
WHERE c.mentor_id = 1 -- Substituir pelo ID do mentor desejado
ORDER BY u.name;

-- 2. Obter resultados de testes de um cliente
SELECT 
    t.title AS test_title,
    t.type AS test_type,
    tr.score,
    tr.percentage,
    tr.strengths,
    tr.areas_for_improvement,
    tr.recommendations,
    tr.mentor_feedback,
    tr.analyzed,
    tr.analyzed_at,
    u.name AS client_name
FROM test_results tr
JOIN test_assignments ta ON tr.assignment_id = ta.id
JOIN tests t ON ta.test_id = t.id
JOIN clients c ON tr.client_id = c.id
JOIN users u ON c.user_id = u.id
WHERE c.id = 2 -- Substituir pelo ID do cliente desejado
ORDER BY tr.created_at DESC;

-- 3. Calcular ranking de gamificação
SELECT 
    u.name AS client_name,
    gp.total_points,
    gp.level,
    gp.streak,
    COUNT(ca.id) AS achievement_count,
    RANK() OVER (ORDER BY gp.total_points DESC) AS rank_position
FROM gamification_points gp
JOIN clients c ON gp.client_id = c.id
JOIN users u ON c.user_id = u.id
LEFT JOIN client_achievements ca ON c.id = ca.client_id
GROUP BY u.name, gp.total_points, gp.level, gp.streak
ORDER BY gp.total_points DESC;

-- 4. Verificar status de assinatura de um mentor
SELECT 
    u.name AS mentor_name,
    s.plan,
    s.status,
    s.start_date,
    s.end_date,
    s.auto_renew,
    s.max_clients,
    s.client_count,
    s.last_billing_date,
    s.next_billing_date
FROM subscriptions s
JOIN mentors m ON s.mentor_id = m.id
JOIN users u ON m.user_id = u.id
WHERE m.id = 1 -- Substituir pelo ID do mentor desejado;

-- 5. Verificar testes pendentes para um cliente
SELECT 
    t.title,
    t.type,
    t.estimated_time_minutes,
    ta.assigned_at,
    ta.due_date,
    ta.status,
    u_mentor.name AS assigned_by
FROM test_assignments ta
JOIN tests t ON ta.test_id = t.id
JOIN users u_mentor ON ta.assigned_by = u_mentor.id
JOIN clients c ON ta.client_id = c.id
WHERE c.id = 2 -- Substituir pelo ID do cliente desejado
AND ta.status IN ('assigned', 'in_progress')
ORDER BY CASE 
    WHEN ta.due_date IS NULL THEN '9999-12-31'::timestamp
    ELSE ta.due_date
END ASC;

-- 6. Relatório de progresso de cliente ao longo do tempo
WITH client_tests AS (
    SELECT 
        tr.client_id,
        date_trunc('month', tr.created_at) AS month,
        COUNT(*) AS tests_completed,
        AVG(tr.percentage) AS avg_score
    FROM test_results tr
    GROUP BY tr.client_id, date_trunc('month', tr.created_at)
),
client_points AS (
    SELECT
        ph.client_id,
        date_trunc('month', ph.created_at) AS month,
        SUM(ph.points) AS points_earned
    FROM points_history ph
    GROUP BY ph.client_id, date_trunc('month', ph.created_at)
)
SELECT
    u.name AS client_name,
    TO_CHAR(ct.month, 'Month YYYY') AS month,
    ct.tests_completed,
    ROUND(ct.avg_score, 2) AS average_score,
    cp.points_earned
FROM client_tests ct
JOIN clients c ON ct.client_id = c.id
JOIN users u ON c.user_id = u.id
LEFT JOIN client_points cp ON ct.client_id = cp.client_id AND ct.month = cp.month
WHERE ct.client_id = 2 -- Substituir pelo ID do cliente desejado
ORDER BY ct.month;

-- 7. Encontrar testes mais populares (mais atribuídos)
SELECT
    t.id,
    t.title,
    t.type,
    COUNT(ta.id) AS assignment_count,
    AVG(tr.percentage) AS avg_score,
    COUNT(CASE WHEN ta.status = 'completed' THEN 1 END) AS completed_count,
    COUNT(CASE WHEN ta.status = 'expired' THEN 1 END) AS expired_count
FROM tests t
LEFT JOIN test_assignments ta ON t.id = ta.test_id
LEFT JOIN test_results tr ON ta.id = tr.assignment_id
GROUP BY t.id, t.title, t.type
ORDER BY assignment_count DESC;

-- 8. Relatório de eficácia de mentor
SELECT
    um.name AS mentor_name,
    COUNT(DISTINCT c.id) AS total_clients,
    COUNT(DISTINCT ta.id) AS total_assignments,
    COUNT(DISTINCT CASE WHEN ta.status = 'completed' THEN ta.id END) AS completed_assignments,
    ROUND(COUNT(DISTINCT CASE WHEN ta.status = 'completed' THEN ta.id END)::numeric / 
        NULLIF(COUNT(DISTINCT ta.id), 0)::numeric * 100, 2) AS completion_rate,
    ROUND(AVG(tr.percentage), 2) AS avg_client_score,
    AVG(gp.level) AS avg_client_level
FROM mentors m
JOIN users um ON m.user_id = um.id
LEFT JOIN clients c ON m.id = c.mentor_id
LEFT JOIN test_assignments ta ON c.id = ta.client_id
LEFT JOIN test_results tr ON ta.id = tr.assignment_id
LEFT JOIN gamification_points gp ON c.id = gp.client_id
WHERE m.id = 1 -- Substituir pelo ID do mentor desejado
GROUP BY um.name
ORDER BY total_clients DESC;

-- 9. Análise de interações com assistente de IA
SELECT
    u.name,
    u.role,
    ai.assistant_type,
    COUNT(*) AS total_interactions,
    AVG(ai.feedback_rating) AS avg_feedback,
    DATE_TRUNC('day', ai.timestamp) AS day
FROM ai_assistant_interactions ai
JOIN users u ON ai.user_id = u.id
WHERE ai.timestamp > NOW() - INTERVAL '30 days'
GROUP BY u.name, u.role, ai.assistant_type, DATE_TRUNC('day', ai.timestamp)
ORDER BY day DESC, total_interactions DESC;

-- 10. Trigger para atualizar pontos de gamificação ao completar um teste
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
        'Teste concluído: ' || (SELECT title FROM tests WHERE id = (SELECT test_id FROM test_assignments WHERE id = NEW.assignment_id)),
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

-- 11. Função para atualizar níveis com base em pontos
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

-- 12. Índices extras para otimização de consultas frequentes
CREATE INDEX IF NOT EXISTS idx_test_assignments_client_status ON test_assignments(client_id, status);
CREATE INDEX IF NOT EXISTS idx_test_results_client_id ON test_results(client_id);
CREATE INDEX IF NOT EXISTS idx_points_history_client_created ON points_history(client_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_timestamp ON ai_assistant_interactions(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_achievements_requirement ON achievements(requirement_value);
CREATE INDEX IF NOT EXISTS idx_test_responses_client_id ON test_responses(client_id);