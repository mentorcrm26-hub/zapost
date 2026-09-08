import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { AIUsageService } from './ai-usage.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('ai-usage')
@UseGuards(AuthGuard, TenantGuard)
export class AIUsageController {
  constructor(private aiUsageService: AIUsageService) {}

  @Get('summary')
  async getSummary(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.aiUsageService.getSummary(tenantId)
  }
}
