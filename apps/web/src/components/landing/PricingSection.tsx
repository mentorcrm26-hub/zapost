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
        '1 idioma (PT ou EN)',
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
      tag: '🔥 O Mais Escolhido',
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
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Cancele quando quiser com 1 clique. Sem multas e sem pegadinhas.
        </p>

        {/* Toggle Mensal / Anual */}
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-2">
          <div className="bg-zinc-950 p-1 rounded-2xl border border-white/10 flex w-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isAnnual ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
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

      {/* Cards de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const price = isAnnual ? p.priceAnnual : p.priceMonthly
          return (
            <div
              key={p.id}
              className={`rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                p.popular
                  ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-500/30 shadow-xl'
                  : 'bg-zinc-950 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                  {p.tag && (
                    <span className="text-[10px] font-mono bg-emerald-500 text-zinc-950 font-extrabold px-2 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-3 font-mono">
                  <span className="text-3xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-zinc-400">/{isAnnual ? 'ano' : 'mês'}</span>
                </div>

                <p className="text-xs text-emerald-300 font-semibold mb-4 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>⚡ {p.credits} criativos no ciclo</span>
                </p>

                <ul className="space-y-2 text-xs text-zinc-300 border-t border-white/10 pt-4 mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/conta"
                onClick={() => trackBeginCheckout(p.id, price * 100)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
                  p.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                <span>Assinar {p.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
