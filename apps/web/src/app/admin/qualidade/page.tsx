'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Layers,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react'

interface TemplateStat {
  id: string
  name: string
  totalGenerated: number
  firstAttemptApproval: number
  rejectionRate: number
  avgRegenerations: number
  topFeedback: string
  trend: number
}

interface SkillStat {
  id: string
  name: string
  family: 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'
  activeInGenerations: number
  successRate: number
  commonIssue: string
}

interface LanguageStat {
  code: string
  label: string
  firstAttemptRate: number
  avgCharCorrection: string
  samplesCount: number
}

const TEMPLATE_STATS: TemplateStat[] = [
  {
    id: 'photo-overlay',
    name: 'Photo Overlay',
    totalGenerated: 1420,
    firstAttemptApproval: 92.4,
    rejectionRate: 7.6,
    avgRegenerations: 1.1,
    topFeedback: 'Preferido em 68% dos posts de estética e gastronomia',
    trend: +3.2,
  },
  {
    id: 'bold-price',
    name: 'Bold Price',
    totalGenerated: 1890,
    firstAttemptApproval: 86.1,
    rejectionRate: 13.9,
    avgRegenerations: 1.3,
    topFeedback: 'Preço às vezes concorre com texto longo em telas pequenas',
    trend: -1.4,
  },
  {
    id: 'clean-split',
    name: 'Clean Split',
    totalGenerated: 840,
    firstAttemptApproval: 79.5,
    rejectionRate: 20.5,
    avgRegenerations: 1.6,
    topFeedback: 'Clientes pedem fotos menos cortadas na divisão 50/50',
    trend: +4.8,
  },
]

const SKILL_STATS: SkillStat[] = [
  {
    id: 'urgencia-prazo',
    name: 'Gatilho de Urgência Real',
    family: 'tecnica',
    activeInGenerations: 620,
    successRate: 94.2,
    commonIssue: 'Excelente retenção quando acompanhado de data real',
  },
  {
    id: 'preco-parcelado-destaque',
    name: 'Preço Parcelado em Destaque',
    family: 'formato',
    activeInGenerations: 410,
    successRate: 91.0,
    commonIssue: 'Funciona melhor em serviços acima de $100',
  },
  {
    id: 'estetica-clean-minimal',
    name: 'Estética & Beleza Premium',
    family: 'segmento',
    activeInGenerations: 380,
    successRate: 88.5,
    commonIssue: 'Exige contrast ratio rígido para fontes finas',
  },
  {
    id: 'sazonal-dia-das-maes',
    name: 'Campanha Dia das Mães',
    family: 'sazonal',
    activeInGenerations: 190,
    successRate: 84.0,
    commonIssue: 'Saturação de termos genéricos precisa de ajuste no prompt',
  },
  {
    id: 'clareza-headline-curta',
    name: 'Headline Max 6 Palavras',
    family: 'aperfeicoamento',
    activeInGenerations: 950,
    successRate: 96.8,
    commonIssue: 'Maior índice de aprovação direta sem re-render',
  },
]

const LANGUAGE_STATS: LanguageStat[] = [
  {
    code: 'pt',
    label: 'Português (Brasil)',
    firstAttemptRate: 89.2,
    avgCharCorrection: '0.4%',
    samplesCount: 3120,
  },
  {
    code: 'en',
    label: 'Inglês (US)',
    firstAttemptRate: 84.7,
    avgCharCorrection: '1.2%',
    samplesCount: 1030,
  },
]

export default function QualidadePage() {
  const [selectedFamily, setSelectedFamily] = useState<string>('all')

  const filteredSkills = selectedFamily === 'all'
    ? SKILL_STATS
    : SKILL_STATS.filter(s => s.family === selectedFamily)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Taxa de Qualidade & Aprovação de 1ª Tentativa
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Métricas de retenção criativa, aceitação de templates na primeira rodada e eficácia das skills em produção.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Aprovação 1ª Tentativa Global</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">87.4%</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" /> +2.1% vs mês anterior
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Taxa de Re-geração / Edição</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">12.6%</div>
          <div className="text-xs text-neutral-400 mt-1 font-mono">
            Média de 1.2 rodadas por post
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Template Mais Eficaz</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white">Photo Overlay</div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">92.4% de aprovação direta</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Paridade de Idioma</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">PT: 89% | EN: 85%</div>
          <div className="text-xs text-neutral-400 mt-1">Diferença de apenas 4.5%</div>
        </div>
      </div>

      {/* Templates Analysis */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Desempenho por Template de Render
        </h2>
        <p className="text-xs text-neutral-400 mb-6">
          Taxa de aprovação na 1ª tentativa sem necessidade de edição de layout pelo cliente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATE_STATS.map((tpl) => (
            <div key={tpl.id} className="border border-neutral-800 bg-neutral-950/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{tpl.name}</span>
                <span className="text-xs font-mono text-neutral-400">{tpl.totalGenerated} posts</span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-neutral-400">1ª Tentativa:</span>
                  <span className="text-emerald-400 font-bold">{tpl.firstAttemptApproval}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${tpl.firstAttemptApproval}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-neutral-800">
                <div>
                  <span className="text-neutral-500">Reprovações:</span>
                  <p className="text-amber-400 font-semibold">{tpl.rejectionRate}%</p>
                </div>
                <div>
                  <span className="text-neutral-500">Tendência:</span>
                  <p className={tpl.trend >= 0 ? 'text-emerald-400 flex items-center gap-0.5' : 'text-rose-400 flex items-center gap-0.5'}>
                    {tpl.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {tpl.trend > 0 ? `+${tpl.trend}%` : `${tpl.trend}%`}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-neutral-900 rounded-lg text-xs text-neutral-300 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">Diagnóstico / Feedback</span>
                {tpl.topFeedback}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Idioma & Paridade */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          Aprovação por Idioma (PT-BR vs EN-US)
        </h2>
        <p className="text-xs text-neutral-400 mb-4">
          Conformidade e precisão das chamadas bilíngues sem perda de naturalidade contextual.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LANGUAGE_STATS.map((lang) => (
            <div key={lang.code} className="border border-neutral-800 bg-neutral-950/60 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{lang.label}</div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">{lang.samplesCount} amostras analisadas</div>
                <div className="text-xs text-neutral-500 mt-2">Taxa de correção pós-geração: <span className="text-white font-mono">{lang.avgCharCorrection}</span></div>
              </div>
              <div className="text-right font-mono">
                <div className="text-3xl font-bold text-emerald-400">{lang.firstAttemptRate}%</div>
                <div className="text-[11px] text-neutral-500">aprovação direta</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Performance */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Eficácia por Skill em Produção
            </h2>
            <p className="text-xs text-neutral-400">
              Taxa de sucesso e feedback das skills ativas injetadas no gerador de conteúdo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Todas as Famílias</option>
              <option value="segmento">Segmento</option>
              <option value="tecnica">Técnica</option>
              <option value="formato">Formato</option>
              <option value="sazonal">Sazonal</option>
              <option value="aperfeicoamento">Aperfeiçoamento</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Família</th>
                <th className="py-3 px-4 text-right">Aplicações</th>
                <th className="py-3 px-4 text-right">Taxa de Sucesso</th>
                <th className="py-3 px-4">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredSkills.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{s.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-800 text-neutral-300 uppercase tracking-wider font-semibold">
                      {s.family}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-neutral-300">{s.activeInGenerations}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">{s.successRate}%</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-400 text-[11px]">{s.commonIssue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
