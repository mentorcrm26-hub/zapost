import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from '../../entities/tenant.entity.js'
import { CreditsService } from '../credits/credits.service.js'

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    private creditsService: CreditsService
  ) {}

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({
      where: { id },
      relations: ['businessProfile', 'brandKit', 'users'],
    })
    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} não encontrado.`)
    }
    return tenant
  }

  async getSummary(id: string) {
    const tenant = await this.findById(id)
    const creditBalance = await this.creditsService.getBalance(id)
    return {
      id: tenant.id,
      name: tenant.name,
      plan: tenant.plan,
      status: tenant.status,
      phone: tenant.phone,
      timezone: tenant.timezone,
      creditBalance,
      businessProfile: tenant.businessProfile,
      brandKit: tenant.brandKit,
    }
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.findById(id)
    Object.assign(tenant, data)
    return this.tenantRepo.save(tenant)
  }
}
