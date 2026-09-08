import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { CreditLedger } from '../../entities/credit-ledger.entity.js'

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(CreditLedger)
    private creditLedgerRepo: Repository<CreditLedger>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  /**
   * Consulta o saldo atual de créditos do tenant chamando a função SQL segura
   */
  async getBalance(tenantId: string): Promise<number> {
    try {
      const result = await this.dataSource.query(
        'SELECT get_tenant_credit_balance($1) as balance',
        [tenantId]
      )
      return parseInt(result[0]?.balance || '0', 10)
    } catch {
      // Fallback em caso de banco SQLite em memória ou função não criada
      const result = await this.creditLedgerRepo
        .createQueryBuilder('ledger')
        .select('COALESCE(SUM(ledger.delta), 0)', 'balance')
        .where('ledger.tenant_id = :tenantId', { tenantId })
        .getRawOne()
      return parseInt(result?.balance || '0', 10)
    }
  }

  /**
   * Registra uma movimentação no ledger (Append-Only)
   */
  async appendTransaction(data: {
    tenantId: string
    creativeId?: string | null
    delta: number
    reason: string
  }): Promise<CreditLedger> {
    const currentBalance = await this.getBalance(data.tenantId)
    const newBalance = currentBalance + data.delta

    if (newBalance < 0) {
      throw new BadRequestException(
        `Saldo insuficiente (${currentBalance} créditos disponíveis). Operação requer ${Math.abs(data.delta)} créditos.`
      )
    }

    const entry = this.creditLedgerRepo.create({
      tenantId: data.tenantId,
      creativeId: data.creativeId || null,
      delta: data.delta,
      reason: data.reason,
      balanceAfter: newBalance,
    })

    return this.creditLedgerRepo.save(entry)
  }

  /**
   * Histórico de transações do tenant
   */
  async getHistory(tenantId: string, limit = 50): Promise<CreditLedger[]> {
    return this.creditLedgerRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }
}
