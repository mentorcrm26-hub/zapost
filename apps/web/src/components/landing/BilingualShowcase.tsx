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
    headlinePt: 'Faxina Completa por apenas $120. Agende no WhatsApp!',
    headlineEn: 'Deep House Cleaning starting at $120. Book on WhatsApp!',
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

export function BilingualShowcase() {
  const [selectedId, setSelectedId] = useState<string>('limpeza')
  const current = EXAMPLES.find((e) => e.id === selectedId) || EXAMPLES[0]!

  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase font-bold text-emerald-400">
              Diferencial Exclusivo
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Prova Social Bilíngue: PT e EN Lado a Lado
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs">
          O único sistema que cria posts nativos para a comunidade brasileira e para clientes americanos.
        </p>
      </div>

      {/* Segment Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedId(ex.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedId === ex.id
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : 'bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20'
            }`}
          >
            {ex.segment}
          </button>
        ))}
      </div>

      {/* Side by Side Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Versão Português */}
        <div className="bg-zinc-950 rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span>🇧🇷</span> Versão em Português
            </span>
            <span className="text-[10px] font-mono text-zinc-500">{current.tags}</span>
          </div>
          <img
            src={current.ptImage}
            alt="Versão Português"
            className="w-full aspect-[4/5] object-contain rounded-xl bg-black max-h-[320px]"
          />
          <p className="text-xs text-zinc-200 font-medium leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            {current.headlinePt}
          </p>
        </div>

        {/* Versão Inglês */}
        <div className="bg-zinc-950 rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <span>🇺🇸</span> Versão em Inglês (American Customers)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              Vocabulário Nativo
            </span>
          </div>
          <img
            src={current.enImage}
            alt="Versão Inglês"
            className="w-full aspect-[4/5] object-contain rounded-xl bg-black max-h-[320px]"
          />
          <p className="text-xs text-zinc-200 font-medium leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            {current.headlineEn}
          </p>
        </div>
      </div>
    </section>
  )
}
