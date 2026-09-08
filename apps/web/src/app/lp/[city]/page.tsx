import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Sparkles, Check, ArrowRight, MessageCircle, Star, ShieldCheck } from 'lucide-react'

interface CityConfig {
  name: string
  state: string
  regionName: string
  neighboringCities: string[]
  topSegments: string[]
  testimonialName: string
  testimonialBusiness: string
  testimonialText: string
}

const CITIES: Record<string, CityConfig> = {
  boston: {
    name: 'Boston & Framingham',
    state: 'MA',
    regionName: 'Grande Boston e MetroWest',
    neighboringCities: ['Framingham', 'Somerville', 'Everett', 'Marlborough', 'Malden'],
    topSegments: ['House Cleaning Residencial', 'Pintura & Drywall', 'Estética & Unhas', 'Catering de Salgados'],
    testimonialName: 'Luciana Santos',
    testimonialBusiness: 'Bella House Cleaning em Framingham, MA',
    testimonialText: 'Eu não tinha tempo de ficar mexendo em Canva depois de faxinar o dia todo. Com o ZaPost, mando um áudio no Zap e em 1 minuto tenho o post em inglês e português pronto!',
  },
  orlando: {
    name: 'Orlando & Kissimmee',
    state: 'FL',
    regionName: 'Flórida Central',
    neighboringCities: ['Kissimmee', 'MetroWest', 'Windermere', 'Winter Garden', 'Dr. Phillips'],
    topSegments: ['Limpeza de Casas de Férias', 'Aluguel de Carros & Transporte', 'Comida Brasileira & Doces', 'Barbearia'],
    testimonialName: 'Rodrigo Medeiros',
    testimonialBusiness: 'Florida Pro Detailing em Kissimmee, FL',
    testimonialText: 'Postar em inglês era meu maior desafio para pegar clientes americanos que pagam melhor. O ZaPost traduz com os termos que eles realmente usam aqui em Orlando.',
  },
  newark: {
    name: 'Newark & Ironbound',
    state: 'NJ',
    regionName: 'New Jersey / Metro NY',
    neighboringCities: ['Ironbound', 'Kearny', 'Harrison', 'Elizabeth', 'Union'],
    topSegments: ['Construção & Framing', 'Salão de Beleza & Cabelo', 'Pizzaria & Delivery', 'Fretes & Mudanças'],
    testimonialName: 'Carlos Oliveira',
    testimonialBusiness: 'Ironbound Drywall & Framing em Newark, NJ',
    testimonialText: 'Muito prático. Tiro foto da obra terminada na sexta-feira, falo no áudio e na hora sai o post para o Instagram e Facebook. Fechei 3 orçamentos na primeira semana.',
  },
  danbury: {
    name: 'Danbury & Bridgeport',
    state: 'CT',
    regionName: 'Fairfield County',
    neighboringCities: ['Danbury', 'Bridgeport', 'Hartford', 'Waterbury', 'Stamford'],
    topSegments: ['Limpeza de Carpete & Sofá', 'Lawn Care & Jardinagem', 'Marmitas Fitness', 'Auto Mecânica'],
    testimonialName: 'Juliana Paiva',
    testimonialBusiness: 'JP Clean Care em Danbury, CT',
    testimonialText: 'A melhor parte é que não tem enrolação. Não preciso de cartão para testar e os posts têm uma qualidade profissional que dá credibilidade.',
  },
  marietta: {
    name: 'Marietta & Atlanta',
    state: 'GA',
    regionName: 'Cobb County & Grande Atlanta',
    neighboringCities: ['Marietta', 'Alpharetta', 'Roswell', 'Kennesaw', 'Smyrna'],
    topSegments: ['Instalação de Pisos & Tile', 'Limpeza Comercial', 'Doceria Brasileira', 'Estética Avançada'],
    testimonialName: 'Fabio Guimarães',
    testimonialBusiness: 'Atlanta Tile & Remodeling em Marietta, GA',
    testimonialText: 'Economizo pelo menos 5 horas por semana que eu perdia tentando criar arte. Recomendo para todo brasileiro que empreende aqui na Geórgia.',
  },
}

export function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }))
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const city = CITIES[params.city.toLowerCase()]
  if (!city) return { title: 'ZaPost — Marketing Digital nos EUA' }

  return {
    title: `Marketing Digital para Brasileiros em ${city.name}, ${city.state} — ZaPost`,
    description: `Crie posts profissionais para seu negócio de limpeza, construção, comida ou estética em ${city.name} em 1 minuto. Português e Inglês no WhatsApp.`,
  }
}

export default function LocalLandingPage({ params }: { params: { city: string } }) {
  const city = CITIES[params.city.toLowerCase()]
  if (!city) notFound()

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Local Hero */}
      <div className="bg-gradient-to-br from-[#0F2E2A] via-zinc-950 to-zinc-950 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-xs font-mono">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{city.regionName} • {city.state}</span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          Marketing Digital no WhatsApp para Brasileiros em {city.name}
        </h1>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
          Manda a foto do seu trabalho e fala o que quer. Sai pronto em <strong>Português 🇧🇷</strong> e <strong>Inglês 🇺🇸</strong> para atrair clientes locais em {city.neighboringCities.slice(0, 3).join(', ')}.
        </p>

        <div className="pt-2">
          <Link
            href="/criar/objetivo"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 touch-target min-h-[56px] transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Criar Meu 1º Post Grátis Agora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-zinc-400 mt-2 font-mono">
            ⚡ 5 criativos grátis • Sem pedir cartão de crédito
          </p>
        </div>
      </div>

      {/* Segmentos Atendidos na Região */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>💼 Os negócios que mais crescem em {city.name}</span>
        </h2>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {city.topSegments.map((seg, i) => (
            <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-xs text-zinc-200 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{seg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Depoimento Local */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <p className="text-xs text-zinc-200 italic leading-relaxed">
          &quot;{city.testimonialText}&quot;
        </p>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-white">{city.testimonialName}</p>
            <p className="text-[11px] text-zinc-400">{city.testimonialBusiness}</p>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
            Cliente Verificado
          </span>
        </div>
      </div>

      {/* Outras Cidades */}
      <div className="text-center pt-2">
        <p className="text-xs text-zinc-400 mb-2">Também atendemos outras comunidades:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(CITIES).map(([slug, c]) => (
            <Link
              key={slug}
              href={`/lp/${slug}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                slug === params.city.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                  : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-white/20'
              }`}
            >
              {c.name} ({c.state})
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
