import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common'
import { TenantsService } from './tenants.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('tenants')
@UseGuards(AuthGuard, TenantGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get('me')
  async getMyTenant(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.tenantsService.getSummary(tenantId)
  }

  @Patch('me')
  async updateMyTenant(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.tenantsService.update(tenantId, body)
  }
}
