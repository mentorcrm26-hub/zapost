import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'
import { Brief } from './brief.entity.js'
import { Render } from './render.entity.js'
import { AIUsage } from './ai-usage.entity.js'

@Entity('creatives')
export class Creative {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @ManyToOne(() => Tenant, (t) => t.creatives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ name: 'brief_id', type: 'uuid', nullable: true })
  briefId: string | null

  @ManyToOne(() => Brief, (b) => b.creatives, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brief_id' })
  brief: Brief | null

  @Column({ length: 50, default: 'aguardando_foto_audio' })
  status: string

  @Column({ name: 'origin_channel', length: 50, default: 'telegram' })
  originChannel: string

  @Column({ name: 'skill_used', length: 100, nullable: true })
  skillUsed: string | null

  @Column({ name: 'total_cost_cents', type: 'int', default: 0 })
  totalCostCents: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Render, (r) => r.creative)
  renders: Render[]

  @OneToMany(() => AIUsage, (u) => u.creative)
  aiUsage: AIUsage[]
}
