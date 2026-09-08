import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @ManyToOne(() => Tenant, (t) => t.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ length: 50, default: 'dono' })
  role: 'dono' | 'operador'

  @Column({ length: 255 })
  name: string

  @Column({ length: 255, nullable: true })
  email: string | null

  @Column({ length: 50, nullable: true })
  phone: string | null

  @Column({ name: 'auth_provider', length: 50, default: 'google' })
  authProvider: 'google' | 'phone' | 'email'

  @Column({ name: 'auth_provider_id', length: 255, nullable: true })
  authProviderId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
