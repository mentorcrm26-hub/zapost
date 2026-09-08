import React from 'react'
import { calculatePriceSize, getContrastTextColor } from '../text-fit.js'

export interface PriceBadgeProps {
  priceLabel: string | null
  primaryColor?: string | undefined
  accentColor?: string | undefined
  variant?: 'giant' | 'badge' | 'ribbon' | undefined
}

export function PriceBadge({
  priceLabel,
  primaryColor = '#2F6F5E',
  accentColor = '#FFB300',
  variant = 'badge',
}: PriceBadgeProps) {
  if (!priceLabel) return null

  if (variant === 'giant') {
    const fontSize = calculatePriceSize(priceLabel, true)
    const textColor = accentColor || '#FFB300'

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 44px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '28px',
          border: `2px solid ${accentColor}`,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: 'Outfit',
            fontWeight: 800,
            color: textColor,
            lineHeight: 1,
            letterSpacing: '-1px',
            textAlign: 'center',
          }}
        >
          {priceLabel}
        </span>
      </div>
    )
  }

  // Variant 'badge' padrão
  const badgeBg = accentColor || '#FFB300'
  const textColor = getContrastTextColor(badgeBg)
  const fontSize = calculatePriceSize(priceLabel, false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 28px',
        backgroundColor: badgeBg,
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      <span
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: 'Outfit',
          fontWeight: 800,
          color: textColor,
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}
      >
        {priceLabel}
      </span>
    </div>
  )
}
