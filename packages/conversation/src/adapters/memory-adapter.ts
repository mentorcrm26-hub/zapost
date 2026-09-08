import type { ChannelAdapter, ButtonOption, ImageAttachment, FileAttachment } from '../types.js'

export interface SentMessage {
  type: 'text' | 'buttons' | 'images' | 'file'
  text?: string | undefined
  buttons?: ButtonOption[] | undefined
  images?: ImageAttachment[] | undefined
  file?: FileAttachment | undefined
  caption?: string | undefined
  name?: string | undefined
}

export class MemoryChannelAdapter implements ChannelAdapter {
  public sentMessages: SentMessage[] = []

  async sendText(text: string): Promise<void> {
    this.sentMessages.push({ type: 'text', text })
  }

  async sendButtons(text: string, buttons: ButtonOption[]): Promise<void> {
    this.sentMessages.push({ type: 'buttons', text, buttons })
  }

  async sendImages(images: ImageAttachment[], caption?: string): Promise<void> {
    this.sentMessages.push({ type: 'images', images, caption })
  }

  async sendFile(file: FileAttachment, name?: string): Promise<void> {
    this.sentMessages.push({ type: 'file', file, name })
  }

  getSentMessages(): SentMessage[] {
    return this.sentMessages
  }

  getLastMessage(): SentMessage | undefined {
    return this.sentMessages[this.sentMessages.length - 1]
  }

  clear(): void {
    this.sentMessages = []
  }
}
