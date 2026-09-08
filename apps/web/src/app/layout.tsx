import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppShell } from '@/components/AppShell'
import { CreatePostProvider } from '@/context/CreatePostContext'

export const metadata: Metadata = {
  title: 'ZaPost — Criativos em 1 Minuto',
  description: 'Marketing digital no WhatsApp para brasileiros donos de pequenos negócios nos EUA.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F2E2A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0b0f17] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-white">
        <CreatePostProvider>
          <AppShell>{children}</AppShell>
        </CreatePostProvider>
      </body>
    </html>
  )
}
