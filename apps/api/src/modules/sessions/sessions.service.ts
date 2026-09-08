import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThan } from 'typeorm'
import { WASession } from '../../entities/wa-session.entity.js'

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(WASession)
    private sessionRepo: Repository<WASession>
  ) {}

  async getSession(phone: string): Promise<WASession | null> {
    const session = await this.sessionRepo.findOne({ where: { phone } })
    if (!session) return null

    // Verifica expiração
    if (new Date() > new Date(session.expiresAt)) {
      await this.sessionRepo.delete(phone)
      return null
    }

    return session
  }

  async saveSession(phone: string, data: { tenantId?: string | null; state: string; context: any }): Promise<WASession> {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    let session = await this.sessionRepo.findOne({ where: { phone } })

    if (!session) {
      session = this.sessionRepo.create({
        phone,
        tenantId: data.tenantId || null,
        state: data.state,
        context: data.context,
        expiresAt,
      })
    } else {
      session.state = data.state
      session.context = data.context
      session.lastActivity = new Date()
      session.expiresAt = expiresAt
      if (data.tenantId) session.tenantId = data.tenantId
    }

    return this.sessionRepo.save(session)
  }

  async deleteSession(phone: string): Promise<void> {
    await this.sessionRepo.delete(phone)
  }

  async purgeExpiredSessions(): Promise<void> {
    await this.sessionRepo.delete({
      expiresAt: LessThan(new Date()),
    })
  }
}
