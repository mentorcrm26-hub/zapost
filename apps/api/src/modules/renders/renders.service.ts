import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Render } from '../../entities/render.entity.js'

@Injectable()
export class RendersService {
  constructor(
    @InjectRepository(Render)
    private renderRepo: Repository<Render>
  ) {}

  async create(tenantId: string, data: Partial<Render>): Promise<Render> {
    const render = this.renderRepo.create({
      ...data,
      tenantId,
    })
    return this.renderRepo.save(render)
  }

  async findByCreative(tenantId: string, creativeId: string): Promise<Render[]> {
    return this.renderRepo.find({
      where: { tenantId, creativeId },
      order: { createdAt: 'ASC' },
    })
  }

  async findOne(tenantId: string, id: string): Promise<Render> {
    const render = await this.renderRepo.findOne({
      where: { id, tenantId },
    })
    if (!render) {
      throw new NotFoundException(`Render ${id} não encontrado para este tenant.`)
    }
    return render
  }
}
