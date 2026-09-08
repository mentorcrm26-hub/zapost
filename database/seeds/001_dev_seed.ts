import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const { Client } = pg

export async function runSeed(client?: pg.Client) {
  const shouldClose = !client
  const dbClient =
    client ||
    new Client({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/zapost',
    })

  if (shouldClose) {
    await dbClient.connect()
  }

  console.log('🌱 Iniciando Seeds de Desenvolvimento do ZaPost...')

  // 1. Cria Tenant de Exemplo: Bella Clean
  const tenantRes = await dbClient.query(`
    INSERT INTO tenants (name, plan, status, cycle_credits, phone, timezone)
    VALUES ('Bella Clean', 'starter', 'active', 10, '+1 (508) 555-0142', 'America/New_York')
    ON CONFLICT DO NOTHING
    RETURNING id;
  `)

  let tenantId: string
  if (tenantRes.rows.length > 0) {
    tenantId = tenantRes.rows[0].id
  } else {
    const existing = await dbClient.query(`SELECT id FROM tenants WHERE name = 'Bella Clean' LIMIT 1;`)
    tenantId = existing.rows[0].id
  }

  // 2. Cria Usuário Dono
  await dbClient.query(`
    INSERT INTO users (tenant_id, role, name, email, phone, auth_provider, auth_provider_id)
    VALUES ($1, 'dono', 'Maria Santos', 'maria@bellaclean.ma', '+1 (508) 555-0142', 'google', 'google-oauth2|maria123')
    ON CONFLICT DO NOTHING;
  `, [tenantId])

  // 3. Cria Business Profile
  await dbClient.query(`
    INSERT INTO business_profiles (tenant_id, segment, city, state, timezone, audience, languages, contact_channel, contact_value)
    VALUES ($1, 'limpeza', 'Framingham', 'MA', 'America/New_York', 'ambos', ARRAY['pt', 'en'], 'whatsapp', '+1 (508) 555-0142')
    ON CONFLICT (tenant_id) DO NOTHING;
  `, [tenantId])

  // 4. Cria Brand Kit
  await dbClient.query(`
    INSERT INTO brand_kits (tenant_id, colors, handle, phone, signature)
    VALUES ($1, ARRAY['#2F6F5E', '#FFB300', '#0F2E2A'], '@bellaclean.ma', '+1 (508) 555-0142', 'Bella Clean')
    ON CONFLICT (tenant_id) DO NOTHING;
  `, [tenantId])

  // 5. Cria Templates Globais
  const templates = [
    {
      id: 'bold-price',
      name: 'Bold Price',
      formats: ['feed_45', 'story_916'],
      rules: { headlineMaxChars: 45, showPrice: true },
      segments: ['limpeza', 'comida', 'beleza', 'construcao'],
    },
    {
      id: 'photo-overlay',
      name: 'Photo Overlay',
      formats: ['feed_45', 'story_916'],
      rules: { headlineMaxChars: 55, gradient: true },
      segments: ['limpeza', 'beleza', 'loja'],
    },
    {
      id: 'clean-split',
      name: 'Clean Split',
      formats: ['feed_45', 'story_916'],
      rules: { headlineMaxChars: 60, splitRatio: '50/50' },
      segments: ['limpeza', 'servicos', 'saude', 'transporte'],
    },
  ]

  for (const t of templates) {
    await dbClient.query(`
      INSERT INTO templates (id, name, version, formats, text_rules, segments, active)
      VALUES ($1, $2, 1, $3, $4, $5, true)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, formats = EXCLUDED.formats;
    `, [t.id, t.name, t.formats, JSON.stringify(t.rules), t.segments])
  }

  // 6. Cria Skills Globais (Fase 2)
  const skills = [
    {
      id: 'tecnica-copywriting',
      type: 'tecnica',
      prompt: 'Headline curta e magnética. Foco no benefício principal e valor imediato.',
      appliesTo: { segments: ['*'], objectives: ['divulgar', 'promocao'] },
    },
    {
      id: 'tecnica-carrossel',
      type: 'formato',
      prompt: 'Estrutura AIDA em 3 a 5 slides com gancho forte na capa e CTA no final.',
      appliesTo: { formats: ['carousel'] },
    },
    {
      id: 'adaptacao-ingles',
      type: 'tecnica',
      prompt: 'Adaptação cultural para o público americano local nos EUA, nunca tradução literal.',
      appliesTo: { languages: ['en'] },
    },
    {
      id: 'segmento-limpeza',
      type: 'segmento',
      prompt: 'Termos e apelos do mercado de limpeza residencial e comercial nos EUA (deep clean, move-in/move-out).',
      appliesTo: { segments: ['limpeza'] },
    },
  ]

  for (const s of skills) {
    await dbClient.query(`
      INSERT INTO skills (id, version, type, prompt, examples, applies_to, active)
      VALUES ($1, 1, $2, $3, '[]'::jsonb, $4, true)
      ON CONFLICT (id) DO UPDATE SET prompt = EXCLUDED.prompt;
    `, [s.id, s.type, s.prompt, JSON.stringify(s.appliesTo)])
  }

  // 7. Lançamento inicial de créditos no ledger (+10)
  const ledgerCount = await dbClient.query(`
    SELECT COUNT(*) as count FROM credit_ledger WHERE tenant_id = $1;
  `, [tenantId])

  if (parseInt(ledgerCount.rows[0].count, 10) === 0) {
    await dbClient.query(`
      INSERT INTO credit_ledger (tenant_id, delta, reason, balance_after)
      VALUES ($1, 10, 'Créditos de boas-vindas do plano starter', 10);
    `, [tenantId])
  }

  console.log(`✅ Seeds concluídos com sucesso para o Tenant "${tenantId}" (Bella Clean)!`)

  if (shouldClose) {
    await dbClient.end()
  }

  return { tenantId }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed().catch((err) => {
    console.error('❌ Erro no seed:', err)
    process.exit(1)
  })
}
