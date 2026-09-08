import type { ConversationSession, SessionStore } from '../types.js'

export class MemorySessionStore implements SessionStore {
  private sessions = new Map<string, { session: ConversationSession; expiresAt: number }>()

  async get(userId: string): Promise<ConversationSession | null> {
    const entry = this.sessions.get(userId)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.sessions.delete(userId)
      return null
    }

    return entry.session
  }

  async set(userId: string, session: ConversationSession, ttlSeconds = 1800): Promise<void> {
    this.sessions.set(userId, {
      session,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async delete(userId: string): Promise<void> {
    this.sessions.delete(userId)
  }

  clear(): void {
    this.sessions.clear()
  }
}
