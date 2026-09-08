import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'
import { Creative } from './creative.entity.js'

@Entity('credit_ledger')
export class CreditLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @ManyToOne(() => Tenant, (t) => t.creditLedger, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ name: 'creative_id', type: 'uuid', nullable: true })
  creativeId: string | null

  @ManyToOne(() => Creative, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creative_id' })
  creative: Creative | null

  @Column({ type: 'int' })
  delta: number

  @Column({ length: 255 })
  reason: string

  @Column({ name: 'balance_after', type: 'int' })
  balanceAfter: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
