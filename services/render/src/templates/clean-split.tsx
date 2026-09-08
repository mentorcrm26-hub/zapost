import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { PriceBadge } from '../components/PriceBadge.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor, isDarkColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'clean-split',
  name: 'Divisão Limpa (Clean Split)',
  description: 'Metade foto com enquadramento perfeito, metade bloco sólido na cor da marca do cliente.',
  maxHeadlineLength: 60,
  maxSubheadlineLength: 90,
  maxPriceLabelLength: 30,
  maxCtaLength: 35,
  requiresPhoto: true,
  logoPlacement: 'header',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function CleanSplitTemplate({ job, width, height, photoDataUri }: TemplateProps) {
  const { content, brandKit, watermark, format } = job
  const isStory = format === 'story_916'

  const primaryColor = brandKit.colors[0] || '#2F6F5E'
  const accentColor = brandKit.colors[1] || '#FFB300'
  const darkColor = brandKit.colors[2] || '#0F2E2A'

  const isBrandDark = isDarkColor(primaryColor)
  const textColor = isBrandDark ? '#FFFFFF' : '#0F2E2A'
  const subtextColor = isBrandDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 46, 42, 0.85)'

  const headlineSize = calculateHeadlineSize(content.headline, isStory)
  const subheadlineSize = calculateSubheadlineSize(content.subheadline || '', isStory)

  const ctaBg = accentColor
  const ctaTextColor = getContrastTextColor(ctaBg)

  // Altura da divisão de foto e conteúdo
  const photoHeight = isStory ? 1040 : 700

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        backgroundColor: primaryColor,
        overflow: 'hidden',
      }}
    >
      {/* Metade Superior: Foto */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${photoHeight}px`,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#0F2E2A',
        }}
      >
        {photoDataUri && (
          <img
            src={photoDataUri}
            alt="Foto ilustrativa"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Tag de Assinatura sobre a foto */}
        {brandKit.signature && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              backgroundColor: 'rgba(8, 24, 21, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '999px',
              padding: '10px 24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              display: 'flex',
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

        {/* Tag de Preço no canto da foto */}
        {content.priceLabel && (
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              display: 'flex',
            }}
          >
            <PriceBadge
              priceLabel={content.priceLabel}
              primaryColor={primaryColor}
              accentColor={accentColor}
              variant="badge"
            />
          </div>
        )}
      </div>

      {/* Metade Inferior: Bloco de Conteúdo Sólido na Cor da Marca */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isStory ? '60px 60px 70px 60px' : '50px 60px 50px 60px',
          backgroundColor: primaryColor,
        }}
      >
        {/* Bloco de Texto (Headline + Subheadline) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h1
            style={{
              fontSize: `${headlineSize}px`,
              fontFamily: 'Outfit',
              fontWeight: 800,
              color: textColor,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              margin: 0,
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
                color: subtextColor,
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              {content.subheadline}
            </p>
          )}
        </div>

        {/* Bloco de Ação: CTA e Contato */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
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
              borderRadius: '20px',
              padding: isStory ? '20px 40px' : '16px 36px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              width: '100%',
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

          {/* Rodapé de Contato */}
          <FooterContact
            brandKit={brandKit}
            variant="client"
            clientBgColor={primaryColor}
          />
        </div>
      </div>

      {/* Marca d'água ZaPost */}
      <Watermark show={watermark} width={width} height={height} />
    </div>
  )
}

export const cleanSplitTemplate: TemplateDefinition = {
  rules,
  render: (props) => <CleanSplitTemplate {...props} />,
}
