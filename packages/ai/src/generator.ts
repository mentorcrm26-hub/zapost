import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import {
  AWARENESS_BY_OBJECTIVE,
  CreativeBrief,
  type BusinessProfile,
  type CreativeRequest,
} from '@zapost/contracts'
import type { ContentProvider, GenerationContext } from './types.js'
import { composeSkills } from './composer.js'
import { ClaudeContentProvider } from './providers/claude.js'
import { OpenAIContentProvider } from './providers/openai.js'
import { GeminiContentProvider } from './providers/gemini.js'
import { MockContentProvider } from './providers/mock.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(currentDir, '../../..')
const systemPromptPath = resolve(rootDir, 'prompts/system-creative.md')

function loadSystemPrompt(): string {
  if (!existsSync(systemPromptPath)) {
    throw new Error(`Arquivo de prompt de sistema não encontrado: ${systemPromptPath}`)
  }
  return readFileSync(systemPromptPath, 'utf8')
}

export function getDefaultContentProvider(): ContentProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiContentProvider()
  }
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIContentProvider()
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return new ClaudeContentProvider()
  }
  if (process.env.ZAPOST_ALLOW_MOCK === '1') {
    console.warn('\n' + '='.repeat(64))
    console.warn('  ⚠️  MODO MOCK — NENHUMA IA FOI CHAMADA')
    console.warn('  O conteúdo é falso e o custo registrado é fictício.')
    console.warn('='.repeat(64) + '\n')
    return new MockContentProvider()
  }
  throw new Error(
    'Nenhuma chave de IA configurada (GEMINI_API_KEY, OPENAI_API_KEY ou ANTHROPIC_API_KEY). Preencha o .env.'
  )
}

/**
 * Remove possíveis blocos de formatação markdown (```json ... ```) se o modelo os incluir.
 */
function cleanJsonText(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }
  return cleaned.trim()
}

export async function generateCreativeBrief(context: GenerationContext): Promise<CreativeBrief> {
  const { businessProfile, creativeRequest, skillsDir } = context

  // TODO: IA de tratamento de imagem ligada pelo botão "✨ melhorar foto" (enhancePhoto)
  if (creativeRequest.enhancePhoto) {
    // Restrição da Fase 2: IA de imagem continua DESLIGADA por padrão.
    // TODO: Implementar integração com provedor de imagem quando enhancePhoto for true.
  }

  const awarenessLevel = AWARENESS_BY_OBJECTIVE[creativeRequest.objective]
  const { skillsUsed, composedText } = composeSkills(businessProfile, creativeRequest, skillsDir)
  const systemPrompt = loadSystemPrompt()
  const provider = context.contentProvider || getDefaultContentProvider()

  const requestId = randomUUID()

  const userPrompt = `
Gere o CreativeBrief para o seguinte pedido:

---
FICHA DO NEGÓCIO:
${JSON.stringify(businessProfile, null, 2)}

---
BRIEFING DO CRIATIVO:
${JSON.stringify(creativeRequest, null, 2)}

---
ESTRATÉGIA:
- requestId: "${requestId}"
- awarenessLevel: "${awarenessLevel}"
- templateHints: ["bold-price", "photo-overlay", "clean-split"]
- skillsUsed: ${JSON.stringify(skillsUsed)}

---
SKILLS INJETADAS (Siga rigorosamente):
${composedText}

---
IMPORTANTE: Retorne ESTRITAMENTE o JSON completo válido de CreativeBrief, preenchendo os idiomas solicitados (${creativeRequest.languages.join(', ')}).
`

  // 1ª Tentativa
  const firstResult = await provider.generate({
    systemPrompt,
    userPrompt,
    temperature: 0.3,
  })

  let rawJson = cleanJsonText(firstResult.rawText)
  let parsedObj: unknown

  try {
    parsedObj = JSON.parse(rawJson)
  } catch (parseError) {
    // Se falhar o parse de JSON, força correção
    parsedObj = null
  }

  let validationResult = parsedObj ? CreativeBrief.safeParse(parsedObj) : null

  if (validationResult && validationResult.success) {
    return validationResult.data
  }

  // 2ª Tentativa (Refaz UMA vez enviando os erros do Zod)
  console.warn('[generator] 1ª tentativa falhou na validação. Refazendo com feedback do Zod...')

  const zodErrors = validationResult
    ? validationResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
    : 'A resposta não continha um JSON válido.'

  const retryPrompt = `
Sua resposta anterior continha erros de validação com o schema Zod do CreativeBrief:

ERROS ENCONTRADOS:
${zodErrors}

RESPOSTA ANTERIOR:
${firstResult.rawText}

Por favor, corrija rigorosamente os erros e devolva o JSON 100% válido correspondente ao CreativeBrief.
`

  const retryResult = await provider.generate({
    systemPrompt,
    userPrompt: retryPrompt,
    temperature: 0.1,
  })

  rawJson = cleanJsonText(retryResult.rawText)

  try {
    parsedObj = JSON.parse(rawJson)
  } catch (err) {
    const failedDumpPath = resolve(rootDir, '.last-failed-generation.json')
    try {
      const { writeFileSync } = await import('node:fs')
      writeFileSync(
        failedDumpPath,
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            firstAttempt: firstResult.rawText,
            secondAttempt: retryResult.rawText,
            parseError: String(err),
          },
          null,
          2
        ),
        'utf8'
      )
    } catch {}
    throw new Error(
      `Falha crítica: O LLM não retornou um JSON válido na 2ª tentativa. Saída salva em ${failedDumpPath}. Erro: ${err}`
    )
  }

  validationResult = CreativeBrief.safeParse(parsedObj)

  if (!validationResult.success) {
    const failedDumpPath = resolve(rootDir, '.last-failed-generation.json')
    try {
      const { writeFileSync } = await import('node:fs')
      writeFileSync(
        failedDumpPath,
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            firstAttempt: firstResult.rawText,
            secondAttempt: retryResult.rawText,
            parsedJson: parsedObj,
            zodIssues: validationResult.error.issues,
          },
          null,
          2
        ),
        'utf8'
      )
    } catch {}

    const errorDetails = validationResult.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ')
    throw new Error(
      `CreativeBrief falhou na validação Zod após 2 tentativas: ${errorDetails}. Saída bruta salva para diagnóstico em ${failedDumpPath}`
    )
  }

  return validationResult.data
}
