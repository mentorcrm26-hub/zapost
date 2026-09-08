import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessProfile } from '../../entities/business-profile.entity.js'

@Injectable()
export class BusinessProfilesService {
  constructor(
    @InjectRepository(BusinessProfile)
    private profileRepo: Repository<BusinessProfile>
  ) {}

  async findByTenantId(tenantId: string): Promise<BusinessProfile> {
    const profile = await this.profileRepo.findOne({ where: { tenantId } })
    if (!profile) {
      throw new NotFoundException(`Ficha do negócio não encontrada para o tenant ${tenantId}`)
    }
    return profile
  }

  async upsert(tenantId: string, data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    let profile = await this.profileRepo.findOne({ where: { tenantId } })
    if (!profile) {
      profile = this.profileRepo.create({ ...data, tenantId })
    } else {
      Object.assign(profile, data)
    }
    return this.profileRepo.save(profile)
  }
}
