'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Download, Copy, Share2, Sparkles, ArrowRight, Image as ImageIcon, Edit3 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCreatePost } from '@/context/CreatePostContext'
import { CreativeLiveEditor } from '@/components/creative/CreativeLiveEditor'
import { TemplateId } from '@/lib/render-creative'

export default function ProntinhoPage() {
  const { state, updateState } = useCreatePost()
  const [copiedLang, setCopiedLang] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)

  const selectedOpt =
    state.generatedOptions.find((o) => o.id === state.selectedTemplate) ||
    state.generatedOptions[0]!

  useEffect(() => {
    // Efeito comemorativo de confetes
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      })
    } catch {}
  }, [])

  const handleCopyCaption = (lang: 'pt' | 'en') => {
    const text =
      lang === 'pt'
        ? `${selectedOpt.captionPt}\n\n${selectedOpt.tagsPt}`
        : `${selectedOpt.captionEn}\n\n${selectedOpt.tagsEn}`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedLang(lang)
      setTimeout(() => setCopiedLang(null), 3000)
    })
  }

  const handleSaveEdited = (updated: any) => {
    const nextOptions = state.generatedOptions.map((opt) => {
      if (opt.id === updated.id || opt.id === state.selectedTemplate) {
        return {
          ...opt,
          id: updated.templateId || opt.id,
          name: updated.templateId || opt.name,
          headlinePt: updated.headlinePt,
          headlineEn: updated.headlineEn,
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
      selectedTemplate: updated.templateId || state.selectedTemplate,
      price: updated.price || state.price,
      businessName: updated.businessName || state.businessName,
      phone: updated.phone || state.phone,
      brandColor: updated.brandColor || state.brandColor,
    })
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header de Sucesso */}
      <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950 border border-emerald-500/40 rounded-3xl p-5 text-center shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-lg mb-3">
          🎉
        </div>
        <h1 className="text-2xl font-bold font-display text-white">
          Prontinho! Seu post tá pronto
        </h1>
        <p className="text-xs text-emerald-200 mt-1">
          1 crédito debitado • Arquivos em alta resolução liberados sem marca d'água.
        </p>

        {/* Botão de Ajuste Rápido */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-black/40 border border-emerald-500/30 px-3 py-1.5 rounded-full hover:bg-black/60 transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Fazer ajustes rápidos na arte</span>
          </button>
        </div>
      </div>

      {/* Seção 1: Arquivos para Download */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-zinc-200 flex items-center justify-between">
          <span>📦 Seus Criativos em Alta Definição</span>
          <span className="text-[11px] font-normal text-emerald-400">Prontos para postar</span>
        </h2>

        {/* Card Feed */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={selectedOpt.finalUrl || `/out/${selectedOpt.id}_feed_45_pt.png`}
              alt="Feed"
              className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black"
            />
            <div>
              <p className="font-bold text-sm text-zinc-100">Post Quadrado (Feed)</p>
              <p className="text-xs text-zinc-400">1080x1080 • Instagram & WhatsApp</p>
            </div>
          </div>
          <a
            href={selectedOpt.finalUrl || `/out/${selectedOpt.id}_feed_45_pt.png`}
            download={`criativo-${selectedOpt.id}-feed.png`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 touch-target min-h-[44px] shadow-sm active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </a>
        </div>

        {/* Card Story */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={selectedOpt.finalStoryUrl || selectedOpt.finalUrl || `/out/${selectedOpt.id}_story_916_pt.png`}
              alt="Story"
              className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black"
            />
            <div>
              <p className="font-bold text-sm text-zinc-100">Post Vertical (Stories/Status)</p>
              <p className="text-xs text-zinc-400">1080x1920 • Stories, Reels & Status</p>
            </div>
          </div>
          <a
            href={selectedOpt.finalStoryUrl || selectedOpt.finalUrl || `/out/${selectedOpt.id}_story_916_pt.png`}
            download={`criativo-${selectedOpt.id}-story.png`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 touch-target min-h-[44px] shadow-sm active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </a>
        </div>

        {/* Card Versão em Inglês */}
        {selectedOpt.finalUrlEn && (
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <img
                src={selectedOpt.finalUrlEn}
                alt="Feed EN"
                className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black"
              />
              <div>
                <p className="font-bold text-sm text-zinc-100">🇺🇸 Versão em Inglês (Feed)</p>
                <p className="text-xs text-zinc-400">1080x1080 • Para clientes americanos</p>
              </div>
            </div>
            <a
              href={selectedOpt.finalUrlEn}
              download={`creative-${selectedOpt.id}-en.png`}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 touch-target min-h-[44px] shadow-sm active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4" />
              <span>Baixar EN</span>
            </a>
          </div>
        )}
      </div>

      {/* Seção 2: Legendas Prontas para Copiar */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <span>✨ Legendas Prontas para Postar</span>
        </h2>

        {/* Legenda em Português */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">🇧🇷 Versão em Português</span>
            <button
              onClick={() => handleCopyCaption('pt')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 touch-target min-h-[36px]"
            >
              {copiedLang === 'pt' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-white/5">
            {selectedOpt.captionPt}
          </p>
          <p className="text-[11px] text-sky-400">{selectedOpt.tagsPt}</p>
        </div>

        {/* Legenda em Inglês */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">🇺🇸 Versão em Inglês (Local)</span>
            <button
              onClick={() => handleCopyCaption('en')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 touch-target min-h-[36px]"
            >
              {copiedLang === 'en' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-white/5">
            {selectedOpt.captionEn}
          </p>
          <p className="text-[11px] text-sky-400">{selectedOpt.tagsEn}</p>
        </div>
      </div>

      {/* Seção 2.5: Melhorar Foto com IA (Crédito Extra) */}
      <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-zinc-100">✨ Iluminação & Nitidez com IA</p>
            <p className="text-xs text-zinc-400">Trata reflexos, sombras e saturação (+1 raio)</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (state.credits < 1) {
              alert('Saldo insuficiente de raios para melhoria de foto.')
              return
            }
            updateState({ credits: state.credits - 1 })
            alert('✨ Foto aprimorada com sucesso! +1 raio debitado.')
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl touch-target min-h-[44px] shrink-0 shadow-sm"
        >
          Melhorar (⚡ 1)
        </button>
      </div>

      {/* Botão Final: Voltar aos Meus Posts */}
      <Link
        href="/"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-2 touch-target min-h-[56px] shadow-lg mt-2"
      >
        <ImageIcon className="w-4 h-4 text-emerald-400" />
        <span>Ver Todos os Meus Posts</span>
      </Link>

      {/* Editor ao Vivo no Prontinho */}
      {isEditorOpen && (
        <CreativeLiveEditor
          isOpen={isEditorOpen}
          initialData={{
            id: selectedOpt.id,
            templateId: (selectedOpt.id || 'bold-price') as TemplateId,
            headlinePt: selectedOpt.headlinePt,
            headlineEn: selectedOpt.headlineEn,
            price: state.price || '$120',
            photoUrl: state.photoUrl || '/sample-sala.jpg',
            businessName: state.businessName || 'Bella Clean',
            phone: state.phone || '(508) 555-0142',
            brandColor: state.brandColor || '#10b981',
            language: state.language || 'pt',
          }}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveEdited}
        />
      )}
    </div>
  )
}
