import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('templates')
export class Template {
  @PrimaryColumn({ length: 100 })
  id: string // 'bold-price', 'photo-overlay', 'clean-split'

  @Column({ length: 255 })
  name: string

  @Column({ type: 'int', default: 1 })
  version: number

  @Column('text', { array: true, default: '{}' })
  formats: string[]

  @Column('jsonb', { name: 'text_rules', default: {} })
  textRules: any

  @Column('text', { array: true, default: '{}' })
  segments: string[]

  @Column({ default: true })
  active: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
