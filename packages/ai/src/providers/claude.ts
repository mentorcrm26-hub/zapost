import type { ContentProvider, ContentGenerateInput, ContentGenerateOutput } from '../types.js'
import { recordAiUsage } from '../usage-tracker.js'

export class ClaudeContentProvider implements ContentProvider {
  private apiKey: string
  private model: string

  constructor(options?: { apiKey?: string; model?: string }) {
    this.apiKey = options?.apiKey || process.env.ANTHROPIC_API_KEY || ''
    this.model = options?.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'
  }

  async generate(input: ContentGenerateInput): Promise<ContentGenerateOutput> {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY não configurada no ambiente.')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        // Teto, não cobrança: paga-se só o que for gerado. 1500 truncava o JSON,
        // porque o CreativeBrief traz caption longa em PT e EN e o thinking
        // adaptativo (ligado por padrão) também consome tokens de saída.
        max_tokens: input.maxTokens || 8000,
        // temperature/top_p/top_k foram REMOVIDOS nos modelos atuais (Sonnet 5,
        // Opus 5, família 4.6+). Enviar qualquer um devolve 400. Profundidade e
        // custo se controlam por output_config.effort, não por sampling.
        // "low" porque isto é transformação estruturada guiada por skills, não
        // raciocínio aberto — e roda em todo criativo, então é rota de volume.
        output_config: { effort: 'low' },
        system: input.systemPrompt,
        messages: [{ role: 'user', content: input.userPrompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      recordAiUsage({
        provider: 'anthropic',
        model: this.model,
        action: 'content_generation',
        costUsd: 0,
        success: false,
      })
      throw new Error(`Erro na API da Anthropic (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as any
    const rawText = data.content?.[0]?.text || ''

    const inputTokens = data.usage?.input_tokens || 0
    const outputTokens = data.usage?.output_tokens || 0

    // Tabela de preços Anthropic (Claude Sonnet: $2.00/1M in, $10.00/1M out)
    const costIn = (inputTokens / 1_000_000) * 2.0
    const costOut = (outputTokens / 1_000_000) * 10.0
    const costUsd = Number((costIn + costOut).toFixed(6))

    recordAiUsage({
      provider: 'anthropic',
      model: this.model,
      action: 'content_generation',
      inputTokens,
      outputTokens,
      costUsd,
      success: true,
    })

    return {
      rawText,
      provider: 'anthropic',
      model: this.model,
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
    }
  }
}
