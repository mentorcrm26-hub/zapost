import { randomUUID } from 'node:crypto'
import type { ContentProvider, ContentGenerateInput, ContentGenerateOutput, TranscriptionProvider } from '../types.js'
import { recordAiUsage } from '../usage-tracker.js'

export class MockContentProvider implements ContentProvider {
  async generate(input: ContentGenerateInput): Promise<ContentGenerateOutput> {
    const userPrompt = input.userPrompt

    // Extrai o objetivo e idioma do prompt para simular a resposta inteligente por nível de consciência
    const isPromo = userPrompt.includes('"objective": "promocao"') || userPrompt.includes('most_aware')
    const isDivulgar = userPrompt.includes('"objective": "divulgar"') || userPrompt.includes('problem_aware')
    const isPortfolio = userPrompt.includes('"objective": "trabalho_feito"') || userPrompt.includes('solution_aware')
    const isTestimonial = userPrompt.includes('"objective": "depoimento"') || userPrompt.includes('product_aware')

    let awareness = 'problem_aware'
    let ptHeadline = 'Segunda e quarta livres'
    let ptSubheadline = 'Sua casa impecável, sem você levantar um dedo'
    let ptPriceLabel = '$120 a casa'
    let ptCta = 'Chama no WhatsApp'
    let ptCaption = 'Segunda e quarta livres essa semana! 🧹 Deixo sua casa impecável por $120. Atendo a região. Chama no WhatsApp pra garantir o seu horário.'

    let enHeadline = 'Monday and Wednesday open'
    let enSubheadline = 'Come home to a spotless house'
    let enPriceLabel = '$120 per home'
    let enCta = 'Text us today'
    let enCaption = 'Two spots left this week 🧹 Spotless home for $120. Serving the local area. Text us today to grab your slot.'

    if (isPromo) {
      awareness = 'most_aware'
      ptHeadline = 'Faxina profunda por $120 esta semana'
      ptSubheadline = 'Garanta sua casa limpa com preço especial de segunda a quinta'
      ptPriceLabel = '$120 na oferta'
      ptCta = 'Garantir promoção'
      ptCaption = 'Oferta especial dessa semana! 🔥 Faxina completa por apenas $120. Poucos horários disponíveis. Chama no WhatsApp antes que acabe.'

      enHeadline = '$120 deep clean special this week'
      enSubheadline = 'Book your spotless clean at our limited-time rate'
      enPriceLabel = '$120 flat rate'
      enCta = 'Claim offer today'
      enCaption = 'Limited time cleaning special! 🔥 Full home clean for just $120. Spots go fast, text us today to book.'
    } else if (isPortfolio) {
      awareness = 'solution_aware'
      ptHeadline = 'Resultado impecável do chão ao teto'
      ptSubheadline = 'Veja a transformação de mais um lar atendido com carinho'
      ptPriceLabel = 'A partir de $120'
      ptCta = 'Solicitar orçamento'
      ptCaption = 'Mais uma casa entregue 100% brilhando e cheirosa! ✨ Agende já o seu dia.'

      enHeadline = 'Spotless from floor to ceiling'
      enSubheadline = 'See the real results from our latest residential cleaning'
      enPriceLabel = 'Starting at $120'
      enCta = 'Get a free quote'
      enCaption = 'Another home left sparkling clean! ✨ Text us today for your estimate.'
    } else if (isTestimonial) {
      awareness = 'product_aware'
      ptHeadline = 'Quem contrata recomenda de olhos fechados'
      ptSubheadline = 'Pontualidade, confiança e capricho em cada cantinho da sua casa'
      ptPriceLabel = '$120 a casa'
      ptCta = 'Conheça nossos serviços'
      ptCaption = 'A satisfação das nossas clientes é nossa maior alegria! 💛 Agende seu atendimento.'

      enHeadline = 'Loved by homeowners everywhere'
      enSubheadline = 'Reliable, punctual and detail-oriented cleaning you can trust'
      enPriceLabel = '$120 per home'
      enCta = 'Message us today'
      enCaption = 'Happy clients and sparkling clean homes every week! 💛 Text us to schedule.'
    }

    const mockResponse = {
      requestId: randomUUID(),
      awarenessLevel: awareness,
      templateHints: ['bold-price', 'photo-overlay', 'clean-split'],
      skillsUsed: ['base', 'tecnica-copywriting', 'adaptacao-ingles', 'segmento-limpeza'],
      content: {
        pt: {
          headline: ptHeadline,
          subheadline: ptSubheadline,
          priceLabel: ptPriceLabel,
          cta: ptCta,
          caption: ptCaption,
          hashtags: ['#limpeza', '#casa', '#brasileirosnoseua', '#housecleaning'],
          slides: null,
        },
        en: {
          headline: enHeadline,
          subheadline: enSubheadline,
          priceLabel: enPriceLabel,
          cta: enCta,
          caption: enCaption,
          hashtags: ['#housecleaning', '#cleaningservice', '#homecare'],
          slides: null,
        },
      },
    }

    const rawText = JSON.stringify(mockResponse, null, 2)
    const inputTokens = 420
    const outputTokens = 290
    const costUsd = 0.00561

    recordAiUsage({
      provider: 'mock-claude',
      model: 'claude-3-5-sonnet',
      action: 'content_generation',
      inputTokens,
      outputTokens,
      costUsd,
      success: true,
    })

    return {
      rawText,
      provider: 'mock-claude',
      model: 'claude-3-5-sonnet',
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
    }
  }
}

export class MockTranscriptionProvider implements TranscriptionProvider {
  async transcribe(
    audio: Buffer | Uint8Array | string,
    options?: { filename?: string; mimeType?: string }
  ): Promise<string> {
    const text = 'Faz um post da minha empresa de limpeza, tô com vaga pra segunda e quarta, cento e vinte a casa'

    recordAiUsage({
      provider: 'mock-whisper',
      model: 'whisper-1',
      action: 'transcription',
      costUsd: 0.002,
      success: true,
    })

    return text
  }
}
