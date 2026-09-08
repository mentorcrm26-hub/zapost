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
import { Template } from './template.entity.js'

@Entity('renders')
export class Render {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ name: 'creative_id', type: 'uuid' })
  creativeId: string

  @ManyToOne(() => Creative, (c) => c.renders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creative_id' })
  creative: Creative

  @Column({ name: 'template_id', length: 100 })
  templateId: string

  @ManyToOne(() => Template)
  @JoinColumn({ name: 'template_id' })
  template: Template

  @Column({ length: 50 })
  format: string

  @Column({ length: 10 })
  language: string

  @Column('text')
  url: string

  @Column({ default: false })
  approved: boolean

  @Column({ default: false })
  watermark: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
