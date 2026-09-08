import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import readline from 'readline'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const { Client } = pg

export async function migrateAiUsage(client?: pg.Client) {
  const jsonlPath = path.join(rootDir, '.ai-usage.jsonl')
  if (!fs.existsSync(jsonlPath)) {
    console.log('ℹ️ Arquivo .ai-usage.jsonl não encontrado. Nada a migrar.')
    return
  }

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

  console.log('📊 Migrando histórico de .ai-usage.jsonl para a tabela ai_usage...')

  // Busca o tenant padrão
  const tenantRes = await dbClient.query(`SELECT id FROM tenants LIMIT 1;`)
  const defaultTenantId = tenantRes.rows[0]?.id || null

  const fileStream = fs.createReadStream(jsonlPath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let count = 0
  for await (const line of rl) {
    if (!line.trim()) continue
    try {
      const record = JSON.parse(line)
      const costUsd = record.costUsd || 0
      const costCents = Math.round(costUsd * 100)
      const inputTokens = record.tokens?.input || record.inputTokens || 0
      const outputTokens = record.tokens?.output || record.outputTokens || 0
      const model = record.model || 'claude-sonnet'
      const provider = record.provider || 'anthropic'
      const createdAt = record.timestamp || new Date().toISOString()

      await dbClient.query(`
        INSERT INTO ai_usage (tenant_id, provider, model, input_tokens, output_tokens, cost_cents, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [defaultTenantId, provider, model, inputTokens, outputTokens, costCents, createdAt])

      count++
    } catch (err: any) {
      console.warn('Erro ao processar linha do .ai-usage.jsonl:', err.message)
    }
  }

  console.log(`✅ Migradas ${count} entradas de uso de IA para o banco de dados com sucesso!`)

  if (shouldClose) {
    await dbClient.end()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrateAiUsage().catch((err) => {
    console.error('❌ Erro na migração de ai-usage:', err)
    process.exit(1)
  })
}
