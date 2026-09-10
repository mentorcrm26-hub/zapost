'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, ZoomIn, Edit3, SlidersHorizontal } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'
import { CreativeLiveEditor } from '@/components/creative/CreativeLiveEditor'
import { TemplateId } from '@/lib/render-creative'

export default function EscolhaPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()
  const [selectedId, setSelectedId] = useState<string>(state.selectedTemplate || 'bold-price')
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [editingOption, setEditingOption] = useState<any | null>(null)

  const handleApprove = () => {
    updateState({
      selectedTemplate: selectedId,
      credits: Math.max(0, state.credits - 1),
    })
    router.push('/criar/prontinho')
  }

  const handleOpenEditor = (e: React.MouseEvent, opt: any) => {
    e.stopPropagation()
    setEditingOption({
      id: opt.id,
      templateId: (opt.id || 'bold-price') as TemplateId,
      headlinePt: opt.headlinePt,
      headlineEn: opt.headlineEn,
      price: state.price || '$120',
      showPrice: opt.showPrice !== false,
      ctaTextPt: opt.ctaTextPt,
      ctaTextEn: opt.ctaTextEn,
      photoUrl: state.photoUrl || '/sample-sala.jpg',
      businessName: state.businessName || 'Bella Clean',
      phone: state.phone || '(508) 555-0142',
      brandColor: state.brandColor || '#10b981',
      language: state.language || 'pt',
    })
  }

  const handleSaveEditedOption = (updated: any) => {
    const nextOptions = state.generatedOptions.map((opt) => {
      if (opt.id === updated.id) {
        return {
          ...opt,
          id: updated.templateId || opt.id,
          name: updated.templateId || opt.name,
          headlinePt: updated.headlinePt,
          headlineEn: updated.headlineEn,
          showPrice: updated.showPrice,
          ctaTextPt: updated.ctaTextPt,
          ctaTextEn: updated.ctaTextEn,
          previewUrl: updated.previewUrl,
          previewUrlEn: updated.previewUrlEn,
          finalUrl: updated.finalUrl,
          finalUrlEn: updated.finalUrlEn,
          finalStoryUrl: updated.finalStoryUrl,
          finalStoryUrlEn: updated.finalStoryUrlEn,
        }
      }
      return opt
    })

    updateState({
      generatedOptions: nextOptions,
      selectedTemplate: updated.templateId || selectedId,
      price: updated.price || state.price,
      businessName: updated.businessName || state.businessName,
      phone: updated.phone || state.phone,
      brandColor: updated.brandColor || state.brandColor,
    })
    setSelectedId(updated.templateId || selectedId)
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Título */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
          Opções Prontas para Você
        </span>
        <h1 className="text-xl font-bold font-display text-white leading-tight mt-2">
          Qual opção você mais gostou?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Toque para escolher ou clique em <b>"Personalizar"</b> para editar 100% dos textos, valor e botões.
        </p>
      </div>

      {/* Lista das Opções Tocáveis */}
      <div className="flex flex-col gap-4">
        {state.generatedOptions.map((opt) => {
          const isSelected = selectedId === opt.id
          const previewImg = state.language === 'en' ? (opt.previewUrlEn || opt.previewUrl) : opt.previewUrl
          const headlineText = state.language === 'en' ? opt.headlineEn : opt.headlinePt
          const captionText = state.language === 'en' ? opt.captionEn : opt.captionPt

          return (
            <div
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`rounded-3xl border-2 p-3.5 transition-all cursor-pointer relative shadow-lg ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50'
                  : 'bg-zinc-900/90 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header do Card com Badge e Botão Grande de Edição */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {opt.badge || opt.name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditor(e, opt)}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-xl hover:bg-emerald-900 shadow-sm transition-all active:scale-95 touch-target min-h-[36px]"
                    title="Editar textos, preço e rodapé deste criativo"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Personalizar Arte</span>
                  </button>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-emerald-500 text-white' : 'border border-white/20'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Imagem de Prévia com Watermark */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-[380px] flex items-center justify-center">
                <img
                  src={previewImg}
                  alt={opt.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Botão de Zoom */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalImage(previewImg)
                  }}
                  className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 touch-target min-h-[36px] min-w-[36px]"
                  title="Ver imagem ampliada"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Headline Resumida */}
              <div className="mt-2.5 px-1">
                <p className="text-xs font-bold text-zinc-200 truncate">{headlineText}</p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{captionText}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Botão Fixo de Aprovação */}
      <div className="sticky bottom-[76px] z-30 pt-2">
        <button
          onClick={handleApprove}
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base rounded-2xl p-4 shadow-2xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] border border-emerald-300/30"
        >
          <Sparkles className="w-5 h-5" />
          <span>Aprovar e Liberar Arquivos (1 crédito)</span>
        </button>
      </div>

      {/* Modal Zoom */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={modalImage}
            alt="Zoom"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Editor ao Vivo */}
      {editingOption && (
        <CreativeLiveEditor
          isOpen={Boolean(editingOption)}
          initialData={editingOption}
          onClose={() => setEditingOption(null)}
          onSave={handleSaveEditedOption}
        />
      )}
    </div>
  )
}
