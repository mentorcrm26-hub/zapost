import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrandKit } from '../../entities/brand-kit.entity.js'
import { BrandKitsService } from './brand-kits.service.js'
import { BrandKitsController } from './brand-kits.controller.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([BrandKit]), AuthModule],
  controllers: [BrandKitsController],
  providers: [BrandKitsService],
  exports: [BrandKitsService],
})
export class BrandKitsModule {}
