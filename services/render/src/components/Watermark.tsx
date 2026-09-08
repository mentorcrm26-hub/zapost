import React from 'react'

export interface WatermarkProps {
  show: boolean
  width: number
  height: number
}

export function Watermark({ show, width, height }: WatermarkProps) {
  if (!show) return null

  // Padrão de marca d'água elegante e não-intrusiva
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '50px 60px 80px 60px',
        pointerEvents: 'none',
      }}
    >
      {/* Faixa superior sutil */}
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
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(15, 46, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '999px',
            padding: '10px 24px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#FFB300"
            stroke="#FFB300"
            strokeWidth="1"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span
            style={{
              fontSize: '18px',
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: '#FFB300',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            ZaPost • Prévia
          </span>
        </div>
      </div>

      {/* Marca d'água diagonal central translúcida */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          opacity: 0.14,
          transform: 'rotate(-25deg)',
        }}
      >
        <span
          style={{
            fontSize: '88px',
            fontFamily: 'Outfit',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          ZAPOST PRÉVIA
        </span>
      </div>

      {/* Espaçador inferior */}
      <div style={{ height: '20px', width: '100%' }} />
    </div>
  )
}
