'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { WhatsAppSupportButton } from '@/components/WhatsAppSupportButton'
import { PwaInstallBanner } from '@/components/PwaInstallBanner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <div className="min-h-screen w-full bg-[#070a0f] text-zinc-100">{children}</div>
  }

  return (
    <div className="mobile-viewport">
      <Header />
      <PwaInstallBanner />
      <main className="flex-1 w-full px-4 py-4">{children}</main>
      <WhatsAppSupportButton />
      <BottomNav />
    </div>
  )
}
