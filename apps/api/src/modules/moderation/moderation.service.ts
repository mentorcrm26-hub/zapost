import { Injectable, Logger, BadRequestException } from '@nestjs/common'

export interface ModerationResult {
  allowed: boolean
  flaggedCategory?: 'medical_promise' | 'income_guarantee' | 'immigration_guarantee' | 'prohibited_content'
  reason?: string
  confidence: number
}

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name)

  // Expressões proibidas categorizadas
  private readonly rules = [
    {
      category: 'medical_promise' as const,
      regex: /\b(cura\s+definitiva|cure\s+sua\s+diabetes|remédio\s+milagroso|tratamento\s+100%\s+garantido|cura\s+do\s+câncer|cure\s+any\s+disease|guaranteed\s+cure)\b/i,
      message: 'Promessas médicas de cura milagrosa ou tratamentos 100% garantidos são proibidas pelas diretrizes de anúncios.',
    },
    {
      category: 'income_guarantee' as const,
      regex: /\b(ganhe\s+\$?[0-9.,]+\s*(por\s+dia|por\s+semana|por\s+mês|garantido)|renda\s+fácil|fique\s+rico|retorno\s+100%\s+garantido|guaranteed\s+income|earn\s+\$?[0-9.,]+\s*guaranteed)\b/i,
      message: 'Garantias de renda fixa ou promessas de enriquecimento rápido violam as políticas de conformidade.',
    },
    {
      category: 'immigration_guarantee' as const,
      regex: /\b(visto(\s+\w+)?\s+garantido|green\s+card\s+garantido|aprovação\s+100%\s+garantida\s+na\s+imigração|guaranteed\s+visa|guaranteed\s+green\s+card)\b/i,
      message: 'Serviços de imigração com promessa de resultado garantido não são permitidos.',
    },
  ]

  /**
   * Executa a moderação ANTES de gastar tokens em qualquer chamada de IA generativa
   */
  moderateBriefing(input: {
    text: string
    transcription?: string
    clientIp?: string
    tenantId?: string
  }): ModerationResult {
    const combinedText = `${input.text || ''} ${input.transcription || ''}`.trim()

    for (const rule of this.rules) {
      if (rule.regex.test(combinedText)) {
        this.logger.warn(
          `[Moderação Bloqueada] Categoria: ${rule.category} | IP: ${input.clientIp || 'N/A'} | Tenant: ${input.tenantId || 'Anônimo'} | Texto: "${combinedText.substring(0, 80)}..."`
        )

        return {
          allowed: false,
          flaggedCategory: rule.category,
          reason: rule.message,
          confidence: 0.99,
        }
      }
    }

    return {
      allowed: true,
      confidence: 1.0,
    }
  }

  /**
   * Lança exceção amigável caso seja reprovado
   */
  assertAllowed(input: { text: string; transcription?: string; clientIp?: string; tenantId?: string }) {
    const res = this.moderateBriefing(input)
    if (!res.allowed) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Conteúdo Reprovado na Moderação Prévia',
        message: res.reason,
        category: res.flaggedCategory,
      })
    }
  }
}
