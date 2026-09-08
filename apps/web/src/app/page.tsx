'use client'

import React from 'react'
import Link from 'next/link'
import { Plus, Download, Share2, Sparkles } from 'lucide-react'
import { useCreatePost } from '@/context/CreatePostContext'

export default function MeusPostsPage() {
  const { state, resetFlow } = useCreatePost()

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
    <div className="flex flex-col gap-5 pb-6">
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

      {/* Título da Seção */}
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
          <span>🖼️ Seus Criativos Recentes</span>
        </h2>
        <span className="text-xs text-zinc-400">{pastPosts.length} posts salvos</span>
      </div>

      {/* Grid de Posts Anteriores */}
      <div className="flex flex-col gap-4">
        {pastPosts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5 flex gap-3.5 items-center shadow-md hover:border-emerald-500/40 transition-colors"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-20 h-24 object-cover rounded-xl border border-white/10 shrink-0 bg-black"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  {post.objective}
                </span>
                <span className="text-[11px] text-zinc-400">{post.date}</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-100 truncate">{post.title}</h3>
              <p className="text-xs text-zinc-400 truncate mb-2">
                {post.channels.join(' • ')}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/criar/prontinho"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 touch-target min-h-[36px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </Link>
                <button
                  onClick={() => alert('Legenda copiada!')}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 touch-target min-h-[36px]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Legenda</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
