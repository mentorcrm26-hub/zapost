import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Tenant } from './tenant.entity.js'
import { Creative } from './creative.entity.js'

@Entity('briefs')
export class Brief {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string

  @ManyToOne(() => Tenant, (t) => t.briefs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ length: 50 })
  objective: string

  @Column('jsonb', { nullable: true })
  offer: any

  @Column({ length: 50, nullable: true })
  deadline: string | null

  @Column('text', { name: 'raw_input' })
  rawInput: string

  @Column('text', { name: 'photo_ids', array: true, default: '{}' })
  photoIds: string[]

  @Column('text', { array: true, default: '{}' })
  networks: string[]

  @Column('text', { array: true, default: '{}' })
  languages: string[]

  @Column({ length: 50, default: 'post' })
  kind: string

  @Column({ name: 'slide_count', type: 'int', nullable: true })
  slideCount: number | null

  @Column({ name: 'enhance_photo', default: false })
  enhancePhoto: boolean

  @Column({ name: 'strategy_awareness', length: 50, nullable: true })
  strategyAwareness: string | null

  @Column({ name: 'visual_angle', length: 100, nullable: true })
  visualAngle: string | null

  @Column('jsonb')
  content: any

  @Column('text', { name: 'template_hints', array: true, default: '{}' })
  templateHints: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany(() => Creative, (c) => c.brief)
  creatives: Creative[]
}
