import { Module } from '@nestjs/common'
import { BillingController } from './billing.controller.js'
import { StripeService } from './stripe.service.js'
import { CreditsModule } from '../credits/credits.module.js'
import { ConversionService } from '../attribution/conversion.service.js'

@Module({
  imports: [CreditsModule],
  controllers: [BillingController],
  providers: [StripeService, ConversionService],
  exports: [StripeService, ConversionService],
})
export class BillingModule {}
