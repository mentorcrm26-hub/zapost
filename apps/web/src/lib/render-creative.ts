export type TemplateId =
  | 'bold-price'
  | 'photo-overlay'
  | 'clean-split'
  | 'proof-card'
  | 'minimal-luxury'
  | 'urgent-promo'

export interface RenderCreativeOptions {
  template: TemplateId | string
  format: 'feed' | 'story'
  language: 'pt' | 'en'
  photoUrl: string
  photoOffsetX?: number // Deslocamento X da foto em % (-50 a +50)
  photoOffsetY?: number // Deslocamento Y da foto em % (-50 a +50)
  photoScale?: number   // Escala / Zoom da foto (1.0 a 2.5)
  textOffsetX?: number  // Deslocamento X dos textos em % (-40 a +40)
  textOffsetY?: number  // Deslocamento Y dos textos em % (-40 a +40)
  textAlign?: 'left' | 'center' | 'right'
  headline: string
  subheadline?: string
  caption?: string
  price?: string        // Texto de destaque / Preço (sem prefixos forçados)
  showPrice?: boolean
  ctaText?: string
  businessName?: string
  phone?: string
  brandColor?: string
  accentColor?: string
  withWatermark?: boolean
}

export interface TemplateCatalogItem {
  id: TemplateId
  name: string
  badgePt: string
  badgeEn: string
  category: 'oferta' | 'prova' | 'institucional' | 'urgencia'
  descriptionPt: string
  descriptionEn: string
}

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = [
  {
    id: 'bold-price',
    name: 'Bold Price',
    badgePt: '1️⃣ Preço Gigante',
    badgeEn: '1️⃣ Giant Price',
    category: 'oferta',
    descriptionPt: 'Preço em destaque gigante com foto escurecida ao fundo.',
    descriptionEn: 'Massive price tag with dimmed background photo.',
  },
  {
    id: 'photo-overlay',
    name: 'Photo Spotlight',
    badgePt: '2️⃣ Foto em Destaque',
    badgeEn: '2️⃣ Photo Spotlight',
    category: 'institucional',
    descriptionPt: 'A foto do seu trabalho ocupa toda a arte com gradiente no rodapé.',
    descriptionEn: 'Full photo showcase with smooth gradient on bottom.',
  },
  {
    id: 'clean-split',
    name: 'Clean Split',
    badgePt: '3️⃣ Divisão Limpa',
    badgeEn: '3️⃣ Clean Split',
    category: 'institucional',
    descriptionPt: 'Foto em moldura superior e dados da oferta na metade inferior.',
    descriptionEn: 'Framed photo at top with offer details on bottom.',
  },
  {
    id: 'proof-card',
    name: '5-Star Proof',
    badgePt: '4️⃣ Prova Social 5★',
    badgeEn: '4️⃣ 5-Star Social Proof',
    category: 'prova',
    descriptionPt: 'Avaliação 5 estrelas e selo de garantia de satisfação.',
    descriptionEn: '5-star customer review rating and satisfaction badge.',
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    badgePt: '5️⃣ Minimalista Luxo',
    badgeEn: '5️⃣ Minimal Luxury',
    category: 'institucional',
    descriptionPt: 'Design editorial refinado com bordas finas e alta elegância.',
    descriptionEn: 'Refined editorial styling with subtle borders & clean elegance.',
  },
  {
    id: 'urgent-promo',
    name: 'Urgent Promo',
    badgePt: '6️⃣ Urgência & Vagas',
    badgeEn: '6️⃣ Urgent Promo',
    category: 'urgencia',
    descriptionPt: 'Faixa de urgência, vagas limitadas e chamada para ação rápida.',
    descriptionEn: 'Limited slots banner, countdown vibe and strong CTA.',
  },
]

// Helper para quebrar texto em várias linhas no canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
) {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y)
      line = words[n] + ' '
      y += lineHeight
      lineCount++
      if (lineCount >= maxLines - 1 && n < words.length - 1) {
        const remaining = words.slice(n).join(' ')
        ctx.fillText(remaining.substring(0, 22) + '...', x, y)
        return
      }
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, y)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous'
    }

    img.onload = () => resolve(img)

    img.onerror = () => {
      const retry = new Image()
      retry.onload = () => resolve(retry)
      retry.onerror = () => {
        const fallbackCanvas = document.createElement('canvas')
        fallbackCanvas.width = 400
        fallbackCanvas.height = 400
        const fctx = fallbackCanvas.getContext('2d')!
        const grad = fctx.createLinearGradient(0, 0, 400, 400)
        grad.addColorStop(0, '#064e3b')
        grad.addColorStop(1, '#0f172a')
        fctx.fillStyle = grad
        fctx.fillRect(0, 0, 400, 400)
        const fallbackImg = new Image()
        fallbackImg.src = fallbackCanvas.toDataURL()
        fallbackImg.onload = () => resolve(fallbackImg)
      }
      retry.src = src
    }

    img.src = src
  })
}

export async function renderCreativeCanvas(options: RenderCreativeOptions): Promise<string> {
  if (typeof window === 'undefined') return ''

  const isStory = options.format === 'story'
  const width = 1080
  const height = isStory ? 1920 : 1080

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const isEn = options.language === 'en'
  const businessName = options.businessName || 'BELLA CLEAN'
  const phone = options.phone || '(508) 555-0142'
  
  // 100% fiel ao que o usuário digitou, sem '$' forçado
  const rawPrice = options.price ? options.price.trim() : ''
  const hasPrice = options.showPrice !== false && rawPrice.length > 0
  const price = hasPrice ? rawPrice : ''
  
  const brandColor = options.brandColor || '#10b981'
  const accentColor = options.accentColor || '#f59e0b'

  // Deslocamento dos textos na tela
  const textShiftX = ((options.textOffsetX || 0) / 100) * width
  const textShiftY = ((options.textOffsetY || 0) / 100) * height

  // Texto do botão de rodapé customizado
  const defaultCtaText = isEn
    ? `📱 Call / Text: ${phone}`
    : `💬 Agendamentos & Contato: ${phone}`
  const footerButtonText = options.ctaText && options.ctaText.trim().length > 0
    ? options.ctaText.trim()
    : defaultCtaText

  // Carrega a foto real do usuário
  const img = await loadImage(options.photoUrl || '/sample-sala.jpg')

  // Helper de desenho da foto em tela cheia com posicionamento e zoom personalizados
  const drawCoverImage = () => {
    const imgAspect = img.width / img.height
    const canvasAspect = width / height
    const scale = options.photoScale || 1.0
    const extraOffsetX = ((options.photoOffsetX || 0) / 100) * width
    const extraOffsetY = ((options.photoOffsetY || 0) / 100) * height

    let baseW = width
    let baseH = height
    if (imgAspect > canvasAspect) {
      baseW = height * imgAspect
    } else {
      baseH = width / imgAspect
    }

    const drawW = baseW * scale
    const drawH = baseH * scale
    const offsetX = (width - drawW) / 2 + extraOffsetX
    const offsetY = (height - drawH) / 2 + extraOffsetY

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  }

  if (options.template === 'bold-price') {
    // ==================== TEMPLATE 1: BOLD PRICE ====================
    drawCoverImage()

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, 'rgba(11, 15, 23, 0.88)')
    grad.addColorStop(0.35, 'rgba(11, 15, 23, 0.45)')
    grad.addColorStop(0.65, 'rgba(11, 15, 23, 0.78)')
    grad.addColorStop(1, 'rgba(11, 15, 23, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Topo: Nome da Marca / Profissional
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`✨ ${businessName.toUpperCase()} ✨`, width / 2 + textShiftX, (isStory ? 180 : 100) + textShiftY * 0.4)

    ctx.fillStyle = brandColor
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(isEn ? 'SPECIAL OFFER' : 'OFERTA ESPECIAL', width / 2 + textShiftX, (isStory ? 230 : 145) + textShiftY * 0.4)

    // Centro: Badge de Preço / Destaque Secundário (deslocado por textShiftX / textShiftY)
    if (hasPrice) {
      const badgeY = (isStory ? height / 2 - 120 : height / 2 - 60) + textShiftY
      const badgeX = width / 2 + textShiftX
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)'
      ctx.beginPath()
      ctx.roundRect(badgeX - 300, badgeY - 100, 600, 200, 36)
      ctx.fill()
      ctx.lineWidth = 6
      ctx.strokeStyle = brandColor
      ctx.stroke()

      ctx.fillStyle = accentColor
      const fontSize = price.length > 10 ? '54px' : price.length > 6 ? '80px' : '100px'
      ctx.font = `900 ${fontSize} sans-serif`
      ctx.fillText(price, badgeX, badgeY + 25)

      // Headline abaixo do preço
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 44px sans-serif'
      const headlineY = (isStory ? height / 2 + 220 : height / 2 + 200) + textShiftY
      wrapText(ctx, options.headline.toUpperCase(), badgeX, headlineY, 860, 56, 3)
    } else {
      // Sem preço: Headline centralizada e deslocável
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 54px sans-serif'
      const headlineY = (isStory ? height / 2 - 40 : height / 2 - 30) + textShiftY
      const headlineX = width / 2 + textShiftX
      wrapText(ctx, options.headline.toUpperCase(), headlineX, headlineY, 920, 68, 4)
    }

    // Rodapé
    const footerY = (isStory ? height - 160 : height - 100) + textShiftY * 0.2
    const footerX = width / 2 + textShiftX * 0.3
    ctx.fillStyle = brandColor
    ctx.beginPath()
    ctx.roundRect(footerX - 380, footerY - 55, 760, 90, 45)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(footerButtonText, footerX, footerY + 5)
  } else if (options.template === 'photo-overlay') {
    // ==================== TEMPLATE 2: PHOTO OVERLAY ====================
    drawCoverImage()

    const grad = ctx.createLinearGradient(0, height * 0.35, 0, height)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(0.45, 'rgba(11, 15, 23, 0.85)')
    grad.addColorStop(1, 'rgba(11, 15, 23, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, height * 0.35, width, height * 0.65)

    // Badge flutuante de preço / texto extra (se ativo)
    if (hasPrice) {
      const badgeW = Math.max(260, price.length * 28 + 60)
      const badgeX = width - badgeW - 60 + textShiftX
      const badgeY = (isStory ? 140 : 60) + textShiftY * 0.5

      ctx.fillStyle = 'rgba(15, 46, 42, 0.92)'
      ctx.beginPath()
      ctx.roundRect(badgeX, badgeY, badgeW, 90, 24)
      ctx.fill()
      ctx.lineWidth = 4
      ctx.strokeStyle = accentColor
      ctx.stroke()

      ctx.fillStyle = accentColor
      const fSize = price.length > 10 ? '38px' : '48px'
      ctx.font = `900 ${fSize} sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(price, badgeX + badgeW / 2, badgeY + 62)
    }

    // Card de Conteúdo Inferior (deslocável)
    const contentX = 80 + textShiftX
    const contentY = (isStory ? height - 520 : height - 380) + textShiftY

    ctx.textAlign = 'left'
    ctx.fillStyle = brandColor
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(`✨ ${businessName.toUpperCase()}`, contentX, contentY)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 46px sans-serif'
    wrapText(ctx, options.headline, contentX, contentY + 65, 920, 60, 3)

    // Rodapé
    const footerY = (isStory ? height - 160 : height - 100) + textShiftY * 0.2
    const footerX = 80 + textShiftX * 0.3
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.roundRect(footerX, footerY - 50, width - 160, 85, 24)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(footerButtonText, width / 2 + textShiftX * 0.3, footerY + 7)
  } else if (options.template === 'clean-split') {
    // ==================== TEMPLATE 3: CLEAN SPLIT ====================
    ctx.fillStyle = '#0b0f17'
    ctx.fillRect(0, 0, width, height)

    const photoH = isStory ? height * 0.52 : height * 0.55
    const margin = 50
    const photoW = width - margin * 2

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(margin, margin + (isStory ? 80 : 20), photoW, photoH - 60, 36)
    ctx.clip()

    const imgAspect = img.width / img.height
    const boxAspect = photoW / (photoH - 60)
    const scale = options.photoScale || 1.0
    const extraOffsetX = ((options.photoOffsetX || 0) / 100) * photoW
    const extraOffsetY = ((options.photoOffsetY || 0) / 100) * (photoH - 60)

    let baseW = photoW
    let baseH = photoH - 60
    if (imgAspect > boxAspect) {
      baseW = (photoH - 60) * imgAspect
    } else {
      baseH = photoW / imgAspect
    }

    const dW = baseW * scale
    const dH = baseH * scale
    const ox = margin + (photoW - dW) / 2 + extraOffsetX
    const oy = margin + (isStory ? 80 : 20) + (photoH - 60 - dH) / 2 + extraOffsetY

    ctx.drawImage(img, ox, oy, dW, dH)
    ctx.restore()

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(margin, margin + (isStory ? 80 : 20), photoW, photoH - 60, 36)
    ctx.stroke()

    // Bloco de Textos inferior deslocável
    const bottomStartY = (photoH + (isStory ? 100 : 40)) + textShiftY
    const leftX = margin + textShiftX

    ctx.fillStyle = brandColor
    ctx.font = 'bold 26px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`🏆 ${businessName.toUpperCase()}`, leftX, bottomStartY)

    if (hasPrice) {
      ctx.fillStyle = accentColor
      const fSize = price.length > 10 ? '36px' : '48px'
      ctx.font = `900 ${fSize} sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(price, width - margin + textShiftX, bottomStartY)
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px sans-serif'
    ctx.textAlign = 'left'
    wrapText(ctx, options.headline, leftX, bottomStartY + 65, photoW, 58, 3)

    const footerY = (isStory ? height - 160 : height - 90) + textShiftY * 0.2
    ctx.fillStyle = '#25D366'
    ctx.beginPath()
    ctx.roundRect(margin + textShiftX * 0.3, footerY - 50, photoW, 85, 24)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(footerButtonText, width / 2 + textShiftX * 0.3, footerY + 6)
  } else if (options.template === 'proof-card') {
    // ==================== TEMPLATE 4: PROOF CARD (5 ESTRELAS) ====================
    drawCoverImage()

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, 'rgba(8, 24, 21, 0.90)')
    grad.addColorStop(0.4, 'rgba(11, 15, 23, 0.65)')
    grad.addColorStop(0.7, 'rgba(11, 15, 23, 0.92)')
    grad.addColorStop(1, 'rgba(8, 24, 21, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Topo
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(`✨ ${businessName.toUpperCase()}`, width / 2 + textShiftX, (isStory ? 160 : 80) + textShiftY * 0.4)

    // Card Central de Prova Social (movimentável via textShiftX / textShiftY)
    const cardY = (isStory ? height / 2 - 160 : height / 2 - 110) + textShiftY
    const cardW = 920
    const cardH = isStory ? 580 : 500
    const cardX = (width - cardW) / 2 + textShiftX
    const centerX = width / 2 + textShiftX

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, cardW, cardH, 36)
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.stroke()

    ctx.fillStyle = '#fbbf24'
    ctx.font = '48px sans-serif'
    ctx.fillText('★★★★★', centerX, cardY + 70)

    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(isEn ? '5.0 RATED BY 100+ CLIENTS' : 'AVALIAÇÃO 5.0 • 100% SATISFAÇÃO', centerX, cardY + 115)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px sans-serif'
    wrapText(ctx, `“${options.headline}”`, centerX, cardY + 190, 820, 56, 3)

    if (hasPrice) {
      ctx.fillStyle = accentColor
      const fSize = price.length > 10 ? '48px' : '64px'
      ctx.font = `900 ${fSize} sans-serif`
      ctx.fillText(price, centerX, cardY + (isStory ? 430 : 380))
    }

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(isEn ? '🛡️ 100% Satisfaction Guaranteed' : '🛡️ Garantia de Excelência & Pontualidade', centerX, cardY + (hasPrice ? (isStory ? 480 : 430) : (isStory ? 400 : 350)))

    const footerY = (isStory ? height - 160 : height - 90) + textShiftY * 0.2
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.roundRect((width - cardW) / 2 + textShiftX * 0.3, footerY - 50, cardW, 85, 24)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(footerButtonText, width / 2 + textShiftX * 0.3, footerY + 6)
  } else if (options.template === 'minimal-luxury') {
    // ==================== TEMPLATE 5: MINIMAL LUXURY ====================
    ctx.fillStyle = '#08080a'
    ctx.fillRect(0, 0, width, height)

    const pad = 40
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
    ctx.lineWidth = 2
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 20px serif'
    ctx.fillText(`— ${businessName.toUpperCase()} —`, width / 2 + textShiftX, (isStory ? 140 : 100) + textShiftY * 0.4)

    ctx.fillStyle = '#ffffff'
    ctx.font = '300 16px sans-serif'
    ctx.fillText(isEn ? 'PREMIUM & RELIABLE SERVICE' : 'SERVIÇO PREMIUM & EXCLUSIVO', width / 2 + textShiftX, (isStory ? 180 : 135) + textShiftY * 0.4)

    const photoSize = isStory ? 600 : 480
    const photoY = isStory ? 240 : 180
    const photoX = (width - photoSize) / 2

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 28)
    ctx.clip()

    const imgAspect = img.width / img.height
    const scale = options.photoScale || 1.0
    const extraOffsetX = ((options.photoOffsetX || 0) / 100) * photoSize
    const extraOffsetY = ((options.photoOffsetY || 0) / 100) * photoSize

    let baseW = photoSize
    let baseH = photoSize
    if (imgAspect > 1) {
      baseW = photoSize * imgAspect
    } else {
      baseH = photoSize / imgAspect
    }

    const dW = baseW * scale
    const dH = baseH * scale
    const ox = photoX + (photoSize - dW) / 2 + extraOffsetX
    const oy = photoY + (photoSize - dH) / 2 + extraOffsetY

    ctx.drawImage(img, ox, oy, dW, dH)
    ctx.restore()

    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 28)
    ctx.stroke()

    // Conteúdo Inferior Deslocável
    const contentStartY = (photoY + photoSize + (isStory ? 70 : 45)) + textShiftY
    const centerX = width / 2 + textShiftX

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 38px serif'
    wrapText(ctx, options.headline, centerX, contentStartY, 880, 50, 2)

    if (hasPrice) {
      ctx.fillStyle = '#d4af37'
      const fSize = price.length > 10 ? '38px' : '50px'
      ctx.font = `bold ${fSize} sans-serif`
      ctx.fillText(price, centerX, contentStartY + (isStory ? 140 : 110))
    }

    const footerY = (isStory ? height - 140 : height - 85) + textShiftY * 0.2
    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(footerButtonText, width / 2 + textShiftX * 0.3, footerY)
  } else if (options.template === 'urgent-promo') {
    // ==================== TEMPLATE 6: URGENT PROMO (URGÊNCIA & FLASH SALE) ====================
    drawCoverImage()

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
    grad.addColorStop(0.3, 'rgba(15, 23, 42, 0.65)')
    grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.92)')
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#dc2626'
    ctx.fillRect(0, isStory ? 80 : 30, width, 70)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(isEn ? '🔥 LIMITED TIME OFFER • ONLY THIS WEEK' : '🔥 ÚLTIMAS VAGAS • SOMENTE ESSA SEMANA', width / 2, isStory ? 125 : 75)

    const centerX = width / 2 + textShiftX

    ctx.fillStyle = '#e2e8f0'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(businessName.toUpperCase(), centerX, (isStory ? 220 : 155) + textShiftY * 0.4)

    ctx.fillStyle = '#ffffff'
    ctx.font = '900 48px sans-serif'
    const headlineY = (isStory ? height / 2 - 80 : height / 2 - 30) + textShiftY
    wrapText(ctx, options.headline.toUpperCase(), centerX, headlineY, 920, 60, 3)

    if (hasPrice) {
      const badgeY = (isStory ? height / 2 + 180 : height / 2 + 160) + textShiftY
      const badgeW = Math.max(520, price.length * 30 + 80)
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.roundRect(centerX - badgeW / 2, badgeY - 70, badgeW, 140, 28)
      ctx.fill()

      ctx.fillStyle = '#0f172a'
      const fSize = price.length > 10 ? '56px' : '80px'
      ctx.font = `900 ${fSize} sans-serif`
      ctx.fillText(price, centerX, badgeY + 30)
    }

    const footerY = (isStory ? height - 160 : height - 90) + textShiftY * 0.2
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.roundRect(centerX - 380, footerY - 55, 760, 95, 48)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#34d399'
    ctx.stroke()

    ctx.fillStyle = '#052e16'
    ctx.font = '900 34px sans-serif'
    ctx.fillText(footerButtonText, centerX, footerY + 8)
  }

  if (options.withWatermark) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
    ctx.beginPath()
    ctx.roundRect(width - 290, 30, 260, 50, 25)
    ctx.fill()

    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚡ ZaPost Prévia', width - 160, 62)
  }

  return canvas.toDataURL('image/png')
}

// Dicionário e gerador dinâmico de cópias fiéis ao input do usuário
export function translateAndAdaptToEn(text: string, price: string): string {
  if (!text) return `Special Offer!`
  let t = text.trim()
  
  t = t.replace(/^(eu quero divulgar|divulga|post sobre|estou fazendo|faço|ofereço)\s+/i, '')
  
  const replacements: Array<[RegExp, string]> = [
    [/limpeza de casa|faxina residencial|limpeza residencial/gi, 'House Cleaning'],
    [/limpeza comercial|limpeza de escritório/gi, 'Commercial & Office Cleaning'],
    [/limpeza pós obra|limpeza pós-obra/gi, 'Post-Construction Cleaning'],
    [/pintura residencial|pintura de casa/gi, 'Residential Painting'],
    [/pintura comercial/gi, 'Commercial Painting'],
    [/reforma de banheiro/gi, 'Bathroom Remodeling'],
    [/reforma de cozinha/gi, 'Kitchen Remodeling'],
    [/instalação de piso|pisos e azulejos/gi, 'Flooring & Tile Installation'],
    [/corte de cabelo|barbearia/gi, 'Haircut & Grooming'],
    [/manicure|pedicure|unhas/gi, 'Nail Care & Manicure'],
    [/design de sobrancelhas|sobrancelha/gi, 'Eyebrow Design'],
    [/esta semana|essa semana/gi, 'This Week'],
    [/só hoje|apenas hoje/gi, 'Today Only'],
    [/orçamento grátis|orçamento gratuito/gi, 'Free Estimate'],
    [/vagas limitadas|poucas vagas/gi, 'Limited Availability'],
    [/em framingham/gi, 'in Framingham'],
    [/em boston/gi, 'in Boston'],
    [/em marlborough/gi, 'in Marlborough'],
    [/em worcester/gi, 'in Worcester'],
    [/por (\$\d+|\d+\s*dólares)/gi, `${price}`],
  ]

  for (const [regex, rep] of replacements) {
    t = t.replace(regex, rep)
  }

  return t
}

export function generateDynamicCopy(rawInput: string, price: string, objective: string, language: 'pt' | 'en') {
  const isEn = language === 'en'
  const userText = (rawInput || '').trim()

  let headlinePt1 = ''
  let headlineEn1 = ''
  let headlinePt2 = ''
  let headlineEn2 = ''
  let headlinePt3 = ''
  let headlineEn3 = ''
  let headlinePt4 = ''
  let headlineEn4 = ''
  let headlinePt5 = ''
  let headlineEn5 = ''
  let headlinePt6 = ''
  let headlineEn6 = ''

  if (userText.length > 2) {
    const cleanUserText = userText.replace(/[.!?]+$/, '').trim()
    const englishTranslated = translateAndAdaptToEn(cleanUserText, price)

    headlinePt1 = cleanUserText.toUpperCase()
    headlineEn1 = englishTranslated.toUpperCase()

    headlinePt2 = cleanUserText.toUpperCase()
    headlineEn2 = englishTranslated.toUpperCase()

    headlinePt3 = cleanUserText.toUpperCase()
    headlineEn3 = englishTranslated.toUpperCase()

    headlinePt4 = cleanUserText.toUpperCase()
    headlineEn4 = englishTranslated.toUpperCase()

    headlinePt5 = cleanUserText.toUpperCase()
    headlineEn5 = englishTranslated.toUpperCase()

    headlinePt6 = cleanUserText.toUpperCase()
    headlineEn6 = englishTranslated.toUpperCase()
  } else {
    headlinePt1 = `OFERTA ESPECIAL`
    headlineEn1 = `SPECIAL OFFER`
    headlinePt2 = `SERVIÇO PROFISSIONAL`
    headlineEn2 = `TOP-RATED SERVICE`
    headlinePt3 = `ATENDIMENTO & QUALIDADE`
    headlineEn3 = `RELIABLE SERVICE`
    headlinePt4 = `QUALIDADE COMPROVADA`
    headlineEn4 = `PROVEN QUALITY`
    headlinePt5 = `EXPERIÊNCIA & EXCLUSIVIDADE`
    headlineEn5 = `PREMIUM EXPERIENCE`
    headlinePt6 = `GARANTA SEU HORÁRIO`
    headlineEn6 = `BOOK YOUR SPOT TODAY`
  }

  return [
    {
      id: 'bold-price' as TemplateId,
      name: 'Bold Price',
      badge: isEn ? '1️⃣ Giant Price' : '1️⃣ Preço Gigante',
      headlinePt: headlinePt1,
      headlineEn: headlineEn1,
      captionPt: `${userText || 'Aproveite nossa condição especial esta semana!'} Atendimento na região. Agende já o seu horário! 📲`,
      captionEn: `Special offer available now! Top-rated local service. Contact us today to book! 📲`,
      tagsPt: '#promocao #servicos #boston #massachusetts #brasileirosnoseua',
      tagsEn: '#specialoffer #services #massachusetts #boston #localbusiness',
    },
    {
      id: 'photo-overlay' as TemplateId,
      name: 'Photo Spotlight',
      badge: isEn ? '2️⃣ Photo Spotlight' : '2️⃣ Foto em Destaque',
      headlinePt: headlinePt2,
      headlineEn: headlineEn2,
      captionPt: `Confira o resultado do nosso trabalho! ✨ ${userText || 'Qualidade garantida e atendimento rápido.'} Entre em contato conosco.`,
      captionEn: `Take a look at our results! ✨ ${userText ? translateAndAdaptToEn(userText, price) : 'Top rated quality and friendly service.'} Contact us today.`,
      tagsPt: '#qualidade #servicosprofissionais #satisfacao #massachusetts',
      tagsEn: '#qualityservice #toprated #proservice #bostonlocal',
    },
    {
      id: 'clean-split' as TemplateId,
      name: 'Clean Split',
      badge: isEn ? '3️⃣ Clean Split' : '3️⃣ Divisão Limpa',
      headlinePt: headlinePt3,
      headlineEn: headlineEn3,
      captionPt: `Compromisso e pontualidade com o seu projeto. ${userText || 'Solicite seu orçamento sem compromisso!'} 📲`,
      captionEn: `Reliable and punctual service. ${userText ? translateAndAdaptToEn(userText, price) : 'Get your free estimate today!'} 📲`,
      tagsPt: '#atendimentovip #pontualidade #satisfacao #massachusetts',
      tagsEn: '#residentialservice #highquality #appointment #localbusiness',
    },
    {
      id: 'proof-card' as TemplateId,
      name: '5-Star Proof',
      badge: isEn ? '4️⃣ 5-Star Social Proof' : '4️⃣ Prova Social 5★',
      headlinePt: headlinePt4,
      headlineEn: headlineEn4,
      captionPt: `Mais de 100 clientes satisfeitos! ⭐⭐⭐⭐⭐ ${userText || 'Trabalho sério, honesto e com garantia de satisfação.'} Peça já sua cotação.`,
      captionEn: `Over 100 happy customers! ⭐⭐⭐⭐⭐ ${userText ? translateAndAdaptToEn(userText, price) : 'Quality work and total satisfaction guaranteed.'} Get in touch.`,
      tagsPt: '#avaliacaopositiva #clientesatisfeito #5estrelas #bostonma',
      tagsEn: '#5starservice #happyclients #proservice #massachusetts',
    },
    {
      id: 'minimal-luxury' as TemplateId,
      name: 'Minimal Luxury',
      badge: isEn ? '5️⃣ Minimal Luxury' : '5️⃣ Minimalista Luxo',
      headlinePt: headlinePt5,
      headlineEn: headlineEn5,
      captionPt: `Para quem busca acabamento impecável e máxima confiança. ✨ ${userText || 'Reserve seu atendimento exclusivo.'}`,
      captionEn: `For those who demand the finest service and peace of mind. ✨ ${userText ? translateAndAdaptToEn(userText, price) : 'Book your appointment today.'}`,
      tagsPt: '#estilopremier #luxo #qualidadeexclusiva #massachusetts',
      tagsEn: '#luxuryservice #highend #bostonpro #exclusive',
    },
    {
      id: 'urgent-promo' as TemplateId,
      name: 'Urgent Promo',
      badge: isEn ? '6️⃣ Urgent Promo' : '6️⃣ Urgência & Vagas',
      headlinePt: headlinePt6,
      headlineEn: headlineEn6,
      captionPt: `🔥 Corra que restam poucas vagas essa semana! ${userText || 'Preço especial por tempo limitado.'} Mande mensagem agora mesmo! 📲`,
      captionEn: `🔥 Hurry, limited slots remaining this week! ${userText ? translateAndAdaptToEn(userText, price) : 'Special pricing for a short time.'} Message us now! 📲`,
      tagsPt: '#urgente #ultimasvagas #ofertasemana #bostonma',
      tagsEn: '#limitedtime #hurryup #specialprice #massachusetts',
    },
  ]
}
