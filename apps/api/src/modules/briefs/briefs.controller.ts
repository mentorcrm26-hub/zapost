import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common'
import { BriefsService } from './briefs.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('briefs')
@UseGuards(AuthGuard, TenantGuard)
export class BriefsController {
  constructor(private briefsService: BriefsService) {}

  @Get()
  async listAll(@Req() req: any) {
    const tenantId = req.user.tenantId
    return this.briefsService.findAll(tenantId)
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId
    return this.briefsService.findOne(tenantId, id)
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.briefsService.create(tenantId, body)
  }
}
