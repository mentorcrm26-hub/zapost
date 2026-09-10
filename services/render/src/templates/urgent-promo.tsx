import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'urgent-promo',
  name: 'Urgência & Flash Promo',
  description: 'Faixa de alerta de urgência, vagas limitadas e alto contraste para fechamento imediato.',
  maxHeadlineLength: 55,
  maxSubheadlineLength: 85,
  maxPriceLabelLength: 25,
  maxCtaLength: 35,
  requiresPhoto: true,
  logoPlacement: 'top-left',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function UrgentPromoTemplate({ job, width, height, photoDataUri }: TemplateProps) {
  const { content, brandKit, watermark, format } = job
  const isStory = format === 'story_916'

  const accentColor = brandKit.colors[1] || '#FFB300'
  const darkColor = brandKit.colors[2] || '#0F2E2A'

  const headlineSize = calculateHeadlineSize(content.headline, isStory)
  const subheadlineSize = calculateSubheadlineSize(content.subheadline || '', isStory)

  const ctaBg = '#10B981'
  const ctaTextColor = getContrastTextColor(ctaBg)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        backgroundColor: darkColor,
        overflow: 'hidden',
      }}
    >
      {/* Foto de Fundo */}
      {photoDataUri && (
        <img
          src={photoDataUri}
          alt="Foto do serviço"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${width}px`,
            height: `${height}px`,
            objectFit: 'cover',
          }}
        />
      )}

      {/* Gradiente Escuro Agressivo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.65) 30%, rgba(15, 23, 42, 0.92) 70%, rgba(2, 6, 23, 0.98) 100%)`,
        }}
      />

      {/* Faixa Superior de Urgência */}
      <div
        style={{
          position: 'absolute',
          top: isStory ? '60px' : '24px',
          left: 0,
          right: 0,
          backgroundColor: '#DC2626',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.5)',
        }}
      >
        <span
          style={{
            fontSize: '24px',
            fontFamily: 'Outfit',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          🔥 {content.subheadline || 'ÚLTIMAS VAGAS • SOMENTE ESSA SEMANA'} 🔥
        </span>
      </div>

      {/* Conteúdo Principal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: isStory ? '160px 50px 70px 50px' : '110px 50px 50px 50px',
        }}
      >
        {/* Topo: Nome da Marca */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {brandKit.signature && (
            <span
              style={{
                fontSize: '22px',
                fontFamily: 'Outfit',
                fontWeight: 700,
                color: '#E2E8F0',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {brandKit.signature}
            </span>
          )}
        </div>

        {/* Centro: Headline e Mega Badge de Preço */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isStory ? '32px' : '24px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <h1
            style={{
              fontSize: `${Math.min(headlineSize, 52)}px`,
              fontFamily: 'Outfit',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.12,
              letterSpacing: '-0.5px',
              margin: 0,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
            }}
          >
            {content.headline}
          </h1>

          {/* Mega Preço de Urgência */}
          {content.priceLabel && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F59E0B',
                borderRadius: '28px',
                padding: isStory ? '18px 56px' : '14px 44px',
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)',
              }}
            >
              <span
                style={{
                  fontSize: isStory ? '76px' : '64px',
                  fontFamily: 'Outfit',
                  fontWeight: 900,
                  color: '#0F172A',
                }}
              >
                {content.priceLabel}
              </span>
            </div>
          )}
        </div>

        {/* Base: CTA e Contato */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: ctaBg,
              border: '4px solid #34D399',
              borderRadius: '28px',
              padding: isStory ? '22px 48px' : '18px 40px',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
              width: '100%',
              maxWidth: '720px',
            }}
          >
            <span
              style={{
                fontSize: isStory ? '32px' : '28px',
                fontFamily: 'Outfit',
                fontWeight: 900,
                color: ctaTextColor,
                letterSpacing: '0.5px',
              }}
            >
              ⚡ {content.cta} 📲
            </span>
          </div>

          <FooterContact brandKit={brandKit} variant="dark" />
        </div>
      </div>

      <Watermark show={watermark} width={width} height={height} />
    </div>
  )
}

export const urgentPromoTemplate: TemplateDefinition = {
  rules,
  render: (props) => <UrgentPromoTemplate {...props} />,
}
