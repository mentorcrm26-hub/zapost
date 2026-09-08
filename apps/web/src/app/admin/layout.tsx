'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Users,
  Key,
  DollarSign,
  Award,
  Sparkles,
  BrainCircuit,
  Layers,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Visão Geral', icon: Activity },
    { href: '/admin/clientes', label: 'Clientes & Suporte', icon: Users },
    { href: '/admin/api-keys', label: 'Chaves & Tetos API', icon: Key },
    { href: '/admin/custos', label: 'Custo por Cliente', icon: DollarSign },
    { href: '/admin/qualidade', label: 'Qualidade & Aprovação', icon: Award },
    { href: '/admin/skills', label: 'Editor de Skills', icon: Sparkles },
    { href: '/admin/aprendizados', label: 'Aprendizados (Regra 16)', icon: BrainCircuit, badge: '2 novos' },
    { href: '/admin/filas', label: 'Filas BullMQ & Falhas', icon: Layers },
  ]

  return (
    <div className="min-h-screen bg-[#070a0f] text-zinc-100 flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sidebar Analítica */}
      <aside className="w-64 bg-[#0d121c] border-r border-white/10 flex flex-col justify-between shrink-0 p-4">
        <div className="flex flex-col gap-6">
          {/* Brand Admin */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-extrabold text-white text-base">
                ⚡
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight text-white font-mono">ZaPost ADMIN</h1>
                <p className="text-[11px] text-emerald-400 font-mono">SALA DE CONTROLE</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" title="Sistema Operando" />
          </div>

          {/* Links de Navegação */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 text-xs text-zinc-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[11px]">Modo Operador Raiz</span>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao WebApp do Cliente</span>
          </Link>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
