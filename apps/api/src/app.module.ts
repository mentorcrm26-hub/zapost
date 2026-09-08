import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DatabaseModule } from './database/database.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { TenantsModule } from './modules/tenants/tenants.module.js'
import { BusinessProfilesModule } from './modules/business-profiles/business-profiles.module.js'
import { BrandKitsModule } from './modules/brand-kits/brand-kits.module.js'
import { BriefsModule } from './modules/briefs/briefs.module.js'
import { CreativesModule } from './modules/creatives/creatives.module.js'
import { RendersModule } from './modules/renders/renders.module.js'
import { TemplatesModule } from './modules/templates/templates.module.js'
import { SkillsModule } from './modules/skills/skills.module.js'
import { CreditsModule } from './modules/credits/credits.module.js'
import { AIUsageModule } from './modules/ai-usage/ai-usage.module.js'
import { SessionsModule } from './modules/sessions/sessions.module.js'
import { QueueModule } from './queues/queue.module.js'
import { TenantContextService } from './common/context/tenant-context.service.js'
import { TenantInterceptor } from './common/interceptors/tenant.interceptor.js'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TenantsModule,
    BusinessProfilesModule,
    BrandKitsModule,
    BriefsModule,
    CreativesModule,
    RendersModule,
    TemplatesModule,
    SkillsModule,
    CreditsModule,
    AIUsageModule,
    SessionsModule,
    QueueModule,
  ],
  providers: [
    TenantContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
