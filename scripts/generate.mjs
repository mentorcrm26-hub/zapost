#!/usr/bin/env node
/**
 * ZaPost - CLI Gerador Ponta a Ponta (Fase 2)
 *
 *   pnpm generate samples/request-limpeza.json --out ./out
 *   pnpm generate samples/request-limpeza.json --out ./out --mode final --template bold-price
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formatsFor } from '../packages/contracts/dist/index.js'
import { generateCreativeBrief, WhisperTranscriptionProvider, MockTranscriptionProvider } from '../packages/ai/dist/index.js'
import { renderJob, getAllTemplateRules } from '../services/render/dist/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

function parseArgs() {
  const args = process.argv.slice(2)
  let requestPath = ''
  let outDir = './out'
  let mode = 'preview'
  let templateId = undefined

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) continue

    if (arg === '--out' || arg === '-o') {
      outDir = args[++i] || './out'
    } else if (arg === '--mode' || arg === '-m') {
      const m = args[++i]
      if (m === 'preview' || m === 'final') {
        mode = m
      }
    } else if (arg === '--template' || arg === '-t') {
      templateId = args[++i]
    } else if (!arg.startsWith('-') && !requestPath) {
      requestPath = arg
    }
  }

  if (!requestPath) {
    console.error('Uso: pnpm generate <arquivo-request.json> [--out <dir>] [--mode preview|final] [--template <id>]')
    process.exit(1)
  }

  return { requestPath, outDir, mode, templateId }
}

async function main() {
  const options = parseArgs()
  let fullRequestPath = resolve(process.cwd(), options.requestPath)

  if (!existsSync(fullRequestPath)) {
    const candidate = resolve(rootDir, options.requestPath)
    if (existsSync(candidate)) {
      fullRequestPath = candidate
    } else {
      console.error(`Arquivo de pedido não encontrado: ${options.requestPath}`)
      process.exit(1)
    }
  }

  const rawJson = readFileSync(fullRequestPath, 'utf8')
  const data = JSON.parse(rawJson)

  const { businessProfile, brandKit, creativeRequest } = data

  if (!businessProfile || !brandKit || !creativeRequest) {
    console.error('O JSON deve conter businessProfile, brandKit e creativeRequest.')
    process.exit(1)
  }

  const fullOutDir = resolve(process.cwd(), options.outDir)
  if (!existsSync(fullOutDir)) {
    mkdirSync(fullOutDir, { recursive: true })
  }

  console.log(`\n========================================`)
  console.log(`⚡ ZaPost — Gerador de Criativos (Fase 2)`)
  console.log(`========================================`)
  console.log(`📁 Pedido:  ${options.requestPath}`)
  console.log(`🎯 Modo:    ${options.mode.toUpperCase()}`)
  console.log(`📂 Saída:   ${fullOutDir}`)
  console.log(`----------------------------------------\n`)

  // 1. Transcrição de áudio se aplicável
  if (data.audioPath && !creativeRequest.rawInput) {
    console.log('🎙️ Transcrevendo áudio do cliente via Whisper...')
    const audioFullPath = resolve(process.cwd(), data.audioPath)
    const audioBuffer = readFileSync(audioFullPath)

    let transcriptionProvider
    if (process.env.OPENAI_API_KEY) {
      transcriptionProvider = new WhisperTranscriptionProvider()
    } else if (process.env.ZAPOST_ALLOW_MOCK === '1') {
      console.warn('\n' + '='.repeat(64))
      console.warn('  ⚠️  MODO MOCK — TRANSCRIÇÃO DE ÁUDIO FALSA')
      console.warn('  Nenhum áudio foi enviado à OpenAI.')
      console.warn('='.repeat(64) + '\n')
      transcriptionProvider = new MockTranscriptionProvider()
    } else {
      throw new Error(
        'OPENAI_API_KEY não definida para transcrição de áudio. Copie .env.example para .env e preencha. ' +
        'Para usar o provedor falso de propósito: ZAPOST_ALLOW_MOCK=1'
      )
    }

    creativeRequest.rawInput = await transcriptionProvider.transcribe(audioBuffer)
    console.log(`   Transcrição: "${creativeRequest.rawInput}"\n`)
  }

  // 2. Geração do CreativeBrief via IA
  console.log('🧠 Compondo skills e gerando CreativeBrief...')
  const startTime = Date.now()

  const brief = await generateCreativeBrief({
    businessProfile,
    creativeRequest,
  })

  const genDuration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`✅ CreativeBrief gerado e validado por Zod (${genDuration}s)!`)
  console.log(`   Nível de Consciência: ${brief.awarenessLevel}`)
  console.log(`   Skills Aplicadas:     ${brief.skillsUsed.join(', ')}`)

  if (brief.content.pt) {
    console.log(`   [PT] Headline: "${brief.content.pt.headline}" | CTA: "${brief.content.pt.cta}"`)
  }
  if (brief.content.en) {
    console.log(`   [EN] Headline: "${brief.content.en.headline}" | CTA: "${brief.content.en.cta}"`)
  }
  console.log(`----------------------------------------\n`)

  // 3. Renderização dos PNGs
  const photoId = creativeRequest.photoIds?.[0] || null
  const jobsToRender = []

  if (options.mode === 'preview') {
    const templates = brief.templateHints?.length ? brief.templateHints : ['bold-price', 'photo-overlay', 'clean-split']
    const previewLang = brief.content.pt ? 'pt' : 'en'
    const content = brief.content[previewLang]

    for (const tId of templates) {
      const job = {
        briefId: brief.requestId,
        templateId: tId,
        format: 'feed_45',
        language: previewLang,
        brandKit,
        content,
        photoUrl: photoId,
        watermark: true,
      }
      jobsToRender.push({ job, fileName: `${tId}_feed_45_${previewLang}_preview.png` })
    }
  } else {
    const selectedTemplate = options.templateId || brief.templateHints?.[0] || 'bold-price'
    const formats = formatsFor(creativeRequest.networks)
    const languages = creativeRequest.languages || ['pt']

    for (const fmt of formats) {
      for (const lang of languages) {
        const content = brief.content[lang]
        if (!content) continue

        const job = {
          briefId: brief.requestId,
          templateId: selectedTemplate,
          format: fmt,
          language: lang,
          brandKit,
          content,
          photoUrl: photoId,
          watermark: false,
        }
        jobsToRender.push({ job, fileName: `${selectedTemplate}_${fmt}_${lang}.png` })
      }
    }
  }

  console.log(`🎨 Renderizando ${jobsToRender.length} imagem(ns) PNG...`)
  const renderedFiles = []

  for (const { job, fileName } of jobsToRender) {
    const jobStart = Date.now()
    process.stdout.write(`  ⏳ Gerando ${fileName}... `)

    try {
      const pngBuffer = await renderJob(job)
      const outputPath = resolve(fullOutDir, fileName)
      writeFileSync(outputPath, pngBuffer)
      const duration = Date.now() - jobStart
      console.log(`✅ OK (${duration}ms)`)
      renderedFiles.push(outputPath)
    } catch (err) {
      console.log(`❌ ERRO`)
      console.error(err)
    }
  }

  console.log(`\n🎉 Processo concluído com sucesso!`)
  console.log(`📂 ${renderedFiles.length} arquivos gerados em: ${fullOutDir}\n`)
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err)
  process.exit(1)
})
