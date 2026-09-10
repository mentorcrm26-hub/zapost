import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'proof-card',
  name: 'Prova Social & 5 Estrelas',
  description: 'Destaque de avaliação 5 estrelas, selo de garantia de satisfação e credibilidade para fechar clientes.',
  maxHeadlineLength: 55,
  maxSubheadlineLength: 85,
  maxPriceLabelLength: 25,
  maxCtaLength: 35,
  requiresPhoto: true,
  logoPlacement: 'top-left',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function ProofCardTemplate({ job, width, height, photoDataUri }: TemplateProps) {
  const { content, brandKit, watermark, format } = job
  const isStory = format === 'story_916'

  const primaryColor = brandKit.colors[0] || '#2F6F5E'
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
          alt="Foto do trabalho"
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

      {/* Overlay Escuro com Gradiente */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `linear-gradient(180deg, rgba(8, 24, 21, 0.90) 0%, rgba(11, 15, 23, 0.70) 35%, rgba(11, 15, 23, 0.92) 75%, rgba(8, 24, 21, 0.98) 100%)`,
        }}
      />

      {/* Conteúdo Principal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: isStory ? '80px 50px 70px 50px' : '60px 50px 50px 50px',
        }}
      >
        {/* Topo: Nome da Marca */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {brandKit.signature && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '999px',
                padding: '8px 24px',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                ✨ {brandKit.signature} ✨
              </span>
            </div>
          )}
        </div>

        {/* Card Central de Prova Social */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '36px',
            padding: isStory ? '50px 40px' : '40px 36px',
            gap: isStory ? '24px' : '18px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Estrelas */}
          <span
            style={{
              fontSize: '44px',
              color: '#FBBF24',
              letterSpacing: '4px',
            }}
          >
            ★★★★★
          </span>

          <span
            style={{
              fontSize: '18px',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 700,
              color: '#94A3B8',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            AVALIAÇÃO 5.0 • 100% SATISFAÇÃO
          </span>

          {/* Headline */}
          <h1
            style={{
              fontSize: `${Math.min(headlineSize, 48)}px`,
              fontFamily: 'Outfit',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            “{content.headline}”
          </h1>

          {/* Preço se houver */}
          {content.priceLabel && (
            <span
              style={{
                fontSize: isStory ? '56px' : '48px',
                fontFamily: 'Outfit',
                fontWeight: 900,
                color: accentColor,
              }}
            >
              {content.priceLabel}
            </span>
          )}

          {/* Subheadline / Garantia */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '999px',
              padding: '8px 20px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 700,
                color: '#34D399',
              }}
            >
              🛡️ {content.subheadline || 'Garantia de Excelência & Pontualidade'}
            </span>
          </div>
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
              borderRadius: '24px',
              padding: isStory ? '20px 48px' : '16px 40px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              width: '100%',
              maxWidth: '680px',
            }}
          >
            <span
              style={{
                fontSize: isStory ? '30px' : '26px',
                fontFamily: 'Outfit',
                fontWeight: 800,
                color: ctaTextColor,
                letterSpacing: '0.5px',
              }}
            >
              {content.cta} →
            </span>
          </div>

          <FooterContact brandKit={brandKit} variant="dark" />
        </div>
      </div>

      <Watermark show={watermark} width={width} height={height} />
    </div>
  )
}

export const proofCardTemplate: TemplateDefinition = {
  rules,
  render: (props) => <ProofCardTemplate {...props} />,
}
