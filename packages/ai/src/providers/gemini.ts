import type {
  ContentProvider,
  ContentGenerateInput,
  ContentGenerateOutput,
  TranscriptionProvider,
} from '../types.js'
import { recordAiUsage } from '../usage-tracker.js'

export class GeminiContentProvider implements ContentProvider, TranscriptionProvider {
  private apiKey: string
  private model: string

  constructor(options?: { apiKey?: string; model?: string }) {
    this.apiKey = options?.apiKey || process.env.GEMINI_API_KEY || ''
    this.model = options?.model || process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  }

  async generate(input: ContentGenerateInput): Promise<ContentGenerateOutput> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY não configurada no ambiente.')
    }

    const candidateModels = [
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-3.8-flash',
      'gemini-3.6-flash',
      'gemini-flash-latest',
    ]

    let lastError: Error | null = null

    for (const modelToTry of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${this.apiKey}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${input.systemPrompt}\n\n---\n${input.userPrompt}` }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          if (response.status === 503 || response.status === 429 || response.status === 404) {
            console.warn(`[gemini] Modelo ${modelToTry} ocupado (${response.status}), tentando fallback...`)
            lastError = new Error(`Erro na API do Google Gemini (${response.status}): ${errorText}`)
            continue
          }
          throw new Error(`Erro na API do Google Gemini (${response.status}): ${errorText}`)
        }

        const data = (await response.json()) as any
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        const inputTokens = data.usageMetadata?.promptTokenCount || 0
        const outputTokens = data.usageMetadata?.candidatesTokenCount || 0

        const costUsd = 0.0001

        recordAiUsage({
          provider: 'gemini',
          model: modelToTry,
          action: 'content_generation',
          inputTokens,
          outputTokens,
          costUsd,
          success: true,
        })

        return {
          rawText,
          provider: 'gemini',
          model: modelToTry,
          usage: {
            inputTokens,
            outputTokens,
            costUsd,
          },
        }
      } catch (err: any) {
        lastError = err
      }
    }

    recordAiUsage({
      provider: 'gemini',
      model: this.model,
      action: 'content_generation',
      costUsd: 0,
      success: false,
    })
    throw lastError || new Error('Falha em todos os modelos Gemini disponíveis.')
  }

  async transcribe(
    audio: Buffer | Uint8Array | string,
    options?: { filename?: string; mimeType?: string }
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY não configurada no ambiente para transcrição.')
    }

    const base64Audio =
      typeof audio === 'string' ? audio : Buffer.from(audio).toString('base64')
    const mimeType = options?.mimeType || 'audio/mp3'

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: 'Transcreva com exatidão o áudio a seguir em português do Brasil. Retorne apenas o texto transcrito, sem introduções ou comentários.',
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Audio,
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro na transcrição Gemini (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as any
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
  }
}
