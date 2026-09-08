import { generateCreativeBrief } from '../packages/ai/dist/index.js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const sampleBase = {
  businessProfile: {
    segment: 'limpeza',
    city: 'Framingham',
    state: 'MA',
    timezone: 'America/New_York',
    audience: 'ambos',
    languages: ['pt', 'en'],
    contactChannel: 'whatsapp',
    contactValue: '+1 (508) 555-0142',
  },
  brandKit: {
    logoUrl: null,
    colors: ['#2F6F5E', '#FFB300', '#0F2E2A'],
    fontFamily: null,
    handle: '@bellaclean.ma',
    phone: '+1 (508) 555-0142',
    signature: 'Bella Clean',
  },
}

const testVariations = [
  {
    name: '1. Divulgação de Vagas na Semana (Problem Aware)',
    objective: 'divulgar',
    rawInput: 'Tô com vaga pra segunda e quarta, 120 a casa',
    offer: { priceCents: 12000, priceMode: 'exato', discountPercent: null },
    deadline: 'esta_semana',
    kind: 'post',
  },
  {
    name: '2. Promoção Relâmpago com Desconto (Most Aware)',
    objective: 'promocao',
    rawInput: 'Promoção de faxina profunda essa semana, 120 dólares',
    offer: { priceCents: 12000, priceMode: 'exato', discountPercent: 20 },
    deadline: 'esta_semana',
    kind: 'post',
  },
  {
    name: '3. Antes e Depois / Trabalho Feito (Solution Aware)',
    objective: 'trabalho_feito',
    rawInput: 'Olha como ficou essa cozinha que limpei hoje em Framingham, tudo brilhando',
    offer: null,
    deadline: null,
    kind: 'post',
  },
  {
    name: '4. Depoimento de Cliente Satisfeita (Product Aware)',
    objective: 'depoimento',
    rawInput: 'Cliente mandou mensagem elogiando nossa pontualidade e capricho',
    offer: null,
    deadline: null,
    kind: 'post',
  },
  {
    name: '5. Promoção Fim de Semana (Most Aware)',
    objective: 'promocao',
    rawInput: 'Oferta especial de sexta-feira, vaga única',
    offer: { priceCents: 13000, priceMode: 'exato', discountPercent: 15 },
    deadline: 'hoje',
    kind: 'post',
  },
  {
    name: '6. Divulgar Limpeza Residencial Regular (Problem Aware)',
    objective: 'divulgar',
    rawInput: 'Faço limpeza quinzenal e mensal, atendo Framingham e região',
    offer: { priceCents: 10000, priceMode: 'a_partir_de', discountPercent: null },
    deadline: null,
    kind: 'post',
  },
  {
    name: '7. Carrossel de Dicas de Organização (Solution Aware)',
    objective: 'trabalho_feito',
    rawInput: 'Passo a passo de como deixamos o banheiro impecável sem estragar o rejunte',
    offer: null,
    deadline: null,
    kind: 'carousel',
    slideCount: 4,
  },
  {
    name: '8. Divulgação Casa Impecável (Problem Aware)',
    objective: 'divulgar',
    rawInput: 'Chegue em casa e relaxe no sofá sem se preocupar com louça e pó',
    offer: { priceCents: 12000, priceMode: 'exato', discountPercent: null },
    deadline: 'esta_semana',
    kind: 'post',
  },
  {
    name: '9. Promoção Limpeza de Primavera (Most Aware)',
    objective: 'promocao',
    rawInput: 'Spring clean com desconto de 25 dólares pra novas clientes',
    offer: { priceCents: 14000, priceMode: 'exato', discountPercent: 18 },
    deadline: 'esta_semana',
    kind: 'post',
  },
  {
    name: '10. Depoimento Família Americana (Product Aware)',
    objective: 'depoimento',
    rawInput: 'Mais uma casa entregue e cliente 100% satisfeita com nossa equipe',
    offer: null,
    deadline: null,
    kind: 'post',
  },
]

console.log(`\n======================================================`)
console.log(`🧪 ZaPost — Bateria de 10 Testes de Geração de IA`)
console.log(`======================================================\n`)

let validatedFirstTry = 0
let totalCost = 0
const results = []

for (let i = 0; i < testVariations.length; i++) {
  const t = testVariations[i]
  const creativeRequest = {
    objective: t.objective,
    offer: t.offer,
    deadline: t.deadline,
    rawInput: t.rawInput,
    photoIds: ['sample-sala-limpa'],
    networks: ['instagram', 'whatsapp_status'],
    languages: ['pt', 'en'],
    kind: t.kind,
    slideCount: t.slideCount || null,
    enhancePhoto: false,
  }

  process.stdout.write(`[${i + 1}/10] Testando: ${t.name}... `)

  try {
    const brief = await generateCreativeBrief({
      businessProfile: sampleBase.businessProfile,
      creativeRequest,
    })

    validatedFirstTry++
    console.log(`✅ Validado! (Nível: ${brief.awarenessLevel})`)

    results.push({
      testName: t.name,
      objective: t.objective,
      awareness: brief.awarenessLevel,
      ptHeadline: brief.content.pt?.headline,
      enHeadline: brief.content.en?.headline,
      ptCta: brief.content.pt?.cta,
      enCta: brief.content.en?.cta,
    })
  } catch (err) {
    console.log(`❌ Falha: ${err.message}`)
  }
}

// Calcular custos a partir do log
const usagePath = resolve(rootDir, '.ai-usage.jsonl')
if (existsSync(usagePath)) {
  const lines = readFileSync(usagePath, 'utf8').trim().split('\n').filter(Boolean)
  const recentLines = lines.slice(-10)
  for (const l of recentLines) {
    try {
      const parsed = JSON.parse(l)
      totalCost += parsed.costUsd || 0
    } catch {}
  }
}

const avgCost = (totalCost / testVariations.length).toFixed(5)
const successRate = ((validatedFirstTry / testVariations.length) * 100).toFixed(0)

console.log(`\n======================================================`)
console.log(`📊 RELATÓRIO FINAL DA BATERIA DE TESTES`)
console.log(`======================================================`)
console.log(`Taxa de Validação de Primeira: ${successRate}% (${validatedFirstTry}/10)`)
console.log(`Custo Médio por Criativo:      $${avgCost} USD (Teto alvo: < $0.03 USD)`)
console.log(`------------------------------------------------------\n`)

console.log(`🔍 COMPARAÇÃO DE HEADLINES POR OBJETIVO & ADAPTAÇÃO PT/EN:\n`)

for (const r of results.slice(0, 4)) {
  console.log(`📌 ${r.testName}`)
  console.log(`   Nível de Consciência: ${r.awareness}`)
  console.log(`   [PT] Headline: "${r.ptHeadline}" (CTA: ${r.ptCta})`)
  console.log(`   [EN] Headline: "${r.enHeadline}" (CTA: ${r.enCta})`)
  console.log(``)
}
