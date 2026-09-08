import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BrandKit } from '../../entities/brand-kit.entity.js'

@Injectable()
export class BrandKitsService {
  constructor(
    @InjectRepository(BrandKit)
    private brandKitRepo: Repository<BrandKit>
  ) {}

  async findByTenantId(tenantId: string): Promise<BrandKit> {
    const kit = await this.brandKitRepo.findOne({ where: { tenantId } })
    if (!kit) {
      throw new NotFoundException(`Brand kit não encontrado para o tenant ${tenantId}`)
    }
    return kit
  }

  async upsert(tenantId: string, data: Partial<BrandKit>): Promise<BrandKit> {
    let kit = await this.brandKitRepo.findOne({ where: { tenantId } })
    if (!kit) {
      kit = this.brandKitRepo.create({ ...data, tenantId })
    } else {
      Object.assign(kit, data)
    }
    return this.brandKitRepo.save(kit)
  }
}
