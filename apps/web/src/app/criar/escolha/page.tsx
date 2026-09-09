'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, ZoomIn } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function EscolhaPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()
  const [selectedId, setSelectedId] = useState<string>(state.selectedTemplate || 'bold-price')
  const [modalImage, setModalImage] = useState<string | null>(null)

  const handleApprove = () => {
    updateState({
      selectedTemplate: selectedId,
      credits: Math.max(0, state.credits - 1),
    })
    router.push('/criar/prontinho')
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Título */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
          3 Opções Prontas
        </span>
        <h1 className="text-xl font-bold font-display text-white leading-tight mt-2">
          Qual opção você mais gostou?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Toque para escolher a que vai ser entregue em todos os formatos e idiomas.
        </p>
      </div>

      {/* Lista das 3 Opções Tocáveis */}
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
              {/* Header do Card com Badge */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {opt.badge}
                </span>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-emerald-500 text-white' : 'border border-white/20'
                }`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
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
    </div>
  )
}
