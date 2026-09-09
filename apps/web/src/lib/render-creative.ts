export interface RenderCreativeOptions {
  template: 'bold-price' | 'photo-overlay' | 'clean-split'
  format: 'feed' | 'story'
  language: 'pt' | 'en'
  photoUrl: string
  headline: string
  caption?: string
  price: string
  businessName?: string
  phone?: string
  brandColor?: string
  withWatermark?: boolean
}

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
    // Somente adiciona crossOrigin se for URL HTTP/HTTPS externa para não quebrar data: ou blob:
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous'
    }

    img.onload = () => resolve(img)

    img.onerror = () => {
      // Se falhar com crossOrigin, tenta sem crossOrigin
      const retry = new Image()
      retry.onload = () => resolve(retry)
      retry.onerror = () => {
        // Fallback elegante com gradiente escuro se a imagem falhar
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
  const price = options.price ? (options.price.startsWith('$') ? options.price : `$${options.price}`) : '$120'
  const brandColor = options.brandColor || '#10b981'

  // Carrega a foto real do usuário (seja base64, blob ou URL)
  const img = await loadImage(options.photoUrl || '/sample-sala.jpg')

  if (options.template === 'bold-price') {
    // ==================== TEMPLATE 1: BOLD PRICE ====================
    // 1. Foto de fundo preenchendo a tela
    const imgAspect = img.width / img.height
    const canvasAspect = width / height
    let drawW = width
    let drawH = height
    let offsetX = 0
    let offsetY = 0

    if (imgAspect > canvasAspect) {
      drawW = height * imgAspect
      offsetX = (width - drawW) / 2
    } else {
      drawH = width / imgAspect
      offsetY = (height - drawH) / 2
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

    // 2. Gradientes de escurecimento para contraste profissional
    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, 'rgba(11, 15, 23, 0.88)')
    grad.addColorStop(0.35, 'rgba(11, 15, 23, 0.45)')
    grad.addColorStop(0.65, 'rgba(11, 15, 23, 0.78)')
    grad.addColorStop(1, 'rgba(11, 15, 23, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // 3. Topo: Nome da Marca
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`✨ ${businessName.toUpperCase()} ✨`, width / 2, isStory ? 180 : 100)

    ctx.fillStyle = brandColor
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(isEn ? 'SPECIAL LIMITED OFFER' : 'OFERTA ESPECIAL DA SEMANA', width / 2, isStory ? 230 : 145)

    // 4. Centro: Badge Gigante de Preço
    const badgeY = isStory ? height / 2 - 120 : height / 2 - 60
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.beginPath()
    ctx.roundRect(width / 2 - 280, badgeY - 110, 560, 220, 36)
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = brandColor
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(isEn ? 'STARTING AT ONLY' : 'A PARTIR DE APENAS', width / 2, badgeY - 45)

    ctx.fillStyle = '#f59e0b'
    ctx.font = '900 110px sans-serif'
    ctx.fillText(price, width / 2, badgeY + 60)

    // 5. Headline da Oferta
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px sans-serif'
    const headlineY = isStory ? height / 2 + 220 : height / 2 + 200
    wrapText(ctx, options.headline.toUpperCase(), width / 2, headlineY, 860, 56, 3)

    // 6. Rodapé: Chamada de Contato
    const footerY = isStory ? height - 160 : height - 100
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.roundRect(width / 2 - 360, footerY - 55, 720, 90, 45)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 34px sans-serif'
    ctx.fillText(`📱 ${isEn ? 'Call / Text' : 'Contato & Agendamento'}: ${phone}`, width / 2, footerY + 5)
  } else if (options.template === 'photo-overlay') {
    // ==================== TEMPLATE 2: PHOTO OVERLAY ====================
    // 1. Foto ocupando tudo
    const imgAspect = img.width / img.height
    const canvasAspect = width / height
    let drawW = width
    let drawH = height
    let offsetX = 0
    let offsetY = 0

    if (imgAspect > canvasAspect) {
      drawW = height * imgAspect
      offsetX = (width - drawW) / 2
    } else {
      drawH = width / imgAspect
      offsetY = (height - drawH) / 2
    }
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

    // 2. Gradiente escuro focado no terço inferior
    const grad = ctx.createLinearGradient(0, height * 0.35, 0, height)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(0.45, 'rgba(11, 15, 23, 0.85)')
    grad.addColorStop(1, 'rgba(11, 15, 23, 0.98)')
    ctx.fillStyle = grad
    ctx.fillRect(0, height * 0.35, width, height * 0.65)

    // 3. Badge flutuante de preço no canto superior direito
    ctx.fillStyle = 'rgba(15, 46, 42, 0.92)'
    ctx.beginPath()
    ctx.roundRect(width - 320, isStory ? 140 : 60, 260, 100, 24)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#f59e0b'
    ctx.stroke()

    ctx.fillStyle = '#f59e0b'
    ctx.font = '900 52px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(price, width - 190, isStory ? 212 : 132)

    // 4. Card de Conteúdo Inferior
    ctx.textAlign = 'left'
    ctx.fillStyle = brandColor
    ctx.font = 'bold 28px sans-serif'
    const contentY = isStory ? height - 520 : height - 380
    ctx.fillText(`✨ ${businessName.toUpperCase()}`, 80, contentY)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 46px sans-serif'
    wrapText(ctx, options.headline, 80, contentY + 65, 920, 60, 3)

    // 5. Botão de Contato no rodapé
    const footerY = isStory ? height - 160 : height - 100
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.roundRect(80, footerY - 50, width - 160, 85, 24)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 34px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`💬 ${isEn ? 'Appointments' : 'Agendamentos & Contato'}: ${phone}`, width / 2, footerY + 7)
  } else {
    // ==================== TEMPLATE 3: CLEAN SPLIT ====================
    // 1. Fundo sólido profundo
    ctx.fillStyle = '#0b0f17'
    ctx.fillRect(0, 0, width, height)

    // 2. Metade Superior: Foto do usuário em moldura moderna
    const photoH = isStory ? height * 0.52 : height * 0.55
    const margin = 50
    const photoW = width - margin * 2

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(margin, margin + (isStory ? 80 : 20), photoW, photoH - 60, 36)
    ctx.clip()

    // Desenha foto cortada
    const imgAspect = img.width / img.height
    const boxAspect = photoW / (photoH - 60)
    let dW = photoW
    let dH = photoH - 60
    let ox = margin
    let oy = margin + (isStory ? 80 : 20)

    if (imgAspect > boxAspect) {
      dW = (photoH - 60) * imgAspect
      ox = margin + (photoW - dW) / 2
    } else {
      dH = photoW / imgAspect
      oy = margin + (isStory ? 80 : 20) + (photoH - 60 - dH) / 2
    }
    ctx.drawImage(img, ox, oy, dW, dH)
    ctx.restore()

    // Borda da foto
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(margin, margin + (isStory ? 80 : 20), photoW, photoH - 60, 36)
    ctx.stroke()

    // 3. Metade Inferior: Informações, Preço e Chamada
    const bottomStartY = photoH + (isStory ? 100 : 40)

    // Tag da Marca
    ctx.fillStyle = brandColor
    ctx.font = 'bold 26px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`🏆 ${businessName.toUpperCase()}`, margin, bottomStartY)

    // Preço alinhado à direita
    ctx.fillStyle = '#f59e0b'
    ctx.font = '900 48px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(price, width - margin, bottomStartY)

    // Headline
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px sans-serif'
    ctx.textAlign = 'left'
    wrapText(ctx, options.headline, margin, bottomStartY + 65, photoW, 58, 3)

    // Botão de Contato
    const footerY = isStory ? height - 160 : height - 90
    ctx.fillStyle = '#25D366'
    ctx.beginPath()
    ctx.roundRect(margin, footerY - 50, photoW, 85, 24)
    ctx.fill()

    ctx.fillStyle = '#052e16'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`📲 ${isEn ? 'Appointments' : 'Agendamentos'}: ${phone}`, width / 2, footerY + 6)
  }

  // 7. Marca d'água opcional se preview
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
function translateAndAdaptToEn(text: string, price: string): string {
  if (!text) return `Special Offer for only ${price}!`
  let t = text.trim()
  
  // Limpeza de prefixos comuns em português
  t = t.replace(/^(eu quero divulgar|divulga|post sobre|estou fazendo|faço|ofereço)\s+/i, '')
  
  // Substituições de termos para inglês fluente
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
    [/por (\$\d+|\d+\s*dólares)/gi, `for only ${price}`],
  ]

  for (const [regex, rep] of replacements) {
    t = t.replace(regex, rep)
  }

  return t
}

export function generateDynamicCopy(rawInput: string, price: string, objective: string, language: 'pt' | 'en') {
  const cleanPrice = price ? (price.startsWith('$') ? price : `$${price}`) : '$120'
  const isEn = language === 'en'

  const userText = (rawInput || '').trim()

  // Se o usuário digitou algo real, priorizamos 100% o que ele digitou
  let headlinePt1 = ''
  let headlineEn1 = ''
  let headlinePt2 = ''
  let headlineEn2 = ''
  let headlinePt3 = ''
  let headlineEn3 = ''

  if (userText.length > 3) {
    // Limpa pontuações extras
    const cleanUserText = userText.replace(/[.!?]+$/, '')
    const englishTranslated = translateAndAdaptToEn(cleanUserText, cleanPrice)

    // 1. Ângulo Direto & Oferta
    headlinePt1 = `${cleanUserText.toUpperCase()} • ${cleanPrice}!`
    headlineEn1 = `${englishTranslated.toUpperCase()} • ONLY ${cleanPrice}!`

    // 2. Ângulo Promessa & Benefício
    headlinePt2 = `O MELHOR EM ${cleanUserText.toUpperCase()}`
    headlineEn2 = `TOP QUALITY ${englishTranslated.toUpperCase()}`

    // 3. Ângulo Confiança & Chamada
    headlinePt3 = `${cleanUserText.toUpperCase()} COM GARANTIA`
    headlineEn3 = `RELIABLE ${englishTranslated.toUpperCase()}`
  } else {
    // Fallback somente se não digitou absolutamente nada
    headlinePt1 = `OFERTA ESPECIAL POR APENAS ${cleanPrice}!`
    headlineEn1 = `SPECIAL OFFER: ONLY ${cleanPrice} THIS WEEK!`
    headlinePt2 = `SERVIÇO PROFISSIONAL DE QUALIDADE`
    headlineEn2 = `TOP-RATED PROFESSIONAL SERVICE`
    headlinePt3 = `AGENDAMENTO RÁPIDO POR ${cleanPrice}`
    headlineEn3 = `QUICK APPOINTMENT FOR ${cleanPrice}`
  }

  return [
    {
      id: 'bold-price',
      name: 'Bold Price',
      badge: isEn ? '1️⃣ Option 1: Giant Price' : '1️⃣ Opção 1: Preço Gigante',
      headlinePt: headlinePt1,
      headlineEn: headlineEn1,
      captionPt: `${userText || 'Aproveite nossa condição especial esta semana!'} Atendimento na região de Massachusetts. Agende já o seu horário! 📲`,
      captionEn: `Special offer available now! Top-rated service in MA. Contact us today to book! 📲`,
      tagsPt: '#promocao #servicos #boston #massachusetts #brasileirosnoseua',
      tagsEn: '#specialoffer #services #massachusetts #boston #localbusiness',
    },
    {
      id: 'photo-overlay',
      name: 'Photo Overlay',
      badge: isEn ? '2️⃣ Option 2: Photo Spotlight' : '2️⃣ Opção 2: Foto c/ Gradiente',
      headlinePt: headlinePt2,
      headlineEn: headlineEn2,
      captionPt: `Confira o resultado do nosso trabalho! ✨ ${userText || 'Qualidade garantida e atendimento rápido.'} Entre em contato conosco.`,
      captionEn: `Take a look at our results! ✨ ${userText ? translateAndAdaptToEn(userText, cleanPrice) : 'Top rated quality and friendly service.'} Contact us today.`,
      tagsPt: '#qualidade #servicosprofissionais #satisfacao #massachusetts',
      tagsEn: '#qualityservice #toprated #proservice #bostonlocal',
    },
    {
      id: 'clean-split',
      name: 'Clean Split',
      badge: isEn ? '3️⃣ Option 3: Clean Split' : '3️⃣ Opção 3: Divisão Limpa',
      headlinePt: headlinePt3,
      headlineEn: headlineEn3,
      captionPt: `Compromisso e pontualidade com o seu projeto. ${userText || 'Solicite seu orçamento sem compromisso!'} 📲`,
      captionEn: `Reliable and punctual service. ${userText ? translateAndAdaptToEn(userText, cleanPrice) : 'Get your free estimate today!'} 📲`,
      tagsPt: '#atendimentovip #pontualidade #satisfacao #massachusetts',
      tagsEn: '#residentialservice #highquality #appointment #localbusiness',
    },
  ]
}

