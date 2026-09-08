'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'

export default function FazendoPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(10)
  const [showFastPreview, setShowFastPreview] = useState(false)

  useEffect(() => {
    // 1. Em 2.5s mostra preview instantâneo do layout base (reduz espera percebida)
    const timerFastPreview = setTimeout(() => {
      setShowFastPreview(true)
      setStep(2)
      setProgress(45)
    }, 2500)

    // 2. Em 5s avança para etapa 3
    const timerStep3 = setTimeout(() => {
      setStep(3)
      setProgress(85)
    }, 5000)

    // 3. Em 7s finaliza e vai para a tela de escolha das 3 opções
    const timerDone = setTimeout(() => {
      setProgress(100)
      router.push('/criar/escolha')
    }, 7000)

    return () => {
      clearTimeout(timerFastPreview)
      clearTimeout(timerStep3)
      clearTimeout(timerDone)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-2 py-4">
      {/* Ícone Animado */}
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-4xl shadow-2xl animate-pulse">
          ⏳
        </div>
        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow">
          IA Rápida
        </div>
      </div>

      {/* Título Principal */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          Tô fazendo, me dá 40 segundos ⏳
        </h1>
        <p className="text-xs text-zinc-400 mt-1.5">
          Criando headlines magnéticas e renderizando suas 3 opções de arte.
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-zinc-900 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Etapas Animadas */}
      <div className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          )}
          <span className={`text-xs ${step >= 1 ? 'font-bold text-zinc-100' : 'text-zinc-500'}`}>
            1. Analisando foto e extraindo argumentos de venda...
          </span>
        </div>

        <div className="flex items-center gap-3">
          {step > 2 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : step === 2 ? (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />
          )}
          <span className={`text-xs ${step >= 2 ? 'font-bold text-zinc-100' : 'text-zinc-500'}`}>
            2. Adaptando copy cultural em Português e Inglês 🇺🇸🇧🇷...
          </span>
        </div>

        <div className="flex items-center gap-3">
          {step >= 3 ? (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />
          )}
          <span className={`text-xs ${step >= 3 ? 'font-bold text-zinc-100' : 'text-zinc-500'}`}>
            3. Renderizando artes com Satori em alta definição...
          </span>
        </div>
      </div>

      {/* Preview Instantâneo em 2 Tempos */}
      {showFastPreview && (
        <div className="w-full bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-3 text-left animate-fadeIn">
          <img
            src="/out/bold-price_feed_45_pt_preview.png"
            alt="Esboço preliminar"
            className="w-14 h-16 object-cover rounded-lg border border-emerald-500/40"
          />
          <div>
            <p className="text-xs font-bold text-emerald-300">Layout base gerado! ✨</p>
            <p className="text-[11px] text-zinc-400">Refinando acabamento e tipografia final...</p>
          </div>
        </div>
      )}
    </div>
  )
}
