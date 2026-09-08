'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Image as ImageIcon, PlusCircle, Sparkles, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Meus Posts', icon: ImageIcon },
    { href: '/criar/objetivo', label: 'Criar Post', icon: PlusCircle, highlight: true },
    { href: '/marca', label: 'Minha Marca', icon: Sparkles },
    { href: '/conta', label: 'Minha Conta', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F2E2A]/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
      <div className="max-w-[480px] mx-auto grid grid-cols-4 h-[68px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3 touch-target group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400 mt-0.5">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center touch-target transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
