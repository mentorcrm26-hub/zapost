'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Save, Check, Plus, Trash2, Palette, RefreshCw } from 'lucide-react'
import { useCreatePost, BrandProfile } from '@/context/CreatePostContext'

interface PresetPalette {
  name: string
  niche: string
  colors: string[]
}

const PRESET_PALETTES: PresetPalette[] = [
  {
    name: 'Limpeza & Faxina',
    niche: 'House Cleaning',
    colors: ['#0F2E2A', '#2F6F5E', '#FFB300'],
  },
  {
    name: 'Estética & Salão',
    niche: 'Beauty & Nails',
    colors: ['#881337', '#FB7185', '#FFF1F2'],
  },
  {
    name: 'Construção & Reformas',
    niche: 'Handyman & Painting',
    colors: ['#0F172A', '#0284C7', '#F97316'],
  },
  {
    name: 'Gastronomia & Doces',
    niche: 'Food & Bakery',
    colors: ['#7F1D1D', '#EA580C', '#FEF08A'],
  },
  {
    name: 'Auto Detailing',
    niche: 'Car Care',
    colors: ['#09090B', '#2563EB', '#38BDF8'],
  },
  {
    name: 'Minimalista & Moderno',
    niche: 'Universal',
    colors: ['#18181B', '#10B981', '#FAFAFA'],
  },
]

const COLOR_ROLES = [
  'Cor Principal (Títulos & Destaques)',
  'Cor Secundária (Fundo & Cards)',
  'Cor de Acento (Botões & Preços)',
  'Cor Neutra / Texto',
  'Cor Especial / Efeitos',
]

export default function MinhaMarcaPage() {
  const { state: appState, updateState } = useCreatePost()

  const [name, setName] = useState(appState.brandProfile?.name || appState.businessName || 'Bella Clean')
  const [handle, setHandle] = useState(appState.brandProfile?.handle || '@bellaclean.ma')
  const [phone, setPhone] = useState(appState.brandProfile?.phone || appState.phone || '+1 (508) 555-0142')
  const [city, setCity] = useState(appState.brandProfile?.city || 'Framingham')
  const [state, setState] = useState(appState.brandProfile?.state || 'MA')
  const [colors, setColors] = useState<string[]>(
    appState.brandProfile?.colors || ['#0F2E2A', '#2F6F5E', '#FFB300']
  )
  const [saved, setSaved] = useState(false)

  // Sincroniza se o estado do contexto for carregado do localStorage
  useEffect(() => {
    if (appState.brandProfile) {
      setName(appState.brandProfile.name)
      setHandle(appState.brandProfile.handle)
      setPhone(appState.brandProfile.phone)
      setCity(appState.brandProfile.city)
      setState(appState.brandProfile.state)
      setColors(appState.brandProfile.colors)
    }
  }, [appState.brandProfile])

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colors]
    updated[index] = newColor
    setColors(updated)
  }

  const handleAddColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#10B981'])
    }
  }

  const handleRemoveColor = (index: number) => {
    if (colors.length > 2) {
      const updated = colors.filter((_, i) => i !== index)
      setColors(updated)
    }
  }

  const handleApplyPalette = (paletteColors: string[]) => {
    setColors([...paletteColors])
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedProfile: BrandProfile = {
      name: name.trim() || 'Minha Empresa',
      handle: handle.trim() || '@minhaempresa',
      phone: phone.trim() || '(508) 555-0142',
      city: city.trim() || 'Framingham',
      state: state.trim() || 'MA',
      colors: colors.length >= 2 ? colors : ['#0F2E2A', '#2F6F5E', '#FFB300'],
    }

    // Persiste no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zapost_brand_profile', JSON.stringify(updatedProfile))
    }

    // Atualiza o contexto global da aplicação
    updateState({
      businessName: updatedProfile.name,
      phone: updatedProfile.phone,
      brandColor: updatedProfile.colors[0],
      brandProfile: updatedProfile,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wide uppercase border border-emerald-500/20 mb-2">
          <Palette className="w-3 h-3" />
          Identidade Visual & Negócio
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white leading-tight">
          🏷️ Minha Marca
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Essas informações e cores são aplicadas automaticamente em todas as suas artes, templates e legendas.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Nome Comercial */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Nome do seu Negócio
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
            placeholder="Ex: Bella Clean, Silva Construction..."
          />
        </div>

        {/* Handle e Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              @ do Instagram
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
              placeholder="@seunegocio"
            />
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Telefone Comercial & Contato
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Localização (Cidade e Estado) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
              placeholder="Ex: Framingham"
            />
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Estado (UF)
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none uppercase"
              placeholder="MA"
              maxLength={2}
            />
          </div>
        </div>

        {/* Cores da Marca (Seletor Interativo + Paletas + Adicionar/Remover) */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  🎨 Cores da sua Marca
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {colors.length} {colors.length === 1 ? 'cor' : 'cores'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Clique no quadrado de cor para abrir a paleta ou digite o código Hexadecimal.
              </p>
            </div>

            {colors.length < 5 && (
              <button
                type="button"
                onClick={handleAddColor}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Cor</span>
              </button>
            )}
          </div>

          {/* Lista de Seletores de Cor Customizáveis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-zinc-950/80 border border-white/10 rounded-xl p-2.5 transition-all hover:border-emerald-500/40"
              >
                {/* Seletor Visual Nativo com Swatch Estilizado */}
                <div className="relative group flex-shrink-0">
                  <input
                    type="color"
                    id={`color-picker-${idx}`}
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value.toUpperCase())}
                    className="w-11 h-11 rounded-xl cursor-pointer border-2 border-white/20 bg-transparent p-0 appearance-none shadow-md"
                    title="Clique para escolher a cor"
                  />
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none border border-black/20"
                    style={{ backgroundColor: color }}
                  />
                </div>

                {/* Hex Code Input e Label do Papel da Cor */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[10px] font-medium text-zinc-400 truncate">
                    {COLOR_ROLES[idx] || `Cor ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className="w-24 bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono font-bold text-zinc-200 uppercase focus:border-emerald-500 focus:outline-none"
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* Botão Remover (se tiver mais de 2 cores) */}
                {colors.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remover esta cor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Paletas Prontas Recomendadas para 1-clique */}
          <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Ou escolha uma Paleta Pronta do seu Nicho:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_PALETTES.map((palette, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleApplyPalette(palette.colors)}
                  className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-zinc-950/60 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-900 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400">
                      {palette.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {palette.colors.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{palette.niche}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prévia ao Vivo das Cores da Marca */}
          <div className="mt-2 pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              👀 Prévia das Cores no Post:
            </span>
            <div
              className="p-4 rounded-xl border border-white/15 flex items-center justify-between transition-colors shadow-inner"
              style={{ backgroundColor: colors[0] || '#0F2E2A' }}
            >
              <div>
                <span
                  className="text-xs font-bold block"
                  style={{ color: colors[2] || colors[1] || '#FFFFFF' }}
                >
                  {name || 'Nome da sua Empresa'}
                </span>
                <span className="text-[11px] text-white/80 font-mono">{handle}</span>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold shadow"
                style={{
                  backgroundColor: colors[1] || '#2F6F5E',
                  color: colors[2] || '#FFFFFF',
                }}
              >
                PROMOÇÃO $120
              </div>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] transition-all"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Identidade Visual Salva com Sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Salvar Alterações da Marca</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

