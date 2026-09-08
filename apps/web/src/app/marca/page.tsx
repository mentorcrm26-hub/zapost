'use client'

import React, { useState } from 'react'
import { Sparkles, Save, Check } from 'lucide-react'

export default function MinhaMarcaPage() {
  const [name, setName] = useState('Bella Clean')
  const [handle, setHandle] = useState('@bellaclean.ma')
  const [phone, setPhone] = useState('+1 (508) 555-0142')
  const [city, setCity] = useState('Framingham')
  const [state, setState] = useState('MA')
  const [colors, setColors] = useState(['#2F6F5E', '#FFB300', '#0F2E2A'])
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          🏷️ Minha Marca
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Essas informações são aplicadas automaticamente em todas as suas artes e legendas.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
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
          />
        </div>

        {/* Handle e Telefone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              @ do Instagram
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-1.5 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              WhatsApp Comercial
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white text-base focus:border-emerald-500 focus:outline-none"
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
            />
          </div>
        </div>

        {/* Cores da Marca */}
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            🎨 Cores da sua Marca
          </label>
          <div className="flex items-center gap-3">
            {colors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newCols = [...colors]
                    newCols[idx] = e.target.value
                    setColors(newCols)
                  }}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-white/20 bg-transparent"
                />
                <span className="text-xs text-zinc-300 font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] mt-2"
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Identidade Visual Salva!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
