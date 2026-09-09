'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export function WhatsAppSupportButton() {
  const { state } = useCreatePost()
  const isEn = state?.language === 'en'

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      isEn
        ? 'Hello! I need help with my marketing creatives on ZaPost.'
        : 'Olá! Preciso de ajuda com meus criativos no ZaPost.'
    )
    window.open(`https://wa.me/15085550142?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-[78px] md:bottom-6 right-3 md:right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs sm:text-sm touch-target min-h-[44px] transition-transform active:scale-95 border border-white/20"
      title={isEn ? 'Chat with human support on WhatsApp' : 'Falar com suporte humano via WhatsApp'}
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
      <span>{isEn ? 'Talk to Support' : 'Falar com atendente'}</span>
    </button>
  )
}
