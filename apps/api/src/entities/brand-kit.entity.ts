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

@Entity('brand_kits')
export class BrandKit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid', unique: true })
  tenantId: string

  @OneToOne(() => Tenant, (t) => t.brandKit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string | null

  @Column('text', { array: true, default: '{}' })
  colors: string[]

  @Column({ name: 'font_family', length: 100, nullable: true })
  fontFamily: string | null

  @Column({ length: 100, nullable: true })
  handle: string | null

  @Column({ length: 50, nullable: true })
  phone: string | null

  @Column({ length: 100, nullable: true })
  signature: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
