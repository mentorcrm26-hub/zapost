import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../..')
dotenv.config({ path: path.join(rootDir, '.env') })

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  const port = process.env.API_PORT || 3000
  await app.listen(port)
  console.log(`🚀 ZaPost API rodando na porta ${port}`)
}

bootstrap().catch((err) => {
  console.error('❌ Falha ao iniciar ZaPost API:', err)
  process.exit(1)
})
