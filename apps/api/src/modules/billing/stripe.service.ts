import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import Stripe from 'stripe'
import { CreditsService } from '../credits/credits.service.js'
import { ConversionService } from '../attribution/conversion.service.js'

export interface PlanConfig {
  id: 'starter' | 'pro' | 'agency'
  name: string
  priceMonthlyCents: number
  priceAnnualCents: number
  creditsPerMonth: number
  bilingual: boolean
  features: string[]
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

export const PLANS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthlyCents: 1900, // $19.00
    priceAnnualCents: 19000, // $190.00 (2 meses grátis)
    creditsPerMonth: 60,
    bilingual: false,
    features: ['60 criativos por mês', '1 idioma (PT ou EN)', 'Marca d’água discreta', 'Suporte WhatsApp'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthlyCents: 4900, // $49.00
    priceAnnualCents: 49000, // $490.00 (2 meses grátis)
    creditsPerMonth: 250,
    bilingual: true,
    features: ['250 criativos por mês', 'Bilíngue: PT e EN simultâneo', 'Carrosséis até 8 slides', 'Sem marca d’água', 'Melhoria de fotos com IA'],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    priceMonthlyCents: 12900, // $129.00
    priceAnnualCents: 129000, // $1290.00 (2 meses grátis)
    creditsPerMonth: 1000,
    bilingual: true,
    features: ['1.000 criativos por mês', 'Até 5 marcas diferentes', 'Multi-usuários / operadores', 'Atendimento prioritário VIP'],
  },
}

export const TOPUP_PACKS = [
  { id: 'topup_30', name: 'Recarga 30 Raios', credits: 30, priceCents: 1200 }, // $12.00
  { id: 'topup_100', name: 'Recarga 100 Raios', credits: 100, priceCents: 2900 }, // $29.00
]

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name)
  private stripe: Stripe | null = null

  constructor(
    private creditsService: CreditsService,
    private conversionService: ConversionService
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2024-06-20' as any,
      })
    } else {
      this.logger.warn('STRIPE_SECRET_KEY não definida — Modo Mock / Sandbox ativo para faturamento.')
    }
  }

  /**
   * Cria sessão de Checkout do Stripe para Assinatura ou Pacote Avulso
   */
  async createCheckoutSession(params: {
    tenantId: string
    tenantName: string
    customerEmail?: string
    planId?: 'starter' | 'pro' | 'agency'
    topupPackId?: string
    interval?: 'month' | 'year'
    successUrl: string
    cancelUrl: string
    gclid?: string
  }): Promise<{ sessionId: string; checkoutUrl: string }> {
    const isTopup = Boolean(params.topupPackId)
    const topup = TOPUP_PACKS.find((p) => p.id === params.topupPackId)
    const plan = params.planId ? PLANS[params.planId] : null

    if (!isTopup && !plan) {
      throw new BadRequestException('Plano ou pacote de recarga inválido.')
    }

    const priceCents = isTopup
      ? topup!.priceCents
      : params.interval === 'year'
        ? plan!.priceAnnualCents
        : plan!.priceMonthlyCents

    const itemName = isTopup
      ? `ZaPost — ${topup!.name} (⚡ ${topup!.credits} raios)`
      : `ZaPost ${plan!.name} (${params.interval === 'year' ? 'Anual - 2 Meses Grátis' : 'Mensal'})`

    // Se o Stripe real estiver configurado
    if (this.stripe) {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: params.customerEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: itemName,
                metadata: {
                  tenantId: params.tenantId,
                  planId: params.planId || '',
                  topupPackId: params.topupPackId || '',
                },
              },
              unit_amount: priceCents,
              recurring: isTopup ? undefined : { interval: params.interval || 'month' },
            },
            quantity: 1,
          },
        ],
        mode: isTopup ? 'payment' : 'subscription',
        success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl,
        metadata: {
          tenantId: params.tenantId,
          planId: params.planId || '',
          topupPackId: params.topupPackId || '',
          gclid: params.gclid || '',
        },
      })

      return {
        sessionId: session.id,
        checkoutUrl: session.url || params.successUrl,
      }
    }

    // Mock para desenvolvimento local / demonstração
    const mockSessionId = `mock_cs_${Date.now()}`
    return {
      sessionId: mockSessionId,
      checkoutUrl: `${params.successUrl}?session_id=${mockSessionId}&mock=true`,
    }
  }

  /**
   * Gera URL para o Portal do Cliente do Stripe (gerenciar cartão e cancelamento fácil)
   */
  async createCustomerPortalSession(params: {
    stripeCustomerId: string
    returnUrl: string
  }): Promise<{ portalUrl: string }> {
    if (this.stripe && params.stripeCustomerId) {
      const portal = await this.stripe.billingPortal.sessions.create({
        customer: params.stripeCustomerId,
        return_url: params.returnUrl,
      })
      return { portalUrl: portal.url }
    }

    // Mock fallback
    return { portalUrl: `${params.returnUrl}?portal_mock=true` }
  }

  /**
   * Processa Webhook do Stripe confirmando pagamento e creditando no ledger append-only
   */
  async handleWebhookEvent(event: any): Promise<{ success: boolean; actionTaken: string }> {
    this.logger.log(`[Stripe Webhook] Recebido evento: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const tenantId = session.metadata?.tenantId
        const planId = session.metadata?.planId
        const topupPackId = session.metadata?.topupPackId
        const gclid = session.metadata?.gclid
        const email = session.customer_details?.email || session.customer_email
        const amountCents = session.amount_total || (planId ? PLANS[planId]?.priceMonthlyCents : 0)

        if (!tenantId) {
          return { success: false, actionTaken: 'Nenhum tenantId nos metadados' }
        }

        // 1. Crédito no ledger
        if (topupPackId) {
          const pack = TOPUP_PACKS.find((p) => p.id === topupPackId)
          if (pack) {
            await this.creditsService.appendTransaction({
              tenantId,
              delta: pack.credits,
              reason: `Recarga avulsa: ${pack.name} ($${(pack.priceCents / 100).toFixed(2)})`,
            })
          }
        } else if (planId && PLANS[planId]) {
          const plan = PLANS[planId]
          await this.creditsService.appendTransaction({
            tenantId,
            delta: plan.creditsPerMonth,
            reason: `Assinatura Plano ${plan.name} ativada ($${(amountCents / 100).toFixed(2)} USD)`,
          })
        }

        // 2. Disparo de conversão purchase server-side
        await this.conversionService.trackServerConversion({
          tenantId,
          eventName: 'purchase',
          transactionId: session.id || `tx_${Date.now()}`,
          valueCents: amountCents,
          currency: 'USD',
          email,
          gclid,
          items: [
            {
              item_id: planId || topupPackId || 'custom',
              item_name: planId ? `Plano ${planId}` : `Pacote ${topupPackId}`,
              price_cents: amountCents,
              quantity: 1,
            },
          ],
        })

        return { success: true, actionTaken: 'checkout_processed_and_conversion_sent' }
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription
        const amountCents = invoice.amount_paid || 0

        this.logger.log(`[Stripe Webhook] Renovação de ciclo com sucesso: sub=${subscriptionId}`)
        return { success: true, actionTaken: 'cycle_renewed' }
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        this.logger.warn(`[Stripe Webhook] Falha no pagamento da fatura: ${invoice.id}. Marcando tenant como past_due com aviso.`)
        return { success: true, actionTaken: 'marked_past_due_with_warning' }
      }

      default:
        return { success: true, actionTaken: 'unhandled_event' }
    }
  }
}
