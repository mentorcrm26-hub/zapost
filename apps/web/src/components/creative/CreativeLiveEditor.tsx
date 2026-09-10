'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Sparkles,
  RefreshCw,
  Palette,
  Type,
  Smartphone,
  Layout,
  Tag,
  Eye,
  EyeOff,
  MessageSquare,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sliders,
  Maximize2,
  ZoomIn,
  MousePointer,
  Check,
  Building,
  Image as ImageIcon,
} from 'lucide-react'
import {
  renderCreativeCanvas,
  TEMPLATE_CATALOG,
  TemplateId,
} from '@/lib/render-creative'

export type EditableLayer = 'headline' | 'price' | 'cta' | 'brand' | 'photo'

interface CreativeLiveEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedOption: {
    id: string
    templateId: TemplateId
    headlinePt: string
    headlineEn: string
    price: string
    showPrice: boolean
    textOffsetX: number
    textOffsetY: number
    headlineOffsetX: number
    headlineOffsetY: number
    headlineScale: number
    priceOffsetX: number
    priceOffsetY: number
    priceScale: number
    brandOffsetX: number
    brandOffsetY: number
    ctaOffsetX: number
    ctaOffsetY: number
    ctaScale: number
    photoOffsetX: number
    photoOffsetY: number
    photoScale: number
    ctaTextPt: string
    ctaTextEn: string
    businessName: string
    phone: string
    brandColor: string
    previewUrl: string
    previewUrlEn: string
    finalUrl: string
    finalUrlEn: string
    finalStoryUrl: string
    finalStoryUrlEn: string
  }) => void
  initialData: {
    id: string
    templateId?: TemplateId
    headlinePt: string
    headlineEn: string
    price?: string
    showPrice?: boolean
    textOffsetX?: number
    textOffsetY?: number
    headlineOffsetX?: number
    headlineOffsetY?: number
    headlineScale?: number
    priceOffsetX?: number
    priceOffsetY?: number
    priceScale?: number
    brandOffsetX?: number
    brandOffsetY?: number
    ctaOffsetX?: number
    ctaOffsetY?: number
    ctaScale?: number
    photoOffsetX?: number
    photoOffsetY?: number
    photoScale?: number
    ctaTextPt?: string
    ctaTextEn?: string
    photoUrl: string
    businessName?: string
    phone?: string
    brandColor?: string
    language?: 'pt' | 'en'
  }
}

const BRAND_PALETTES = [
  { name: 'Esmeralda Prosper', color: '#10b981' },
  { name: 'Petróleo Clássico', color: '#0f2e2a' },
  { name: 'Âmbar Dourado', color: '#f59e0b' },
  { name: 'Azul Confiança', color: '#2563eb' },
  { name: 'Roxo Criativo', color: '#8b5cf6' },
  { name: 'Vermelho Urgente', color: '#dc2626' },
  { name: 'Ouro Luxo', color: '#d4af37' },
  { name: 'Preto Elegante', color: '#18181b' },
]

export function CreativeLiveEditor({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreativeLiveEditorProps) {
  const [templateId, setTemplateId] = useState<TemplateId>(
    (initialData.templateId || initialData.id || 'bold-price') as TemplateId
  )
  const [format, setFormat] = useState<'feed' | 'story'>('feed')
  const [language, setLanguage] = useState<'pt' | 'en'>(initialData.language || 'pt')
  const [activeTab, setActiveTab] = useState<'texto' | 'mover' | 'design'>('mover')

  // Camada/Elemento Ativo Selecionado (Estilo Canva)
  const [selectedLayer, setSelectedLayer] = useState<EditableLayer>('headline')

  // Textos
  const [headlinePt, setHeadlinePt] = useState(initialData.headlinePt || '')
  const [headlineEn, setHeadlineEn] = useState(initialData.headlineEn || '')
  
  // Destaque Secundário / Preço / Texto Extra (sem $)
  const [price, setPrice] = useState(initialData.price || '')
  const [showPrice, setShowPrice] = useState<boolean>(initialData.showPrice !== false)
  
  // 1. Headline (Texto Principal) - Posição e Escala Individual
  const [headlineOffsetX, setHeadlineOffsetX] = useState<number>(initialData.headlineOffsetX || 0)
  const [headlineOffsetY, setHeadlineOffsetY] = useState<number>(initialData.headlineOffsetY || 0)
  const [headlineScale, setHeadlineScale] = useState<number>(initialData.headlineScale || 1.0)

  // 2. Preço / Destaque Secundário - Posição e Escala Individual
  const [priceOffsetX, setPriceOffsetX] = useState<number>(initialData.priceOffsetX || 0)
  const [priceOffsetY, setPriceOffsetY] = useState<number>(initialData.priceOffsetY || 0)
  const [priceScale, setPriceScale] = useState<number>(initialData.priceScale || 1.0)

  // 3. Botão de Rodapé / CTA - Posição e Escala Individual
  const [ctaOffsetX, setCtaOffsetX] = useState<number>(initialData.ctaOffsetX || 0)
  const [ctaOffsetY, setCtaOffsetY] = useState<number>(initialData.ctaOffsetY || 0)
  const [ctaScale, setCtaScale] = useState<number>(initialData.ctaScale || 1.0)

  // 4. Nome da Empresa / Topo - Posição Individual
  const [brandOffsetX, setBrandOffsetX] = useState<number>(initialData.brandOffsetX || 0)
  const [brandOffsetY, setBrandOffsetY] = useState<number>(initialData.brandOffsetY || 0)

  // 5. Enquadramento e Posição da Foto de Fundo
  const [photoOffsetX, setPhotoOffsetX] = useState<number>(initialData.photoOffsetX || 0)
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(initialData.photoOffsetY || 0)
  const [photoScale, setPhotoScale] = useState<number>(initialData.photoScale || 1.0)

  // Identificação e Botão
  const [businessName, setBusinessName] = useState(initialData.businessName || 'Livia Maria')
  const [phone, setPhone] = useState(initialData.phone || '(407) 474-2138')
  
  const [ctaTextPt, setCtaTextPt] = useState(
    initialData.ctaTextPt || `💬 Agendamentos & Contato: ${initialData.phone || '(407) 474-2138'}`
  )
  const [ctaTextEn, setCtaTextEn] = useState(
    initialData.ctaTextEn || `📱 Call / Text: ${initialData.phone || '(407) 474-2138'}`
  )
  
  const [brandColor, setBrandColor] = useState(initialData.brandColor || '#10b981')

  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('')
  const [isRendering, setIsRendering] = useState<boolean>(false)

  // Drag-and-drop no Canvas (Estilo Canva)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)

  // Re-renderiza o canvas em tempo real sempre que qualquer propriedade mudar
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setIsRendering(true)

    const timer = setTimeout(async () => {
      try {
        const headline = language === 'en' ? headlineEn : headlinePt
        const ctaText = language === 'en' ? ctaTextEn : ctaTextPt

        const dataUrl = await renderCreativeCanvas({
          template: templateId,
          format: format,
          language: language,
          photoUrl: initialData.photoUrl || '/sample-sala.jpg',
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headline || 'SEU SERVIÇO AQUI',
          price: price,
          showPrice: showPrice,
          ctaText: ctaText,
          businessName: businessName,
          phone: phone,
          brandColor: brandColor,
          withWatermark: true,
        })

        if (isMounted) {
          setLivePreviewUrl(dataUrl)
          setIsRendering(false)
        }
      } catch (err) {
        console.error('Erro ao renderizar prévia ao vivo:', err)
        if (isMounted) setIsRendering(false)
      }
    }, 60) // Atualização rápida

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [
    isOpen,
    templateId,
    format,
    language,
    headlinePt,
    headlineEn,
    price,
    showPrice,
    headlineOffsetX,
    headlineOffsetY,
    headlineScale,
    priceOffsetX,
    priceOffsetY,
    priceScale,
    brandOffsetX,
    brandOffsetY,
    ctaOffsetX,
    ctaOffsetY,
    ctaScale,
    photoOffsetX,
    photoOffsetY,
    photoScale,
    ctaTextPt,
    ctaTextEn,
    businessName,
    phone,
    brandColor,
    initialData.photoUrl,
  ])

  if (!isOpen) return null

  // Helpers para mover o elemento atualmente selecionado
  const moveActiveLayer = (dx: number, dy: number) => {
    switch (selectedLayer) {
      case 'headline':
        setHeadlineOffsetX((p) => Math.max(-50, Math.min(50, p + dx)))
        setHeadlineOffsetY((p) => Math.max(-50, Math.min(50, p + dy)))
        break
      case 'price':
        setPriceOffsetX((p) => Math.max(-50, Math.min(50, p + dx)))
        setPriceOffsetY((p) => Math.max(-50, Math.min(50, p + dy)))
        break
      case 'cta':
        setCtaOffsetX((p) => Math.max(-50, Math.min(50, p + dx)))
        setCtaOffsetY((p) => Math.max(-50, Math.min(50, p + dy)))
        break
      case 'brand':
        setBrandOffsetX((p) => Math.max(-50, Math.min(50, p + dx)))
        setBrandOffsetY((p) => Math.max(-50, Math.min(50, p + dy)))
        break
      case 'photo':
        setPhotoOffsetX((p) => Math.max(-50, Math.min(50, p + dx)))
        setPhotoOffsetY((p) => Math.max(-50, Math.min(50, p + dy)))
        break
    }
  }

  const resetActiveLayer = () => {
    switch (selectedLayer) {
      case 'headline':
        setHeadlineOffsetX(0)
        setHeadlineOffsetY(0)
        setHeadlineScale(1.0)
        break
      case 'price':
        setPriceOffsetX(0)
        setPriceOffsetY(0)
        setPriceScale(1.0)
        break
      case 'cta':
        setCtaOffsetX(0)
        setCtaOffsetY(0)
        setCtaScale(1.0)
        break
      case 'brand':
        setBrandOffsetX(0)
        setBrandOffsetY(0)
        break
      case 'photo':
        setPhotoOffsetX(0)
        setPhotoOffsetY(0)
        setPhotoScale(1.0)
        break
    }
  }

  const resetAllPositions = () => {
    setHeadlineOffsetX(0)
    setHeadlineOffsetY(0)
    setHeadlineScale(1.0)
    setPriceOffsetX(0)
    setPriceOffsetY(0)
    setPriceScale(1.0)
    setCtaOffsetX(0)
    setCtaOffsetY(0)
    setCtaScale(1.0)
    setBrandOffsetX(0)
    setBrandOffsetY(0)
    setPhotoOffsetX(0)
    setPhotoOffsetY(0)
    setPhotoScale(1.0)
  }

  // Drag and Drop interativo no Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    let curX = 0
    let curY = 0
    if (selectedLayer === 'headline') { curX = headlineOffsetX; curY = headlineOffsetY }
    else if (selectedLayer === 'price') { curX = priceOffsetX; curY = priceOffsetY }
    else if (selectedLayer === 'cta') { curX = ctaOffsetX; curY = ctaOffsetY }
    else if (selectedLayer === 'brand') { curX = brandOffsetX; curY = brandOffsetY }
    else if (selectedLayer === 'photo') { curX = photoOffsetX; curY = photoOffsetY }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: curX,
      startY: curY,
    }
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    
    // Converte delta de pixel do preview (~300px) para porcentagem
    const deltaPercentX = (dx / 300) * 70
    const deltaPercentY = (dy / 300) * 70

    const newX = Math.round(Math.max(-50, Math.min(50, dragStartRef.current.startX + deltaPercentX)))
    const newY = Math.round(Math.max(-50, Math.min(50, dragStartRef.current.startY + deltaPercentY)))

    if (selectedLayer === 'headline') { setHeadlineOffsetX(newX); setHeadlineOffsetY(newY) }
    else if (selectedLayer === 'price') { setPriceOffsetX(newX); setPriceOffsetY(newY) }
    else if (selectedLayer === 'cta') { setCtaOffsetX(newX); setCtaOffsetY(newY) }
    else if (selectedLayer === 'brand') { setBrandOffsetX(newX); setBrandOffsetY(newY) }
    else if (selectedLayer === 'photo') { setPhotoOffsetX(newX); setPhotoOffsetY(newY) }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    dragStartRef.current = null
  }

  // Getters para os controles da camada ativa
  const getActiveLayerValues = () => {
    switch (selectedLayer) {
      case 'headline':
        return {
          name: 'Texto Principal (Headline)',
          icon: <Type className="w-4 h-4 text-emerald-400" />,
          x: headlineOffsetX,
          y: headlineOffsetY,
          scale: headlineScale,
          setX: setHeadlineOffsetX,
          setY: setHeadlineOffsetY,
          setScale: setHeadlineScale,
          hasScale: true,
        }
      case 'price':
        return {
          name: 'Destaque Secundário / Preço',
          icon: <Tag className="w-4 h-4 text-amber-400" />,
          x: priceOffsetX,
          y: priceOffsetY,
          scale: priceScale,
          setX: setPriceOffsetX,
          setY: setPriceOffsetY,
          setScale: setPriceScale,
          hasScale: true,
        }
      case 'cta':
        return {
          name: 'Botão de Contato / Rodapé',
          icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
          x: ctaOffsetX,
          y: ctaOffsetY,
          scale: ctaScale,
          setX: setCtaOffsetX,
          setY: setCtaOffsetY,
          setScale: setCtaScale,
          hasScale: true,
        }
      case 'brand':
        return {
          name: 'Nome da Marca / Topo',
          icon: <Building className="w-4 h-4 text-blue-400" />,
          x: brandOffsetX,
          y: brandOffsetY,
          scale: 1.0,
          setX: setBrandOffsetX,
          setY: setBrandOffsetY,
          setScale: () => {},
          hasScale: false,
        }
      case 'photo':
        return {
          name: 'Foto de Fundo (Enquadramento)',
          icon: <ImageIcon className="w-4 h-4 text-purple-400" />,
          x: photoOffsetX,
          y: photoOffsetY,
          scale: photoScale,
          setX: setPhotoOffsetX,
          setY: setPhotoOffsetY,
          setScale: setPhotoScale,
          hasScale: true,
          scaleMin: 0.5,
          scaleMax: 2.5,
        }
    }
  }

  const activeValues = getActiveLayerValues()

  const handleSaveAndApply = async () => {
    setIsRendering(true)
    try {
      const photo = initialData.photoUrl || '/sample-sala.jpg'

      const [
        previewPt,
        previewEn,
        finalFeedPt,
        finalFeedEn,
        finalStoryPt,
        finalStoryEn,
      ] = await Promise.all([
        renderCreativeCanvas({
          template: templateId,
          format: 'feed',
          language: 'pt',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlinePt,
          price,
          showPrice,
          ctaText: ctaTextPt,
          businessName,
          phone,
          brandColor,
          withWatermark: true,
        }),
        renderCreativeCanvas({
          template: templateId,
          format: 'feed',
          language: 'en',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlineEn,
          price,
          showPrice,
          ctaText: ctaTextEn,
          businessName,
          phone,
          brandColor,
          withWatermark: true,
        }),
        renderCreativeCanvas({
          template: templateId,
          format: 'feed',
          language: 'pt',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlinePt,
          price,
          showPrice,
          ctaText: ctaTextPt,
          businessName,
          phone,
          brandColor,
          withWatermark: false,
        }),
        renderCreativeCanvas({
          template: templateId,
          format: 'feed',
          language: 'en',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlineEn,
          price,
          showPrice,
          ctaText: ctaTextEn,
          businessName,
          phone,
          brandColor,
          withWatermark: false,
        }),
        renderCreativeCanvas({
          template: templateId,
          format: 'story',
          language: 'pt',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlinePt,
          price,
          showPrice,
          ctaText: ctaTextPt,
          businessName,
          phone,
          brandColor,
          withWatermark: false,
        }),
        renderCreativeCanvas({
          template: templateId,
          format: 'story',
          language: 'en',
          photoUrl: photo,
          headlineOffsetX,
          headlineOffsetY,
          headlineScale,
          priceOffsetX,
          priceOffsetY,
          priceScale,
          brandOffsetX,
          brandOffsetY,
          ctaOffsetX,
          ctaOffsetY,
          ctaScale,
          photoOffsetX,
          photoOffsetY,
          photoScale,
          headline: headlineEn,
          price,
          showPrice,
          ctaText: ctaTextEn,
          businessName,
          phone,
          brandColor,
          withWatermark: false,
        }),
      ])

      onSave({
        id: initialData.id,
        templateId,
        headlinePt,
        headlineEn,
        price,
        showPrice,
        textOffsetX: 0,
        textOffsetY: 0,
        headlineOffsetX,
        headlineOffsetY,
        headlineScale,
        priceOffsetX,
        priceOffsetY,
        priceScale,
        brandOffsetX,
        brandOffsetY,
        ctaOffsetX,
        ctaOffsetY,
        ctaScale,
        photoOffsetX,
        photoOffsetY,
        photoScale,
        ctaTextPt,
        ctaTextEn,
        businessName,
        phone,
        brandColor,
        previewUrl: previewPt,
        previewUrlEn: previewEn,
        finalUrl: finalFeedPt,
        finalUrlEn: finalFeedEn,
        finalStoryUrl: finalStoryPt,
        finalStoryUrlEn: finalStoryEn,
      })
      onClose()
    } catch (err) {
      console.error('Erro ao salvar customização:', err)
      alert('Houve um erro ao processar os arquivos da arte.')
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-white/15 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header do Modal */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🎨
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Editor Completo da Arte
              </h2>
              <p className="text-[11px] text-zinc-400">
                Selecione e mova qualquer texto individualmente ou arraste diretamente na prévia (estilo Canva).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto flex-1">
          {/* Coluna Esquerda: Preview ao Vivo + Área de Arraste Canva */}
          <div className="flex flex-col items-center justify-center bg-black/60 rounded-2xl p-3 border border-white/10 relative min-h-[360px]">
            {/* Controles de Formato e Idioma */}
            <div className="w-full flex items-center justify-between mb-2.5 gap-2">
              <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setFormat('feed')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    format === 'feed'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Feed (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    format === 'story'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Story (9:16)
                </button>
              </div>

              <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('pt')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    language === 'pt'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🇧🇷 PT
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    language === 'en'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            {/* Imagem de Prévia Renderizada com Suporte a Drag & Drop (Canva-like) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative w-full max-w-[320px] aspect-square flex items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-zinc-900 shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none transition-shadow ${
                isDragging ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-950 shadow-emerald-900/30' : ''
              }`}
              title="Clique e arraste para reposicionar o elemento selecionado!"
            >
              {livePreviewUrl ? (
                <img
                  src={livePreviewUrl}
                  alt="Prévia em tempo real"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-xs">Renderizando arte...</span>
                </div>
              )}

              {/* Indicador de Arraste / Elemento Ativo */}
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="bg-black/80 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                  <MousePointer className="w-2.5 h-2.5" />
                  {activeValues.name}
                </span>
              </div>

              {isRendering && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-emerald-300 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Atualizando...
                  </span>
                </div>
              )}
            </div>

            {/* Dica de arraste Canva */}
            <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">💡 Dica Canva:</span> Clique e arraste o mouse na prévia para mover!
            </p>
          </div>

          {/* Coluna Direita: Abas e Controles Individuais */}
          <div className="flex flex-col gap-3 text-xs">
            {/* Abas Superiores */}
            <div className="grid grid-cols-3 bg-zinc-900 rounded-xl p-1 border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('mover')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'mover'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>📍 Mover Elementos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('texto')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'texto'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>✍️ Textos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'design'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>🎨 Modelos & Cores</span>
              </button>
            </div>

            {/* ABA 1: MOVER ELEMENTOS INDIVIDUAIS (ESTILO CANVA) */}
            {activeTab === 'mover' && (
              <div className="flex flex-col gap-3 bg-zinc-900/90 border border-white/10 rounded-2xl p-3.5">
                {/* Seletor de Camadas / Elementos */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
                    1️⃣ Escolha qual elemento você quer mover ou redimensionar:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedLayer('headline')}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                        selectedLayer === 'headline'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="truncate">✍️ Headline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLayer('price')}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                        selectedLayer === 'price'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="truncate">🏷️ Preço/Valor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLayer('cta')}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                        selectedLayer === 'cta'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="truncate">💬 Botão Rodapé</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLayer('brand')}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                        selectedLayer === 'brand'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      <span className="truncate">🏢 Nome/Topo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLayer('photo')}
                      className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                        selectedLayer === 'photo'
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                      <span className="truncate">🖼️ Foto de Fundo</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetAllPositions}
                      className="p-2 rounded-xl border border-white/10 bg-zinc-800/40 text-zinc-400 hover:text-white flex items-center justify-center gap-1 text-[11px] transition-colors"
                      title="Resetar todos os elementos para a posição original"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resetar Tudo</span>
                    </button>
                  </div>
                </div>

                {/* Bloco de Controle do Elemento Selecionado */}
                <div className="bg-zinc-950/70 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      {activeValues.icon}
                      <span>Ajustando: <strong className="text-emerald-400">{activeValues.name}</strong></span>
                    </span>

                    <button
                      type="button"
                      onClick={resetActiveLayer}
                      className="text-[10px] text-zinc-400 hover:text-emerald-300 flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded-md"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Resetar</span>
                    </button>
                  </div>

                  {/* Joystick Direcional 4 Vias */}
                  <div className="flex items-center justify-center gap-4 py-1">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveActiveLayer(0, -6)}
                        className="p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 active:scale-90 shadow transition-all touch-target"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveActiveLayer(-6, 0)}
                          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 active:scale-90 shadow transition-all touch-target"
                          title="Mover para esquerda"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={resetActiveLayer}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]"
                        >
                          Centro
                        </button>

                        <button
                          type="button"
                          onClick={() => moveActiveLayer(6, 0)}
                          className="p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 active:scale-90 shadow transition-all touch-target"
                          title="Mover para direita"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => moveActiveLayer(0, 6)}
                        className="p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-200 active:scale-90 shadow transition-all touch-target"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Botões Rápidos de Alinhamento */}
                    <div className="flex flex-col gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => activeValues.setY(-28)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-left font-semibold flex items-center gap-1"
                      >
                        🔝 Mais no Topo
                      </button>
                      <button
                        type="button"
                        onClick={() => { activeValues.setX(0); activeValues.setY(0); }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-left font-semibold flex items-center gap-1"
                      >
                        🎯 Centralizar
                      </button>
                      <button
                        type="button"
                        onClick={() => activeValues.setY(28)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-left font-semibold flex items-center gap-1"
                      >
                        ⬇️ Mais na Base
                      </button>
                    </div>
                  </div>

                  {/* Sliders de Precisão */}
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    {/* Altura Vertical */}
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>↕️ Altura Vertical (Y):</span>
                        <span className="font-mono text-emerald-400 font-bold">{activeValues.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={activeValues.y}
                        onChange={(e) => activeValues.setY(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                      />
                    </div>

                    {/* Posição Horizontal */}
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>↔️ Deslocamento Lateral (X):</span>
                        <span className="font-mono text-emerald-400 font-bold">{activeValues.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={activeValues.x}
                        onChange={(e) => activeValues.setX(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                      />
                    </div>

                    {/* Escala / Tamanho do Elemento */}
                    {activeValues.hasScale && (
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-0.5">
                          <span>🔍 Tamanho / Zoom:</span>
                          <span className="font-mono text-amber-400 font-bold">{activeValues.scale.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min={activeValues.scaleMin || 0.6}
                          max={activeValues.scaleMax || 1.8}
                          step="0.05"
                          value={activeValues.scale}
                          onChange={(e) => activeValues.setScale(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: EDIÇÃO DE TEXTOS */}
            {activeTab === 'texto' && (
              <div className="flex flex-col gap-3.5 bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5">
                {/* Headline Principal */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Texto Principal (Headline da Imagem):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setSelectedLayer('headline'); setActiveTab('mover'); }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold"
                    >
                      <Move className="w-3 h-3" />
                      <span>Mover</span>
                    </button>
                  </div>

                  {language === 'pt' ? (
                    <textarea
                      rows={2}
                      value={headlinePt}
                      onChange={(e) => setHeadlinePt(e.target.value)}
                      placeholder="Digite exatamente o texto principal da arte..."
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={headlineEn}
                      onChange={(e) => setHeadlineEn(e.target.value)}
                      placeholder="Type the exact main headline in English..."
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  )}
                </div>

                {/* Destaque Secundário / Preço */}
                <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Destaque Secundário / Preço na Imagem:</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedLayer('price'); setActiveTab('mover'); }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-bold"
                      >
                        <Move className="w-3 h-3" />
                        <span>Mover</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPrice(!showPrice)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                          showPrice
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 border border-white/10'
                        }`}
                      >
                        {showPrice ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Exibindo</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Oculto</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {showPrice && (
                    <div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ex: $120, 120, Palestra Exclusiva, Sob Consulta..."
                        className="w-full bg-zinc-950 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400 font-extrabold focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">
                        💡 Aparece exatamente o texto que você digitar (sem cifrão forçado).
                      </p>
                    </div>
                  )}
                </div>

                {/* Texto do Botão de Rodapé */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Texto do Botão de Rodapé (Contato / CTA):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setSelectedLayer('cta'); setActiveTab('mover'); }}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold"
                    >
                      <Move className="w-3 h-3" />
                      <span>Mover</span>
                    </button>
                  </div>

                  {language === 'pt' ? (
                    <input
                      type="text"
                      value={ctaTextPt}
                      onChange={(e) => setCtaTextPt(e.target.value)}
                      placeholder="Ex: 💬 Agendamentos & Contato: (407) 474-2138"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      value={ctaTextEn}
                      onChange={(e) => setCtaTextEn(e.target.value)}
                      placeholder="Ex: 📱 Call / Text: (407) 474-2138"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  )}
                </div>

                {/* Nome da Marca / Telefone */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1">
                      <span>Nome / Marca (Topo):</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Livia Maria"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Telefone:</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(407) 474-2138"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: MODELOS & CORES */}
            {activeTab === 'design' && (
              <div className="flex flex-col gap-3.5 bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5">
                {/* Seletor de Templates Visuais */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-2">
                    <Layout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estilo & Layout do Criativo:</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATE_CATALOG.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setTemplateId(tpl.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                          templateId === tpl.id
                            ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                            : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[11px] text-white">
                            {language === 'en' ? tpl.badgeEn : tpl.badgePt}
                          </span>
                          {templateId === tpl.id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                          {language === 'en' ? tpl.descriptionEn : tpl.descriptionPt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paleta de Cores */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-2">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cores da Marca / Destaque:</span>
                  </label>

                  <div className="grid grid-cols-4 gap-2">
                    {BRAND_PALETTES.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setBrandColor(p.color)}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          brandColor === p.color
                            ? 'border-white bg-zinc-800 shadow'
                            : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-800'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shadow-inner border border-white/20"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-[9px] text-zinc-300 truncate w-full text-center">
                          {p.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="p-3 sm:p-4 border-t border-white/10 flex items-center justify-between bg-zinc-900/95 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            disabled={isRendering}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {isRendering ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Aplicando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Salvar e Aplicar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
