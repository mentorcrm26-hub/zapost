import type {
  BusinessProfile,
  BrandKit,
  CreativeRequest,
  CreativeBrief,
  Objective,
  Deadline,
  Network,
} from '@zapost/contracts'

export type ConversationState =
  | 'inicio'
  | 'aguardando_foto_audio'
  | 'briefing_objetivo'
  | 'briefing_oferta'
  | 'briefing_prazo'
  | 'briefing_redes'
  | 'confirmacao'
  | 'gerando'
  | 'escolha'
  | 'entrega'

export interface ButtonOption {
  id: string
  label: string
}

export interface ImageAttachment {
  url?: string | undefined
  buffer?: Buffer | undefined
}

export interface FileAttachment {
  url?: string | undefined
  buffer?: Buffer | undefined
  filename: string
}

export interface ChannelAdapter {
  sendText(text: string): Promise<void>
  sendButtons(text: string, buttons: ButtonOption[]): Promise<void>
  sendImages(images: ImageAttachment[], caption?: string): Promise<void>
  sendFile(file: FileAttachment, name?: string): Promise<void>
}

export interface IncomingMessage {
  userId: string
  userName?: string | undefined
  text?: string | undefined
  buttonPayload?: string | undefined
  audioBuffer?: Buffer | undefined
  photoBuffer?: Buffer | undefined
  photoUrl?: string | undefined
}

export interface ConversationSession {
  userId: string
  state: ConversationState
  lastActivity: number
  businessProfile: BusinessProfile
  brandKit: BrandKit
  draftRequest: {
    objective?: Objective | undefined
    priceCents?: number | null | undefined
    priceMode?: 'exato' | 'a_partir_de' | undefined
    discountPercent?: number | null | undefined
    deadline?: Deadline | null | undefined
    rawInput?: string | undefined
    photoIds?: string[] | undefined
    photoBuffer?: Buffer | undefined
    photoUrl?: string | null | undefined
    networks?: Network[] | undefined
    languages?: ('pt' | 'en')[] | undefined
    kind?: 'post' | 'carousel' | undefined
  }
  generatedBrief?: CreativeBrief | undefined
  previewJobs?: Array<{ templateId: string; buffer: Buffer; fileName: string }> | undefined
}

export interface SessionStore {
  get(userId: string): Promise<ConversationSession | null>
  set(userId: string, session: ConversationSession, ttlSeconds?: number): Promise<void>
  delete(userId: string): Promise<void>
}
