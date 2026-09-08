'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CheckCircle } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function RedesPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()

  const [price, setPrice] = useState(state.price || '120')
  const [deadline, setDeadline] = useState(state.deadline || 'esta_semana')
  const [networks, setNetworks] = useState<string[]>(state.networks || ['instagram', 'whatsapp_status'])

  const toggleNetwork = (net: string) => {
    if (networks.includes(net)) {
      if (networks.length > 1) {
        setNetworks(networks.filter((n) => n !== net))
      }
    } else {
      setNetworks([...networks, net])
    }
  }

  const handleContinue = () => {
    updateState({
      price,
      deadline,
      networks,
    })
    router.push('/criar/confere')
  }

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
          Etapa 4 de 4
        </span>
        <div className="w-8" />
      </div>

      {/* Título */}
      <div>
        <h1 className="text-xl font-bold font-display text-white leading-tight">
          Onde você quer postar?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          O sistema formata a arte e as legendas perfeitamente para cada canal.
        </p>
      </div>

      {/* Seleção de Redes */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Redes Sociais
        </label>
        
        <button
          onClick={() => toggleNetwork('instagram')}
          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between touch-target min-h-[56px] transition-all active:scale-[0.98] ${
            networks.includes('instagram')
              ? 'bg-emerald-950/40 border-emerald-500 text-white'
              : 'bg-zinc-900 border-white/10 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📸</span>
            <div className="text-left">
              <p className="font-bold text-sm text-zinc-100">Instagram (Feed e Stories)</p>
              <p className="text-[11px] text-zinc-400">Post no mural e nos stories</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${networks.includes('instagram') ? 'bg-emerald-500 text-white' : 'border border-white/20'}`}>
            {networks.includes('instagram') && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </button>

        <button
          onClick={() => toggleNetwork('whatsapp_status')}
          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between touch-target min-h-[56px] transition-all active:scale-[0.98] ${
            networks.includes('whatsapp_status')
              ? 'bg-emerald-950/40 border-emerald-500 text-white'
              : 'bg-zinc-900 border-white/10 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <p className="font-bold text-sm text-zinc-100">Status do WhatsApp</p>
              <p className="text-[11px] text-zinc-400">Direto nos seus contatos e clientes</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${networks.includes('whatsapp_status') ? 'bg-emerald-500 text-white' : 'border border-white/20'}`}>
            {networks.includes('whatsapp_status') && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </button>

        <button
          onClick={() => toggleNetwork('facebook')}
          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between touch-target min-h-[56px] transition-all active:scale-[0.98] ${
            networks.includes('facebook')
              ? 'bg-emerald-950/40 border-emerald-500 text-white'
              : 'bg-zinc-900 border-white/10 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div className="text-left">
              <p className="font-bold text-sm text-zinc-100">Facebook</p>
              <p className="text-[11px] text-zinc-400">Página e grupos de comunidade local</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${networks.includes('facebook') ? 'bg-emerald-500 text-white' : 'border border-white/20'}`}>
            {networks.includes('facebook') && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
        </button>
      </div>

      {/* Seção Adaptativa de Preço e Prazo */}
      {state.objective === 'promocao' && (
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 mt-1">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1.5">
              🏷️ Preço da Oferta (USD)
            </label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-white/15 rounded-xl px-3 py-2">
              <span className="text-emerald-400 font-bold text-lg">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120"
                className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-1.5">
              📅 Prazo da Promoção
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'esta_semana', label: 'Esta semana' },
                { id: 'hoje', label: 'Só hoje' },
                { id: 'sem_prazo', label: 'Sem prazo' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeadline(d.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold touch-target min-h-[44px] transition-colors ${
                    deadline === d.id
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-zinc-950 border-white/10 text-zinc-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botão de Avançar */}
      <button
        onClick={handleContinue}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] mt-2"
      >
        <span>Revisar Resumo</span>
        <CheckCircle className="w-5 h-5" />
      </button>
    </div>
  )
}
