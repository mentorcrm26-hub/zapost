import { Bot, InlineKeyboard, InputFile } from 'grammy'
import type { ChannelAdapter, ButtonOption, ImageAttachment, FileAttachment } from '../types.js'

export class TelegramChannelAdapter implements ChannelAdapter {
  private bot: Bot
  private chatId: number | string

  constructor(bot: Bot, chatId: number | string) {
    this.bot = bot
    this.chatId = chatId
  }

  async sendText(text: string): Promise<void> {
    await this.withRetry(() =>
      this.bot.api.sendMessage(this.chatId, text, {
        parse_mode: 'HTML',
      })
    )
  }

  async sendButtons(text: string, buttons: ButtonOption[]): Promise<void> {
    const keyboard = new InlineKeyboard()

    // Regra: Máximo 3 botões por linha
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i]
      if (!btn) continue
      keyboard.text(btn.label, btn.id)
      if ((i + 1) % 3 === 0 && i < buttons.length - 1) {
        keyboard.row()
      }
    }

    await this.withRetry(() =>
      this.bot.api.sendMessage(this.chatId, text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
      })
    )
  }

  async sendImages(images: ImageAttachment[], caption?: string): Promise<void> {
    if (images.length === 0) return

    if (images.length === 1) {
      const img = images[0]!
      const photo = img.buffer ? new InputFile(img.buffer, 'preview.png') : img.url!
      await this.withRetry(() =>
        this.bot.api.sendPhoto(
          this.chatId,
          photo,
          caption ? { caption } : {}
        )
      )
      return
    }

    // Álbum de imagens (MediaGroup)
    const mediaGroup = images.map((img, index) => {
      const file = img.buffer ? new InputFile(img.buffer, `preview-${index + 1}.png`) : img.url!
      if (index === 0 && caption) {
        return {
          type: 'photo' as const,
          media: file,
          caption,
        }
      }
      return {
        type: 'photo' as const,
        media: file,
      }
    })

    await this.withRetry(() => this.bot.api.sendMediaGroup(this.chatId, mediaGroup))
  }

  async sendFile(file: FileAttachment, name?: string): Promise<void> {
    const doc = file.buffer ? new InputFile(file.buffer, file.filename) : file.url!
    await this.withRetry(() =>
      this.bot.api.sendDocument(this.chatId, doc, {
        caption: name || file.filename,
      })
    )
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempt = 0
    while (attempt < maxRetries) {
      try {
        return await fn()
      } catch (err: any) {
        attempt++
        // Se for erro de rate limit (429), respeita retry_after do Telegram
        const retryAfter = err?.parameters?.retry_after || 1
        if (attempt >= maxRetries) {
          console.error(`[telegram-adapter] Falha persistente após ${attempt} tentativas:`, err.message)
          throw err
        }
        console.warn(`[telegram-adapter] Erro na chamada (tentativa ${attempt}). Aguardando ${retryAfter}s...`)
        await new Promise((r) => setTimeout(r, retryAfter * 1000))
      }
    }
    throw new Error('Falha inesperada no withRetry do TelegramChannelAdapter')
  }
}
