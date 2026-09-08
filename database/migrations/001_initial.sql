-- ============================================================
-- ZaPost — Migration 001_initial.sql
-- Multi-tenant desde a 1ª migration com tenant_id em todas as tabelas de dados
-- credit_ledger append-only com trigger de proteção
-- Valores em centavos de USD inteiros
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. TENANTS (A conta do negócio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    cycle_credits INTEGER NOT NULL DEFAULT 10,
    phone VARCHAR(50) NOT NULL,
    timezone VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants(phone);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- ------------------------------------------------------------
-- 2. USERS (Dono ou operadores do negócio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'dono', -- 'dono' | 'operador'
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'google', -- 'google' | 'phone' | 'email'
    auth_provider_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_id ON users(auth_provider, auth_provider_id) WHERE auth_provider_id IS NOT NULL;

-- ------------------------------------------------------------
-- 3. BUSINESS_PROFILES (Ficha do negócio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    segment VARCHAR(100) NOT NULL DEFAULT 'limpeza',
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    timezone VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
    audience VARCHAR(50) NOT NULL DEFAULT 'ambos',
    languages TEXT[] NOT NULL DEFAULT ARRAY['pt', 'en'],
    contact_channel VARCHAR(50) NOT NULL DEFAULT 'whatsapp',
    contact_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_profiles_tenant ON business_profiles(tenant_id);

-- ------------------------------------------------------------
-- 4. BRAND_KITS (Identidade visual do negócio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    logo_url TEXT,
    colors TEXT[] NOT NULL DEFAULT ARRAY['#2F6F5E', '#FFB300', '#0F2E2A'],
    font_family VARCHAR(100),
    handle VARCHAR(100),
    phone VARCHAR(50),
    signature VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_kits_tenant ON brand_kits(tenant_id);

-- ------------------------------------------------------------
-- 5. BRIEFS (Briefings e conteúdo gerado pela IA)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    objective VARCHAR(50) NOT NULL,
    offer JSONB,
    deadline VARCHAR(50),
    raw_input TEXT NOT NULL,
    photo_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    networks TEXT[] NOT NULL DEFAULT ARRAY['instagram', 'whatsapp_status'],
    languages TEXT[] NOT NULL DEFAULT ARRAY['pt', 'en'],
    kind VARCHAR(50) NOT NULL DEFAULT 'post',
    slide_count INTEGER,
    enhance_photo BOOLEAN NOT NULL DEFAULT FALSE,
    strategy_awareness VARCHAR(50),
    visual_angle VARCHAR(100),
    content JSONB NOT NULL,
    template_hints TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefs_tenant_id ON briefs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);

-- ------------------------------------------------------------
-- 6. CREATIVES (Estado e ciclo de vida do criativo)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'aguardando_foto_audio',
    origin_channel VARCHAR(50) NOT NULL DEFAULT 'telegram', -- 'whatsapp' | 'telegram' | 'webapp'
    skill_used VARCHAR(100),
    total_cost_cents INTEGER NOT NULL DEFAULT 0, -- Centavos USD
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creatives_tenant_id ON creatives(tenant_id);
CREATE INDEX IF NOT EXISTS idx_creatives_status ON creatives(status);

-- ------------------------------------------------------------
-- 7. TEMPLATES (Globais do sistema — sem tenant_id)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(100) PRIMARY KEY, -- 'bold-price', 'photo-overlay', 'clean-split'
    name VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    formats TEXT[] NOT NULL DEFAULT ARRAY['feed_45', 'story_916'],
    text_rules JSONB NOT NULL DEFAULT '{}'::JSONB,
    segments TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 8. SKILLS (Globais do sistema — sem tenant_id)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(100) PRIMARY KEY,
    version INTEGER NOT NULL DEFAULT 1,
    type VARCHAR(50) NOT NULL, -- 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'
    prompt TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]'::JSONB,
    applies_to JSONB NOT NULL DEFAULT '{}'::JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 9. RENDERS (Arquivos PNG gerados em alta ou preview)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS renders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    creative_id UUID NOT NULL REFERENCES creatives(id) ON DELETE CASCADE,
    template_id VARCHAR(100) NOT NULL REFERENCES templates(id),
    format VARCHAR(50) NOT NULL, -- 'feed_45' | 'story_916'
    language VARCHAR(10) NOT NULL, -- 'pt' | 'en'
    url TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    watermark BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_renders_tenant_id ON renders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_renders_creative_id ON renders(creative_id);

-- ------------------------------------------------------------
-- 10. CREDIT_LEDGER (Extrato contábil de créditos — APPEND-ONLY)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
    delta INTEGER NOT NULL, -- +10 (compra), -1 (aprovação de criativo), -1 (melhoria foto)
    reason VARCHAR(255) NOT NULL,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_tenant_id ON credit_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_created_at ON credit_ledger(created_at DESC);

-- Trigger de segurança: Proíbe UPDATE e DELETE no credit_ledger
CREATE OR REPLACE FUNCTION trg_prevent_credit_ledger_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Operação proibida no credit_ledger: Esta tabela é estritamente append-only (sem UPDATE ou DELETE).';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_credit_ledger_append_only ON credit_ledger;
CREATE TRIGGER enforce_credit_ledger_append_only
BEFORE UPDATE OR DELETE ON credit_ledger
FOR EACH ROW EXECUTE FUNCTION trg_prevent_credit_ledger_mutation();

-- Função para consultar saldo atual de um tenant
CREATE OR REPLACE FUNCTION get_tenant_credit_balance(p_tenant_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_balance INTEGER;
BEGIN
    SELECT COALESCE(SUM(delta), 0) INTO v_balance
    FROM credit_ledger
    WHERE tenant_id = p_tenant_id;
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 11. API_KEYS (Globais com teto mensal em centavos de USD)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL, -- 'anthropic' | 'openai'
    key_encrypted TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1,
    monthly_budget_cents INTEGER NOT NULL DEFAULT 20000, -- $200.00
    current_spend_cents INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 12. AI_USAGE (Rastreabilidade de custos e tokens de IA)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL, -- 'anthropic' | 'openai'
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost_cents INTEGER NOT NULL DEFAULT 0, -- Centavos USD
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant_id ON ai_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at DESC);

-- ------------------------------------------------------------
-- 13. WA_SESSIONS (Sessões conversacionais com TTL)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wa_sessions (
    phone VARCHAR(50) PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    state VARCHAR(50) NOT NULL DEFAULT 'aguardando_foto_audio',
    context JSONB NOT NULL DEFAULT '{}'::JSONB,
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes')
);

CREATE INDEX IF NOT EXISTS idx_wa_sessions_tenant ON wa_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wa_sessions_expires ON wa_sessions(expires_at);
