import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { PriceBadge } from '../components/PriceBadge.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'photo-overlay',
  name: 'Foto Sangrando com Gradiente',
  description: 'Foto em tela cheia com gradiente suave e escuro na base, bloco de texto nítido, preço em badge e CTA evidente.',
  maxHeadlineLength: 64,
  maxSubheadlineLength: 90,
  maxPriceLabelLength: 32,
  maxCtaLength: 40,
  requiresPhoto: true,
  logoPlacement: 'top-right',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function PhotoOverlayTemplate({ job, width, height, photoDataUri }: TemplateProps) {
  const { content, brandKit, watermark, format } = job
  const isStory = format === 'story_916'

  const primaryColor = brandKit.colors[0] || '#2F6F5E'
  const accentColor = brandKit.colors[1] || '#FFB300'
  const darkColor = brandKit.colors[2] || '#0F2E2A'

  const headlineSize = calculateHeadlineSize(content.headline, isStory)
  const subheadlineSize = calculateSubheadlineSize(content.subheadline || '', isStory)

  const ctaBg = accentColor
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
      {/* Foto Sangrando (Full Cover) */}
      {photoDataUri && (
        <img
          src={photoDataUri}
          alt="Foto principal"
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

      {/* Gradiente sutil no topo para a assinatura/logo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: '250px',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 24, 21, 0.65) 0%, rgba(8, 24, 21, 0) 100%)',
        }}
      />

      {/* Gradiente denso na base para garantir leitura perfeita */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${width}px`,
          height: isStory ? '1050px' : '850px',
          backgroundImage: 'linear-gradient(180deg, rgba(8, 24, 21, 0) 0%, rgba(8, 24, 21, 0.72) 30%, rgba(8, 24, 21, 0.96) 75%, rgba(8, 24, 21, 0.99) 100%)',
        }}
      />

      {/* Container de conteúdo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: isStory ? '90px 60px 80px 60px' : '65px 60px 55px 60px',
        }}
      >
        {/* Topo: Assinatura e Badge da Marca */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {brandKit.signature && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(8, 24, 21, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '999px',
                padding: '10px 24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '1px',
                }}
              >
                {brandKit.signature}
              </span>
            </div>
          )}

          {/* Tag de preço no topo se desejar */}
          {content.priceLabel && (
            <PriceBadge
              priceLabel={content.priceLabel}
              primaryColor={primaryColor}
              accentColor={accentColor}
              variant="badge"
            />
          )}
        </div>

        {/* Base: Card de Informações e Chamada */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
          }}
        >
          {/* Bloco de Texto */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h1
              style={{
                fontSize: `${headlineSize}px`,
                fontFamily: 'Outfit',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                margin: 0,
                textShadow: '0 3px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              {content.headline}
            </h1>

            {content.subheadline && (
              <p
                style={{
                  fontSize: `${subheadlineSize}px`,
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.94)',
                  lineHeight: 1.4,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                }}
              >
                {content.subheadline}
              </p>
            )}
          </div>

          {/* Ação / CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: ctaBg,
              borderRadius: '20px',
              padding: isStory ? '20px 36px' : '18px 32px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
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
              {content.cta}
            </span>
            <span
              style={{
                fontSize: isStory ? '30px' : '26px',
                fontFamily: 'Outfit',
                fontWeight: 800,
                color: ctaTextColor,
              }}
            >
              →
            </span>
          </div>

          {/* Rodapé com @ e Telefone */}
          <FooterContact brandKit={brandKit} variant="dark" />
        </div>
      </div>

      {/* Marca d'água ZaPost se aplicável */}
      <Watermark show={watermark} width={width} height={height} />
    </div>
  )
}

export const photoOverlayTemplate: TemplateDefinition = {
  rules,
  render: (props) => <PhotoOverlayTemplate {...props} />,
}
