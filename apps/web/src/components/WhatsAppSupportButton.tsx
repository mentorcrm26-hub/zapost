'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppSupportButton() {
  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com meus criativos no ZaPost.')
    window.open(`https://wa.me/15085550142?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-[78px] right-3 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2.5 rounded-full shadow-lg font-bold text-xs touch-target min-h-[44px] transition-transform active:scale-95"
      title="Falar com suporte humano via WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
      <span>Falar com atendente</span>
    </button>
  )
}
