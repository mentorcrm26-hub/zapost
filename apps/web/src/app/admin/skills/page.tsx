'use client'

import React, { useState } from 'react'
import {
  Code2,
  History,
  RotateCcw,
  Sparkles,
  Split,
  CheckCircle2,
  Save,
  Play,
  Eye,
  Plus,
  AlertCircle,
  FileCode,
  Tag
} from 'lucide-react'

interface SkillItem {
  id: string
  name: string
  family: 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'
  version: string
  lastUpdated: string
  status: 'active' | 'ab_test' | 'draft'
  abPercentage?: number
  yamlContent: string
  previewPt: string
  previewEn: string
  history: {
    version: string
    timestamp: string
    author: string
    summary: string
  }[]
}

const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'urgencia-prazo',
    name: 'Gatilho de Urgência Real',
    family: 'tecnica',
    version: '1.4.0',
    lastUpdated: '06/09/2026 18:30',
    status: 'active',
    yamlContent: `id: urgencia-prazo
version: 1.4.0
type: tecnica
applies_to:
  objetivos: ['promocao', 'evento', 'lancamento']
regras:
  - 'Nunca invente datas falsas sem prazo no briefing'
  - 'Use expressões assertivas como "Até sábado" ou "Vagas limitadas"'
  - 'Destaque o elemento temporal no topo ou no subheadline'
proibicoes:
  - 'Não use "Corra antes que acabe" mais de uma vez'`,
    previewPt: '🔥 Até Sábado: 40% OFF em Alinhamento e Balanceamento. Agende no WhatsApp!',
    previewEn: '🔥 This Week Only: 40% OFF Wheel Alignment & Balancing. Book via WhatsApp!',
    history: [
      { version: '1.4.0', timestamp: '06/09 18:30', author: 'Admin (Daian)', summary: 'Reforço de regra para evitar clichês genéricos' },
      { version: '1.3.0', timestamp: '28/08 14:15', author: 'Sistema (Auto)', summary: 'Otimização de tokens após 500 gerações' },
      { version: '1.0.0', timestamp: '15/08 10:00', author: 'Admin (Daian)', summary: 'Criação inicial da skill' },
    ],
  },
  {
    id: 'estetica-clean-minimal',
    name: 'Estética & Beleza Premium',
    family: 'segmento',
    version: '2.1.0',
    lastUpdated: '07/09/2026 09:12',
    status: 'ab_test',
    abPercentage: 50,
    yamlContent: `id: estetica-clean-minimal
version: 2.1.0
type: segmento
applies_to:
  segmentos: ['estetica', 'beleza', 'dermatologia', 'spa']
regras:
  - 'Vocabulário sofisticado e acolhedor ("Renove sua autoestima", "Cuidado exclusivo")'
  - 'Hierarquia tipográfica suave, dando respiro à foto'
  - 'Preço deve ser posicionado com discrição elegante'`,
    previewPt: 'Realce sua beleza natural com nosso protocolo exclusivo de Bioestimuladores.',
    previewEn: 'Enhance your natural glow with our exclusive Collagen Bio-stimulator protocol.',
    history: [
      { version: '2.1.0', timestamp: '07/09 09:12', author: 'Admin (Daian)', summary: 'Ajuste de contraste e refinamento do tom de voz' },
      { version: '2.0.0', timestamp: '01/09 16:40', author: 'Admin (Daian)', summary: 'Remodelagem para suportar clínicas de alto padrão' },
    ],
  },
  {
    id: 'preco-parcelado-destaque',
    name: 'Preço Parcelado em Destaque',
    family: 'formato',
    version: '1.2.0',
    lastUpdated: '04/09/2026 21:00',
    status: 'active',
    yamlContent: `id: preco-parcelado-destaque
version: 1.2.0
type: formato
applies_to:
  objetivos: ['venda_direta', 'promocao']
regras:
  - 'Se houver parcelamento no briefing, coloque a parcela como número principal'
  - 'Exemplo: "10x de R$ 49,90" ao invés de apenas "R$ 499,00"'`,
    previewPt: 'Notebook Dell Inspiron i5 em até 10x de R$ 289,90 sem juros!',
    previewEn: 'Dell Inspiron i5 Laptop starting at just $49/mo with zero interest!',
    history: [
      { version: '1.2.0', timestamp: '04/09 21:00', author: 'Admin (Daian)', summary: 'Adição de formatação cambial em USD' },
    ],
  },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS)
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(INITIAL_SKILLS[0])
  const [editorContent, setEditorContent] = useState<string>(INITIAL_SKILLS[0].yamlContent)
  const [isTestingAB, setIsTestingAB] = useState<boolean>(INITIAL_SKILLS[0].status === 'ab_test')
  const [notification, setNotification] = useState<string | null>(null)

  const handleSelectSkill = (skill: SkillItem) => {
    setSelectedSkill(skill)
    setEditorContent(skill.yamlContent)
    setIsTestingAB(skill.status === 'ab_test')
  }

  const handleSave = () => {
    const updated = skills.map((s) => {
      if (s.id === selectedSkill.id) {
        return {
          ...s,
          yamlContent: editorContent,
          status: isTestingAB ? ('ab_test' as const) : ('active' as const),
          lastUpdated: 'Agora mesmo',
          version: incrementPatchVersion(s.version),
          history: [
            {
              version: incrementPatchVersion(s.version),
              timestamp: 'Agora mesmo',
              author: 'Admin (Daian)',
              summary: isTestingAB ? 'Publicado em Teste A/B (50%)' : 'Alterações manuais salvas',
            },
            ...s.history,
          ],
        }
      }
      return s
    })

    setSkills(updated)
    const current = updated.find((s) => s.id === selectedSkill.id)!
    setSelectedSkill(current)
    showFeedback('Skill salva com sucesso e versão incrementada!')
  }

  const handleRevert = (versionItem: { version: string; summary: string }) => {
    showFeedback(`Revertido com sucesso para a versão ${versionItem.version}!`)
  }

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  function incrementPatchVersion(v: string) {
    const parts = v.split('.')
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parseInt(parts[2], 10) + 1}`
    }
    return `${v}.1`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Code2 className="w-6 h-6 text-amber-400" />
            Editor & Versionador de Skills
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Gerencie as 5 famílias de inteligência (Segmento, Técnica, Formato, Sazonal, Aperfeiçoamento) com histórico e A/B testing.
          </p>
        </div>

        <button
          onClick={() => showFeedback('Nova skill em rascunho criada')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          Nova Skill
        </button>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">
            Skills Disponíveis ({skills.length})
          </h2>

          <div className="space-y-2">
            {skills.map((s) => {
              const isSelected = s.id === selectedSkill.id
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSkill(s)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400/60 shadow-lg shadow-amber-400/5'
                      : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm">{s.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      v{s.version}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {s.family}
                    </span>
                    {s.status === 'ab_test' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                        <Split className="w-2.5 h-2.5" /> A/B ({s.abPercentage}%)
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: YAML Editor & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{selectedSkill.name}</h3>
                  <span className="text-xs font-mono text-neutral-400">ID: {selectedSkill.id}</span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">Última alteração: {selectedSkill.lastUpdated}</div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs">
                  <Split className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-neutral-300 font-mono">Teste A/B (50%)</span>
                  <input
                    type="checkbox"
                    checked={isTestingAB}
                    onChange={(e) => setIsTestingAB(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                </label>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Salvar Nova Versão
                </button>
              </div>
            </div>

            {/* Code / YAML Editor Area */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  YAML Schema & Regras Injetáveis
                </span>
                <span>YAML 1.2</span>
              </div>
              <div className="relative font-mono text-xs">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  rows={12}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-emerald-400 focus:outline-none focus:border-amber-400/60 leading-relaxed resize-y selection:bg-amber-400/20"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Bilíngue Live Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Preview Injetado (PT)</span>
                  <span className="text-amber-400">BR</span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">{selectedSkill.previewPt}</p>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Preview Injetado (EN)</span>
                  <span className="text-sky-400">US</span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">{selectedSkill.previewEn}</p>
              </div>
            </div>

            {/* Version History & 1-Click Revert */}
            <div className="pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-neutral-400" />
                Histórico de Versões & Reversão
              </h4>

              <div className="space-y-2">
                {selectedSkill.history.map((h, i) => (
                  <div
                    key={h.version}
                    className="flex items-center justify-between p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400">v{h.version}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">{h.timestamp}</span>
                      <span className="text-neutral-300 font-sans">{h.summary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-500">{h.author}</span>
                      {i > 0 && (
                        <button
                          onClick={() => handleRevert(h)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 rounded text-[11px] font-mono transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" /> Reverter
                        </button>
                      )}
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded">
                          Atual
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
