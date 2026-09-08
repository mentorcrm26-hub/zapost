'use client'

import React, { useState } from 'react'
import { Users, LogIn, Search, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react'

export default function AdminClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [impersonateModal, setImpersonateModal] = useState<any>(null)
  const [reason, setReason] = useState('')
  const [auditSuccess, setAuditSuccess] = useState<string | null>(null)

  const clients = [
    {
      id: 'tenant-1111',
      name: 'Bella Clean',
      segment: 'Limpeza Residencial',
      owner: 'Maria Santos',
      phone: '+1 (508) 555-0142',
      location: 'Framingham, MA',
      plan: 'Starter ($49/mês)',
      creditsUsed: '8 / 10',
      status: 'Ativo',
    },
    {
      id: 'tenant-2222',
      name: 'Padaria do Silva',
      segment: 'Comida & Pães',
      owner: 'Antônio Silva',
      phone: '+1 (407) 555-0199',
      location: 'Orlando, FL',
      plan: 'Growth ($89/mês)',
      creditsUsed: '19 / 20',
      status: 'Ativo',
    },
    {
      id: 'tenant-3333',
      name: 'Glow Hair Studio',
      segment: 'Beleza & Salão',
      owner: 'Juliana Costa',
      phone: '+1 (978) 555-0188',
      location: 'Lowell, MA',
      plan: 'Starter ($49/mês)',
      creditsUsed: '4 / 10',
      status: 'Ativo',
    },
    {
      id: 'tenant-4444',
      name: 'Boston Movers & Trucks',
      segment: 'Transporte & Mudança',
      owner: 'Carlos Eduardo',
      phone: '+1 (617) 555-0155',
      location: 'Boston, MA',
      plan: 'Growth ($89/mês)',
      creditsUsed: '12 / 20',
      status: 'Ativo',
    },
  ]

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImpersonate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      alert('É obrigatório informar o motivo da auditoria.')
      return
    }

    // Registra log de auditoria
    console.log(`[AUDIT_LOG] Admin impersonated tenant ${impersonateModal.name} (${impersonateModal.id}). Motivo: ${reason}`)
    setAuditSuccess(`Acesso registrado na tabela audit_logs! Redirecionando como ${impersonateModal.name}...`)

    setTimeout(() => {
      setImpersonateModal(null)
      setReason('')
      setAuditSuccess(null)
      window.location.href = '/'
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>GESTÃO DE CLIENTES & IMPERSONATION</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Visualize o consumo dos tenants e entre como o cliente para suporte auditado.
          </p>
        </div>

        {/* Busca */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, cidade..."
            className="w-full bg-[#0d121c] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-[#0d121c] border border-white/10 rounded-2xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/90 text-zinc-400 border-b border-white/10 font-mono">
            <tr>
              <th className="p-3.5">Empresa / Tenant</th>
              <th className="p-3.5">Responsável</th>
              <th className="p-3.5">Plano</th>
              <th className="p-3.5">Raios no Mês</th>
              <th className="p-3.5">Localização</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Ação Suporte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-bold text-white">
                  <div>{client.name}</div>
                  <div className="text-[11px] text-zinc-400 font-normal">{client.segment}</div>
                </td>
                <td className="p-3.5">
                  <div className="text-zinc-200">{client.owner}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{client.phone}</div>
                </td>
                <td className="p-3.5 font-mono text-zinc-300">{client.plan}</td>
                <td className="p-3.5 font-mono text-emerald-400 font-bold">{client.creditsUsed}</td>
                <td className="p-3.5 text-zinc-300">{client.location}</td>
                <td className="p-3.5">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono text-[10px]">
                    {client.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setImpersonateModal(client)}
                    className="bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 ml-auto transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Entrar Como</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Impersonate com Auditoria Obrigatória */}
      {impersonateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d121c] border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-white">
                  Entrar como {impersonateModal.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  Esta ação concede acesso total à conta do cliente para suporte.
                </p>
              </div>
            </div>

            {auditSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>{auditSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleImpersonate} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Motivo do Acesso (Registrado na tabela audit_logs):
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex: Suporte a pedido do cliente via WhatsApp para ajuste de template..."
                    rows={3}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setImpersonateModal(null)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg"
                  >
                    Confirmar e Entrar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
