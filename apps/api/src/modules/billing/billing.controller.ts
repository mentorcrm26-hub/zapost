import { Controller, Post, Get, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common'
import { StripeService, PLANS, TOPUP_PACKS } from './stripe.service.js'

@Controller('billing')
export class BillingController {
  constructor(private stripeService: StripeService) {}

  @Get('plans')
  getPlans() {
    return {
      plans: Object.values(PLANS),
      topups: TOPUP_PACKS,
      trialDetails: {
        freeCredits: 5,
        noCardRequired: true,
        expires: 'never_by_time_only_by_quantity',
      },
    }
  }

  @Post('checkout-session')
  async createCheckoutSession(
    @Body()
    body: {
      tenantId: string
      tenantName: string
      customerEmail?: string
      planId?: 'starter' | 'pro' | 'agency'
      topupPackId?: string
      interval?: 'month' | 'year'
      successUrl: string
      cancelUrl: string
      gclid?: string
    }
  ) {
    return this.stripeService.createCheckoutSession(body)
  }

  @Post('customer-portal')
  async createCustomerPortalSession(
    @Body()
    body: {
      stripeCustomerId: string
      returnUrl: string
    }
  ) {
    return this.stripeService.createCustomerPortalSession(body)
  }

  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string
  ) {
    return this.stripeService.handleWebhookEvent(body)
  }
}
