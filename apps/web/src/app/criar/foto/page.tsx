'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function FotoPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()
  const [photoPreview, setPhotoPreview] = useState<string | null>(state.photoUrl || '/sample-sala.jpg')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string
        setPhotoPreview(base64)
        updateState({ photoUrl: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    const chosenPhoto = photoPreview || state.photoUrl || '/sample-sala.jpg'
    updateState({ photoUrl: chosenPhoto })
    router.push('/criar/voz')
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Barra de Progresso & Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white p-2 -ml-2 touch-target"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
          Etapa 2 de 4
        </span>
        <div className="w-8" />
      </div>

      {/* Título */}
      <div>
        <h1 className="text-xl font-bold font-display text-white leading-tight">
          Envie a foto do seu serviço
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Pode ser uma foto tirada agora ou da galeria do seu celular.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Área de Preview da Foto */}
      <div className="bg-zinc-900 border-2 border-dashed border-white/20 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group">
        {photoPreview ? (
          <div className="w-full flex flex-col items-center">
            <img
              src={photoPreview}
              alt="Prévia do serviço"
              className="w-full h-56 object-cover rounded-2xl shadow-lg border border-white/10"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-zinc-800/80 px-3 py-2 rounded-lg touch-target min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Trocar foto</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <p className="font-bold text-sm text-zinc-200">Nenhuma foto selecionada</p>
            <p className="text-xs text-zinc-400 mt-1">Tire uma foto ou escolha da galeria</p>
          </div>
        )}
      </div>

      {/* Botões de Ação de Upload */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold text-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 touch-target min-h-[72px] active:scale-[0.98]"
        >
          <Camera className="w-6 h-6 text-emerald-400" />
          <span>📸 Câmera</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold text-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-2 touch-target min-h-[72px] active:scale-[0.98]"
        >
          <ImageIcon className="w-6 h-6 text-emerald-400" />
          <span>🖼️ Galeria</span>
        </button>
      </div>

      {/* Botão de Avançar */}
      <button
        onClick={handleContinue}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] mt-2"
      >
        <span>Continuar com esta foto</span>
        <CheckCircle className="w-5 h-5" />
      </button>
    </div>
  )
}
