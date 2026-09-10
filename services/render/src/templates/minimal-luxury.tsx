import React from 'react'
import type { TemplateDefinition, TemplateRules, TemplateProps } from '../types.js'
import { Watermark } from '../components/Watermark.js'
import { FooterContact } from '../components/FooterContact.js'
import { calculateHeadlineSize, calculateSubheadlineSize, getContrastTextColor } from '../text-fit.js'

export const rules: TemplateRules = {
  id: 'minimal-luxury',
  name: 'Minimalista Luxo (Editorial)',
  description: 'Design editorial refinado com moldura fina, tipografia nobre e visual sofisticado para serviços de alto padrão.',
  maxHeadlineLength: 50,
  maxSubheadlineLength: 80,
  maxPriceLabelLength: 25,
  maxCtaLength: 35,
  requiresPhoto: true,
  logoPlacement: 'header',
  supportedFormats: ['feed_45', 'story_916', 'square_11', 'carousel_45'],
}

export function MinimalLuxuryTemplate({ job, width, height, photoDataUri }: TemplateProps) {
  const { content, brandKit, watermark, format } = job
  const isStory = format === 'story_916'

  const goldColor = '#D4AF37'
  const darkBg = '#08080A'

  const headlineSize = calculateHeadlineSize(content.headline, isStory)
  const subheadlineSize = calculateSubheadlineSize(content.subheadline || '', isStory)

  const photoSize = isStory ? 580 : 460

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        backgroundColor: darkBg,
        overflow: 'hidden',
        padding: isStory ? '60px 50px' : '50px 45px',
      }}
    >
      {/* Moldura Externa Dourada */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: '2px solid rgba(212, 175, 55, 0.45)',
          pointerEvents: 'none',
        }}
      />

      {/* Topo Editorial */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        {brandKit.signature && (
          <span
            style={{
              fontSize: '22px',
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: goldColor,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            — {brandKit.signature} —
          </span>
        )}

        <span
          style={{
            fontSize: '15px',
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.75)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          SERVIÇO PREMIUM & EXCLUSIVO
        </span>
      </div>

      {/* Foto Central em Moldura Refinada */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            borderRadius: '28px',
            border: `2px solid ${goldColor}`,
            overflow: 'hidden',
            display: 'flex',
            position: 'relative',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7)',
          }}
        >
          {photoDataUri && (
            <img
              src={photoDataUri}
              alt="Foto editorial"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      </div>

      {/* Conteúdo Inferior: Headline + Preço */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: `${Math.min(headlineSize, 44)}px`,
            fontFamily: 'Outfit',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {content.headline}
        </h1>

        {content.priceLabel && (
          <span
            style={{
              fontSize: isStory ? '52px' : '44px',
              fontFamily: 'Outfit',
              fontWeight: 900,
              color: goldColor,
            }}
          >
            {content.priceLabel}
          </span>
        )}

        {/* CTA Minimalista */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${goldColor}`,
            borderRadius: '999px',
            padding: '12px 36px',
            marginTop: '8px',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: goldColor,
              letterSpacing: '1px',
            }}
          >
            {content.cta}
          </span>
        </div>
      </div>

      {/* Rodapé */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <FooterContact brandKit={brandKit} variant="dark" />
      </div>

      <Watermark show={watermark} width={width} height={height} />
    </div>
  )
}

export const minimalLuxuryTemplate: TemplateDefinition = {
  rules,
  render: (props) => <MinimalLuxuryTemplate {...props} />,
}
