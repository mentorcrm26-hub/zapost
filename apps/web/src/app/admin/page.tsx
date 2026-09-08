'use client'

import React from 'react'
import Link from 'next/link'
import {
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const kpis = [
    {
      title: 'Receita do Mês (MRR)',
      value: '$2,480.00',
      change: '+14.2%',
      isPositive: true,
      desc: '32 clientes ativos nos planos Starter e Growth',
      icon: DollarSign,
    },
    {
      title: 'Custo Real de IA (LLM+Áudio)',
      value: '$48.12',
      change: '-6.8%',
      isPositive: true,
      desc: '1,240 chamadas Claude Sonnet + Whisper',
      icon: Sparkles,
    },
    {
      title: 'Margem Bruta do Produto',
      value: '98.05%',
      change: '+0.4%',
      isPositive: true,
      desc: 'Margem de software preservada',
      icon: TrendingUp,
    },
    {
      title: 'Aprovação na 1ª Tentativa',
      value: '84.6%',
      change: '+3.1%',
      isPositive: true,
      desc: 'Média ponderada dos 3 templates',
      icon: Award,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span>SALA DE CONTROLE — VISÃO GERAL</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Monitoramento financeiro, operacional e qualitativo em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>TODOS OS SERVIÇOS OPERACIONAIS</span>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="bg-[#0d121c] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">{kpi.title}</span>
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">{kpi.value}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                <span className="text-emerald-400 font-bold">{kpi.change} vs mês ant.</span>
                <span className="text-zinc-500 truncate max-w-[120px]">{kpi.desc}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerta de Aprendizados Pendentes (Regra 16) */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-300">
              2 Novos Aprendizados Autônomos Aguardando Revisão Humana
            </p>
            <p className="text-xs text-zinc-300">
              O sistema detectou padrões de alta reprovação no template clean-split para o segmento de beleza.
            </p>
          </div>
        </div>
        <Link
          href="/admin/aprendizados"
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
        >
          <span>Revisar Fila</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid Duplo: Acesso Rápido */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card 1: Margem e Custo */}
        <div className="bg-[#0d121c] border border-white/10 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>CUSTO POR CLIENTE & MARGEM</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Descubra quais tenants estão consumindo mais tokens de IA em relação ao valor que pagam por mês.
            </p>
          </div>
          <Link
            href="/admin/custos"
            className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl self-start flex items-center gap-1.5"
          >
            <span>Ver Tabela de Margem</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Qualidade & Templates */}
        <div className="bg-[#0d121c] border border-white/10 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>QUALIDADE DOS TEMPLATES</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Taxa de aprovação de primeira por template e por idioma. Identifique templates que precisam ser aposentados.
            </p>
          </div>
          <Link
            href="/admin/qualidade"
            className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl self-start flex items-center gap-1.5"
          >
            <span>Ver Métricas de Qualidade</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
