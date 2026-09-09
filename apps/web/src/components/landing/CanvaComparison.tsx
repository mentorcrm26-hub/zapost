'use client'

import React from 'react'
import { X, Check } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function CanvaComparison() {
  const { state } = useCreatePost()
  const isEn = state.language === 'en'

  return (
    <section className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs sm:text-sm font-mono uppercase font-bold text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
          {isEn ? 'The Question Every Business Owner Asks' : 'A Pergunta Que Todo Empreendedor Faz'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-3">
          {isEn ? '"Why not just use Canva for free?"' : '"Por que não usar o Canva de graça?"'}
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed max-w-2xl">
          {isEn ? (
            <>
              The answer is simple: Canva hands you a <strong>blank canvas</strong>. After 10 hours of hard work, you
              don&apos;t need another tool — you need <strong>finished work</strong>.
            </>
          ) : (
            <>
              A resposta é simples: o Canva entrega uma <strong>tela em branco</strong>. Depois de 10 horas de trabalho
              pesado, você não precisa de mais ferramentas — precisa de <strong>trabalho pronto</strong>.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Lado Canva */}
        <div className="bg-zinc-950/90 border border-rose-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 text-rose-400 font-extrabold text-base border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <X className="w-5 h-5 stroke-[3] text-rose-400" />
            </div>
            <span>{isEn ? 'Using Canva' : 'Usando o Canva'}</span>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'You must come up with design ideas from scratch after an exhausting day.'
                  : 'Você precisa ter ideias do zero depois de um dia exaustivo.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'Waste 40 minutes tweaking fonts, colors, and photos on a small phone screen.'
                  : 'Gasta 40 minutos alinhando fontes, cores e fotos no celular.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'Forced to use Google Translate with high risk of awkward phrasing in front of American clients.'
                  : 'Precisa traduzir no Google Tradutor e corre o risco de passar vergonha com termos errados.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'End up giving up on posting consistently, losing high-ticket customers to competitors.'
                  : 'Acaba desistindo de postar e perde clientes para concorrentes.'}
              </span>
            </li>
          </ul>
        </div>

        {/* Lado ZaPost */}
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl shadow-emerald-950/40">
          <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-base border-b border-emerald-500/20 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 stroke-[3] text-emerald-400" />
            </div>
            <span>{isEn ? 'With ZaPost in 1 Minute' : 'Com o ZaPost em 1 Minuto'}</span>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-100 font-medium">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'Just upload a job photo and speak or type what you want to offer.'
                  : 'Você só envia a foto do serviço e fala ou digita sua oferta.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEn ? (
                  <>
                    In <strong>less than 1 minute</strong>, receive 3 designer-quality high-res graphics.
                  </>
                ) : (
                  <>
                    Em <strong>menos de 1 minuto</strong>, recebe 3 artes diagramadas em alta resolução.
                  </>
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'Native American English copy and natural Portuguese captions.'
                  : 'Textos e legendas em inglês natural americano e português.'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEn
                  ? 'Active digital presence every week without stealing your precious family rest time.'
                  : 'Sua presença digital ativa toda semana sem roubar seu tempo de descanso.'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
