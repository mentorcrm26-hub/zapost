'use client'

import React, { useState } from 'react'
import {
  Zap,
  Gift,
  MessageCircle,
  CreditCard,
  ChevronRight,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowUpRight,
  Copy,
  CheckCheck,
  AlertCircle
} from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'
import { trackBeginCheckout } from '@/lib/tracking'

interface Plan {
  id: 'starter' | 'pro' | 'agency'
  name: string
  priceMonthly: number
  priceAnnual: number
  credits: number
  bilingual: boolean
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 19,
    priceAnnual: 190,
    credits: 60,
    bilingual: false,
    features: ['60 criativos / mês', '1 idioma (PT ou EN)', 'Marca d’água discreta', 'Suporte WhatsApp'],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    priceAnnual: 490,
    credits: 250,
    bilingual: true,
    features: ['250 criativos / mês', 'Bilíngue: PT e EN juntos', 'Carrosséis até 8 slides', 'Sem marca d’água', 'Melhoria de fotos com IA'],
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    priceMonthly: 129,
    priceAnnual: 1290,
    credits: 1000,
    bilingual: true,
    features: ['1.000 criativos / mês', 'Até 5 marcas diferentes', 'Multi-usuários / operadores', 'Atendimento prioritário VIP'],
  },
]

const TOPUPS = [
  { id: 'topup_30', name: 'Recarga 30 Raios', credits: 30, price: 12 },
  { id: 'topup_100', name: 'Recarga 100 Raios', credits: 100, price: 29 },
]

const MOCK_LEDGER = [
  { id: 'tx-001', delta: +5, reason: 'Trial Grátis de Boas-Vindas (Sem Cartão)', date: '01/09 10:00' },
  { id: 'tx-002', delta: -1, reason: 'Aprovação: Post Faxina Profissional', date: '02/09 14:32' },
  { id: 'tx-003', delta: -1, reason: 'Melhoria de Foto com IA', date: '02/09 14:35' },
  { id: 'tx-004', delta: +60, reason: 'Assinatura Plano Starter ($19.00 USD)', date: '05/09 18:00' },
  { id: 'tx-005', delta: -1, reason: 'Aprovação: Carrossel Promoção de Sábado', date: '06/09 11:20' },
]

export default function MinhaContaPage() {
  const { state, updateState } = useCreatePost()
  const [isAnnual, setIsAnnual] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'agency'>('pro')
  const [notification, setNotification] = useState<string | null>(null)

  const referralLink = 'https://zapost.com/ref/daian360'

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleCheckout = (planId: string, price: number, credits: number) => {
    trackBeginCheckout(planId, price * 100)
    // Simula recarga instantânea
    updateState({ credits: state.credits + credits })
    setShowPlansModal(false)
    showFeedback(`🎉 Assinatura confirmada! +${credits} raios adicionados ao seu saldo.`)
  }

  const handleTopup = (packName: string, price: number, credits: number) => {
    trackBeginCheckout(packName, price * 100)
    updateState({ credits: state.credits + credits })
    showFeedback(`⚡ Recarga concluída! +${credits} raios creditados no seu saldo.`)
  }

  const handleOpenStripePortal = () => {
    showFeedback('Abrindo Portal do Cliente Stripe para gerenciar cartão e cancelamento em 1 clique...')
  }

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4500)
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          👤 Minha Conta
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Gerencie seu plano, saldo de raios ⚡, recargas e programa de indicação.
        </p>
      </div>

      {notification && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Card Principal de Saldo & Plano */}
      <div className="bg-gradient-to-br from-[#0F2E2A] via-zinc-950 to-zinc-950 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-800/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Plano Pro Ativo
          </span>
          <span className="text-xs text-zinc-400 font-mono">Renova em 24 dias</span>
        </div>

        <div className="flex items-center justify-between my-1">
          <div>
            <p className="text-xs text-zinc-300">Saldo Disponível</p>
            <p className="text-3xl font-extrabold text-white flex items-center gap-1.5 mt-0.5 font-mono">
              <Zap className="w-7 h-7 fill-amber-400 text-amber-400" />
              <span>⚡ {state.credits}</span>
            </p>
          </div>

          <button
            onClick={() => setShowPlansModal(true)}
            className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg touch-target min-h-[48px] active:scale-95 transition-all"
          >
            Mudar Plano
          </button>
        </div>

        <p className="text-[11px] text-emerald-200/90 border-t border-white/10 pt-3 flex items-center justify-between">
          <span>✓ Débito somente na aprovação</span>
          <span className="font-mono text-zinc-400">$49.00 USD / mês</span>
        </p>
      </div>

      {/* Recarga Avulsa (Para quem estourou a cota no meio do mês) */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              Estourou a cota? Pacotes Avulsos
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Créditos extras que nunca expiram.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {TOPUPS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => handleTopup(pack.name, pack.price, pack.credits)}
              className="bg-zinc-950 border border-white/10 hover:border-amber-400/50 p-3 rounded-xl flex flex-col items-center justify-center text-center group transition-all"
            >
              <span className="text-base font-bold text-amber-400 font-mono">⚡ {pack.credits}</span>
              <span className="text-xs font-semibold text-white mt-0.5">${pack.price} USD</span>
              <span className="text-[10px] text-zinc-500 mt-1">Comprar Agora</span>
            </button>
          ))}
        </div>
      </div>

      {/* Programa de Indicação */}
      <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Indique e Ganhe 1 Mês Grátis</h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Envie seu link para outros brasileiros donos de negócios nos EUA. Quando eles assinarem, você ganha <strong>1 mês grátis</strong> e eles ganham <strong>20% de desconto</strong> no 1º mês!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopyReferral}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Gestão de Assinatura & Cancelamento Transparente */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={handleOpenStripePortal}
          className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-zinc-800/50 touch-target min-h-[56px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <span className="text-sm font-semibold text-zinc-200 block">Gerenciar Cartão e Faturas</span>
              <span className="text-[11px] text-zinc-400">Portal seguro do Stripe</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={handleOpenStripePortal}
          className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-zinc-800/50 touch-target min-h-[56px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-zinc-400" />
            <div className="text-left">
              <span className="text-sm font-semibold text-zinc-300 block">Cancelar Assinatura</span>
              <span className="text-[11px] text-zinc-500">Sem labirinto — cancele a qualquer momento com 1 clique</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => window.open('https://wa.me/15085550142?text=Olá! Preciso de ajuda com minha conta ZaPost.', '_blank')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 touch-target min-h-[56px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-200">Falar com Atendente Humano no Zap</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Extrato do Credit Ledger (Append-Only) */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          Extrato Contábil de Raios (Append-Only)
        </h3>

        <div className="space-y-2">
          {MOCK_LEDGER.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl text-xs">
              <div>
                <p className="text-zinc-200 font-medium">{tx.reason}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{tx.date}</p>
              </div>
              <span
                className={`font-mono font-bold text-sm ${
                  tx.delta > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {tx.delta > 0 ? `+${tx.delta}` : tx.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Escolha de Planos */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Escolha seu Plano ZaPost</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Preços em USD. Sem taxas escondidas.</p>
              </div>
              <button
                onClick={() => setShowPlansModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Toggle Anual / Mensal */}
            <div className="flex items-center justify-center gap-3 bg-zinc-950 p-1.5 rounded-2xl border border-white/10">
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
                <span className="text-[10px] bg-amber-400 text-zinc-950 font-extrabold px-2 py-0.5 rounded-full">
                  2 Meses Grátis
                </span>
              </button>
            </div>

            {/* Cards de Planos */}
            <div className="space-y-4">
              {PLANS.map((plan) => {
                const price = isAnnual ? plan.priceAnnual : plan.priceMonthly
                return (
                  <div
                    key={plan.id}
                    className={`border rounded-2xl p-4 transition-all ${
                      plan.popular
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-zinc-950 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          {plan.name}
                          {plan.popular && (
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 font-extrabold">
                              Mais Popular
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-zinc-400">⚡ {plan.credits} criativos / mês</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold text-white font-mono">${price}</span>
                        <span className="text-xs text-zinc-400">/{isAnnual ? 'ano' : 'mês'}</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-zinc-300 my-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleCheckout(plan.id, price, plan.credits)}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow ${
                        plan.popular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      Assinar Plano {plan.name}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
