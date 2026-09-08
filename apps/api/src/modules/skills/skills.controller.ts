import { Controller, Get, Param } from '@nestjs/common'
import { SkillsService } from './skills.service.js'

@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get()
  async listAll() {
    return this.skillsService.findAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.skillsService.findOne(id)
  }
}
