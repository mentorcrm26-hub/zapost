import type { ChannelAdapter, ButtonOption, ImageAttachment, FileAttachment } from '../types.js'

export interface WhatsAppConfig {
  phoneNumberId?: string | undefined
  accessToken?: string | undefined
  apiVersion?: string | undefined
}

export class WhatsAppCloudChannelAdapter implements ChannelAdapter {
  private toPhoneNumber: string
  private config: WhatsAppConfig

  constructor(toPhoneNumber: string, config?: WhatsAppConfig) {
    this.toPhoneNumber = toPhoneNumber
    this.config = {
      phoneNumberId: config?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: config?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '',
      apiVersion: config?.apiVersion || 'v21.0',
    }
  }

  async sendText(text: string): Promise<void> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      console.log(`[whatsapp-adapter:mock] Para ${this.toPhoneNumber}: "${text}"`)
      return
    }

    await this.callApi({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.toPhoneNumber,
      type: 'text',
      text: { body: text },
    })
  }

  async sendButtons(text: string, buttons: ButtonOption[]): Promise<void> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      const btnLabels = buttons.map((b) => `[${b.label}]`).join(' ')
      console.log(`[whatsapp-adapter:mock] Para ${this.toPhoneNumber}: "${text}" -> ${btnLabels}`)
      return
    }

    // WhatsApp Cloud API suporta até 3 botões do tipo reply
    const actionButtons = buttons.slice(0, 3).map((b) => ({
      type: 'reply',
      reply: {
        id: b.id,
        title: b.label.slice(0, 20), // Limite de 20 chars do WhatsApp
      },
    }))

    await this.callApi({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.toPhoneNumber,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text },
        action: { buttons: actionButtons },
      },
    })
  }

  async sendImages(images: ImageAttachment[], caption?: string): Promise<void> {
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (!img) continue

      if (!this.config.accessToken || !this.config.phoneNumberId) {
        console.log(`[whatsapp-adapter:mock] Envio de imagem para ${this.toPhoneNumber} (imagem ${i + 1})`)
        continue
      }

      // Envio via link ou media id
      if (img.url) {
        await this.callApi({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.toPhoneNumber,
          type: 'image',
          image: {
            link: img.url,
            caption: i === 0 ? caption : undefined,
          },
        })
      }
    }
  }

  async sendFile(file: FileAttachment, name?: string): Promise<void> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      console.log(`[whatsapp-adapter:mock] Envio de arquivo ${file.filename} para ${this.toPhoneNumber}`)
      return
    }

    if (file.url) {
      await this.callApi({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: this.toPhoneNumber,
        type: 'document',
        document: {
          link: file.url,
          filename: file.filename,
          caption: name || undefined,
        },
      })
    }
  }

  private async callApi(payload: unknown): Promise<void> {
    const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Erro na WhatsApp Cloud API (${response.status}): ${err}`)
    }
  }
}
