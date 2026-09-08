import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Render } from '../../entities/render.entity.js'
import { RendersService } from './renders.service.js'
import { RendersController } from './renders.controller.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([Render]), AuthModule],
  controllers: [RendersController],
  providers: [RendersService],
  exports: [RendersService],
})
export class RendersModule {}
