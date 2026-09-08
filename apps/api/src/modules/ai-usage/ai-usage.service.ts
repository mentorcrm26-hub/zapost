import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AIUsage } from '../../entities/ai-usage.entity.js'

@Injectable()
export class AIUsageService {
  constructor(
    @InjectRepository(AIUsage)
    private aiUsageRepo: Repository<AIUsage>
  ) {}

  async logUsage(data: {
    tenantId?: string | null
    creativeId?: string | null
    provider: string
    model: string
    inputTokens: number
    outputTokens: number
    costCents: number // Centavos USD
  }): Promise<AIUsage> {
    const usage = this.aiUsageRepo.create({
      tenantId: data.tenantId || null,
      creativeId: data.creativeId || null,
      provider: data.provider,
      model: data.model,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      costCents: data.costCents,
    })
    return this.aiUsageRepo.save(usage)
  }

  async getSummary(tenantId?: string) {
    const qb = this.aiUsageRepo.createQueryBuilder('usage')

    if (tenantId) {
      qb.where('usage.tenant_id = :tenantId', { tenantId })
    }

    const result = await qb
      .select('SUM(usage.cost_cents)', 'totalCostCents')
      .addSelect('SUM(usage.input_tokens)', 'totalInputTokens')
      .addSelect('SUM(usage.output_tokens)', 'totalOutputTokens')
      .addSelect('COUNT(usage.id)', 'totalCalls')
      .getRawOne()

    return {
      totalCostCents: parseInt(result?.totalCostCents || '0', 10),
      totalCostUsd: (parseInt(result?.totalCostCents || '0', 10) / 100).toFixed(4),
      totalInputTokens: parseInt(result?.totalInputTokens || '0', 10),
      totalOutputTokens: parseInt(result?.totalOutputTokens || '0', 10),
      totalCalls: parseInt(result?.totalCalls || '0', 10),
    }
  }
}
