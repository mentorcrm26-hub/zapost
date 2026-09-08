import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  Tenant,
  User,
  BusinessProfile,
  BrandKit,
  Brief,
  Creative,
  Render,
  Template,
  Skill,
  CreditLedger,
  ApiKey,
  AIUsage,
  WASession,
} from '../entities/index.js'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL
        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [
              Tenant,
              User,
              BusinessProfile,
              BrandKit,
              Brief,
              Creative,
              Render,
              Template,
              Skill,
              CreditLedger,
              ApiKey,
              AIUsage,
              WASession,
            ],
            synchronize: false, // Usamos migrations manuais para segurança e controle
            logging: process.env.NODE_ENV === 'development',
          }
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'zapost',
          entities: [
            Tenant,
            User,
            BusinessProfile,
            BrandKit,
            Brief,
            Creative,
            Render,
            Template,
            Skill,
            CreditLedger,
            ApiKey,
            AIUsage,
            WASession,
          ],
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
        }
      },
    }),
  ],
})
export class DatabaseModule {}
