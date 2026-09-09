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
import { useCreatePost } from '@/context/CreatePostContext'
import { trackBeginCheckout, trackCreativeApproved } from '@/lib/tracking'

interface GeneratedOption {
  id: string
  name: string
  previewUrl: string
  badgePt: string
  badgeEn: string
  headlinePt: string
  headlineEn: string
}

const SAMPLE_OPTIONS: GeneratedOption[] = [
  {
    id: 'bold-price',
    name: 'Bold Price',
    previewUrl: '/out/bold-price_feed_45_pt.png',
    badgePt: '🔥 Foco em Preço & Urgência',
    badgeEn: '🔥 Price & Urgency Focus',
    headlinePt: 'Faxina Completa por apenas $120!',
    headlineEn: 'Deep House Cleaning for only $120!',
  },
  {
    id: 'photo-overlay',
    name: 'Photo Overlay',
    previewUrl: '/out/photo-overlay_feed_45_pt.png',
    badgePt: '✨ Destaque Visual da Foto',
    badgeEn: '✨ Photo Visual Spotlight',
    headlinePt: 'Sua casa limpa e cheirosa sem esforço.',
    headlineEn: 'Spotless home, zero hassle for you.',
  },
  {
    id: 'clean-split',
    name: 'Clean Split',
    previewUrl: '/out/clean-split_feed_45_pt.png',
    badgePt: '🏆 Direto ao Ponto & Sofisticado',
    badgeEn: '🏆 Direct & High-End Look',
    headlinePt: 'Reserve seu horário no WhatsApp.',
    headlineEn: 'Book your appointment via WhatsApp.',
  },
]

export function HeroWithLiveDemo() {
  const { state } = useCreatePost()
  const isEn = state.language === 'en'

  const [objective, setObjective] = useState<string>('promocao')
  const [audioText, setAudioText] = useState<string>(
    isEn
      ? 'Residential house cleaning in Framingham for only $120 through Saturday. Book on WhatsApp.'
      : 'Faxina residencial em Framingham por apenas $120 até sábado. Agendamentos no WhatsApp.'
  )
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [hasGenerated, setHasGenerated] = useState<boolean>(false)
  const [selectedOpt, setSelectedOpt] = useState<GeneratedOption>(SAMPLE_OPTIONS[0])
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)
  const [signupEmail, setSignupEmail] = useState<string>('')
  const [signupPhone, setSignupPhone] = useState<string>('')
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false)

  // Atualiza automaticamente o texto de exemplo ao trocar de idioma se o usuário não tiver digitado algo personalizado
  React.useEffect(() => {
    if (audioText === 'Faxina residencial em Framingham por apenas $120 até sábado. Agendamentos no WhatsApp.') {
      if (isEn) {
        setAudioText('Residential house cleaning in Framingham for only $120 through Saturday. Book on WhatsApp.')
      }
    } else if (
      audioText === 'Residential house cleaning in Framingham for only $120 through Saturday. Book on WhatsApp.'
    ) {
      if (!isEn) {
        setAudioText('Faxina residencial em Framingham por apenas $120 até sábado. Agendamentos no WhatsApp.')
      }
    }
  }, [isEn])

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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
      {/* Coluna da Esquerda: Copywriting de Alta Conversão */}
      <div className="lg:col-span-6 xl:col-span-6 space-y-7 sm:space-y-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-xs sm:text-sm font-bold font-mono shadow-sm">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
          <span>
            {isEn
              ? 'WhatsApp Marketing for Small Businesses in the US'
              : 'Marketing Digital no WhatsApp para Brasileiros nos EUA'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold font-display text-white leading-[1.18] sm:leading-[1.18] tracking-tight">
          {isEn ? 'Send a photo and speak your mind.' : 'Manda a foto e fala o que quer.'}{' '}
          <span className="block mt-2 pb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 overflow-visible">
            {isEn
              ? 'Ready in minutes in English & Portuguese.'
              : 'Sai pronto em português e em inglês.'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
          {isEn
            ? 'A full digital marketing team inside your WhatsApp. No blank canvas, no wasting hours on Canva after an exhausting day of work.'
            : 'Uma equipe de marketing digital que cabe no seu WhatsApp. Sem tela em branco, sem perder horas no Canva depois de um dia exaustivo de trabalho.'}
        </p>

        {/* Bullets de Benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-200 pt-2 text-left">
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 shadow-sm">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{isEn ? 'Ready in 1 minute' : 'Pronto em 1 minuto'}</span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 shadow-sm">
            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold">{isEn ? 'English 🇺🇸 & Portuguese 🇧🇷' : 'Português 🇧🇷 e Inglês 🇺🇸'}</span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{isEn ? '3 designer options' : '3 opções diagramadas'}</span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{isEn ? '5 free posts, no card needed' : '5 posts grátis sem cartão'}</span>
          </div>
        </div>
      </div>

      {/* Coluna da Direita: Widget Interativo Try-Before-Signup */}
      <div className="lg:col-span-6 xl:col-span-6">
        <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950/90 to-[#0F2E2A]/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-base font-bold text-white">
                {isEn ? 'Try It Free Now' : 'Experimente Grátis Agora'}
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 font-semibold">
              {isEn ? 'No signup • No card' : 'Sem cadastro • Sem cartão'}
            </span>
          </div>

          {!hasGenerated ? (
            <div className="space-y-4">
              {/* 1. Escolha de Objetivo */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  {isEn ? '1. What do you want to post today?' : '1. O que você quer postar hoje?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'promocao', label: isEn ? '🏷️ Promotion' : '🏷️ Promoção' },
                    { id: 'trabalho', label: isEn ? '✨ Work Done' : '✨ Trabalho Feito' },
                    { id: 'divulgacao', label: isEn ? '📢 Announcement' : '📢 Divulgação' },
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
                  {isEn ? '2. Photo of your service / product:' : '2. Foto do seu serviço / produto:'}
                </label>
                <div className="bg-zinc-950 border border-dashed border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/sample-sala.jpg"
                      alt="Foto Exemplo"
                      className="w-12 h-12 object-cover rounded-xl border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block">
                        {isEn ? 'clean_house_framingham.jpg' : 'sala_limpa_framingham.jpg'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {isEn ? 'Real photo attached' : 'Foto real anexada'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg border border-white/5">
                    {isEn ? 'Sample Loaded' : 'Exemplo Carregado'}
                  </span>
                </div>
              </div>

              {/* 3. Áudio ou Texto */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between">
                  <span>{isEn ? '3. What do you want to say in the post?' : '3. O que você quer falar no post?'}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Mic className="w-3 h-3" /> {isEn ? 'Like a voice note on WhatsApp' : 'Como um áudio no Zap'}
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
                    <span>{isEn ? 'AI is creating your 3 options...' : 'A IA está diagramando suas 3 opções...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>{isEn ? 'See My 3 Free Post Options' : 'Ver Minhas 3 Opções de Post Grátis'}</span>
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
                  <span className="text-xs font-bold text-white block">
                    {isEn ? '🎉 Magic Happening!' : '🎉 Mágica Acontecendo!'}
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    {isEn
                      ? 'Your 3 options were created in English 🇺🇸 and Portuguese 🇧🇷.'
                      : 'Suas 3 opções foram criadas em PT 🇧🇷 e EN 🇺🇸.'}
                  </span>
                </div>
                <button
                  onClick={() => setHasGenerated(false)}
                  className="text-[10px] text-zinc-400 hover:text-white underline font-mono"
                >
                  {isEn ? 'Change Text' : 'Mudar Texto'}
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
                  {isEn ? '⚡ ZaPost Free Preview' : '⚡ ZaPost Prévia Grátis'}
                </div>

                <img
                  src={selectedOpt.previewUrl}
                  alt="Preview Selecionado"
                  className="w-full aspect-[4/5] object-contain rounded-xl bg-black max-h-[300px]"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase font-mono text-emerald-400">
                    {isEn ? selectedOpt.badgeEn : selectedOpt.badgePt}
                  </span>
                  <p className="text-xs font-bold text-white">
                    {isEn ? selectedOpt.headlineEn : selectedOpt.headlinePt}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {isEn ? selectedOpt.headlinePt : selectedOpt.headlineEn}
                  </p>
                </div>
              </div>

              {/* CTA de Desbloqueio e Download */}
              <button
                onClick={handleDownloadClick}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4 fill-current" />
                <span>
                  {isEn
                    ? 'Download High Resolution (Unlock 5 Free)'
                    : 'Baixar em Alta Resolução (Liberar 5 Grátis)'}
                </span>
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
                <h3 className="font-bold text-white text-base">
                  {isEn ? 'Unlock Your 5 Free Creatives' : 'Liberar Seus 5 Criativos Grátis'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {isEn
                    ? 'Where should we send your high-resolution files?'
                    : 'Para onde enviamos seus arquivos em alta resolução?'}
                </p>
              </div>
              <button onClick={() => setShowSignupModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            {signupSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">
                  {isEn ? 'Account created successfully!' : 'Conta criada com sucesso!'}
                </h4>
                <p className="text-xs text-emerald-300">
                  {isEn
                    ? '5 credits added to your balance. Redirecting...'
                    : '5 créditos creditados na sua conta. Redirecionando...'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    {isEn ? 'Your WhatsApp (US or Brazil)' : 'Seu WhatsApp (EUA ou Brasil)'}
                  </label>
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
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    {isEn ? 'Your Email' : 'Seu E-mail'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.business@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEn ? 'No Credit Card Required' : 'Sem Cartão de Crédito'}</span>
                  </div>
                  <p>
                    {isEn
                      ? 'You get 5 complete creatives with zero commitment and no recurring charges.'
                      : 'Você ganha 5 criativos completos sem compromisso e sem cobranças automáticas.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all"
                >
                  {isEn ? 'Unlock Files & Create Account' : 'Liberar Arquivos e Criar Conta'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
