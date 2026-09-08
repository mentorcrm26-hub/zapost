'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { trackBeginCheckout } from '@/lib/tracking'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState<boolean>(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 19,
      priceAnnual: 190,
      credits: 60,
      features: [
        '60 criativos por mês',
        '1 idioma (Português ou Inglês)',
        'Marca d’água discreta',
        'Suporte via WhatsApp',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 49,
      priceAnnual: 490,
      credits: 250,
      features: [
        '250 criativos por mês',
        'Bilíngue: Português 🇧🇷 e Inglês 🇺🇸',
        'Carrosséis até 8 slides',
        'Sem nenhuma marca d’água',
        'Melhoria de fotos com IA',
      ],
      popular: true,
      tag: '🔥 Mais Escolhido',
    },
    {
      id: 'agency',
      name: 'Agency',
      priceMonthly: 129,
      priceAnnual: 1290,
      credits: 1000,
      features: [
        '1.000 criativos por mês',
        'Até 5 marcas / negócios diferentes',
        'Multi-usuários & operadores',
        'Atendimento prioritário VIP',
      ],
      popular: false,
    },
  ]

  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/40">
          Planos Claros em USD
        </span>
        <h2 className="text-xl font-bold text-white">
          Escolha o Plano Ideal para seu Negócio
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Cancele quando quiser com 1 clique. Sem multas e sem pegadinhas.
        </p>

        {/* Toggle Mensal / Anual */}
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-2">
          <div className="bg-zinc-950 p-1 rounded-2xl border border-white/10 flex w-full">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isAnnual ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isAnnual ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] bg-amber-400 text-zinc-950 font-extrabold px-1.5 py-0.5 rounded-full">
                2 Meses Grátis
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Planos em Stack Vertical para Viewport Mobile */}
      <div className="flex flex-col gap-4">
        {plans.map((p) => {
          const price = isAnnual ? p.priceAnnual : p.priceMonthly
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-5 flex flex-col justify-between border transition-all ${
                p.popular
                  ? 'bg-gradient-to-b from-emerald-950/60 via-zinc-950 to-zinc-950 border-emerald-400 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10'
                  : 'bg-zinc-950 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                {/* Header do Card com Nome e Badge alinhados */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    {p.name}
                  </h3>
                  {p.tag && (
                    <span className="text-[11px] font-mono bg-emerald-500 text-zinc-950 font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Preço e Raios */}
                <div className="flex items-baseline justify-between gap-2 my-3 pb-3 border-b border-white/10">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-3xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-zinc-400 font-sans">/{isAnnual ? 'ano' : 'mês'}</span>
                  </div>

                  <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ⚡ {p.credits} criativos
                  </span>
                </div>

                {/* Lista de Recursos */}
                <ul className="space-y-2.5 text-xs text-zinc-300 my-4">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação Full-Width */}
              <Link
                href="/conta"
                onClick={() => trackBeginCheckout(p.id, price * 100)}
                className={`w-full py-4 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md touch-target min-h-[52px] active:scale-[0.98] mt-2 ${
                  p.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                }`}
              >
                <span>Assinar Plano {p.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="text-center pt-2 text-[11px] text-zinc-400 space-y-1">
        <p>🔒 Pagamento processado com segurança bancária pelo Stripe.</p>
        <p>
          Prefere testar antes? <Link href="/criar/objetivo" className="text-emerald-400 underline font-bold">Ganhe 5 criativos grátis sem cartão</Link>.
        </p>
      </div>
    </section>
  )
}
