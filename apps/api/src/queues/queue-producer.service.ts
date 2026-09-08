import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

@Injectable()
export class QueueProducerService {
  constructor(
    @InjectQueue('transcricao') private transcriptionQueue: Queue,
    @InjectQueue('geracao') private generationQueue: Queue,
    @InjectQueue('render') private renderQueue: Queue,
    @InjectQueue('entrega') private deliveryQueue: Queue
  ) {}

  async enqueueTranscription(data: { tenantId: string; audioUrl: string; creativeId: string }) {
    return this.transcriptionQueue.add('transcribe-audio', data, {
      jobId: `transcribe:${data.creativeId}`,
    })
  }

  async enqueueGeneration(data: { tenantId: string; creativeId: string; briefInput: any }) {
    return this.generationQueue.add('generate-brief', data, {
      jobId: `generate:${data.creativeId}`,
    })
  }

  async enqueueRender(data: {
    tenantId: string
    creativeId: string
    templateId: string
    format: string
    language: string
    watermark: boolean
  }) {
    return this.renderQueue.add('render-creative', data)
  }

  async enqueueDelivery(data: { tenantId: string; creativeId: string; channel: string; recipient: string }) {
    return this.deliveryQueue.add('deliver-creative', data)
  }
}
