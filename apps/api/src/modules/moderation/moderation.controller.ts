import { Controller, Post, Body, Req } from '@nestjs/common'
import { ModerationService } from './moderation.service.js'

@Controller('moderation')
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @Post('check')
  checkContent(
    @Body()
    body: {
      text: string
      transcription?: string
      tenantId?: string
    },
    @Req() req: any
  ) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
    return this.moderationService.moderateBriefing({
      text: body.text,
      transcription: body.transcription,
      tenantId: body.tenantId,
      clientIp: String(clientIp),
    })
  }
}
