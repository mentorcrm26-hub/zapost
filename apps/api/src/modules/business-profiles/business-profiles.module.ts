import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BusinessProfile } from '../../entities/business-profile.entity.js'
import { BusinessProfilesService } from './business-profiles.service.js'
import { BusinessProfilesController } from './business-profiles.controller.js'
import { AuthModule } from '../auth/auth.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([BusinessProfile]), AuthModule],
  controllers: [BusinessProfilesController],
  providers: [BusinessProfilesService],
  exports: [BusinessProfilesService],
})
export class BusinessProfilesModule {}
