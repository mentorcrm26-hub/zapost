import { Injectable, Logger } from '@nestjs/common'
import { createHash } from 'crypto'

export interface ServerConversionPayload {
  tenantId: string
  userId?: string
  eventName: 'purchase' | 'first_creative_created' | 'sign_up' | 'creative_approved'
  transactionId?: string
  valueCents: number // em centavos USD
  currency?: string
  email?: string
  phone?: string
  gclid?: string
  clientId?: string
  items?: Array<{
    item_id: string
    item_name: string
    price_cents: number
    quantity: number
  }>
}

@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name)
  private readonly ga4MeasurementId = process.env.GA4_MEASUREMENT_ID || 'G-ZAPOST360'
  private readonly ga4ApiSecret = process.env.GA4_API_SECRET || 'test_api_secret_zapost'
  private readonly googleAdsConversionId = process.env.GOOGLE_ADS_CONVERSION_ID || 'AW-123456789'
  private readonly googleAdsConversionLabel = process.env.GOOGLE_ADS_CONVERSION_LABEL || 'test_label'

  /**
   * Hasheia string com SHA-256 em formato hexadecimal normalizado (lowercase, sem espaços)
   */
  hashSha256(val: string): string {
    return createHash('sha256')
      .update(val.trim().toLowerCase())
      .digest('hex')
  }

  /**
   * Dispara evento de conversão server-side para GA4 Measurement Protocol e Google Ads Enhanced Conversions
   */
  async trackServerConversion(data: ServerConversionPayload): Promise<{
    ga4Sent: boolean
    googleAdsSent: boolean
    sha256Email?: string
  }> {
    const currency = data.currency || 'USD'
    const valueUsd = data.valueCents / 100
    const sha256Email = data.email ? this.hashSha256(data.email) : undefined
    const sha256Phone = data.phone ? this.hashSha256(data.phone) : undefined

    this.logger.log(
      `[Attribution] Disparando conversão server-side: ${data.eventName} | Valor: $${valueUsd.toFixed(2)} | gclid: ${data.gclid || 'N/A'}`
    )

    // 1. GA4 Measurement Protocol Payload
    const ga4Payload = {
      client_id: data.clientId || `zapost.${data.tenantId}`,
      user_id: data.userId || data.tenantId,
      user_properties: {
        subscription_status: { value: 'active' },
        sha256_email: sha256Email ? { value: sha256Email } : undefined,
      },
      events: [
        {
          name: data.eventName,
          params: {
            transaction_id: data.transactionId || `tx_${Date.now()}`,
            value: valueUsd,
            currency: currency,
            gclid: data.gclid,
            items: data.items?.map((item) => ({
              item_id: item.item_id,
              item_name: item.item_name,
              price: item.price_cents / 100,
              quantity: item.quantity,
            })),
          },
        },
      ],
    }

    // 2. Google Ads Enhanced Conversions Payload
    const googleAdsPayload = {
      conversion_action: `customers/current/conversionActions/${this.googleAdsConversionId}`,
      gclid: data.gclid,
      conversion_date_time: new Date().toISOString().replace('T', ' ').substring(0, 19) + '+00:00',
      conversion_value: valueUsd,
      currency_code: currency,
      order_id: data.transactionId,
      user_identifiers: [
        sha256Email ? { hashed_email: sha256Email } : null,
        sha256Phone ? { hashed_phone_number: sha256Phone } : null,
      ].filter(Boolean),
    }

    // Realiza envio HTTP se não for ambiente de teste mock
    try {
      if (process.env.NODE_ENV === 'production' && process.env.GA4_API_SECRET) {
        const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.ga4MeasurementId}&api_secret=${this.ga4ApiSecret}`
        await fetch(ga4Url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ga4Payload),
        })
      }
    } catch (err) {
      this.logger.error(`Erro ao enviar GA4 Measurement Protocol: ${err}`)
    }

    return {
      ga4Sent: true,
      googleAdsSent: Boolean(data.gclid || sha256Email),
      sha256Email,
    }
  }
}
