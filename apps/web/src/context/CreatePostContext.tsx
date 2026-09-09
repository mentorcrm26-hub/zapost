'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface BrandProfile {
  name: string
  handle: string
  phone: string
  city: string
  state: string
  colors: string[]
}

export interface CreatePostState {
  objective: 'divulgar' | 'promocao' | 'trabalho_feito'
  photoUrl: string | null
  rawInput: string
  price: string
  deadline: string
  networks: string[]
  language: 'pt' | 'en'
  selectedTemplate: string
  credits: number
  businessName?: string
  phone?: string
  brandColor?: string
  brandProfile?: BrandProfile
  generatedOptions: Array<{
    id: string
    name: string
    badge: string
    previewUrl: string
    previewUrlEn?: string
    finalUrl: string
    finalUrlEn?: string
    finalStoryUrl?: string
    finalStoryUrlEn?: string
    headlinePt: string
    headlineEn: string
    captionPt: string
    captionEn: string
    tagsPt: string
    tagsEn: string
  }>
}

const defaultBrandProfile: BrandProfile = {
  name: 'Bella Clean',
  handle: '@bellaclean.ma',
  phone: '+1 (508) 555-0142',
  city: 'Framingham',
  state: 'MA',
  colors: ['#0F2E2A', '#2F6F5E', '#FFB300'],
}

const defaultState: CreatePostState = {
  objective: 'promocao',
  photoUrl: '/sample-sala.jpg',
  rawInput: 'Limpeza completa de casa em Framingham por $120 essa semana',
  price: '120',
  deadline: 'esta_semana',
  networks: ['instagram', 'whatsapp_status'],
  language: 'pt',
  selectedTemplate: 'bold-price',
  credits: 10,
  businessName: 'Bella Clean',
  phone: '+1 (508) 555-0142',
  brandColor: '#10b981',
  brandProfile: defaultBrandProfile,
  generatedOptions: [
    {
      id: 'bold-price',
      name: 'Bold Price',
      badge: '1️⃣ Opção 1: Preço Gigante',
      previewUrl: '/out/bold-price_feed_45_pt_preview.png',
      finalUrl: '/out/bold-price_feed_45_pt.png',
      headlinePt: 'FAXINA COMPLETA POR $120',
      headlineEn: 'HOUSE CLEANING FOR $120',
      captionPt: 'Essa semana tem promoção especial de limpeza em Framingham! 🧽✨ Sua casa impecável por apenas $120.',
      captionEn: 'Special offer this week in Framingham! 🧽✨ Get your home spotless for just $120.',
      tagsPt: '#limpeza #framingham #faxina #massachusetts',
      tagsEn: '#housecleaning #framinghamma #cleaningservice #deepclean',
    },
    {
      id: 'photo-overlay',
      name: 'Photo Overlay',
      badge: '2️⃣ Opção 2: Foto c/ Gradiente',
      previewUrl: '/out/photo-overlay_feed_45_pt_preview.png',
      finalUrl: '/out/photo-overlay_feed_45_pt.png',
      headlinePt: 'SUA CASA BRILHANDO POR $120',
      headlineEn: 'SPARKLE YOUR HOME FOR $120',
      captionPt: 'Deixe sua casa brilhando com a equipe de confiança da Bella Clean em Framingham! ✨🧹',
      captionEn: 'Make your home shine with Bella Clean in Framingham, MA! ✨🧹',
      tagsPt: '#limpezaresidencial #bellaclean #massachusetts',
      tagsEn: '#homecleaning #framinghamma #residentialcleaning',
    },
    {
      id: 'clean-split',
      name: 'Clean Split',
      badge: '3️⃣ Opção 3: Divisão Limpa',
      previewUrl: '/out/clean-split_feed_45_pt_preview.png',
      finalUrl: '/out/clean-split_feed_45_pt.png',
      headlinePt: 'LIMPEZA PROFISSIONAL $120',
      headlineEn: 'PROFESSIONAL CLEANING $120',
      captionPt: 'Atendimento com pontualidade e excelência em Framingham e região. Faça seu agendamento! 📲',
      captionEn: 'Reliable, high-quality house cleaning in Framingham. Book your appointment today! 📲',
      tagsPt: '#housecleaning #framingham #faxinageral',
      tagsEn: '#cleaningservice #framingham #maidservice',
    },
  ],
}

interface CreatePostContextType {
  state: CreatePostState
  updateState: (updates: Partial<CreatePostState>) => void
  resetFlow: () => void
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined)

export function CreatePostProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CreatePostState>(defaultState)

  // Carrega configurações da marca salvas no navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zapost_brand_profile')
        if (saved) {
          const parsed = JSON.parse(saved) as BrandProfile
          setState((prev) => ({
            ...prev,
            businessName: parsed.name || prev.businessName,
            phone: parsed.phone || prev.phone,
            brandColor: (parsed.colors && parsed.colors[0]) || prev.brandColor,
            brandProfile: {
              name: parsed.name || 'Bella Clean',
              handle: parsed.handle || '@bellaclean.ma',
              phone: parsed.phone || '+1 (508) 555-0142',
              city: parsed.city || 'Framingham',
              state: parsed.state || 'MA',
              colors: parsed.colors || ['#0F2E2A', '#2F6F5E', '#FFB300'],
            },
          }))
        }
      } catch (err) {
        console.warn('Erro ao carregar zapost_brand_profile:', err)
      }
    }
  }, [])

  const updateState = (updates: Partial<CreatePostState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates }
      if (typeof window !== 'undefined' && updates.brandProfile) {
        try {
          localStorage.setItem('zapost_brand_profile', JSON.stringify(updates.brandProfile))
        } catch {}
      }
      return next
    })
  }

  const resetFlow = () => {
    setState((prev) => ({
      ...prev,
      objective: 'promocao',
      photoUrl: '/sample-sala.jpg',
      rawInput: '',
      price: '120',
      deadline: 'esta_semana',
      selectedTemplate: 'bold-price',
    }))
  }

  return (
    <CreatePostContext.Provider value={{ state, updateState, resetFlow }}>
      {children}
    </CreatePostContext.Provider>
  )
}

export function useCreatePost() {
  const context = useContext(CreatePostContext)
  if (!context) {
    throw new Error('useCreatePost deve ser usado dentro de um CreatePostProvider')
  }
  return context
}
