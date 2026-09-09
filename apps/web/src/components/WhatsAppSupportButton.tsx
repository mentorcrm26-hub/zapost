'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function WhatsAppSupportButton() {
  const { state } = useCreatePost()
  const isEn = state?.language === 'en'

  const openSupport = () => {
    // Abre canal de suporte direto / Telegram ou suporte online
    window.open('https://t.me/zapost_suporte', '_blank')
  }

  return (
    <button
      onClick={openSupport}
      className="fixed bottom-[78px] md:bottom-6 right-3 md:right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs sm:text-sm touch-target min-h-[44px] transition-transform active:scale-95 border border-emerald-300/30"
      title={isEn ? 'Direct human support' : 'Suporte direto com atendente'}
    >
      <MessageCircle className="w-5 h-5" />
      <span>{isEn ? 'Support' : 'Suporte Online'}</span>
    </button>
  )
}
