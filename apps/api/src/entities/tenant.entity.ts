import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { User } from './user.entity.js'
import { BusinessProfile } from './business-profile.entity.js'
import { BrandKit } from './brand-kit.entity.js'
import { Brief } from './brief.entity.js'
import { Creative } from './creative.entity.js'
import { CreditLedger } from './credit-ledger.entity.js'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  name: string

  @Column({ length: 50, default: 'starter' })
  plan: string

  @Column({ length: 50, default: 'active' })
  status: string

  @Column({ name: 'cycle_credits', type: 'int', default: 10 })
  cycleCredits: number

  @Column({ length: 50 })
  phone: string

  @Column({ length: 100, default: 'America/New_York' })
  timezone: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]

  @OneToOne(() => BusinessProfile, (bp) => bp.tenant)
  businessProfile: BusinessProfile

  @OneToOne(() => BrandKit, (bk) => bk.tenant)
  brandKit: BrandKit

  @OneToMany(() => Brief, (b) => b.tenant)
  briefs: Brief[]

  @OneToMany(() => Creative, (c) => c.tenant)
  creatives: Creative[]

  @OneToMany(() => CreditLedger, (cl) => cl.tenant)
  creditLedger: CreditLedger[]
}
