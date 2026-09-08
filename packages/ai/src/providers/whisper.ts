import type { TranscriptionProvider } from '../types.js'
import { recordAiUsage } from '../usage-tracker.js'

export class WhisperTranscriptionProvider implements TranscriptionProvider {
  private apiKey: string
  private model: string

  constructor(options?: { apiKey?: string; model?: string }) {
    this.apiKey = options?.apiKey || process.env.OPENAI_API_KEY || ''
    this.model = options?.model || process.env.WHISPER_MODEL || 'whisper-1'
  }

  async transcribe(
    audio: Buffer | Uint8Array | string,
    options?: { filename?: string; mimeType?: string }
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada no ambiente para o Whisper.')
    }

    const formData = new FormData()
    const filename = options?.filename || 'audio.mp3'
    const mimeType = options?.mimeType || 'audio/mpeg'

    let blob: Blob
    if (typeof audio === 'string') {
      // Se for string base64 ou texto direto
      blob = new Blob([Buffer.from(audio, 'base64')], { type: mimeType })
    } else {
      blob = new Blob([audio], { type: mimeType })
    }

    formData.append('file', blob, filename)
    formData.append('model', this.model)
    formData.append('language', 'pt') // Áudio falado pelo cliente em português

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      recordAiUsage({
        provider: 'openai',
        model: this.model,
        action: 'transcription',
        costUsd: 0,
        success: false,
      })
      throw new Error(`Erro na API Whisper (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as any
    const text = data.text || ''

    // Custo estimado Whisper: ~$0.006/minuto (~$0.001 por 10s de áudio padrão)
    const costUsd = 0.002

    recordAiUsage({
      provider: 'openai',
      model: this.model,
      action: 'transcription',
      costUsd,
      success: true,
    })

    return text
  }
}
