'use client'

import React, { useState } from 'react'
import {
  BrainCircuit,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  ThumbsUp,
  FileCode,
  Activity,
  History,
  CheckCircle2
} from 'lucide-react'

interface PendingLearning {
  id: string
  sourceTrigger: string
  patternDetected: string
  occurrences: number
  sampleTenants: string[]
  suggestedFamily: 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'
  targetSkillId?: string
  suggestedRule: string
  suggestedYamlDiff: string
  detectedAt: string
  confidenceScore: number
}

const INITIAL_LEARNINGS: PendingLearning[] = [
  {
    id: 'lrn-001',
    sourceTrigger: '22 clientes de Estética trocaram o termo "Desconto" por "Condição Especial" no editor manual',
    patternDetected: 'O público de clínicas e estética de alto padrão rejeita a palavra "desconto", preferindo "cortesia", "condição especial" ou "protocolo exclusivo".',
    occurrences: 22,
    sampleTenants: ['Clínica Estética Bella', 'Dra. Camila Dermatologia', 'Studio Lumina'],
    suggestedFamily: 'segmento',
    targetSkillId: 'estetica-clean-minimal',
    suggestedRule: 'Nunca use a palavra "desconto" ou "promoção barata" para estética avançada. Substitua por "condição especial" ou "protocolo exclusivo".',
    suggestedYamlDiff: `+ proibicoes:
+   - 'Nunca use "Desconto" ou "Promoção" para serviços de harmonização ou bioestimuladores'
+ regras:
+   - 'Utilize "Condição Especial de Inauguração" ou "Protocolo de Boas-Vindas"'`,
    detectedAt: '07/09/2026 14:20',
    confidenceScore: 96,
  },
  {
    id: 'lrn-002',
    sourceTrigger: '18 posts de Pizzarias e Hamburguerias tiveram o preço movido para o botão de CTA',
    patternDetected: 'Em delivery noturno, o preço explícito no botão ("Pedir por R$ 39,90") converte 3x mais que no meio do corpo.',
    occurrences: 18,
    sampleTenants: ['Pizzaria Forno & Sabor', 'Burger House 360', 'Sampa Lanches'],
    suggestedFamily: 'formato',
    targetSkillId: 'preco-parcelado-destaque',
    suggestedRule: 'Para alimentação noturna e delivery rápido, incorpore o valor monetário diretamente no texto do botão de ação.',
    suggestedYamlDiff: `+ regras:
+   - 'Em delivery rápido, crie CTA com preço: "Peça agora por apenas R$ X"'`,
    detectedAt: '06/09/2026 22:15',
    confidenceScore: 91,
  },
  {
    id: 'lrn-003',
    sourceTrigger: '14 rejeições no template Bold Price quando headline passava de 7 palavras',
    patternDetected: 'Títulos longos quebram em 4 linhas no formato 4:5 e cobrem a área de contraste do preço.',
    occurrences: 14,
    sampleTenants: ['Auto Peças Silva', 'Marmitaria Fitness', 'Boutique da Moda'],
    suggestedFamily: 'aperfeicoamento',
    suggestedRule: 'No template Bold Price, imponha limite estrito de 6 palavras ou 38 caracteres na headline.',
    suggestedYamlDiff: `+ regras:
+   - 'No template bold-price, headline não pode ultrapassar 6 palavras'`,
    detectedAt: '05/09/2026 11:05',
    confidenceScore: 89,
  },
]

export default function AprendizadosPage() {
  const [learnings, setLearnings] = useState<PendingLearning[]>(INITIAL_LEARNINGS)
  const [promotedCount, setPromotedCount] = useState<number>(14)
  const [discardedCount, setDiscardedCount] = useState<number>(3)
  const [notification, setNotification] = useState<string | null>(null)

  const handlePromote = (id: string, rule: string) => {
    setLearnings(learnings.filter((l) => l.id !== id))
    setPromotedCount((c) => c + 1)
    showFeedback(`Aprendizado promovido com sucesso a REGRA PERMANENTE!`)
  }

  const handleDiscard = (id: string) => {
    setLearnings(learnings.filter((l) => l.id !== id))
    setDiscardedCount((c) => c + 1)
    showFeedback(`Aprendizado descartado da fila de avaliação.`)
  }

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-amber-400" />
          Fila de Aprendizados Pendentes
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Insights extraídos de edições e reprovações de clientes. Nenhuma regra é promovida sem autorização humana expressa.
        </p>
      </div>

      {/* Regra 16 Banner */}
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wider block font-mono">
            Regra 16 do ZaPost — Supervisão Humana Obrigatória
          </span>
          <p className="text-neutral-300 mt-0.5">
            O motor de IA identifica padrões de edição e rascunha melhorias, mas <strong>nenhuma regra autogerada entra em produção permanentemente</strong> sem que você clique em &quot;Promover a Regra&quot;.
          </p>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Pendentes de Revisão</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{learnings.length}</div>
          </div>
          <Clock className="w-6 h-6 text-amber-400/60" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Promovidos a Regra</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{promotedCount}</div>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-400/60" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Descartados</div>
            <div className="text-2xl font-bold text-neutral-500 font-mono mt-1">{discardedCount}</div>
          </div>
          <XCircle className="w-6 h-6 text-neutral-600" />
        </div>
      </div>

      {/* Cards de Aprendizados Pendentes */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-400">
          Aguardando Decisão ({learnings.length})
        </h2>

        {learnings.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center text-neutral-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            Nenhum aprendizado pendente no momento. Todos os padrões foram analisados.
          </div>
        ) : (
          learnings.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 hover:border-neutral-700 transition-colors"
            >
              {/* Header do Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {item.suggestedFamily}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">ID: {item.id}</span>
                  <span className="text-xs font-mono text-neutral-500">• {item.detectedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">Confiança do Padrão:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    {item.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Gatilho & Padrão */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    Gatilho & Frequência ({item.occurrences} eventos)
                  </div>
                  <p className="text-xs text-neutral-200 font-medium leading-relaxed">{item.sourceTrigger}</p>
                  <div className="text-[10px] text-neutral-500 font-mono pt-1">
                    Exemplos: {item.sampleTenants.join(', ')}
                  </div>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Padrão Identificado pelo Motor
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{item.patternDetected}</p>
                </div>
              </div>

              {/* Proposta de Regra & YAML Diff */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    Regra Sugerida para Injeção
                  </span>
                  {item.targetSkillId && (
                    <span className="text-neutral-500">Skill alvo: <code className="text-amber-300">{item.targetSkillId}</code></span>
                  )}
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap">
                  {item.suggestedYamlDiff}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleDiscard(item.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-neutral-400" />
                  Descartar Aprendizado
                </button>

                <button
                  onClick={() => handlePromote(item.id, item.suggestedRule)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors shadow-md shadow-amber-400/10"
                >
                  <CheckCircle className="w-4 h-4" />
                  Promover a Regra Permanente
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
