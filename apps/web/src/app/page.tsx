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
    <div className="flex flex-col gap-8 pb-12">
      {/* Botão de Alternância Superior (Se o usuário quiser ver seus posts existentes) */}
      <div className="flex items-center justify-between bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'landing'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Conhecer o ZaPost</span>
        </button>

        <button
          onClick={() => setActiveTab('meus_posts')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'meus_posts'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Meus Posts Salvos</span>
        </button>
      </div>

      {activeTab === 'landing' ? (
        /* ==================== VISTA 1: LANDING PAGE DE ALTA CONVERSÃO ==================== */
        <div className="space-y-8 animate-fade-in">
          {/* 1. Hero com Try-Before-Signup */}
          <HeroWithLiveDemo />

          {/* 2. Prova Social Bilíngue Lado a Lado */}
          <BilingualShowcase />

          {/* 3. Quebra da Objeção do Canva */}
          <CanvaComparison />

          {/* 4. Planos em Dólar (Stripe) */}
          <PricingSection />

          {/* 5. Rodapé com SEO Local e Links Legais */}
          <LocalSeoLinks />
        </div>
      ) : (
        /* ==================== VISTA 2: MEUS POSTS (GALERIA DO CLIENTE) ==================== */
        <div className="space-y-6 animate-fade-in">
          {/* Botão Gigante de Ação: CRIAR NOVO POST */}
          <Link
            href="/criar/objetivo"
            onClick={resetFlow}
            className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-lg rounded-2xl p-4 shadow-xl flex items-center justify-between touch-target min-h-[68px] active:scale-[0.98] transition-all border border-emerald-400/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                ✨
              </div>
              <div className="text-left">
                <p className="leading-tight text-white font-display text-lg">CRIAR NOVO POST</p>
                <p className="text-xs text-emerald-100 font-normal">Foto + Áudio = Post em 1 min</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white text-emerald-800 flex items-center justify-center font-bold">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
          </Link>

          {/* Lista de Posts Salvos */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300">Posts Recentes</h2>
            <div className="space-y-3">
              {pastPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-14 h-16 object-cover rounded-xl border border-white/10 bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                      {post.objective}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate mt-1">{post.title}</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">{post.date}</p>
                  </div>
                  <a
                    href={post.image}
                    download
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl touch-target min-h-[40px] min-w-[40px] flex items-center justify-center"
                    title="Baixar post"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
