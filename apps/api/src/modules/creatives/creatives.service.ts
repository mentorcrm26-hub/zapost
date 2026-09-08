import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Creative } from '../../entities/creative.entity.js'
import { CreditsService } from '../credits/credits.service.js'

@Injectable()
export class CreativesService {
  constructor(
    @InjectRepository(Creative)
    private creativeRepo: Repository<Creative>,
    private creditsService: CreditsService
  ) {}

  async create(tenantId: string, data: Partial<Creative>): Promise<Creative> {
    const creative = this.creativeRepo.create({
      ...data,
      tenantId,
    })
    return this.creativeRepo.save(creative)
  }

  async findAll(tenantId: string, limit = 50): Promise<Creative[]> {
    return this.creativeRepo.find({
      where: { tenantId },
      relations: ['brief', 'renders'],
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  async findOne(tenantId: string, id: string): Promise<Creative> {
    const creative = await this.creativeRepo.findOne({
      where: { id, tenantId },
      relations: ['brief', 'renders', 'aiUsage'],
    })
    if (!creative) {
      throw new NotFoundException(`Criativo ${id} não encontrado para este tenant.`)
    }
    return creative
  }

  /**
   * Aprovação do criativo (Regra 4: débito de 1 crédito acontece APENAS na aprovação)
   */
  async approveCreative(tenantId: string, id: string): Promise<Creative> {
    const creative = await this.findOne(tenantId, id)
    if (creative.status === 'aprovado') {
      return creative
    }

    // Debita 1 crédito no ledger
    await this.creditsService.appendTransaction({
      tenantId,
      creativeId: creative.id,
      delta: -1,
      reason: `Aprovação de criativo #${creative.id.slice(0, 8)}`,
    })

    creative.status = 'aprovado'
    return this.creativeRepo.save(creative)
  }
}
