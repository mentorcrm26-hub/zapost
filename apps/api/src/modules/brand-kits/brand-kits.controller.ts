import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common'
import { BrandKitsService } from './brand-kits.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('brand-kits')
@UseGuards(AuthGuard, TenantGuard)
export class BrandKitsController {
  constructor(private brandKitsService: BrandKitsService) {}

  @Get('me')
  async getMyBrandKit(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.brandKitsService.findByTenantId(tenantId)
  }

  @Put('me')
  async updateMyBrandKit(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.brandKitsService.upsert(tenantId, body)
  }
}
