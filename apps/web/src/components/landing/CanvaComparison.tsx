'use client'

import React from 'react'
import { X, Check, Clock, Brain, MessageCircle, AlertCircle } from 'lucide-react'

export function CanvaComparison() {
  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono uppercase font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          A Pergunta Que Todo Empreendedor Faz
        </span>
        <h2 className="text-lg font-bold text-white mt-2">
          &quot;Por que não usar o Canva de graça?&quot;
        </h2>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          A resposta é simples: o Canva entrega uma <strong>tela em branco</strong>. Depois de 10 horas de trabalho pesado, você não precisa de mais ferramentas — precisa de trabalho pronto.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lado Canva */}
        <div className="bg-zinc-950 border border-rose-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <X className="w-4 h-4 stroke-[3]" />
            <span>Usando o Canva</span>
          </div>

          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Você precisa ter ideias do zero depois de um dia exaustivo.</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Gasta 40 minutos alinhando fontes, cores e fotos no celular.</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Precisa traduzir no Google Tradutor e corre o risco de passar vergonha com termos errados.</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Acaba desistindo de postar e perde clientes para concorrentes.</span>
            </li>
          </ul>
        </div>

        {/* Lado ZaPost */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Com o ZaPost no WhatsApp</span>
          </div>

          <ul className="space-y-2.5 text-xs text-zinc-200">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Você só manda uma foto e fala um áudio rápido no Zap.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Em <strong>menos de 1 minuto</strong>, recebe 3 artes diagramadas em alta resolução.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Textos e legendas em inglês natural americano e português.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sua presença digital ativa toda semana sem roubar seu tempo de descanso.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
