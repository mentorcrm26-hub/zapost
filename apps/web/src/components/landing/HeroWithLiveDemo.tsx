'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Zap,
  Mic,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  ShieldCheck,
  Clock,
  Globe
} from 'lucide-react'
import { trackBeginCheckout, trackCreativeApproved } from '@/lib/tracking'

interface GeneratedOption {
  id: string
  name: string
  previewUrl: string
  badge: string
  headlinePt: string
  headlineEn: string
}

const SAMPLE_OPTIONS: GeneratedOption[] = [
  {
    id: 'bold-price',
    name: 'Bold Price',
    previewUrl: '/out/bold-price_feed_45_pt.png',
    badge: '🔥 Foco em Preço & Urgência',
    headlinePt: 'Faxina Completa por apenas $120!',
    headlineEn: 'Deep House Cleaning for only $120!',
  },
  {
    id: 'photo-overlay',
    name: 'Photo Overlay',
    previewUrl: '/out/photo-overlay_feed_45_pt.png',
    badge: '✨ Destaque Visual da Foto',
    headlinePt: 'Sua casa limpa e cheirosa sem esforço.',
    headlineEn: 'Spotless home, zero hassle for you.',
  },
  {
    id: 'clean-split',
    name: 'Clean Split',
    previewUrl: '/out/clean-split_feed_45_pt.png',
    badge: '🏆 Direto ao Ponto & Sofisticado',
    headlinePt: 'Reserve seu horário no WhatsApp.',
    headlineEn: 'Book your appointment via WhatsApp.',
  },
]

export function HeroWithLiveDemo() {
  const [objective, setObjective] = useState<string>('promocao')
  const [audioText, setAudioText] = useState<string>('Faxina residencial em Framingham por apenas $120 até sábado. Agendamentos no WhatsApp.')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [hasGenerated, setHasGenerated] = useState<boolean>(false)
  const [selectedOpt, setSelectedOpt] = useState<GeneratedOption>(SAMPLE_OPTIONS[0])
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)
  const [signupEmail, setSignupEmail] = useState<string>('')
  const [signupPhone, setSignupPhone] = useState<string>('')
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false)

  const handleGenerateTrial = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
      trackCreativeApproved('trial_post', 'bold-price', true)
    }, 1200)
  }

  const handleDownloadClick = () => {
    setShowSignupModal(true)
    trackBeginCheckout('trial_free_5', 0)
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSignupSuccess(true)
    setTimeout(() => {
      setShowSignupModal(false)
      window.location.href = '/criar/prontinho'
    }, 1500)
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Coluna da Esquerda: Copywriting de Alta Conversão */}
      <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-xs font-bold font-mono shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Marketing Digital no WhatsApp para Brasileiros nos EUA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white leading-[1.15] tracking-tight">
          Manda a foto e fala o que quer.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 block">
            Sai pronto em português e em inglês.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
          Uma equipe de marketing digital que cabe no seu WhatsApp. Sem tela em branco, sem perder horas no Canva depois de um dia exaustivo de trabalho.
        </p>

        {/* Bullets de Benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-200 pt-2 text-left">
          <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pronto em 1 minuto</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Português 🇧🇷 e Inglês 🇺🇸</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>3 opções diagramadas</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>5 posts grátis sem cartão</span>
          </div>
        </div>
      </div>

      {/* Coluna da Direita: Widget Interativo Try-Before-Signup */}
      <div className="lg:col-span-6">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#0F2E2A]/30 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-bold text-white">Experimente Grátis Agora</h2>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Sem cadastro • Sem cartão
            </span>
          </div>

          {!hasGenerated ? (
            <div className="space-y-4">
              {/* 1. Escolha de Objetivo */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  1. O que você quer postar hoje?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'promocao', label: '🏷️ Promoção' },
                    { id: 'trabalho', label: '✨ Trabalho Feito' },
                    { id: 'divulgacao', label: '📢 Divulgação' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setObjective(item.id)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                        objective === item.id
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Foto de Exemplo */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  2. Foto do seu serviço / produto:
                </label>
                <div className="bg-zinc-950 border border-dashed border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/sample-sala.jpg"
                      alt="Foto Exemplo"
                      className="w-12 h-12 object-cover rounded-xl border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">sala_limpa_framingham.jpg</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Foto real anexada</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg border border-white/5">
                    Exemplo Carregado
                  </span>
                </div>
              </div>

              {/* 3. Áudio ou Texto */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between">
                  <span>3. O que você quer falar no post?</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Mic className="w-3 h-3" /> Como um áudio no Zap
                  </span>
                </label>
                <textarea
                  value={audioText}
                  onChange={(e) => setAudioText(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none font-sans"
                />
              </div>

              {/* Botão de Geração */}
              <button
                onClick={handleGenerateTrial}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] transition-all active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
                    <span>A IA está diagramando suas 3 opções...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Ver Minhas 3 Opções de Post Grátis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Estado com Opções Geradas (Try-Before-Signup) */
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">🎉 Mágica Acontecendo!</span>
                  <span className="text-[11px] text-emerald-300">Suas 3 opções foram criadas em PT 🇧🇷 e EN 🇺🇸.</span>
                </div>
                <button
                  onClick={() => setHasGenerated(false)}
                  className="text-[10px] text-zinc-400 hover:text-white underline font-mono"
                >
                  Mudar Texto
                </button>
              </div>

              {/* Seletor das 3 Opções */}
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOpt(opt)}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedOpt.id === opt.id
                        ? 'bg-emerald-950/80 border-emerald-400 shadow-md'
                        : 'bg-zinc-950 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={opt.previewUrl}
                      alt={opt.name}
                      className="w-full aspect-[4/5] object-cover rounded-xl bg-black"
                    />
                    <span className="text-[10px] font-bold text-zinc-200 truncate w-full text-center">
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Preview Grande da Opção Selecionada */}
              <div className="bg-zinc-950 rounded-2xl p-3 border border-white/10 space-y-3 relative overflow-hidden">
                {/* Marca d'água do Trial */}
                <div className="absolute top-5 right-5 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-amber-400/30 z-10">
                  ⚡ ZaPost Prévia Grátis
                </div>

                <img
                  src={selectedOpt.previewUrl}
                  alt="Preview Selecionado"
                  className="w-full aspect-[4/5] object-contain rounded-xl bg-black max-h-[300px]"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase font-mono text-emerald-400">
                    {selectedOpt.badge}
                  </span>
                  <p className="text-xs font-bold text-white">{selectedOpt.headlinePt}</p>
                  <p className="text-[11px] text-zinc-400">{selectedOpt.headlineEn}</p>
                </div>
              </div>

              {/* CTA de Desbloqueio e Download */}
              <button
                onClick={handleDownloadClick}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4 fill-current" />
                <span>Baixar em Alta Resolução (Liberar 5 Grátis)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cadastro Rápido */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Liberar Seus 5 Criativos Grátis</h3>
                <p className="text-[11px] text-zinc-400">Para onde enviamos seus arquivos em alta resolução?</p>
              </div>
              <button onClick={() => setShowSignupModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            {signupSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Conta criada com sucesso!</h4>
                <p className="text-xs text-emerald-300">5 créditos creditados na sua conta. Redirecionando...</p>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Seu WhatsApp (EUA ou Brasil)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (508) 555-0142"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Seu E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="seu.negocio@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Sem Cartão de Crédito</span>
                  </div>
                  <p>Você ganha 5 criativos completos sem compromisso e sem cobranças automáticas.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all"
                >
                  Liberar Arquivos e Criar Conta
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
