'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'
import { trackBeginCheckout } from '@/lib/tracking'

export function PricingSection() {
  const { state } = useCreatePost()
  const isEn = state.language === 'en'

  const [isAnnual, setIsAnnual] = useState<boolean>(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 19,
      priceAnnual: 190,
      credits: 60,
      features: isEn
        ? [
            '60 creatives per month',
            '1 language (English or Portuguese)',
            'Discreet watermark',
            'Priority online support',
          ]
        : [
            '60 criativos por mês',
            '1 idioma (Português ou Inglês)',
            'Marca d’água discreta',
            'Suporte prioritário online',
          ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 49,
      priceAnnual: 490,
      credits: 250,
      features: isEn
        ? [
            '250 creatives per month',
            'Bilingual: English 🇺🇸 & Portuguese 🇧🇷',
            'Carousels up to 8 slides',
            'Zero watermark',
            'AI photo enhancement',
          ]
        : [
            '250 criativos por mês',
            'Bilíngue: Português 🇧🇷 e Inglês 🇺🇸',
            'Carrosséis até 8 slides',
            'Sem nenhuma marca d’água',
            'Melhoria de fotos com IA',
          ],
      popular: true,
      tag: isEn ? '🔥 Most Popular' : '🔥 Mais Escolhido',
    },
    {
      id: 'agency',
      name: 'Agency',
      priceMonthly: 129,
      priceAnnual: 1290,
      credits: 1000,
      features: isEn
        ? [
            '1,000 creatives per month',
            'Up to 5 different brands/businesses',
            'Multi-user team access',
            'VIP Priority Support',
          ]
        : [
            '1.000 criativos por mês',
            'Até 5 marcas / negócios diferentes',
            'Multi-usuários & operadores',
            'Atendimento prioritário VIP',
          ],
      popular: false,
    },
  ]

  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center space-y-3">
        <span className="text-xs sm:text-sm font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-4 py-1 rounded-full border border-emerald-800/40">
          {isEn ? 'Clear Pricing in USD' : 'Planos Claros em USD'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
          {isEn ? 'Choose the Perfect Plan for Your Business' : 'Escolha o Plano Ideal para seu Negócio'}
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed">
          {isEn
            ? 'Cancel anytime with 1 click. No contracts, no hidden fees.'
            : 'Cancele quando quiser com 1 clique. Sem multas e sem pegadinhas.'}
        </p>

        {/* Toggle Mensal / Anual */}
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-3">
          <div className="bg-zinc-950 p-1.5 rounded-2xl border border-white/10 flex w-full shadow-inner">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                !isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isEn ? 'Monthly' : 'Mensal'}
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{isEn ? 'Annual' : 'Anual'}</span>
              <span className="text-[10px] bg-amber-400 text-zinc-950 font-extrabold px-2 py-0.5 rounded-full">
                {isEn ? '-2 Months Free' : '-2 Meses'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Planos: 3 Colunas no Desktop, Stack no Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((p) => {
          const price = isAnnual ? p.priceAnnual : p.priceMonthly
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition-all h-full ${
                p.popular
                  ? 'bg-gradient-to-b from-emerald-950/70 via-zinc-950 to-zinc-950 border-emerald-400 ring-2 ring-emerald-500/40 shadow-2xl shadow-emerald-500/15 lg:-translate-y-2'
                  : 'bg-zinc-950/90 border-white/10 hover:border-white/25 shadow-lg'
              }`}
            >
              <div>
                {/* Header do Card com Nome e Badge alinhados */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-extrabold text-white text-xl flex items-center gap-2">
                    {p.name}
                  </h3>
                  {p.tag && (
                    <span className="text-xs font-mono bg-emerald-500 text-zinc-950 font-extrabold px-3 py-1 rounded-full shadow-md">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Preço e Raios */}
                <div className="flex items-baseline justify-between gap-2 my-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-zinc-400 font-sans">
                      /{isAnnual ? (isEn ? 'year' : 'ano') : isEn ? 'mo' : 'mês'}
                    </span>
                  </div>

                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5 font-mono bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800/50">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ⚡ {p.credits} {isEn ? 'creatives' : ''}
                  </span>
                </div>

                {/* Lista de Recursos */}
                <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 my-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
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
                className={`w-full py-4 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-xl touch-target min-h-[56px] active:scale-[0.98] mt-4 ${
                  p.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                }`}
              >
                <span>{isEn ? `Subscribe to ${p.name}` : `Assinar Plano ${p.name}`}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="text-center pt-2 text-xs text-zinc-400 space-y-1">
        <p>
          {isEn
            ? '🔒 100% secure USD payment processed by Stripe.'
            : '🔒 Pagamento 100% seguro em USD processado pelo Stripe.'}
        </p>
        <p>
          {isEn ? (
            <>
              Prefer to test first?{' '}
              <Link href="/criar/objetivo" className="text-emerald-400 underline font-bold hover:text-emerald-300">
                Get 5 free creatives, no card needed
              </Link>
              .
            </>
          ) : (
            <>
              Prefere testar antes?{' '}
              <Link href="/criar/objetivo" className="text-emerald-400 underline font-bold hover:text-emerald-300">
                Ganhe 5 criativos grátis sem cartão
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </section>
  )
}
