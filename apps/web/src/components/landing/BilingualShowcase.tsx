'use client'

import React, { useState } from 'react'
import { Globe, Sparkles, Check, ArrowRight } from 'lucide-react'

interface ExamplePair {
  id: string
  segment: string
  title: string
  ptImage: string
  enImage: string
  headlinePt: string
  headlineEn: string
  tags: string
}

const EXAMPLES: ExamplePair[] = [
  {
    id: 'limpeza',
    segment: 'House Cleaning',
    title: 'Limpeza Residencial & Comercial',
    ptImage: '/out/bold-price_feed_45_pt.png',
    enImage: '/out/bold-price_feed_45_en.png',
    headlinePt: 'Faxina Completa por apenas $120. Agende seu horário!',
    headlineEn: 'Deep House Cleaning starting at $120. Book your spot today!',
    tags: 'Boston, MA • Orlando, FL',
  },
  {
    id: 'beleza',
    segment: 'Estética & Barbearia',
    title: 'Clínica de Estética & Beleza',
    ptImage: '/out/photo-overlay_feed_45_pt.png',
    enImage: '/out/photo-overlay_feed_45_en.png',
    headlinePt: 'Realce sua beleza com nosso protocolo exclusivo.',
    headlineEn: 'Enhance your natural glow with our signature care.',
    tags: 'Framingham, MA • Newark, NJ',
  },
  {
    id: 'construcao',
    segment: 'Construção & Drywall',
    title: 'Reforma, Pintura & Framing',
    ptImage: '/out/clean-split_feed_45_pt.png',
    enImage: '/out/clean-split_feed_45_en.png',
    headlinePt: 'Orçamento sem compromisso para sua obra ou reforma.',
    headlineEn: 'Free estimate for your remodeling or framing project.',
    tags: 'Danbury, CT • Marietta, GA',
  },
]

import { useCreatePost } from '@/context/CreatePostContext'

export function BilingualShowcase() {
  const { state } = useCreatePost()
  const isEn = state.language === 'en'

  const [selectedId, setSelectedId] = useState<string>('limpeza')
  const current = EXAMPLES.find((e) => e.id === selectedId) || EXAMPLES[0]!

  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-mono uppercase font-bold text-emerald-400">
              {isEn ? 'Exclusive Feature' : 'Diferencial Exclusivo'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            {isEn ? 'Bilingual Social Proof: PT and EN Side by Side' : 'Prova Social Bilíngue: PT e EN Lado a Lado'}
          </h2>
        </div>
        <p className="text-sm text-zinc-300 max-w-sm leading-relaxed">
          {isEn
            ? 'The only platform creating native posts for both the Brazilian community and American clients.'
            : 'O único sistema que cria posts nativos para a comunidade brasileira e para clientes americanos.'}
        </p>
      </div>

      {/* Segment Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedId(ex.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
              selectedId === ex.id
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/40'
                : 'bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/25 hover:text-white'
            }`}
          >
            {ex.segment}
          </button>
        ))}
      </div>

      {/* Side by Side Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Versão Português */}
        <div className="bg-zinc-950/90 rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-lg group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span className="text-lg">🇧🇷</span> Versão em Português
            </span>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
              {current.tags}
            </span>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10">
            <img
              src={current.ptImage}
              alt="Versão Português"
              className="w-full aspect-[4/5] object-contain bg-black max-h-[420px] group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5">
            {current.headlinePt}
          </p>
        </div>

        {/* Versão Inglês */}
        <div className="bg-zinc-950/90 rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-lg group hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <span className="text-lg">🇺🇸</span> Versão em Inglês (American Customers)
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/40">
              Vocabulário Nativo
            </span>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10">
            <img
              src={current.enImage}
              alt="Versão Inglês"
              className="w-full aspect-[4/5] object-contain bg-black max-h-[420px] group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5">
            {current.headlineEn}
          </p>
        </div>
      </div>
    </section>
  )
}
