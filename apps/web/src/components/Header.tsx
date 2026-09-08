'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Globe, Sparkles, User, Image, Plus } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function Header() {
  const { state, updateState, resetFlow } = useCreatePost()

  const toggleLanguage = () => {
    updateState({ language: state.language === 'pt' ? 'en' : 'pt' })
  }

  return (
    <header className="w-full bg-[#0F2E2A] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-extrabold text-base px-2.5 py-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
            ZaPost
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-none">ZaPost</span>
            <span className="text-[10px] text-emerald-300 font-mono hidden xs:block">
              Marketing no Zap
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
          <Link href="/" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/lp/boston" className="hover:text-white transition-colors">
            Cidades
          </Link>
          <Link href="/conta" className="hover:text-white transition-colors">
            Planos & Preços
          </Link>
          <Link href="/admin" className="text-zinc-400 hover:text-emerald-400 font-mono transition-colors">
            Admin
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Botão Criar Post (Desktop CTA) */}
          <Link
            href="/criar/objetivo"
            onClick={resetFlow}
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Criar Post</span>
          </Link>

          {/* Saldo de Créditos */}
          <Link
            href="/conta"
            className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold touch-target min-h-[36px] hover:bg-amber-500/30 transition-colors"
            title="Seus créditos disponíveis"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono text-xs">⚡ {state.credits}</span>
          </Link>

          {/* Idioma Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-black/20 hover:bg-black/40 text-white border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-semibold touch-target min-h-[36px] transition-colors"
            title="Alternar idioma da interface"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{state.language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
