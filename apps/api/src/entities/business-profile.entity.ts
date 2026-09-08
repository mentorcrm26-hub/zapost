import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'

@Entity('business_profiles')
export class BusinessProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid', unique: true })
  tenantId: string

  @OneToOne(() => Tenant, (t) => t.businessProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ length: 100, default: 'limpeza' })
  segment: string

  @Column({ length: 100 })
  city: string

  @Column({ length: 2 })
  state: string

  @Column({ length: 100, default: 'America/New_York' })
  timezone: string

  @Column({ length: 50, default: 'ambos' })
  audience: 'brasileiros' | 'americanos' | 'ambos'

  @Column('text', { array: true, default: '{}' })
  languages: string[]

  @Column({ name: 'contact_channel', length: 50, default: 'whatsapp' })
  contactChannel: string

  @Column({ name: 'contact_value', length: 100 })
  contactValue: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
