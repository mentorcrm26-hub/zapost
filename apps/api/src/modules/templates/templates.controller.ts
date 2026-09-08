import { Controller, Get, Param } from '@nestjs/common'
import { TemplatesService } from './templates.service.js'

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  async listAll() {
    return this.templatesService.findAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.templatesService.findOne(id)
  }
}
