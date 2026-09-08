import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common'
import { BusinessProfilesService } from './business-profiles.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('business-profiles')
@UseGuards(AuthGuard, TenantGuard)
export class BusinessProfilesController {
  constructor(private profilesService: BusinessProfilesService) {}

  @Get('me')
  async getMyProfile(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.profilesService.findByTenantId(tenantId)
  }

  @Put('me')
  async updateMyProfile(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.profilesService.upsert(tenantId, body)
  }
}
