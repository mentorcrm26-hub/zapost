-- ============================================================
-- ZaPost — Migration 002_admin_tables.sql
-- Auditoria de Acessos (Impersonate), Fila de Aprendizados (Regra 16) e Versionamento de Skills
-- ============================================================

-- 1. AUDIT_LOGS (Registro de auditoria para ações de suporte e impersonation)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'impersonate_tenant', 'promote_skill', 'change_api_key'
    target_tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(target_tenant_id);

-- 2. PENDING_LEARNINGS (Fila de aprendizados detectados pela IA — Regra 16: aprovação humana obrigatória)
CREATE TABLE IF NOT EXISTS pending_learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'template_preference', 'vocabulary_tuning', 'segment_gap'
    insight TEXT NOT NULL,
    sample_size INTEGER NOT NULL DEFAULT 20,
    confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.85, -- 0.00 a 1.00
    metrics JSONB NOT NULL DEFAULT '{}'::JSONB,
    suggested_prompt TEXT NOT NULL,
    suggested_skill_id VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'promoted' | 'discarded'
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pending_learnings_status ON pending_learnings(status);

-- 3. SKILL_VERSIONS (Histórico de alterações e reversão em 1 clique)
CREATE TABLE IF NOT EXISTS skill_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id VARCHAR(100) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    examples JSONB DEFAULT '[]'::JSONB,
    applies_to JSONB DEFAULT '{}'::JSONB,
    created_by VARCHAR(255) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_versions_skill ON skill_versions(skill_id, version DESC);
