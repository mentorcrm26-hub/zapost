import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { CreditsService } from './credits.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('credits')
@UseGuards(AuthGuard, TenantGuard)
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  @Get('balance')
  async getBalance(@Req() req: any) {
    const tenantId = req.user.tenantId
    const balance = await this.creditsService.getBalance(tenantId)
    return { tenantId, balance }
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const tenantId = req.user.tenantId
    const history = await this.creditsService.getHistory(tenantId)
    return { tenantId, history }
  }

  @Post('add')
  async addCredits(@Req() req: any, @Body() body: { delta: number; reason: string }) {
    const tenantId = req.user.tenantId
    const result = await this.creditsService.appendTransaction({
      tenantId,
      delta: Math.abs(body.delta || 10),
      reason: body.reason || 'Recarga de créditos',
    })
    return result
  }
}
