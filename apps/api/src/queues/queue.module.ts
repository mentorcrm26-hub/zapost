import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QueueProducerService } from './queue-producer.service.js'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const redisConfig = {
  url: redisUrl,
  maxRetriesPerRequest: null,
}

@Module({
  imports: [
    BullModule.forRoot({
      connection: redisConfig,
    }),
    BullModule.registerQueue(
      {
        name: 'transcricao',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      },
      {
        name: 'geracao',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      },
      {
        name: 'render',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      },
      {
        name: 'entrega',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }
    ),
  ],
  providers: [QueueProducerService],
  exports: [QueueProducerService, BullModule],
})
export class QueueModule {}
