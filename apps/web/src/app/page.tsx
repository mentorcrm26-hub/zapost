'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Download, Share2, Sparkles, Zap, ArrowRight, LayoutGrid, Sparkle } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'
import { HeroWithLiveDemo } from '@/components/landing/HeroWithLiveDemo'
import { BilingualShowcase } from '@/components/landing/BilingualShowcase'
import { CanvaComparison } from '@/components/landing/CanvaComparison'
import { PricingSection } from '@/components/landing/PricingSection'
import { LocalSeoLinks } from '@/components/landing/LocalSeoLinks'
import { captureUrlAttribution } from '@/lib/tracking'

export default function HomePage() {
  const { state, resetFlow } = useCreatePost()
  const [activeTab, setActiveTab] = useState<'landing' | 'meus_posts'>('landing')

  useEffect(() => {
    // Captura gclid e UTMs da URL no primeiro toque e grava em cookie de 1ª parte
    captureUrlAttribution()
  }, [])

  const pastPosts = [
    {
      id: 'post-1',
      date: 'Hoje, 14:30',
      objective: '🏷️ Promoção ($120)',
      image: '/out/bold-price_feed_45_pt.png',
      title: 'Faxina Completa $120',
      channels: ['Instagram', 'WhatsApp Status'],
    },
    {
      id: 'post-2',
      date: 'Ontem',
      objective: '✨ Trabalho Feito',
      image: '/out/clean-split_feed_45_pt.png',
      title: 'Antes & Depois Sala',
      channels: ['Instagram'],
    },
    {
      id: 'post-3',
      date: '3 dias atrás',
      objective: '📢 Divulgação',
      image: '/out/photo-overlay_feed_45_pt.png',
      title: 'Bella Clean Framingham',
      channels: ['Instagram', 'Facebook'],
    },
  ]

  return (
    <div className="flex flex-col gap-12 sm:gap-20 pb-16">
      {/* 1. Hero com Try-Before-Signup */}
      <HeroWithLiveDemo />

      {/* 2. Prova Social Bilíngue Lado a Lado */}
      <div id="prova-social">
        <BilingualShowcase />
      </div>

      {/* 3. Quebra da Objeção do Canva */}
      <div id="comparativo">
        <CanvaComparison />
      </div>

      {/* 4. Planos em Dólar (Stripe) */}
      <div id="planos">
        <PricingSection />
      </div>

      {/* 5. Rodapé com SEO Local e Links Legais */}
      <LocalSeoLinks />
    </div>
  )
}
