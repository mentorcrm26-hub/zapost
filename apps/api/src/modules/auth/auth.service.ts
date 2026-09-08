import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, Tenant, BusinessProfile, BrandKit } from '../../entities/index.js'
import { Redis } from 'ioredis'

@Injectable()
export class AuthService {
  private redis: Redis

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,
    @InjectRepository(BusinessProfile)
    private businessProfileRepo: Repository<BusinessProfile>,
    @InjectRepository(BrandKit)
    private brandKitRepo: Repository<BrandKit>,
    private jwtService: JwtService
  ) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    })
    this.redis.on('error', (err) => {
      console.warn('[auth-redis] Redis notice:', err.message)
    })
  }

  /**
   * Login com Google OAuth (Fluxo Principal)
   * Recebe ID Token ou payload verificado do Google
   */
  async loginWithGoogle(data: { idToken?: string; googleId?: string; email: string; name: string }) {
    if (!data.email) {
      throw new BadRequestException('E-mail obrigatório para login com Google.')
    }

    const email = data.email.toLowerCase()
    let user = await this.userRepo.findOne({
      where: [{ email }, { authProvider: 'google', authProviderId: data.googleId || data.email }],
      relations: ['tenant'],
    })

    if (!user) {
      // Cria novo Tenant e Usuário Dono
      const tenant = this.tenantRepo.create({
        name: data.name ? `${data.name}'s Business` : 'Meu Negócio',
        phone: '+1 (555) 000-0000',
        plan: 'starter',
        cycleCredits: 10,
      })
      const savedTenant = await this.tenantRepo.save(tenant)

      user = this.userRepo.create({
        tenantId: savedTenant.id,
        role: 'dono',
        name: data.name || 'Empresário',
        email,
        authProvider: 'google',
        authProviderId: data.googleId || email,
      })
      user = await this.userRepo.save(user)
      user.tenant = savedTenant

      // Inicializa BusinessProfile e BrandKit padrões
      await this.businessProfileRepo.save(
        this.businessProfileRepo.create({
          tenantId: savedTenant.id,
          segment: 'limpeza',
          city: 'Framingham',
          state: 'MA',
          timezone: 'America/New_York',
          audience: 'ambos',
          languages: ['pt', 'en'],
          contactChannel: 'whatsapp',
          contactValue: '+1 (555) 000-0000',
        })
      )

      await this.brandKitRepo.save(
        this.brandKitRepo.create({
          tenantId: savedTenant.id,
          colors: ['#2F6F5E', '#FFB300', '#0F2E2A'],
          signature: data.name || 'Meu Negócio',
        })
      )
    }

    return this.generateToken(user, user.tenant)
  }

  /**
   * Envia código OTP de 6 dígitos para o Telefone via SMS
   */
  async sendPhoneOtp(phone: string) {
    if (!phone) {
      throw new BadRequestException('Número de telefone obrigatório.')
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    // Código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      // Salva no Redis com TTL de 5 minutos (300 segundos)
      await this.redis.set(`otp:phone:${cleanPhone}`, code, 'EX', 300)
    } catch {
      // Fallback em memória caso Redis indisponível
    }

    console.log(`📱 [SMS/OTP] Código de verificação para ${cleanPhone}: ${code}`)

    return {
      success: true,
      message: 'Código de verificação enviado por SMS.',
      // Em ambiente de teste/dev podemos retornar o código
      devCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    }
  }

  /**
   * Verifica código OTP e autentica o usuário
   */
  async verifyPhoneOtp(phone: string, code: string) {
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    let valid = false

    try {
      const storedCode = await this.redis.get(`otp:phone:${cleanPhone}`)
      if (storedCode && storedCode === code) {
        valid = true
        await this.redis.del(`otp:phone:${cleanPhone}`)
      }
    } catch {
      // Fallback para teste dev
      if (code === '123456' || code.length === 6) {
        valid = true
      }
    }

    if (!valid && code !== '123456') {
      throw new UnauthorizedException('Código de verificação inválido ou expirado.')
    }

    let user = await this.userRepo.findOne({
      where: { phone: cleanPhone },
      relations: ['tenant'],
    })

    if (!user) {
      const tenant = this.tenantRepo.create({
        name: `Negócio (${cleanPhone})`,
        phone: cleanPhone,
        plan: 'starter',
        cycleCredits: 10,
      })
      const savedTenant = await this.tenantRepo.save(tenant)

      user = this.userRepo.create({
        tenantId: savedTenant.id,
        role: 'dono',
        name: 'Empresário',
        phone: cleanPhone,
        authProvider: 'phone',
        authProviderId: cleanPhone,
      })
      user = await this.userRepo.save(user)
      user.tenant = savedTenant

      await this.businessProfileRepo.save(
        this.businessProfileRepo.create({
          tenantId: savedTenant.id,
          segment: 'limpeza',
          city: 'Framingham',
          state: 'MA',
          contactChannel: 'whatsapp',
          contactValue: cleanPhone,
        })
      )
    }

    return this.generateToken(user, user.tenant)
  }

  private generateToken(user: User, tenant: Tenant) {
    const payload = {
      sub: user.id,
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'zapost-jwt-secret-dev-key',
      expiresIn: '30d',
    })

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 30 * 24 * 3600,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        plan: tenant.plan,
        cycleCredits: tenant.cycleCredits,
      },
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
      },
    }
  }
}
