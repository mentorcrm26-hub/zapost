'use client'

import React, { useState, useEffect } from 'react'
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
  ZoomIn,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import {
  renderCreativeCanvas,
  TEMPLATE_CATALOG,
  TemplateId,
} from '@/lib/render-creative'

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
  const [activeTab, setActiveTab] = useState<'texto' | 'foto' | 'design'>('texto')

  // Textos
  const [headlinePt, setHeadlinePt] = useState(initialData.headlinePt || '')
  const [headlineEn, setHeadlineEn] = useState(initialData.headlineEn || '')
  
  // Destaque Secundário / Preço / Texto Extra (sem prefixo forçado de $)
  const [price, setPrice] = useState(initialData.price || '')
  const [showPrice, setShowPrice] = useState<boolean>(initialData.showPrice !== false)
  
  // Enquadramento e Posição da Foto
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
    }, 80) // Debounce ultra rápido para sliders e botões

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

  // Helpers para mover a imagem
  const movePhoto = (dx: number, dy: number) => {
    setPhotoOffsetX((prev) => Math.max(-45, Math.min(45, prev + dx)))
    setPhotoOffsetY((prev) => Math.max(-45, Math.min(45, prev + dy)))
  }

  const resetPhoto = () => {
    setPhotoOffsetX(0)
    setPhotoOffsetY(0)
    setPhotoScale(1.0)
  }

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
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✏️
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Editor Completo da Arte
              </h2>
              <p className="text-[11px] text-zinc-400">
                Edite textos, enquadramento da foto, preço e botões com prévia ao vivo.
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
          {/* Coluna Esquerda: Preview ao Vivo */}
          <div className="flex flex-col items-center justify-center bg-black/60 rounded-2xl p-3 border border-white/10 relative min-h-[340px]">
            {/* Controles de Formato e Idioma */}
            <div className="w-full flex items-center justify-between mb-3 gap-2">
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

            {/* Imagem de Prévia Renderizada */}
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-zinc-900 shadow-2xl">
              {livePreviewUrl ? (
                <img
                  src={livePreviewUrl}
                  alt="Prévia em tempo real"
                  className="w-full h-full object-contain select-none"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-xs">Renderizando arte...</span>
                </div>
              )}

              {isRendering && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-300 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Atualizando...
                  </span>
                </div>
              )}
            </div>

            {/* Atalho rápido para centralizar a foto se houver offset */}
            {(photoOffsetX !== 0 || photoOffsetY !== 0 || photoScale !== 1.0) && (
              <button
                type="button"
                onClick={resetPhoto}
                className="mt-2 text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Enquadramento Original</span>
              </button>
            )}
          </div>

          {/* Coluna Direita: Abas e Controles */}
          <div className="flex flex-col gap-3 text-xs">
            {/* Abas de Navegação */}
            <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('texto')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'texto'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Textos & Valor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('foto')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'foto'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>Mover / Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'design'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Modelos & Cores</span>
              </button>
            </div>

            {/* ABA 1: TEXTOS & VALOR */}
            {activeTab === 'texto' && (
              <div className="flex flex-col gap-3">
                {/* 1. Headline Principal */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1">
                    <Type className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Texto Principal (Headline da Imagem):</span>
                  </label>
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

                {/* 2. Campo de Destaque Secundário / Preço (SEM FORÇAR $) */}
                <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Destaque Secundário / Preço na Imagem:</span>
                    </label>

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

                  {showPrice && (
                    <div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ex: $120, A partir de R$100, Palestra Exclusiva, etc."
                        className="w-full bg-zinc-950 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400 font-extrabold focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">
                        💡 Dica: Aparece exatamente como você digitar (com ou sem cifrão).
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Texto do Botão de Rodapé */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Texto do Botão de Rodapé (Contato / CTA):</span>
                  </label>
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

                {/* 4. Nome da Marca / Profissional no Topo */}
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

            {/* ABA 2: MOVER / ENQUADRAMENTO DA FOTO */}
            {activeTab === 'foto' && (
              <div className="flex flex-col gap-3.5 bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <Move className="w-4 h-4 text-emerald-400" />
                    <span>Ajustar Posição e Enquadramento da Foto:</span>
                  </span>

                  <button
                    type="button"
                    onClick={resetPhoto}
                    className="text-[10px] text-zinc-400 hover:text-white bg-zinc-800 px-2 py-1 rounded-md"
                  >
                    Resetar
                  </button>
                </div>

                {/* Joystick de Movimentação Rápida */}
                <div className="flex flex-col items-center justify-center gap-1 my-1">
                  <button
                    type="button"
                    onClick={() => movePhoto(0, -6)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 shadow touch-target"
                    title="Mover foto para cima"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => movePhoto(-6, 0)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 shadow touch-target"
                      title="Mover foto para esquerda"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={resetPhoto}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]"
                    >
                      Centro
                    </button>

                    <button
                      type="button"
                      onClick={() => movePhoto(6, 0)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 shadow touch-target"
                      title="Mover foto para direita"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => movePhoto(0, 6)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 active:scale-95 shadow touch-target"
                    title="Mover foto para baixo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Sliders de Precisão */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">↔️ Posição Horizontal (X):</span>
                      <span className="font-bold text-emerald-400">{photoOffsetX}%</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={photoOffsetX}
                      onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">↕️ Posição Vertical (Y):</span>
                      <span className="font-bold text-emerald-400">{photoOffsetY}%</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={photoOffsetY}
                      onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">🔍 Zoom da Foto (Escala):</span>
                      <span className="font-bold text-amber-400">{photoScale.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.2"
                      step="0.05"
                      value={photoScale}
                      onChange={(e) => setPhotoScale(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: MODELOS & CORES */}
            {activeTab === 'design' && (
              <div className="flex flex-col gap-3">
                {/* 1. Escolha do Modelo Visual */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                    <Layout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Escolha outro Modelo Visual:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TEMPLATE_CATALOG.map((tpl) => {
                      const isCur = templateId === tpl.id
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setTemplateId(tpl.id)}
                          className={`p-2 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                            isCur
                              ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                              : 'bg-zinc-900/90 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className={`text-[11px] font-extrabold truncate ${
                            isCur ? 'text-emerald-300' : 'text-zinc-200'
                          }`}>
                            {tpl.name}
                          </span>
                          <span className="text-[9px] text-zinc-400 line-clamp-1 leading-tight">
                            {tpl.descriptionPt}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Cores da Marca */}
                <div>
                  <label className="font-bold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cor Principal de Destaque:</span>
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {BRAND_PALETTES.map((pal) => (
                      <button
                        key={pal.color}
                        type="button"
                        onClick={() => setBrandColor(pal.color)}
                        style={{ backgroundColor: pal.color }}
                        title={pal.name}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          brandColor === pal.color
                            ? 'border-white scale-125 shadow-lg'
                            : 'border-transparent hover:scale-110'
                        }`}
                      />
                    ))}

                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0 p-0"
                      title="Cor personalizada"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé do Modal com Botões */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-zinc-900/90 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors touch-target"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            disabled={isRendering}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg flex items-center gap-2 touch-target active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Salvar e Aplicar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  )
}
