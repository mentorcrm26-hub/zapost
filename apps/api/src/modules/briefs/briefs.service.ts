import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Brief } from '../../entities/brief.entity.js'

@Injectable()
export class BriefsService {
  constructor(
    @InjectRepository(Brief)
    private briefRepo: Repository<Brief>
  ) {}

  async create(tenantId: string, data: Partial<Brief>): Promise<Brief> {
    const brief = this.briefRepo.create({
      ...data,
      tenantId,
    })
    return this.briefRepo.save(brief)
  }

  async findAll(tenantId: string, limit = 50): Promise<Brief[]> {
    return this.briefRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  async findOne(tenantId: string, id: string): Promise<Brief> {
    const brief = await this.briefRepo.findOne({
      where: { id, tenantId },
    })
    if (!brief) {
      throw new NotFoundException(`Briefing ${id} não encontrado para este tenant.`)
    }
    return brief
  }
}
