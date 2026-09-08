import type { ReactNode } from 'react'
import type { Format, LocalizedContent, RenderJob } from '@zapost/contracts'

export interface TemplateRules {
  id: string
  name: string
  description: string
  maxHeadlineLength: number
  maxSubheadlineLength: number
  maxPriceLabelLength: number
  maxCtaLength: number
  requiresPhoto: boolean
  logoPlacement: 'top-left' | 'top-right' | 'top-center' | 'header' | 'none'
  supportedFormats: Format[]
}

export interface TemplateProps {
  job: RenderJob
  width: number
  height: number
  photoDataUri?: string | null | undefined
}

export interface TemplateDefinition {
  rules: TemplateRules
  render: (props: TemplateProps) => ReactNode
}
