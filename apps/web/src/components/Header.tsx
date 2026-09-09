'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Globe, Sparkles, Plus } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function Header() {
  const { state, updateState, resetFlow } = useCreatePost()

  const toggleLanguage = () => {
    updateState({ language: state.language === 'pt' ? 'en' : 'pt' })
  }

  const isEn = state.language === 'en'

  return (
    <header className="w-full bg-[#0F2E2A]/90 backdrop-blur-xl text-white border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo Elegante Sem Duplicação */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform border border-emerald-300/20">
            <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
              ZaPost
            </span>
            <span className="text-[11px] text-emerald-300 font-medium tracking-wide">
              {isEn ? 'Marketing on WhatsApp' : 'Marketing no Zap'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            {isEn ? 'Home' : 'Início'}
          </Link>
          <a href="#prova-social" className="hover:text-emerald-400 transition-colors">
            {isEn ? 'PT/EN Examples' : 'Exemplos PT/EN'}
          </a>
          <a href="#comparativo" className="hover:text-emerald-400 transition-colors">
            {isEn ? 'Why ZaPost?' : 'Por que ZaPost?'}
          </a>
          <a href="#planos" className="hover:text-emerald-400 transition-colors">
            {isEn ? 'Plans & Pricing' : 'Planos & Preços'}
          </a>
          <Link href="/admin" className="text-zinc-400 hover:text-emerald-400 font-mono text-xs transition-colors">
            Admin
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Botão Criar Post (Desktop CTA) */}
          <Link
            href="/criar/objetivo"
            onClick={resetFlow}
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isEn ? 'Create Post' : 'Criar Post'}</span>
          </Link>

          {/* Saldo de Créditos */}
          <Link
            href="/conta"
            className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-mono font-bold h-[40px] transition-colors shadow-sm"
            title="Seus créditos disponíveis"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span>{state.credits}</span>
          </Link>

          {/* Idioma Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-black/30 hover:bg-black/50 text-white border border-white/10 px-3 py-2 rounded-xl text-xs font-mono font-bold h-[40px] transition-colors shadow-sm"
            title="Alternar idioma da interface"
          >
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{state.language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
