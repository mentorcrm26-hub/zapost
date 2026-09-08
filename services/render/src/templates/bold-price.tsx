import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { PriceBadge } from '../components/PriceBadge.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'bold-price',
  name: 'Preço Gigante',
  description: 'Preço gigante centralizado, foto ao fundo escurecida com overlay e gradiente, headline de alto impacto.',
  maxHeadlineLength: 50,
  maxSubheadlineLength: 80,
  maxPriceLabelLength: 25,
  maxCtaLength: 35,
  requiresPhoto: true,
  logoPlacement: 'top-left',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function BoldPriceTemplate({ job, width, height, photoDataUri }: TemplateProps) {
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
      {/* Foto de fundo */}
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

      {/* Overlay escuro com vinheta para garantir contraste máximo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'rgba(8, 24, 21, 0.78)',
        }}
      />

      {/* Gradiente adicional vertical */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `linear-gradient(180deg, rgba(8, 24, 21, 0.85) 0%, rgba(8, 24, 21, 0.45) 45%, rgba(8, 24, 21, 0.95) 100%)`,
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
          padding: isStory ? '90px 60px 80px 60px' : '70px 60px 60px 60px',
        }}
      >
        {/* Topo: Tag de Marca / Header */}
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
                {brandKit.signature}
              </span>
            </div>
          )}
        </div>

        {/* Centro: Headline, Preço Gigante e Subheadline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isStory ? '36px' : '28px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Headline */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <h1
              style={{
                fontSize: `${headlineSize}px`,
                fontFamily: 'Outfit',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.12,
                letterSpacing: '-0.5px',
                textAlign: 'center',
                margin: 0,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
            >
              {content.headline}
            </h1>
          </div>

          {/* Preço Gigante */}
          {content.priceLabel && (
            <PriceBadge
              priceLabel={content.priceLabel}
              primaryColor={primaryColor}
              accentColor={accentColor}
              variant="giant"
            />
          )}

          {/* Subheadline */}
          {content.subheadline && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '900px',
              }}
            >
              <p
                style={{
                  fontSize: `${subheadlineSize}px`,
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.35,
                  textAlign: 'center',
                  margin: 0,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                }}
              >
                {content.subheadline}
              </p>
            </div>
          )}
        </div>

        {/* Base: CTA e Contato */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            width: '100%',
          }}
        >
          {/* Botão de CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: ctaBg,
              borderRadius: '24px',
              padding: isStory ? '22px 56px' : '18px 48px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              width: '100%',
              maxWidth: '680px',
            }}
          >
            <span
              style={{
                fontSize: isStory ? '32px' : '28px',
                fontFamily: 'Outfit',
                fontWeight: 800,
                color: ctaTextColor,
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}
            >
              {content.cta} →
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

export const boldPriceTemplate: TemplateDefinition = {
  rules,
  render: (props) => <BoldPriceTemplate {...props} />,
}
