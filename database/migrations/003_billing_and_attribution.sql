-- ============================================================
-- ZaPost — Migration 003_billing_and_attribution.sql
-- Fase 5: Cobrança Stripe, Atribuição Server-Side (gclid), e Indicação
-- Valores sempre em centavos de USD inteiros
-- ============================================================

-- ------------------------------------------------------------
-- 1. ATUALIZAÇÕES EM TENANTS (Stripe & Programa de Indicação)
-- ------------------------------------------------------------
ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) NOT NULL DEFAULT 'trialing', -- 'trialing' | 'active' | 'past_due' | 'canceled'
    ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50) UNIQUE,
    ADD COLUMN IF NOT EXISTS referred_by_tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON tenants(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_tenants_referral_code ON tenants(referral_code);

-- ------------------------------------------------------------
-- 2. ATUALIZAÇÕES EM USERS (Rastreabilidade de Anúncios & gclid)
-- ------------------------------------------------------------
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS gclid VARCHAR(255),
    ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100),
    ADD COLUMN IF NOT EXISTS first_touch_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_users_gclid ON users(gclid);

-- ------------------------------------------------------------
-- 3. TABELA DE EVENTOS DE ATRIBUIÇÃO SERVER-SIDE (Disparos GA4 e Google Ads)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attribution_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(100) NOT NULL, -- 'purchase' | 'first_creative_created' | 'sign_up'
    gclid VARCHAR(255),
    sha256_email VARCHAR(64),
    value_cents INTEGER NOT NULL DEFAULT 0, -- Centavos USD
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    platform VARCHAR(50) NOT NULL, -- 'ga4_measurement_protocol' | 'google_ads_conversion_api'
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'sent', -- 'sent' | 'failed'
    response_body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attribution_tenant ON attribution_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attribution_gclid ON attribution_events(gclid);
CREATE INDEX IF NOT EXISTS idx_attribution_event ON attribution_events(event_name);
