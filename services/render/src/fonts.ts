import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SatoriOptions } from 'satori'

type FontConfig = SatoriOptions['fonts'][number]

const currentDir = dirname(fileURLToPath(import.meta.url))
const fontsDir = resolve(currentDir, '../fonts')

let cachedFonts: FontConfig[] | null = null

export function getLoadedFonts(): FontConfig[] {
  if (cachedFonts) {
    return cachedFonts
  }

  const fontFiles: { name: string; file: string; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style: 'normal' | 'italic' }[] = [
    // Display font - Outfit
    { name: 'Outfit', file: 'Outfit-600.ttf', weight: 600, style: 'normal' },
    { name: 'Outfit', file: 'Outfit-700.ttf', weight: 700, style: 'normal' },
    { name: 'Outfit', file: 'Outfit-800.ttf', weight: 800, style: 'normal' },
    // Body / Sans font - Plus Jakarta Sans
    { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-400.ttf', weight: 400, style: 'normal' },
    { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-500.ttf', weight: 500, style: 'normal' },
    { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-600.ttf', weight: 600, style: 'normal' },
    { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-700.ttf', weight: 700, style: 'normal' },
    // Display font - Bricolage Grotesque
    { name: 'Bricolage Grotesque', file: 'BricolageGrotesque-700.ttf', weight: 700, style: 'normal' },
    { name: 'Bricolage Grotesque', file: 'BricolageGrotesque-800.ttf', weight: 800, style: 'normal' },
  ]

  const loaded: FontConfig[] = []

  for (const item of fontFiles) {
    const fullPath = resolve(fontsDir, item.file)
    if (existsSync(fullPath)) {
      const buffer = readFileSync(fullPath)
      loaded.push({
        name: item.name,
        data: buffer,
        weight: item.weight,
        style: item.style,
      })
    }
  }

  if (loaded.length === 0) {
    throw new Error(`Nenhuma fonte encontrada no diretório: ${fontsDir}`)
  }

  cachedFonts = loaded
  return cachedFonts
}
