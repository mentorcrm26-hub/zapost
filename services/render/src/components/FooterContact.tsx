import React from 'react'
import type { BrandKit } from '@zapost/contracts'
import { isDarkColor } from '../text-fit.js'

export interface FooterContactProps {
  brandKit: BrandKit
  variant?: 'dark' | 'light' | 'client' | undefined
  clientBgColor?: string | undefined
}

export function FooterContact({ brandKit, variant = 'dark', clientBgColor }: FooterContactProps) {
  const { handle, phone, signature } = brandKit

  if (!handle && !phone && !signature) {
    return null
  }

  let textColor = '#FFFFFF'
  let subColor = 'rgba(255, 255, 255, 0.8)'
  let bgColor = 'rgba(0, 0, 0, 0.45)'
  let borderColor = 'rgba(255, 255, 255, 0.15)'

  if (variant === 'light') {
    textColor = '#0F2E2A'
    subColor = 'rgba(15, 46, 42, 0.8)'
    bgColor = 'rgba(255, 255, 255, 0.9)'
    borderColor = 'rgba(15, 46, 42, 0.1)'
  } else if (variant === 'client' && clientBgColor) {
    const dark = isDarkColor(clientBgColor)
    textColor = dark ? '#FFFFFF' : '#0F2E2A'
    subColor = dark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 46, 42, 0.85)'
    bgColor = dark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)'
    borderColor = dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '16px 28px',
        backgroundColor: bgColor,
        borderRadius: '20px',
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Assinatura ou Handle à esquerda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {signature && (
          <span
            style={{
              fontSize: '26px',
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '0.5px',
            }}
          >
            {signature}
          </span>
        )}
        {handle && (
          <span
            style={{
              fontSize: '22px',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 600,
              color: subColor,
            }}
          >
            {handle}
          </span>
        )}
      </div>

      {/* Telefone / WhatsApp à direita */}
      {phone && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              backgroundColor: '#25D366', // Indicador verde de contato ativo
            }}
          />
          <span
            style={{
              fontSize: '24px',
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '0.5px',
            }}
          >
            {phone}
          </span>
        </div>
      )}
    </div>
  )
}
