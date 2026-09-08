import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Creative } from '../../entities/creative.entity.js'
import { CreativesService } from './creatives.service.js'
import { CreativesController } from './creatives.controller.js'
import { AuthModule } from '../auth/auth.module.js'
import { CreditsModule } from '../credits/credits.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([Creative]), AuthModule, CreditsModule],
  controllers: [CreativesController],
  providers: [CreativesService],
  exports: [CreativesService],
})
export class CreativesModule {}
