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
      <div className="min-h-screen bg-[#0b0f17] text-zinc-100 flex flex-col">
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
    <div className="min-h-screen bg-[#0b0f17] text-zinc-100 flex flex-col">
      <Header />
      <PwaInstallBanner />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
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
