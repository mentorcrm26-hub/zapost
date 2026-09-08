import { randomUUID } from 'node:crypto'
import type {
  BusinessProfile,
  BrandKit,
  CreativeRequest,
  Objective,
  Deadline,
  Network,
  RenderJob,
} from '@zapost/contracts'
import { formatsFor } from '@zapost/contracts'
import { generateCreativeBrief, WhisperTranscriptionProvider, MockTranscriptionProvider } from '@zapost/ai'
import { renderJob } from '@zapost/render'
import type {
  ChannelAdapter,
  ConversationSession,
  IncomingMessage,
  SessionStore,
} from './types.js'

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  segment: 'limpeza',
  city: 'Framingham',
  state: 'MA',
  timezone: 'America/New_York',
  audience: 'ambos',
  languages: ['pt', 'en'],
  contactChannel: 'whatsapp',
  contactValue: '+1 (508) 555-0142',
}

export const DEFAULT_BRAND_KIT: BrandKit = {
  logoUrl: null,
  colors: ['#2F6F5E', '#FFB300', '#0F2E2A'],
  fontFamily: null,
  handle: '@bellaclean.ma',
  phone: '+1 (508) 555-0142',
  signature: 'Bella Clean',
}

export class ConversationEngine {
  private sessionStore: SessionStore

  constructor(sessionStore: SessionStore) {
    this.sessionStore = sessionStore
  }

  async handleMessage(incoming: IncomingMessage, adapter: ChannelAdapter): Promise<void> {
    const userId = incoming.userId
    let session = await this.sessionStore.get(userId)

    // Tratamento de saída de emergência ("1" recomeçar, "0" atendente)
    const rawText = incoming.text?.trim()
    if (rawText === '0') {
      await adapter.sendText(
        '🤝 Entendido! Já avisei nossa equipe e uma pessoa vai te responder por aqui em instantes.'
      )
      return
    }

    const SESSION_TTL_MS = 30 * 60 * 1000 // 30 minutos
    let sessionExpired = false
    if (session && Date.now() - session.lastActivity > SESSION_TTL_MS) {
      await this.sessionStore.delete(userId)
      session = null
      sessionExpired = true
    }

    if (rawText === '1' || incoming.buttonPayload === 'cmd_recomecar') {
      await this.sessionStore.delete(userId)
      session = null
    }

    // Inicialização de nova sessão
    if (!session) {
      session = {
        userId,
        state: 'aguardando_foto_audio',
        lastActivity: Date.now(),
        businessProfile: DEFAULT_BUSINESS_PROFILE,
        brandKit: DEFAULT_BRAND_KIT,
        draftRequest: {
          photoIds: ['sample-sala-limpa'],
          networks: ['instagram', 'whatsapp_status'],
          languages: ['pt', 'en'],
          kind: 'post',
        },
      }

      // Se for apenas comando de reinício/início sem mídia anexada
      const hasMedia = Boolean(incoming.photoBuffer || incoming.photoUrl || incoming.audioBuffer)
      if (rawText === '1' || incoming.buttonPayload === 'cmd_recomecar') {
        await this.sessionStore.set(userId, session)
        await adapter.sendText(
          `Prontinho, recomeçamos do zero! 🔄\n\nManda pra mim <b>uma foto</b> e <b>um áudio</b> explicando o que você quer no post.`
        )
        return
      }

      if (sessionExpired) {
        await this.sessionStore.set(userId, session)
        await adapter.sendText(
          `Sua sessão anterior expirou por 30 minutos de inatividade. ⏳\n\nVamos começar um novo post! Manda pra mim <b>uma foto</b> e <b>um áudio</b>.`
        )
        return
      }

      if (!hasMedia && (!rawText || rawText.length < 15)) {
        await this.sessionStore.set(userId, session)
        await adapter.sendText(
          `Oi! 👋 Sou o assistente do <b>ZaPost</b>.\n\nManda pra mim <b>uma foto</b> do seu serviço e <b>um áudio</b> (ou texto) falando o que você quer postar hoje.`
        )
        return
      }
    }

    session.lastActivity = Date.now()

    // Processamento de acordo com o estado atual
    try {
      switch (session.state) {
        case 'aguardando_foto_audio':
          await this.handleAguardandoFotoAudio(incoming, session, adapter)
          break

        case 'briefing_objetivo':
          await this.handleBriefingObjetivo(incoming, session, adapter)
          break

        case 'briefing_oferta':
          await this.handleBriefingOferta(incoming, session, adapter)
          break

        case 'briefing_prazo':
          await this.handleBriefingPrazo(incoming, session, adapter)
          break

        case 'briefing_redes':
          await this.handleBriefingRedes(incoming, session, adapter)
          break

        case 'confirmacao':
          await this.handleConfirmacao(incoming, session, adapter)
          break

        case 'escolha':
          await this.handleEscolha(incoming, session, adapter)
          break

        default:
          await this.sendEmergencyFallback(adapter)
          break
      }
    } catch (err: any) {
      console.error(`[conversation-engine] Erro ao processar mensagem do usuário ${userId}:`, err)
      await adapter.sendText(
        'Ops, tive uma instabilidade aqui 🙈 Manda 1 pra recomeçar ou 0 pra falar com uma pessoa.'
      )
    }

    await this.sessionStore.set(userId, session)
  }

  /* ============================================================
     Manipuladores de Estado
     ============================================================ */

  private async handleAguardandoFotoAudio(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    // Foto
    if (incoming.photoBuffer) {
      session.draftRequest.photoBuffer = incoming.photoBuffer
      session.draftRequest.photoUrl = `data:image/jpeg;base64,${incoming.photoBuffer.toString('base64')}`
    } else if (incoming.photoUrl) {
      session.draftRequest.photoUrl = incoming.photoUrl
    }

    // Áudio ou Texto
    if (incoming.audioBuffer) {
      const transcriptionProvider = process.env.OPENAI_API_KEY
        ? new WhisperTranscriptionProvider()
        : new MockTranscriptionProvider()
      session.draftRequest.rawInput = await transcriptionProvider.transcribe(incoming.audioBuffer)
    } else if (incoming.text) {
      session.draftRequest.rawInput = incoming.text
    }

    // Se ainda falta áudio/texto
    if (!session.draftRequest.rawInput && (session.draftRequest.photoBuffer || session.draftRequest.photoUrl)) {
      await adapter.sendText('Recebi sua foto! 📸 Agora manda um áudio ou escreve o que você quer divulgar.')
      return
    }

    // Se ainda falta foto
    if (session.draftRequest.rawInput && !session.draftRequest.photoBuffer && !session.draftRequest.photoUrl) {
      await adapter.sendText('Entendi o que você quer! 🎙️ Agora me manda uma foto do seu trabalho pra colocar no post.')
      return
    }

    // Temos foto e input de texto/áudio! Avança para o briefing
    session.state = 'briefing_objetivo'
    await adapter.sendButtons('Qual é o objetivo principal desse post?', [
      { id: 'obj_divulgar', label: '📢 Divulgar serviço' },
      { id: 'obj_promocao', label: '🏷️ Fazer promoção' },
      { id: 'obj_trabalho', label: '✨ Trabalho feito' },
      { id: 'obj_tanto_faz', label: '🎲 Tanto faz, escolhe' },
    ])
  }

  private async handleBriefingObjetivo(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    let objective: Objective = 'divulgar'
    if (payload === 'obj_promocao' || payload === '2' || payload?.toLowerCase().includes('promo')) {
      objective = 'promocao'
    } else if (payload === 'obj_trabalho' || payload === '3' || payload?.toLowerCase().includes('trabalho')) {
      objective = 'trabalho_feito'
    } else if (payload === 'obj_divulgar' || payload === '1' || payload?.toLowerCase().includes('divulgar')) {
      objective = 'divulgar'
    } else if (payload === 'obj_tanto_faz' || payload === '4') {
      objective = 'divulgar'
    } else {
      await this.sendEmergencyFallback(adapter)
      return
    }

    session.draftRequest.objective = objective

    // Briefing adaptativo: Se for promoção ou divulgar, pergunta sobre preço
    if (objective === 'promocao' || objective === 'divulgar') {
      session.state = 'briefing_oferta'
      await adapter.sendButtons('Tem algum preço ou oferta especial pra colocar no post?', [
        { id: 'oferta_audio', label: '✅ Falei no áudio' },
        { id: 'oferta_sem_preco', label: '🚫 Sem preço' },
        { id: 'oferta_tanto_faz', label: '🎲 Tanto faz' },
      ])
      return
    }

    // Se for trabalho feito, vai direto para redes
    session.state = 'briefing_redes'
    await adapter.sendButtons('Onde você quer postar?', [
      { id: 'rede_insta_status', label: '📸 Insta + WhatsApp' },
      { id: 'rede_insta', label: '📸 Só Instagram' },
      { id: 'rede_todas', label: '🌐 Todas as redes' },
    ])
  }

  private async handleBriefingOferta(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    if (payload === 'oferta_sem_preco' || payload === '2') {
      session.draftRequest.priceCents = null
    } else {
      // Padrão: usa preço padrão da oferta ou detectado
      session.draftRequest.priceCents = 12000
      session.draftRequest.priceMode = 'exato'
    }

    // Se o objetivo for promoção, pergunta prazo
    if (session.draftRequest.objective === 'promocao') {
      session.state = 'briefing_prazo'
      await adapter.sendButtons('Qual é o prazo dessa promoção?', [
        { id: 'prazo_esta_semana', label: '📅 Esta semana' },
        { id: 'prazo_hoje', label: '⚡ Só hoje' },
        { id: 'prazo_tanto_faz', label: '🎲 Sem prazo fixo' },
      ])
      return
    }

    // Senão vai para redes
    session.state = 'briefing_redes'
    await adapter.sendButtons('Onde você quer postar?', [
      { id: 'rede_insta_status', label: '📸 Insta + WhatsApp' },
      { id: 'rede_insta', label: '📸 Só Instagram' },
      { id: 'rede_todas', label: '🌐 Todas as redes' },
    ])
  }

  private async handleBriefingPrazo(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    let deadline: Deadline = 'esta_semana'
    if (payload === 'prazo_hoje' || payload === '2') {
      deadline = 'hoje'
    } else if (payload === 'prazo_esta_semana' || payload === '1') {
      deadline = 'esta_semana'
    } else {
      deadline = 'sem_prazo'
    }

    session.draftRequest.deadline = deadline

    session.state = 'briefing_redes'
    await adapter.sendButtons('Onde você quer postar?', [
      { id: 'rede_insta_status', label: '📸 Insta + WhatsApp' },
      { id: 'rede_insta', label: '📸 Só Instagram' },
      { id: 'rede_todas', label: '🌐 Todas as redes' },
    ])
  }

  private async handleBriefingRedes(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    let networks: Network[] = ['instagram', 'whatsapp_status']
    if (payload === 'rede_insta' || payload === '2') {
      networks = ['instagram']
    } else if (payload === 'rede_todas' || payload === '3') {
      networks = ['instagram', 'whatsapp_status', 'facebook']
    }

    session.draftRequest.networks = networks

    // Avança para o Cartão de Confirmação
    session.state = 'confirmacao'
    const objLabel =
      session.draftRequest.objective === 'promocao'
        ? 'Promoção com preço'
        : session.draftRequest.objective === 'trabalho_feito'
        ? 'Trabalho feito / Portfólio'
        : 'Divulgação de serviços'

    const priceText = session.draftRequest.priceCents ? `$${session.draftRequest.priceCents / 100}` : 'Sem preço'

    const confirmationText = `📋 <b>Dá uma olhada no resumo antes de gerar:</b>\n
• <b>Objetivo:</b> ${objLabel}
• <b>Preço:</b> ${priceText}
• <b>Empresa:</b> ${session.brandKit.signature || 'Bella Clean'} (${session.businessProfile.city}, ${session.businessProfile.state})
• <b>Redes:</b> ${networks.join(', ')}
• <b>Idiomas:</b> Português e Inglês 🇺🇸🇧🇷\n
Tudo certo pra gerar as 3 opções?`

    await adapter.sendButtons(confirmationText, [
      { id: 'confirma_sim', label: '⚡ Sim, pode gerar!' },
      { id: 'confirma_nao', label: '❌ Quero mudar algo' },
    ])
  }

  private async handleConfirmacao(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    if (payload === 'confirma_nao' || payload === '2' || payload?.toLowerCase().includes('nao')) {
      session.state = 'aguardando_foto_audio'
      await adapter.sendText('Sem problemas! Cancelado com custo zero. Manda a foto e o áudio novamente quando quiser.')
      return
    }

    if (payload !== 'confirma_sim' && payload !== '1' && !payload?.toLowerCase().includes('sim')) {
      await this.sendEmergencyFallback(adapter)
      return
    }

    // Comunicação de espera
    session.state = 'gerando'
    await adapter.sendText('Tô fazendo, me dá 40 segundos ⏳')

    // Monta o CreativeRequest completo
    const creativeRequest: CreativeRequest = {
      objective: session.draftRequest.objective || 'divulgar',
      offer: session.draftRequest.priceCents
        ? {
            priceCents: session.draftRequest.priceCents,
            priceMode: session.draftRequest.priceMode || 'exato',
            discountPercent: session.draftRequest.discountPercent ?? null,
          }
        : null,
      deadline: session.draftRequest.deadline || null,
      rawInput: session.draftRequest.rawInput || 'Divulgação de serviços de limpeza',
      photoIds: session.draftRequest.photoIds || ['sample-sala-limpa'],
      networks: session.draftRequest.networks || ['instagram', 'whatsapp_status'],
      languages: session.draftRequest.languages || ['pt', 'en'],
      kind: session.draftRequest.kind || 'post',
      slideCount: null,
      enhancePhoto: false,
    }

    // 1. Gera o CreativeBrief com IA
    const brief = await generateCreativeBrief({
      businessProfile: session.businessProfile,
      creativeRequest,
    })
    session.generatedBrief = brief

    // 2. Renderiza as 3 opções de preview (Regra 17: feed_45, pt, com watermark)
    const templates = brief.templateHints?.length ? brief.templateHints : ['bold-price', 'photo-overlay', 'clean-split']
    const photoSource = session.draftRequest.photoUrl || session.draftRequest.photoIds?.[0] || 'sample-sala-limpa'

    const previewJobs: Array<{ templateId: string; buffer: Buffer; fileName: string }> = []
    const previewImagesForAdapter: Array<{ buffer: Buffer }> = []

    for (const tId of templates) {
      const job: RenderJob = {
        briefId: brief.requestId,
        templateId: tId,
        format: 'feed_45',
        language: 'pt',
        brandKit: session.brandKit,
        content: brief.content.pt!,
        photoUrl: photoSource,
        watermark: true,
      }

      const pngBuffer = await renderJob(job)
      previewJobs.push({ templateId: tId, buffer: pngBuffer, fileName: `${tId}_feed_45_pt_preview.png` })
      previewImagesForAdapter.push({ buffer: pngBuffer })
    }

    session.previewJobs = previewJobs
    session.state = 'escolha'

    // Envia as 3 imagens de prévia
    await adapter.sendImages(previewImagesForAdapter, 'Pronto! Criei 3 opções pra você escolher a que mais gosta 👇')

    // Envia os botões de escolha
    await adapter.sendButtons('Qual opção você quer aprovar?', [
      { id: 'escolha_bold-price', label: '1️⃣ Opção 1 (Preço Gigante)' },
      { id: 'escolha_photo-overlay', label: '2️⃣ Opção 2 (Foto c/ Gradiente)' },
      { id: 'escolha_clean-split', label: '3️⃣ Opção 3 (Divisão Limpa)' },
    ])
  }

  private async handleEscolha(
    incoming: IncomingMessage,
    session: ConversationSession,
    adapter: ChannelAdapter
  ): Promise<void> {
    const payload = incoming.buttonPayload || incoming.text?.trim()

    let selectedTemplate = 'bold-price'
    if (payload === 'escolha_photo-overlay' || payload === '2') {
      selectedTemplate = 'photo-overlay'
    } else if (payload === 'escolha_clean-split' || payload === '3') {
      selectedTemplate = 'clean-split'
    } else if (payload === 'escolha_bold-price' || payload === '1') {
      selectedTemplate = 'bold-price'
    } else {
      await this.sendEmergencyFallback(adapter)
      return
    }

    session.state = 'entrega'
    await adapter.sendText('Aprovado! ⚡ Gerando seus arquivos em alta resolução em Português e Inglês...')

    const brief = session.generatedBrief!
    const photoSource = session.draftRequest.photoUrl || session.draftRequest.photoIds?.[0] || 'sample-sala-limpa'
    const networks = session.draftRequest.networks || ['instagram', 'whatsapp_status']
    const formats = formatsFor(networks)
    const languages: ('pt' | 'en')[] = session.draftRequest.languages || ['pt', 'en']

    // Renderiza arquivos finais (sem marca d'água)
    for (const fmt of formats) {
      for (const lang of languages) {
        const content = brief.content[lang]
        if (!content) continue

        const job: RenderJob = {
          briefId: brief.requestId,
          templateId: selectedTemplate,
          format: fmt,
          language: lang,
          brandKit: session.brandKit,
          content,
          photoUrl: photoSource,
          watermark: false,
        }

        const pngBuffer = await renderJob(job)
        const formatLabel = fmt === 'feed_45' ? 'Feed' : 'Story'
        const langFlag = lang === 'pt' ? '🇧🇷 Português' : '🇺🇸 Inglês'
        const filename = `${selectedTemplate}_${fmt}_${lang}.png`

        await adapter.sendFile({ buffer: pngBuffer, filename }, `📦 ${formatLabel} (${langFlag})`)
      }
    }

    // Envia a legenda para copiar e colar
    const captionPt = brief.content.pt?.caption || ''
    const tagsPt = brief.content.pt?.hashtags?.join(' ') || ''
    const captionEn = brief.content.en?.caption || ''
    const tagsEn = brief.content.en?.hashtags?.join(' ') || ''

    const legendasMsg = `✨ <b>Legendas prontas para postar:</b>\n
🇧🇷 <b>Em Português:</b>
${captionPt}
${tagsPt}\n
🇺🇸 <b>Em Inglês:</b>
${captionEn}
${tagsEn}`

    await adapter.sendText(legendasMsg)
    await adapter.sendText('Tudo entregue! 🚀 Para fazer um novo post, basta mandar outra foto e áudio.')

    // Reseta sessão para limpo
    await this.sessionStore.delete(session.userId)
  }

  private async sendEmergencyFallback(adapter: ChannelAdapter): Promise<void> {
    await adapter.sendButtons('Não entendi 🙈 Manda 1 pra recomeçar ou 0 pra falar com uma pessoa.', [
      { id: 'cmd_recomecar', label: '🔄 1. Recomeçar' },
      { id: 'cmd_humano', label: '👤 0. Falar com atendente' },
    ])
  }
}
