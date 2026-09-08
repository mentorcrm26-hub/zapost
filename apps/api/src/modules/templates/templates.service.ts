import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Template } from '../../entities/template.entity.js'

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templateRepo: Repository<Template>
  ) {}

  async findAll(): Promise<Template[]> {
    return this.templateRepo.find({ where: { active: true } })
  }

  async findOne(id: string): Promise<Template | null> {
    return this.templateRepo.findOne({ where: { id } })
  }

  async upsert(data: Partial<Template>): Promise<Template> {
    return this.templateRepo.save(this.templateRepo.create(data))
  }
}
