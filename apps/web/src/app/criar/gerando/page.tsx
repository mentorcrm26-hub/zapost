'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'
import { renderCreativeCanvas, generateDynamicCopy } from '@/lib/render-creative'

export default function FazendoPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(20)
  const isGeneratingRef = React.useRef(false)

  useEffect(() => {
    if (isGeneratingRef.current) return
    isGeneratingRef.current = true

    async function generateRealCreatives() {
      try {
        const photoUrl = state.photoUrl || '/sample-sala.jpg'
        const rawInput = state.rawInput || 'Limpeza completa residencial em Framingham por $120'
        const price = state.price || '120'
        const objective = state.objective || 'promocao'

        // 1. Gera as cópias personalizadas com base no texto e preço reais
        const dynamicCopies = generateDynamicCopy(rawInput, price, objective, state.language)

        setStep(1)
        setProgress(40)

        // 2. Renderiza em tempo real os 3 templates com a foto real do usuário
        const generated = await Promise.all(
          dynamicCopies.map(async (copy) => {
            const templateId = copy.id as 'bold-price' | 'photo-overlay' | 'clean-split'

            // Feed PT
            const previewUrl = await renderCreativeCanvas({
              template: templateId,
              format: 'feed',
              language: 'pt',
              photoUrl: photoUrl,
              headline: copy.headlinePt,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: true,
            })

            // Feed EN
            const previewUrlEn = await renderCreativeCanvas({
              template: templateId,
              format: 'feed',
              language: 'en',
              photoUrl: photoUrl,
              headline: copy.headlineEn,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: true,
            })

            // Final High-Res Feed PT (sem marca d'água)
            const finalUrl = await renderCreativeCanvas({
              template: templateId,
              format: 'feed',
              language: 'pt',
              photoUrl: photoUrl,
              headline: copy.headlinePt,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: false,
            })

            // Final High-Res Feed EN
            const finalUrlEn = await renderCreativeCanvas({
              template: templateId,
              format: 'feed',
              language: 'en',
              photoUrl: photoUrl,
              headline: copy.headlineEn,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: false,
            })

            // Final High-Res Story PT (9:16)
            const finalStoryUrl = await renderCreativeCanvas({
              template: templateId,
              format: 'story',
              language: 'pt',
              photoUrl: photoUrl,
              headline: copy.headlinePt,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: false,
            })

            // Final High-Res Story EN (9:16)
            const finalStoryUrlEn = await renderCreativeCanvas({
              template: templateId,
              format: 'story',
              language: 'en',
              photoUrl: photoUrl,
              headline: copy.headlineEn,
              price: price,
              businessName: state.businessName || 'Bella Clean',
              phone: state.phone || '(508) 555-0142',
              brandColor: state.brandColor || '#10b981',
              withWatermark: false,
            })

            return {
              id: copy.id,
              name: copy.name,
              badge: copy.badge,
              previewUrl: previewUrl || copy.id,
              previewUrlEn: previewUrlEn || copy.id,
              finalUrl: finalUrl || previewUrl,
              finalUrlEn: finalUrlEn || previewUrlEn,
              finalStoryUrl: finalStoryUrl || previewUrl,
              finalStoryUrlEn: finalStoryUrlEn || previewUrlEn,
              headlinePt: copy.headlinePt,
              headlineEn: copy.headlineEn,
              captionPt: copy.captionPt,
              captionEn: copy.captionEn,
              tagsPt: copy.tagsPt,
              tagsEn: copy.tagsEn,
            }
          })
        )

        setStep(2)
        setProgress(75)
        updateState({ generatedOptions: generated })

        setTimeout(() => {
          setStep(3)
          setProgress(100)
          setTimeout(() => {
            router.push('/criar/escolha')
          }, 600)
        }, 800)
      } catch (err) {
        console.error('Erro na geração dinâmica:', err)
        router.push('/criar/escolha')
      }
    }

    generateRealCreatives()
  }, [])

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
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-zinc-700 shrink-0" />
          )}
          <span className={`text-xs ${step >= 3 ? 'font-bold text-zinc-100' : 'text-zinc-500'}`}>
            3. Renderizando suas 3 artes com a sua foto e dados...
          </span>
        </div>
      </div>

      <div className="text-xs text-zinc-500">
        ⚡ Aplicando branding, contraste e adaptação bilíngue...
      </div>
    </div>
  )
}
