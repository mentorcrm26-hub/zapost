import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tenant } from '../../entities/tenant.entity.js'
import { TenantsService } from './tenants.service.js'
import { TenantsController } from './tenants.controller.js'
import { AuthModule } from '../auth/auth.module.js'
import { CreditsModule } from '../credits/credits.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), AuthModule, CreditsModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
