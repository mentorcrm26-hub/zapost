import React from 'react'
import Link from 'next/link'
import { MapPin, Shield } from 'lucide-react'

export function LocalSeoLinks() {
  const hubs = [
    { slug: 'boston', name: 'Boston & Framingham', state: 'MA' },
    { slug: 'orlando', name: 'Orlando & Kissimmee', state: 'FL' },
    { slug: 'newark', name: 'Newark & Ironbound', state: 'NJ' },
    { slug: 'danbury', name: 'Danbury & Bridgeport', state: 'CT' },
    { slug: 'marietta', name: 'Marietta & Atlanta', state: 'GA' },
  ]

  return (
    <footer className="space-y-6 pt-4 text-center border-t border-white/10">
      {/* Polos Regionais */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider flex items-center justify-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Polos da Comunidade Brasileira nos EUA
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {hubs.map((h) => (
            <Link
              key={h.slug}
              href={`/lp/${h.slug}`}
              className="text-xs bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-white/5 transition-colors"
            >
              {h.name} ({h.state})
            </Link>
          ))}
        </div>
      </div>

      {/* Links Legais e Institucionais */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 pt-2">
        <Link href="/terms" className="hover:text-white underline">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-white underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/cancellation" className="hover:text-white underline">
          Cancellation Policy
        </Link>
        <span>•</span>
        <Link href="/admin" className="text-zinc-500 hover:text-emerald-400 font-mono">
          Operador Admin
        </Link>
      </div>

      <p className="text-[11px] text-zinc-600 font-mono">
        © 2026 ZaPost Inc. • Marketing Digital no WhatsApp para Brasileiros nos EUA.
      </p>
    </footer>
  )
}
