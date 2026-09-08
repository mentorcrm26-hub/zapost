'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Edit, ShieldCheck } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function ConferePage() {
  const router = useRouter()
  const { state } = useCreatePost()

  const objLabel =
    state.objective === 'promocao'
      ? 'Promoção com preço destacado'
      : state.objective === 'trabalho_feito'
      ? 'Trabalho feito / Portfólio'
      : 'Divulgação de serviços'

  const deadlineLabel =
    state.deadline === 'esta_semana'
      ? 'Esta semana'
      : state.deadline === 'hoje'
      ? 'Só hoje'
      : 'Sem prazo fixo'

  const handleGenerate = () => {
    router.push('/criar/gerando')
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white p-2 -ml-2 touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
          Quase lá!
        </span>
        <div className="w-8" />
      </div>

      {/* Título */}
      <div>
        <h1 className="text-xl font-bold font-display text-white leading-tight">
          📋 Confira o resumo do post
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Dê uma olhada antes de gerar as 3 opções de criativo.
        </p>
      </div>

      {/* Cartão de Confirmação em Linguagem de Gente */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Foto em Destaque */}
        {state.photoUrl && (
          <div className="w-full h-36 rounded-2xl overflow-hidden relative border border-white/10">
            <img
              src={state.photoUrl}
              alt="Foto do post"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1">
              📸 Foto pronta
            </div>
          </div>
        )}

        {/* Detalhes do Briefing */}
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-zinc-400">Objetivo:</span>
            <span className="font-bold text-white text-right">{objLabel}</span>
          </div>

          {state.objective === 'promocao' && (
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-zinc-400">Preço / Oferta:</span>
              <span className="font-bold text-emerald-400">${state.price || '120'}</span>
            </div>
          )}

          {state.objective === 'promocao' && (
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-zinc-400">Prazo:</span>
              <span className="font-bold text-white">{deadlineLabel}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-zinc-400">Empresa:</span>
            <span className="font-bold text-white">Bella Clean (Framingham, MA)</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-zinc-400">Idiomas:</span>
            <span className="font-bold text-emerald-400">Português e Inglês 🇺🇸🇧🇷</span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-zinc-400">O que você falou:</span>
            <span className="text-xs text-zinc-300 italic max-w-[180px] truncate text-right">
              "{state.rawInput || 'Limpeza de casa em Framingham'}"
            </span>
          </div>
        </div>

        {/* Aviso de Crédito Seguro */}
        <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <b>Custo zero agora:</b> Você vê as 3 opções de arte e o crédito só é debitado quando você aprovar.
          </span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98]"
        >
          <Sparkles className="w-5 h-5" />
          <span>⚡ Sim, pode gerar as 3 opções!</span>
        </button>

        <button
          onClick={() => router.push('/criar/objetivo')}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm rounded-2xl p-3.5 border border-white/10 flex items-center justify-center gap-1.5 touch-target min-h-[50px]"
        >
          <Edit className="w-4 h-4" />
          <span>Quero mudar algo</span>
        </button>
      </div>
    </div>
  )
}
