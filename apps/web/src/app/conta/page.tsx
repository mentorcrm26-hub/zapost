'use client'

import React from 'react'
import { Zap, ShieldCheck, Gift, MessageCircle, CreditCard, ChevronRight } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function MinhaContaPage() {
  const { state } = useCreatePost()

  const openWhatsApp = () => {
    window.open('https://wa.me/15085550142?text=Olá! Gostaria de recarregar créditos no ZaPost.', '_blank')
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          👤 Minha Conta
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Gerencie seu plano, saldo de créditos e suporte.
        </p>
      </div>

      {/* Card de Créditos e Plano */}
      <div className="bg-gradient-to-br from-[#0F2E2A] to-zinc-950 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/40">
            Plano Starter
          </span>
          <span className="text-xs text-zinc-400">Renova em 25 dias</span>
        </div>

        <div className="flex items-center justify-between my-1">
          <div>
            <p className="text-xs text-zinc-300">Créditos Restantes</p>
            <p className="text-3xl font-extrabold text-white flex items-center gap-1 mt-0.5">
              <Zap className="w-7 h-7 fill-amber-400 text-amber-400" />
              <span>{state.credits}</span>
            </p>
          </div>

          <button
            onClick={() => alert('Recarga de créditos em centavos USD')}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-lg touch-target min-h-[48px] active:scale-95"
          >
            ⚡ Recarregar
          </button>
        </div>

        <p className="text-[11px] text-emerald-200/80 border-t border-white/10 pt-3">
          ✓ Cada post aprovado debita 1 crédito • Sem mensalidades ocultas
        </p>
      </div>

      {/* Indicação / Ganhe Créditos */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-zinc-100">Indique um Amigo</p>
            <p className="text-xs text-zinc-400">Ganhe 5 créditos quando ele criar um post</p>
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText('https://zapost.app?ref=maria123')
            alert('Link de indicação copiado!')
          }}
          className="text-xs font-bold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/40 px-3 py-2 rounded-lg touch-target min-h-[40px]"
        >
          Copiar Link
        </button>
      </div>

      {/* Lista de Opções */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-md">
        <button
          onClick={openWhatsApp}
          className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-zinc-800/50 touch-target min-h-[56px]"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-200">Suporte Humano via WhatsApp</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button
          onClick={() => alert('Histórico de Faturas')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 touch-target min-h-[56px]"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-200">Histórico de Pagamentos</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 text-center mt-2">
        ZaPost v0.1.0 • Feito para brasileiros nos EUA 🇺🇸🇧🇷
      </p>
    </div>
  )
}
