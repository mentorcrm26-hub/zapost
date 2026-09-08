import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AIUsage } from '../../entities/ai-usage.entity.js'
import { AIUsageService } from './ai-usage.service.js'
import { AIUsageController } from './ai-usage.controller.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([AIUsage]), AuthModule],
  controllers: [AIUsageController],
  providers: [AIUsageService],
  exports: [AIUsageService],
})
export class AIUsageModule {}
