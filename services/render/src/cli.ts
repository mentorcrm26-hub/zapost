#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { formatsFor, type Format, type Language, type RenderJob } from '@zapost/contracts'
import { renderJob } from './engine.js'
import { getAllTemplateRules } from './templates/index.js'

interface CliOptions {
  briefPath: string
  outDir: string
  mode: 'preview' | 'final'
  templateId?: string | undefined
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  let briefPath = ''
  let outDir = './out'
  let mode: 'preview' | 'final' = 'preview'
  let templateId: string | undefined = undefined

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) continue

    if (arg === '--out' || arg === '-o') {
      outDir = args[++i] || './out'
    } else if (arg === '--mode' || arg === '-m') {
      const m = args[++i]
      if (m === 'preview' || m === 'final') {
        mode = m
      } else {
        console.error(`Modo inválido: "${m}". Use "preview" ou "final".`)
        process.exit(1)
      }
    } else if (arg === '--template' || arg === '-t') {
      templateId = args[++i]
    } else if (!arg.startsWith('-') && !briefPath) {
      briefPath = arg
    }
  }

  if (!briefPath) {
    console.error('Uso: pnpm render <arquivo-brief.json> [--out <dir>] [--mode preview|final] [--template <id>]')
    process.exit(1)
  }

  return { briefPath, outDir, mode, templateId }
}

async function main() {
  const options = parseArgs()
  
  // Resolução inteligente do caminho do brief
  let fullBriefPath = resolve(process.cwd(), options.briefPath)
  if (!existsSync(fullBriefPath)) {
    // Tenta a partir do root se executado dentro de services/render
    const candidate = resolve(process.cwd(), '../../', options.briefPath)
    if (existsSync(candidate)) {
      fullBriefPath = candidate
    }
  }

  if (!existsSync(fullBriefPath)) {
    console.error(`Arquivo não encontrado: ${options.briefPath} (verificado em ${fullBriefPath})`)
    process.exit(1)
  }

  const rawJson = readFileSync(fullBriefPath, 'utf8')
  const briefData = JSON.parse(rawJson)

  const { businessProfile, brandKit, creativeRequest, creativeBrief } = briefData

  if (!creativeBrief || !brandKit || !creativeRequest) {
    console.error('O arquivo JSON fornecido não contém a estrutura esperada (brandKit, creativeRequest, creativeBrief).')
    process.exit(1)
  }

  // Resolução inteligente do diretório de saída
  // Se o usuário rodou da raiz ou de dentro do package, respeita o local onde o comando foi chamado
  let fullOutDir = resolve(process.cwd(), options.outDir)
  // Se estivermos dentro de services/render e o outDir for relativo simples, podemos colocar na raiz para fácil acesso
  if (process.cwd().endsWith('render') && options.outDir.startsWith('./')) {
    fullOutDir = resolve(process.cwd(), '../../', options.outDir)
  }

  if (!existsSync(fullOutDir)) {
    mkdirSync(fullOutDir, { recursive: true })
  }

  const photoId = creativeRequest.photoIds?.[0] || null

  console.log(`\n========================================`)
  console.log(`🚀 ZaPost Render Engine (Fase 1)`)
  console.log(`========================================`)
  console.log(`📁 Entrada: ${options.briefPath}`)
  console.log(`🎯 Modo:    ${options.mode.toUpperCase()}`)
  console.log(`📂 Saída:   ${fullOutDir}`)
  console.log(`----------------------------------------\n`)

  const jobsToRender: { job: RenderJob; fileName: string }[] = []

  if (options.mode === 'preview') {
    // Regra 17: No modo preview, 3 opções de template em UM formato (feed_45) e no primeiro idioma (pt) com marca d'água
    const templates = creativeBrief.templateHints?.length
      ? creativeBrief.templateHints
      : getAllTemplateRules().map((r) => r.id)

    const previewLang: Language = creativeBrief.content.pt ? 'pt' : 'en'
    const content = creativeBrief.content[previewLang]

    if (!content) {
      console.error(`Conteúdo não encontrado para o idioma "${previewLang}".`)
      process.exit(1)
    }

    for (const tId of templates) {
      const job: RenderJob = {
        briefId: creativeBrief.requestId,
        templateId: tId,
        format: 'feed_45',
        language: previewLang,
        brandKit,
        content,
        photoUrl: photoId,
        watermark: true,
      }
      const fileName = `${tId}_feed_45_${previewLang}_preview.png`
      jobsToRender.push({ job, fileName })
    }
  } else {
    // Modo final: Template selecionado expande para todos os formatos das redes e todos os idiomas sem marca d'água
    const selectedTemplate = options.templateId || creativeBrief.templateHints?.[0] || 'bold-price'
    const formats: Format[] = formatsFor(creativeRequest.networks)
    const languages: Language[] = creativeRequest.languages || ['pt']

    for (const fmt of formats) {
      for (const lang of languages) {
        const content = creativeBrief.content[lang]
        if (!content) continue

        const job: RenderJob = {
          briefId: creativeBrief.requestId,
          templateId: selectedTemplate,
          format: fmt,
          language: lang,
          brandKit,
          content,
          photoUrl: photoId,
          watermark: false,
        }
        const fileName = `${selectedTemplate}_${fmt}_${lang}.png`
        jobsToRender.push({ job, fileName })
      }
    }
  }

  console.log(`Renderizando ${jobsToRender.length} imagem(ns)...`)
  const startTime = Date.now()

  const renderedFiles: string[] = []

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
    } catch (err: any) {
      console.log(`❌ ERRO`)
      console.error(`     ${err?.message || err}`)
    }
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n✨ Concluído! ${renderedFiles.length} arquivos gerados em ${totalDuration}s.`)
  console.log(`📂 Diretório de saída: ${fullOutDir}\n`)
}

main().catch((err) => {
  console.error('Erro fatal no CLI:', err)
  process.exit(1)
})
