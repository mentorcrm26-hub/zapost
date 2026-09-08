'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function ObjetivoPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()

  const handleSelect = (obj: 'divulgar' | 'promocao' | 'trabalho_feito') => {
    updateState({ objective: obj })
    router.push('/criar/foto')
  }

  const options = [
    {
      id: 'divulgar',
      emoji: '📢',
      title: 'Divulgar meu serviço',
      desc: 'Apresentar o trabalho e atrair novos clientes na região',
    },
    {
      id: 'promocao',
      emoji: '🏷️',
      title: 'Fazer uma promoção',
      desc: 'Oferta especial com preço destacado e senso de urgência',
      highlight: true,
    },
    {
      id: 'trabalho_feito',
      emoji: '✨',
      title: 'Mostrar trabalho feito',
      desc: 'Antes e depois, resultado recente ou depoimento de cliente',
    },
    {
      id: 'promocao',
      emoji: '🎲',
      title: 'Tanto faz, escolhe por mim',
      desc: 'A IA escolhe o melhor ângulo baseado na sua foto e áudio',
    },
  ]

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Barra de Progresso & Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white p-2 -ml-2 touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
          Etapa 1 de 4
        </span>
        <div className="w-8" />
      </div>

      {/* Título Principal */}
      <div>
        <h1 className="text-xl font-bold font-display text-white leading-tight">
          Qual é o objetivo do post de hoje?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Toque na opção que melhor descreve o que você quer divulgar.
        </p>
      </div>

      {/* Lista de Opções com Twemoji */}
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(opt.id as any)}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 touch-target min-h-[72px] active:scale-[0.98] ${
              opt.highlight
                ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/60 shadow-lg'
                : 'bg-zinc-900/80 border-white/10 hover:border-white/20 hover:bg-zinc-800/80'
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-black/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {opt.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base text-zinc-100 leading-snug">{opt.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
