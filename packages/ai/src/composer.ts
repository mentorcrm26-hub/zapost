import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import type { BusinessProfile, CreativeRequest } from '@zapost/contracts'
import type { SkillDefinition, SkillType } from './types.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const defaultSkillsDir = resolve(currentDir, '../../../skills')

const TYPE_ORDER: Record<SkillType, number> = {
  tecnica: 1, // base é tratada com prioridade 0
  formato: 2,
  segmento: 3,
  sazonal: 4,
  aperfeicoamento: 5,
}

export function loadAllSkills(skillsDir = defaultSkillsDir): SkillDefinition[] {
  if (!existsSync(skillsDir)) {
    return []
  }

  const files = readdirSync(skillsDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
  const skills: SkillDefinition[] = []

  for (const file of files) {
    try {
      const fullPath = resolve(skillsDir, file)
      const content = readFileSync(fullPath, 'utf8')
      const parsed = yaml.load(content) as SkillDefinition
      if (parsed && parsed.id && parsed.type) {
        skills.push(parsed)
      }
    } catch (err) {
      console.warn(`[composer] Erro ao carregar skill "${file}":`, err)
    }
  }

  return skills
}

export function isSkillApplicable(
  skill: SkillDefinition,
  businessProfile: BusinessProfile,
  creativeRequest: CreativeRequest
): boolean {
  if (skill.applies_to?.all) {
    return true
  }

  const { applies_to } = skill
  if (!applies_to) {
    return true
  }

  // Filtro por objetivo
  if (applies_to.objectives && applies_to.objectives.length > 0) {
    if (!applies_to.objectives.includes(creativeRequest.objective)) {
      return false
    }
  }

  // Filtro por tipo de criativo (post vs carousel)
  if (applies_to.kinds && applies_to.kinds.length > 0) {
    if (!applies_to.kinds.includes(creativeRequest.kind)) {
      return false
    }
  }

  // Filtro por segmento
  if (applies_to.segments && applies_to.segments.length > 0) {
    if (!applies_to.segments.includes(businessProfile.segment)) {
      return false
    }
  }

  // Filtro por idioma
  if (applies_to.languages && applies_to.languages.length > 0) {
    const hasMatchingLang = creativeRequest.languages.some((l) => applies_to.languages?.includes(l))
    if (!hasMatchingLang) {
      return false
    }
  }

  return true
}

export interface ComposeSkillsResult {
  skillsUsed: string[]
  composedText: string
}

export function composeSkills(
  businessProfile: BusinessProfile,
  creativeRequest: CreativeRequest,
  skillsDir = defaultSkillsDir
): ComposeSkillsResult {
  const allSkills = loadAllSkills(skillsDir)
  const applicable = allSkills.filter((s) => isSkillApplicable(s, businessProfile, creativeRequest))

  // Ordenação: base -> tecnica -> formato -> segmento
  applicable.sort((a, b) => {
    if (a.id === 'base') return -1
    if (b.id === 'base') return 1

    const orderA = TYPE_ORDER[a.type] ?? 99
    const orderB = TYPE_ORDER[b.type] ?? 99

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.id.localeCompare(b.id)
  })

  const skillsUsed = applicable.map((s) => s.id)
  const blocks: string[] = []

  for (const skill of applicable) {
    blocks.push(`### SKILL: [${skill.type.toUpperCase()}] ${skill.id}\n${skill.content.trim()}`)
  }

  return {
    skillsUsed,
    composedText: blocks.join('\n\n---\n\n'),
  }
}
