'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Download, Copy, Share2, Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCreatePost } from '@/context/CreatePostContext'

export default function ProntinhoPage() {
  const { state } = useCreatePost()
  const [copiedLang, setCopiedLang] = useState<string | null>(null)

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

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header de Sucesso */}
      <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950 border border-emerald-500/40 rounded-3xl p-5 text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-lg mb-3">
          🎉
        </div>
        <h1 className="text-2xl font-bold font-display text-white">
          Prontinho! Seu post tá pronto
        </h1>
        <p className="text-xs text-emerald-200 mt-1">
          1 crédito debitado • Arquivos em alta resolução liberados sem marca d'água.
        </p>
      </div>

      {/* Seção 1: Arquivos para Download */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <span>📦 Arquivos de Imagem em Alta Resolução</span>
        </h2>

        {/* Card Feed */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={`/out/${selectedOpt.id}_feed_45_pt.png`}
              alt="Feed"
              className="w-14 h-16 object-cover rounded-xl border border-white/10 bg-black"
            />
            <div>
              <p className="font-bold text-sm text-zinc-100">Instagram & WhatsApp (Feed)</p>
              <p className="text-xs text-zinc-400">Português 🇧🇷 e Inglês 🇺🇸</p>
            </div>
          </div>
          <a
            href={`/out/${selectedOpt.id}_feed_45_pt.png`}
            download={`${selectedOpt.id}_feed_45_pt.png`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 touch-target min-h-[44px] shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </a>
        </div>

        {/* Card Story */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <img
              src={`/out/${selectedOpt.id}_story_916_pt.png`}
              alt="Story"
              className="w-14 h-16 object-cover rounded-xl border border-white/10 bg-black"
            />
            <div>
              <p className="font-bold text-sm text-zinc-100">Stories & Status</p>
              <p className="text-xs text-zinc-400">Português 🇧🇷 e Inglês 🇺🇸</p>
            </div>
          </div>
          <a
            href={`/out/${selectedOpt.id}_story_916_pt.png`}
            download={`${selectedOpt.id}_story_916_pt.png`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 touch-target min-h-[44px] shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Baixar</span>
          </a>
        </div>
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

      {/* Botão Final: Voltar aos Meus Posts */}
      <Link
        href="/"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-2 touch-target min-h-[56px] shadow-lg mt-2"
      >
        <ImageIcon className="w-4 h-4 text-emerald-400" />
        <span>Ver Todos os Meus Posts</span>
      </Link>
    </div>
  )
}
