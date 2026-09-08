'use client'

/**
 * Utilitário de Atribuição e Rastreamento Client-Side ZaPost
 * - Captura e persistência de gclid e UTMs em cookies de 1ª parte (90 dias)
 * - Consent Mode v2
 * - Disparo de eventos gtag (begin_checkout, creative_approved, whatsapp_link_click)
 */

const COOKIE_EXPIRY_DAYS = 90

export function setCookie(name: string, value: string, days = COOKIE_EXPIRY_DAYS) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`))
  return matches ? decodeURIComponent(matches[1]) : null
}

/**
 * Captura parâmetros de anúncio da URL no 1º toque e persiste em cookies
 */
export function captureUrlAttribution() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')
  const refCode = params.get('ref')

  if (gclid) {
    setCookie('_gclid', gclid)
  }
  if (utmSource) setCookie('_utm_source', utmSource)
  if (utmMedium) setCookie('_utm_medium', utmMedium)
  if (utmCampaign) setCookie('_utm_campaign', utmCampaign)
  if (refCode) setCookie('_referral_code', refCode)
}

/**
 * Retorna os dados de atribuição persistidos para inclusão em formulários de cadastro e checkout
 */
export function getStoredAttribution() {
  return {
    gclid: getCookie('_gclid') || undefined,
    utmSource: getCookie('_utm_source') || undefined,
    utmMedium: getCookie('_utm_medium') || undefined,
    utmCampaign: getCookie('_utm_campaign') || undefined,
    referralCode: getCookie('_referral_code') || undefined,
  }
}

/**
 * Dispara eventos para o Google Tag Manager / GA4 no navegador
 */
export function trackClientEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    ;(window as any).dataLayer.push({
      event: eventName,
      ...params,
    })
  }
}

/**
 * Evento: Começou Checkout
 */
export function trackBeginCheckout(planId: string, valueCents: number) {
  trackClientEvent('begin_checkout', {
    currency: 'USD',
    value: valueCents / 100,
    items: [
      {
        item_id: planId,
        item_name: `Plano ${planId}`,
        price: valueCents / 100,
      },
    ],
  })
}

/**
 * Evento: Criativo Aprovado
 */
export function trackCreativeApproved(creativeId: string, templateId: string, isFirst = false) {
  trackClientEvent('creative_approved', {
    creative_id: creativeId,
    template_id: templateId,
  })

  if (isFirst) {
    trackClientEvent('first_creative_created', {
      creative_id: creativeId,
    })
  }
}

/**
 * Evento: Clique no link do WhatsApp
 */
export function trackWhatsAppClick(source = 'button') {
  trackClientEvent('whatsapp_link_click', {
    source,
  })
}
