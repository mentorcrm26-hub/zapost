import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common'
import { CreativesService } from './creatives.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('creatives')
@UseGuards(AuthGuard, TenantGuard)
export class CreativesController {
  constructor(private creativesService: CreativesService) {}

  @Get()
  async listAll(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.creativesService.findAll(tenantId)
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId
    return this.creativesService.findOne(tenantId, id)
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.creativesService.create(tenantId, body)
  }

  @Post(':id/approve')
  async approve(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId
    return this.creativesService.approveCreative(tenantId, id)
  }
}
