import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  provider: string // 'anthropic' | 'openai'

  @Column({ name: 'key_encrypted', type: 'text' })
  keyEncrypted: string

  @Column({ type: 'int', default: 1 })
  priority: number

  @Column({ name: 'monthly_budget_cents', type: 'int', default: 20000 })
  monthlyBudgetCents: number

  @Column({ name: 'current_spend_cents', type: 'int', default: 0 })
  currentSpendCents: number

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
