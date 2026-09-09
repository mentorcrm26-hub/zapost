'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { WhatsAppSupportButton } from '@/components/WhatsAppSupportButton'
import { PwaInstallBanner } from '@/components/PwaInstallBanner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const isAdmin = pathname.startsWith('/admin')
  const isAppFlow =
    pathname.startsWith('/criar') ||
    pathname.startsWith('/marca') ||
    pathname === '/conta'

  // 1. Painel Administrativo (Full-Width Desktop com Sidebar)
  if (isAdmin) {
    return <div className="min-h-screen w-full bg-[#070a0f] text-zinc-100">{children}</div>
  }

  // 2. Fluxo de Criação do Usuário (Mobile Viewport Focado & BottomNav)
  if (isAppFlow) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-zinc-100 flex flex-col pt-[68px]">
        <Header />
        <div className="mobile-viewport">
          <PwaInstallBanner />
          <main className="flex-1 w-full px-4 py-4">{children}</main>
          <WhatsAppSupportButton />
          <BottomNav />
        </div>
      </div>
    )
  }

  // 3. Páginas Públicas / Landing Page / SEO Local / Termos (Layout Web Responsivo Desktop + Mobile)
  return (
    <div className="min-h-screen bg-[#0b0f17] text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-white relative pt-[68px]">
      {/* Background radial glow para desktop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      <Header />
      <PwaInstallBanner />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-10">
        {children}
      </main>
      <WhatsAppSupportButton />
      {/* BottomNav aparece apenas em telas pequenas para acesso rápido */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
