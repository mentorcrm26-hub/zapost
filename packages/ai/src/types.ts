import type { BusinessProfile, CreativeRequest, CreativeBrief, AwarenessLevel } from '@zapost/contracts'

export type SkillType = 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'

export interface SkillAppliesTo {
  all?: boolean
  segments?: string[]
  objectives?: string[]
  formats?: string[]
  kinds?: string[]
  languages?: string[]
}

export interface SkillDefinition {
  id: string
  version: string
  type: SkillType
  applies_to?: SkillAppliesTo
  content: string
  examples?: {
    good?: unknown[]
    bad?: unknown[]
  }
}

export interface TranscriptionProvider {
  transcribe(
    audio: Buffer | Uint8Array | string,
    options?: { filename?: string; mimeType?: string }
  ): Promise<string>
}

export interface ContentGenerateInput {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}

export interface AiUsageRecord {
  timestamp: string
  provider: string
  model: string
  action: 'transcription' | 'content_generation'
  inputTokens?: number | undefined
  outputTokens?: number | undefined
  audioSeconds?: number | undefined
  costUsd: number
  success: boolean
  mock?: boolean | undefined
}

export interface ContentGenerateOutput {
  rawText: string
  provider: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
    costUsd: number
  }
}

export interface ContentProvider {
  generate(input: ContentGenerateInput): Promise<ContentGenerateOutput>
}

export interface GenerationContext {
  businessProfile: BusinessProfile
  creativeRequest: CreativeRequest
  skillsDir?: string
  contentProvider?: ContentProvider
  transcriptionProvider?: TranscriptionProvider
}
