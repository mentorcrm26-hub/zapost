'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, MicOff, CheckCircle, Edit3, Keyboard } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function VozPage() {
  const router = useRouter()
  const { state, updateState } = useCreatePost()
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState(state.rawInput || '')
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Inicializa Web Speech API se suportado
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recog = new SpeechRecognition()
        recog.continuous = true
        recog.interimResults = true
        recog.lang = 'pt-BR'

        recog.onresult = (event: any) => {
          let current = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript
          }
          if (current) {
            setTranscript((prev) => (prev ? `${prev} ${current}` : current))
          }
        }

        recog.onerror = (event: any) => {
          console.warn('Web Speech API aviso:', event.error)
          setIsRecording(false)
        }

        recog.onend = () => {
          setIsRecording(false)
        }

        setRecognition(recog)
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognition) {
      if (!isRecording) {
        setIsRecording(true)
        setTimeout(() => {
          setTranscript('Limpeza completa de casa em Framingham por $120 essa semana')
          setIsRecording(false)
        }, 2000)
      } else {
        setIsRecording(false)
      }
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      setTranscript('')
      recognition.start()
      setIsRecording(true)
    }
  }

  const handleContinue = () => {
    const finalInput = transcript.trim() || state.rawInput || 'Divulgação de serviços com alta qualidade'
    
    // Tenta extrair preço se o usuário digitou ou falou números
    const priceMatch = finalInput.match(/\$\s*(\d+(?:[.,]\d{2})?)|\b(\d+)\s*(?:dólares|dolares|dollars|usd)\b|por\s*(\d+)/i)
    const detectedPrice = priceMatch ? (priceMatch[1] || priceMatch[2] || priceMatch[3]) : state.price

    updateState({
      rawInput: finalInput,
      price: detectedPrice || state.price || '120',
    })
    router.push('/criar/redes')
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
          Etapa 3 de 4
        </span>
        <div className="w-8" />
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-xl font-bold font-display text-white leading-tight">
          O que você quer falar no post?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Grave um áudio ou digite o que você quer divulgar.
        </p>
      </div>

      {/* Alternador de Modo: Áudio vs Digitação */}
      <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-white/10 rounded-2xl">
        <button
          type="button"
          onClick={() => setInputMode('voice')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all touch-target min-h-[44px] ${
            inputMode === 'voice'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Gravar Áudio</span>
        </button>

        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all touch-target min-h-[44px] ${
            inputMode === 'text'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Digitar Texto</span>
        </button>
      </div>

      {/* Conteúdo Conforme Modo */}
      {inputMode === 'voice' ? (
        <div className="flex flex-col items-center justify-center my-3">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all touch-target active:scale-95 border-4 ${
              isRecording
                ? 'bg-red-600 border-red-400 animate-pulse text-white shadow-red-500/50'
                : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 border-emerald-300/40 text-white hover:scale-105 shadow-emerald-500/30'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-12 h-12 stroke-[2.5]" />
                <span className="text-[11px] font-extrabold mt-1 uppercase tracking-wider">
                  Ouvindo...
                </span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 stroke-[2.5]" />
                <span className="text-[11px] font-extrabold mt-1 uppercase tracking-wider">
                  Gravar
                </span>
              </>
            )}
          </button>

          <p className="text-xs text-zinc-400 mt-3 text-center">
            {isRecording ? '🎙️ Fale agora... Toque para finalizar' : 'Toque no botão para começar a falar'}
          </p>
        </div>
      ) : (
        <div className="my-1">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
            ✏️ O que você quer divulgar?
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Ex: Pintura residencial de sala e quarto em Boston por $350 esta semana"
            rows={4}
            className="w-full bg-zinc-950 border border-white/15 rounded-2xl p-4 text-white text-base focus:border-emerald-500 focus:outline-none resize-none shadow-inner"
          />
        </div>
      )}

      {/* Caixa do Texto Entendido / Digitado */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span>✨ Mensagem que será usada na arte:</span>
          </span>
          {inputMode === 'voice' && (
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 touch-target min-h-[36px]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
          )}
        </div>

        <div className="bg-zinc-950/60 rounded-xl p-3 border border-white/5 min-h-[52px] flex items-center">
          <p className="text-sm text-zinc-200 italic leading-relaxed">
            {transcript ? `"${transcript}"` : 'Nenhum texto informado ainda. Grave um áudio ou clique na aba "Digitar Texto".'}
          </p>
        </div>
      </div>

      {/* Botão de Avançar */}
      <button
        onClick={handleContinue}
        disabled={!transcript.trim()}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl p-4 shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] active:scale-[0.98] mt-1"
      >
        <span>Continuar</span>
        <CheckCircle className="w-5 h-5" />
      </button>
    </div>
  )
}
