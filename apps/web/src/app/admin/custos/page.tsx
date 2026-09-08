'use client'

import React, { useState } from 'react'
import { DollarSign, ArrowUpDown, TrendingDown, TrendingUp, AlertOctagon } from 'lucide-react'

export default function AdminCustosPage() {
  const [sortField, setSortField] = useState<'marginPct' | 'costTotal' | 'revenue'>('marginPct')
  const [sortAsc, setSortAsc] = useState(false)

  const rawData = [
    {
      id: 'tenant-1',
      name: 'Bella Clean',
      plan: 'Starter ($49.00)',
      revenue: 49.00,
      tokensLlm: 184500,
      costLlm: 1.84,
      costAudio: 0.18,
      costRender: 0.04,
      costTotal: 2.06,
      profit: 46.94,
      marginPct: 95.8,
      status: 'Margem Saudável 🟢',
    },
    {
      id: 'tenant-2',
      name: 'Padaria do Silva',
      plan: 'Growth ($89.00)',
      revenue: 89.00,
      tokensLlm: 490200,
      costLlm: 4.90,
      costAudio: 0.42,
      costRender: 0.12,
      costTotal: 5.44,
      profit: 83.56,
      marginPct: 93.9,
      status: 'Margem Saudável 🟢',
    },
    {
      id: 'tenant-3',
      name: 'Glow Hair Studio',
      plan: 'Starter ($49.00)',
      revenue: 49.00,
      tokensLlm: 98000,
      costLlm: 0.98,
      costAudio: 0.09,
      costRender: 0.02,
      costTotal: 1.09,
      profit: 47.91,
      marginPct: 97.8,
      status: 'Alta Margem 🟢',
    },
    {
      id: 'tenant-4',
      name: 'Boston Heavy Demolition',
      plan: 'Starter ($49.00)',
      revenue: 49.00,
      tokensLlm: 2450000,
      costLlm: 24.50,
      costAudio: 3.10,
      costRender: 0.90,
      costTotal: 28.50,
      profit: 20.50,
      marginPct: 41.8,
      status: '⚠️ Margem Degradada (Alto Volume)',
    },
    {
      id: 'tenant-5',
      name: 'Truck Express Delivery',
      plan: 'PAYG ($19.00)',
      revenue: 19.00,
      tokensLlm: 1890000,
      costLlm: 18.90,
      costAudio: 2.80,
      costRender: 0.85,
      costTotal: 22.55,
      profit: -3.55,
      marginPct: -18.7,
      status: '🚨 MARGEM NEGATIVA (Prejuízo)',
    },
  ]

  const sortedData = [...rawData].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (sortAsc) return valA > valB ? 1 : -1
    return valA < valB ? 1 : -1
  })

  const toggleSort = (field: 'marginPct' | 'costTotal' | 'revenue') => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const totalRev = rawData.reduce((acc, c) => acc + c.revenue, 0)
  const totalCost = rawData.reduce((acc, c) => acc + c.costTotal, 0)
  const totalProfit = totalRev - totalCost
  const avgMargin = ((totalProfit / totalRev) * 100).toFixed(1)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>CUSTO REAL DE IA POR CLIENTE & MARGEM</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Cruzamento da tabela ai_usage contra a receita do plano. Identifique quem consome sua margem.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0d121c] border border-white/10 px-4 py-2 rounded-2xl font-mono text-xs">
          <div>
            <span className="text-zinc-400">Receita: </span>
            <span className="font-bold text-white">${totalRev.toFixed(2)}</span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-zinc-400">Custo Total IA: </span>
            <span className="font-bold text-amber-400">${totalCost.toFixed(2)}</span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-zinc-400">Margem Média: </span>
            <span className="font-bold text-emerald-400">{avgMargin}%</span>
          </div>
        </div>
      </div>

      {/* Tabela de Custo e Margem Ordenável */}
      <div className="bg-[#0d121c] border border-white/10 rounded-2xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/90 text-zinc-400 border-b border-white/10 font-mono">
            <tr>
              <th className="p-3.5">Cliente / Tenant</th>
              <th className="p-3.5">Plano Contratado</th>
              <th
                className="p-3.5 cursor-pointer hover:text-white"
                onClick={() => toggleSort('revenue')}
              >
                <div className="flex items-center gap-1">
                  <span>Receita</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">LLM (Tokens)</th>
              <th className="p-3.5">Áudio (Whisper)</th>
              <th
                className="p-3.5 cursor-pointer hover:text-white"
                onClick={() => toggleSort('costTotal')}
              >
                <div className="flex items-center gap-1">
                  <span>Custo Total IA</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Lucro Bruto ($)</th>
              <th
                className="p-3.5 cursor-pointer hover:text-white"
                onClick={() => toggleSort('marginPct')}
              >
                <div className="flex items-center gap-1">
                  <span>Margem (%)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {sortedData.map((row) => {
              const isNegative = row.marginPct < 0
              const isDegraded = row.marginPct < 60 && !isNegative

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-white/5 transition-colors ${
                    isNegative ? 'bg-red-950/20' : isDegraded ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <td className="p-3.5 font-bold text-white font-sans">{row.name}</td>
                  <td className="p-3.5 text-zinc-300 font-sans">{row.plan}</td>
                  <td className="p-3.5 font-bold text-white">${row.revenue.toFixed(2)}</td>
                  <td className="p-3.5 text-zinc-300">
                    <div>${row.costLlm.toFixed(2)}</div>
                    <div className="text-[10px] text-zinc-500 font-normal">{(row.tokensLlm / 1000).toFixed(0)}k toks</div>
                  </td>
                  <td className="p-3.5 text-zinc-300">${row.costAudio.toFixed(2)}</td>
                  <td className="p-3.5 font-bold text-amber-300">${row.costTotal.toFixed(2)}</td>
                  <td
                    className={`p-3.5 font-bold ${
                      isNegative ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    ${row.profit.toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        isNegative
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isDegraded
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {row.marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-[11px]">
                    <span
                      className={
                        isNegative
                          ? 'text-red-400 font-bold'
                          : isDegraded
                          ? 'text-amber-400'
                          : 'text-zinc-400'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
