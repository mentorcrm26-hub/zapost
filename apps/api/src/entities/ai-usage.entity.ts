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

@Entity('ai_usage')
export class AIUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null

  @ManyToOne(() => Tenant, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant | null

  @Column({ name: 'creative_id', type: 'uuid', nullable: true })
  creativeId: string | null

  @ManyToOne(() => Creative, (c) => c.aiUsage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creative_id' })
  creative: Creative | null

  @Column({ length: 50 })
  provider: string // 'anthropic' | 'openai'

  @Column({ length: 100 })
  model: string

  @Column({ name: 'input_tokens', type: 'int', default: 0 })
  inputTokens: number

  @Column({ name: 'output_tokens', type: 'int', default: 0 })
  outputTokens: number

  @Column({ name: 'cost_cents', type: 'int', default: 0 })
  costCents: number // Centavos USD

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
