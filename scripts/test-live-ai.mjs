import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { generateCreativeBrief } from '../packages/ai/dist/generator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega .env
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

async function testLiveAiGeneration() {
  console.log('🤖 Testando geração real de criativo com IA (GPT-4o / Claude)...\n')

  const businessProfile = {
    segment: 'limpeza',
    city: 'Framingham',
    state: 'MA',
    timezone: 'America/New_York',
    audience: 'ambos',
    languages: ['pt', 'en'],
    contact: {
      channel: 'whatsapp',
      value: '+1 (508) 555-0142',
    },
  }

  const creativeRequest = {
    objective: 'promocao',
    offer: {
      serviceOrProduct: 'Faxina Residencial Completa',
      price: '120',
      deadline: 'esta_semana',
    },
    rawInput: 'Faxina residencial em Framingham por $120 até sábado. Agendamentos no WhatsApp.',
    languages: ['pt', 'en'],
    networks: ['instagram', 'whatsapp_status'],
  }

  const brief = await generateCreativeBrief({
    businessProfile,
    creativeRequest,
    skillsDir: path.resolve(__dirname, '../packages/skills'),
  })

  console.log('🎉 SUCESSO! CreativeBrief gerado pela IA (Google Gemini / GPT-4o):\n')
  console.log('📌 Templates Recomendados:', brief.templateHints?.join(', '))
  console.log('🎯 Nível de Consciência:', brief.awarenessLevel)
  console.log('🧠 Skills Utilizadas:', brief.skillsUsed?.join(', '))

  if (brief.content.pt) {
    console.log('\n🇧🇷 Conteúdo em Português:')
    console.log('  Headline:', brief.content.pt.headline)
    console.log('  Subheadline:', brief.content.pt.subheadline)
    console.log('  CTA:', brief.content.pt.cta)
    console.log('  Legenda:\n', brief.content.pt.caption)
    console.log('  Hashtags:', (brief.content.pt.hashtags || []).join(' '))
  }

  if (brief.content.en) {
    console.log('\n🇺🇸 Conteúdo em Inglês:')
    console.log('  Headline:', brief.content.en.headline)
    console.log('  Subheadline:', brief.content.en.subheadline)
    console.log('  CTA:', brief.content.en.cta)
    console.log('  Legenda:\n', brief.content.en.caption)
    console.log('  Hashtags:', (brief.content.en.hashtags || []).join(' '))
  }
}

testLiveAiGeneration().catch((err) => {
  console.error('\n❌ Erro durante teste de IA:', err)
  process.exit(1)
})
