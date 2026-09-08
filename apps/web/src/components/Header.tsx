'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Globe } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function Header() {
  const { state, updateState } = useCreatePost()

  const toggleLanguage = () => {
    updateState({ language: state.language === 'pt' ? 'en' : 'pt' })
  }

  return (
    <header className="w-full bg-[#0F2E2A] text-white px-4 py-3 border-b border-white/10 flex items-center justify-between sticky top-0 z-40 shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-extrabold text-base px-2.5 py-1 rounded-lg shadow-sm">
          ZaPost
        </div>
        <span className="text-xs text-emerald-200 font-medium hidden xs:inline">
          Marketing no Zap
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Saldo de Créditos */}
        <Link
          href="/conta"
          className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-full text-xs font-bold touch-target min-h-[36px]"
          title="Seus créditos disponíveis"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{state.credits} créditos</span>
        </Link>

        {/* Idioma Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 bg-black/20 hover:bg-black/40 text-white border border-white/10 px-2 py-1.5 rounded-lg text-xs font-semibold touch-target min-h-[36px]"
          title="Alternar idioma da interface"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{state.language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
        </button>
      </div>
    </header>
  )
}
