'use client'

import React, { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export function PwaInstallBanner() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
      }
    } else {
      alert('Para instalar: no Safari toque em Compartilhar > Adicionar à Tela de Início. No Chrome toque em menu ⋮ > Instalar aplicativo.')
    }
  }

  if (!show) return null

  return (
    <div className="bg-emerald-900/90 border border-emerald-500/40 text-white p-3 mx-4 mt-3 rounded-xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight">Instalar ZaPost no celular</p>
          <p className="text-[11px] text-emerald-200">Acesse direto da sua tela inicial</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstall}
          className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
        >
          Instalar
        </button>
        <button
          onClick={() => setShow(false)}
          className="text-zinc-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
