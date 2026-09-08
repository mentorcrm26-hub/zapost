/**
 * ZaPost - Ajuste automático de tipografia e contraste
 * 
 * Regra 6: Ajuste automático do corpo da fonte para o texto caber na caixa
 * sem estourar e sem cortar. O português é ~20% mais longo que o inglês.
 * A headline deve continuar legível a 200px de largura.
 */

export interface FontSizeOptions {
  baseSize: number
  minSize: number
  maxSize: number
  targetLength?: number
}

/**
 * Calcula o tamanho ideal da fonte baseado no comprimento do texto e no espaço disponível.
 */
export function calculateHeadlineSize(text: string, isStory = false): number {
  const length = text ? text.length : 0

  if (isStory) {
    if (length <= 20) return 72
    if (length <= 32) return 64
    if (length <= 44) return 56
    if (length <= 54) return 48
    return 42
  }

  // Feed (1080x1350) e Square (1080x1080)
  if (length <= 20) return 68
  if (length <= 30) return 60
  if (length <= 42) return 52
  if (length <= 54) return 46
  return 40
}

/**
 * Calcula o tamanho ideal para a subheadline.
 */
export function calculateSubheadlineSize(text: string, isStory = false): number {
  const length = text ? text.length : 0

  if (isStory) {
    if (length <= 40) return 34
    if (length <= 65) return 30
    return 26
  }

  if (length <= 40) return 32
  if (length <= 65) return 28
  return 24
}

/**
 * Calcula o tamanho ideal para o preço.
 */
export function calculatePriceSize(text: string, isGiant = false): number {
  const length = text ? text.length : 0

  if (isGiant) {
    if (length <= 8) return 108
    if (length <= 14) return 92
    if (length <= 20) return 78
    return 64
  }

  if (length <= 10) return 48
  if (length <= 16) return 42
  return 36
}

/**
 * Retorna se uma cor hexadecimal é escura (útil para decidir se o texto deve ser branco ou escuro).
 */
export function isDarkColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '')
  if (cleanHex.length !== 6) return true

  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  // Luminância relativa perceptível
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 140
}

/**
 * Retorna cor de texto de alto contraste (#FFFFFF ou #0F2E2A) baseada no fundo.
 */
export function getContrastTextColor(bgHex: string): string {
  return isDarkColor(bgHex) ? '#FFFFFF' : '#0F2E2A'
}
