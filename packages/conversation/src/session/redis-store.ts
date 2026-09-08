import { Redis } from 'ioredis'
import type { ConversationSession, SessionStore } from '../types.js'

export class RedisSessionStore implements SessionStore {
  private client: Redis
  private prefix: string

  constructor(options?: { redisUrl?: string; prefix?: string }) {
    const url = options?.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379'
    this.prefix = options?.prefix || 'zapost:session:'
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 2000)),
      lazyConnect: true,
    })

    this.client.on('error', (err) => {
      console.warn('[redis-session] Aviso de conexão Redis:', err.message)
    })
  }

  private getKey(userId: string): string {
    return `${this.prefix}${userId}`
  }

  async get(userId: string): Promise<ConversationSession | null> {
    try {
      const data = await this.client.get(this.getKey(userId))
      if (!data) return null
      return JSON.parse(data) as ConversationSession
    } catch (err) {
      console.warn(`[redis-session] Falha ao ler sessão ${userId}:`, err)
      return null
    }
  }

  async set(userId: string, session: ConversationSession, ttlSeconds = 1800): Promise<void> {
    try {
      const key = this.getKey(userId)
      const data = JSON.stringify(session)
      await this.client.set(key, data, 'EX', ttlSeconds)
    } catch (err) {
      console.warn(`[redis-session] Falha ao salvar sessão ${userId}:`, err)
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.client.del(this.getKey(userId))
    } catch (err) {
      console.warn(`[redis-session] Falha ao deletar sessão ${userId}:`, err)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.quit()
    } catch {}
  }
}
