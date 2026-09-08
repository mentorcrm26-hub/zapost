import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common'
import { RendersService } from './renders.service.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Controller('renders')
@UseGuards(AuthGuard, TenantGuard)
export class RendersController {
  constructor(private rendersService: RendersService) {}

  @Get('creative/:creativeId')
  async listByCreative(@Req() req: any, @Param('creativeId') creativeId: string) {
    const tenantId = req.user.tenantId
    return this.rendersService.findByCreative(tenantId, creativeId)
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.user.tenantId
    return this.rendersService.findOne(tenantId, id)
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const tenantId = req.user.tenantId
    return this.rendersService.create(tenantId, body)
  }
}
