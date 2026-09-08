'use client'

import React, { useState } from 'react'
import { Key, AlertTriangle, CheckCircle, ShieldCheck, RefreshCw, Zap } from 'lucide-react'

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState([
    {
      id: 'key-1',
      provider: 'Anthropic (Claude Sonnet)',
      role: 'Principal',
      priority: 1,
      status: 'Ativa (Normal)',
      monthlyBudgetCents: 20000, // $200.00
      currentSpendCents: 4812,   // $48.12
      keyMasked: 'sk-ant-api03-xxxx...9fA2',
    },
    {
      id: 'key-2',
      provider: 'Anthropic (Chave Reserva Backup)',
      role: 'Reserva Fallback',
      priority: 2,
      status: 'Standby',
      monthlyBudgetCents: 20000, // $200.00
      currentSpendCents: 0,      // $0.00
      keyMasked: 'sk-ant-api03-yyyy...1a8C',
    },
    {
      id: 'key-3',
      provider: 'OpenAI (Whisper Áudio)',
      role: 'Principal',
      priority: 1,
      status: 'Ativa (Normal)',
      monthlyBudgetCents: 5000,  // $50.00
      currentSpendCents: 1240,   // $12.40
      keyMasked: 'sk-proj-xxxx...kk90',
    },
  ])

  const [fallbackTriggered, setFallbackTriggered] = useState(false)

  const simulateBudgetBurst = () => {
    setKeys((prev) =>
      prev.map((k) => {
        if (k.id === 'key-1') {
          return {
            ...k,
            currentSpendCents: 20050, // $200.50 (Estourou teto)
            status: '⚠️ Teto Estourado (Chaveado)',
          }
        }
        if (k.id === 'key-2') {
          return {
            ...k,
            status: '⚡ Ativa (Assumiu Carga)',
            currentSpendCents: 150,
          }
        }
        return k
      })
    )
    setFallbackTriggered(true)
  }

  const resetKeys = () => {
    setKeys([
      {
        id: 'key-1',
        provider: 'Anthropic (Claude Sonnet)',
        role: 'Principal',
        priority: 1,
        status: 'Ativa (Normal)',
        monthlyBudgetCents: 20000,
        currentSpendCents: 4812,
        keyMasked: 'sk-ant-api03-xxxx...9fA2',
      },
      {
        id: 'key-2',
        provider: 'Anthropic (Chave Reserva Backup)',
        role: 'Reserva Fallback',
        priority: 2,
        status: 'Standby',
        monthlyBudgetCents: 20000,
        currentSpendCents: 0,
        keyMasked: 'sk-ant-api03-yyyy...1a8C',
      },
      {
        id: 'key-3',
        provider: 'OpenAI (Whisper Áudio)',
        role: 'Principal',
        priority: 1,
        status: 'Ativa (Normal)',
        monthlyBudgetCents: 5000,
        currentSpendCents: 1240,
        keyMasked: 'sk-proj-xxxx...kk90',
      },
    ])
    setFallbackTriggered(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <span>CHAVES DE API & CONTROLE DE TETO MENSAL</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Defina limites orçamentários por chave com failover automático para o provedor reserva.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {fallbackTriggered ? (
            <button
              onClick={resetKeys}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resetar Simulação</span>
            </button>
          ) : (
            <button
              onClick={simulateBudgetBurst}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Testar Estouro de Teto (Failover)</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de Status de Failover */}
      {fallbackTriggered && (
        <div className="bg-amber-950/60 border border-amber-500/50 rounded-2xl p-4 flex items-center gap-3 text-amber-200 text-xs font-mono shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <b>FAILOVER AUTOMÁTICO EXECUTADO COM SUCESSO:</b> A chave principal Anthropic atingiu 100% do teto ($200.00). O sistema desceu imediatamente para a chave reserva sem causar nenhum erro para os clientes.
          </div>
        </div>
      )}

      {/* Tabela de Chaves */}
      <div className="bg-[#0d121c] border border-white/10 rounded-2xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/90 text-zinc-400 border-b border-white/10 font-mono">
            <tr>
              <th className="p-3.5">Provedor / Papel</th>
              <th className="p-3.5">Chave</th>
              <th className="p-3.5">Teto Mensal</th>
              <th className="p-3.5">Gasto Acumulado</th>
              <th className="p-3.5">Uso do Teto</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {keys.map((k) => {
              const pct = Math.min(100, (k.currentSpendCents / k.monthlyBudgetCents) * 100)
              const isOver = k.currentSpendCents >= k.monthlyBudgetCents

              return (
                <tr key={k.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    <div>{k.provider}</div>
                    <div className="text-[11px] text-zinc-400 font-mono font-normal">{k.role} (Prioridade {k.priority})</div>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-400">{k.keyMasked}</td>
                  <td className="p-3.5 font-mono text-zinc-200 font-bold">
                    ${(k.monthlyBudgetCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    ${(k.currentSpendCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <div className="w-32 flex items-center gap-2">
                      <div className="flex-1 bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/10">
                        <div
                          className={`h-full rounded-full ${
                            isOver ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400">{pct.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] border ${
                        isOver
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : k.status.includes('⚡')
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {k.status}
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
