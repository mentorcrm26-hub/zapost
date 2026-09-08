import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)
const pg = require(path.resolve(__dirname, '../apps/api/node_modules/pg'))

// Simples parser de .env
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=')
      const k = trimmed.substring(0, idx).trim()
      const v = trimmed.substring(idx + 1).trim()
      if (!process.env[k]) process.env[k] = v
    }
  })
}

const { Client } = pg

async function runMigration() {
  console.log('🚀 Conectando ao PostgreSQL do Supabase...')

  // Servidor confirmado em us-west-2
  const pass = 'd7f9l5EWHwdQBLNE'
  const ref = 'myclegwwqdthfmthofir'

  const connectionStrings = [
    `postgresql://postgres.${ref}:${encodeURIComponent(pass)}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${ref}:${encodeURIComponent(pass)}@aws-0-us-west-2.pooler.supabase.com:5432/postgres`,
    process.env.DATABASE_URL,
    process.env.DATABASE_POOLER_URL,
  ]

  let client = null
  let successfulUrl = null

  for (const connStr of connectionStrings) {
    if (!connStr) continue
    try {
      console.log(`Tentando conexão: ${connStr.replace(/:[^:@]+@/, ':****@')}`)
      const c = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      })
      await c.connect()
      const res = await c.query('SELECT NOW() as now, version() as version;')
      console.log('✅ Conexão bem-sucedida!', res.rows[0].version)
      client = c
      successfulUrl = connStr
      break
    } catch (err) {
      console.warn('⚠️ Falha nesta string de conexão:', err.message)
    }
  }

  if (!client) {
    throw new Error('❌ Não foi possível conectar a nenhuma das portas do PostgreSQL no Supabase.')
  }

  console.log('📜 Lendo arquivo de migração 001_initial.sql...')
  const sqlPath = path.resolve(__dirname, '../database/migrations/001_initial.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('⚙️ Executando migração 001_initial.sql no Supabase...')
  await client.query(sql)
  console.log('✅ Migração 001_initial.sql aplicada com sucesso!')

  // Verifica as tabelas criadas
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `)

  console.log('\n📊 Tabelas encontradas no banco:')
  tablesRes.rows.forEach((r) => console.log(`  - ${r.table_name}`))

  await client.end()
  return successfulUrl
}

runMigration()
  .then((url) => {
    console.log('\n🎉 Setup do Banco de Dados Concluído com Sucesso!')
  })
  .catch((err) => {
    console.error('\n❌ Erro durante o processo:', err)
    process.exit(1)
  })
