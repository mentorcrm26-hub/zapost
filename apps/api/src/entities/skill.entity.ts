import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('skills')
export class Skill {
  @PrimaryColumn({ length: 100 })
  id: string

  @Column({ type: 'int', default: 1 })
  version: number

  @Column({ length: 50 })
  type: string // 'segmento' | 'tecnica' | 'formato' | 'sazonal' | 'aperfeicoamento'

  @Column('text')
  prompt: string

  @Column('jsonb', { default: [] })
  examples: any

  @Column('jsonb', { name: 'applies_to', default: {} })
  appliesTo: any

  @Column({ default: true })
  active: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
