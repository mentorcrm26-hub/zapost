import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, Tenant, BusinessProfile, BrandKit } from '../../entities/index.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { AuthGuard } from '../../common/guards/auth.guard.js'
import { TenantGuard } from '../../common/guards/tenant.guard.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, BusinessProfile, BrandKit]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'zapost-jwt-secret-dev-key',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, TenantGuard],
  exports: [AuthService, JwtModule, AuthGuard, TenantGuard],
})
export class AuthModule {}
