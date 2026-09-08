import type { TemplateDefinition, TemplateRules } from '../types.js'
import { boldPriceTemplate } from './bold-price.js'
import { photoOverlayTemplate } from './photo-overlay.js'
import { cleanSplitTemplate } from './clean-split.js'

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  'bold-price': boldPriceTemplate,
  'photo-overlay': photoOverlayTemplate,
  'clean-split': cleanSplitTemplate,
}

export function getTemplate(id: string): TemplateDefinition {
  const template = TEMPLATE_REGISTRY[id]
  if (!template) {
    throw new Error(`Template não encontrado: "${id}". Templates disponíveis: ${Object.keys(TEMPLATE_REGISTRY).join(', ')}`)
  }
  return template
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY)
}

export function getAllTemplateRules(): TemplateRules[] {
  return Object.values(TEMPLATE_REGISTRY).map((t) => t.rules)
}

export { boldPriceTemplate, photoOverlayTemplate, cleanSplitTemplate }
