import type { ContentProvider, ContentGenerateInput, ContentGenerateOutput } from '../types.js'
import { recordAiUsage } from '../usage-tracker.js'

export class OpenAIContentProvider implements ContentProvider {
  private apiKey: string
  private model: string

  constructor(options?: { apiKey?: string; model?: string }) {
    this.apiKey = options?.apiKey || process.env.OPENAI_API_KEY || ''
    this.model = options?.model || process.env.OPENAI_MODEL || 'gpt-4o'
  }

  async generate(input: ContentGenerateInput): Promise<ContentGenerateOutput> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada no ambiente.')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: input.systemPrompt },
          { role: 'user', content: input.userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      recordAiUsage({
        provider: 'openai',
        model: this.model,
        action: 'content_generation',
        costUsd: 0,
        success: false,
      })
      throw new Error(`Erro na API da OpenAI (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as any
    const rawText = data.choices?.[0]?.message?.content || ''

    const inputTokens = data.usage?.prompt_tokens || 0
    const outputTokens = data.usage?.completion_tokens || 0

    // Custo GPT-4o: ~$2.50/1M in, $10.00/1M out
    const costIn = (inputTokens / 1_000_000) * 2.5
    const costOut = (outputTokens / 1_000_000) * 10.0
    const costUsd = Number((costIn + costOut).toFixed(6))

    recordAiUsage({
      provider: 'openai',
      model: this.model,
      action: 'content_generation',
      inputTokens,
      outputTokens,
      costUsd,
      success: true,
    })

    return {
      rawText,
      provider: 'openai',
      model: this.model,
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
    }
  }
}
