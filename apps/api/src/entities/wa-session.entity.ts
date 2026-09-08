import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'

@Entity('wa_sessions')
export class WASession {
  @PrimaryColumn({ length: 50 })
  phone: string

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant | null

  @Column({ length: 50, default: 'aguardando_foto_audio' })
  state: string

  @Column('jsonb', { default: {} })
  context: any

  @CreateDateColumn({ name: 'last_activity' })
  lastActivity: Date

  @Column('timestamptz', { name: 'expires_at' })
  expiresAt: Date
}
