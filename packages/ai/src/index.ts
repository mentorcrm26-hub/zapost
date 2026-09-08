import dotenv from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Carrega automaticamente variáveis de ambiente do .env na raiz do projeto
const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(currentDir, '../../..')
dotenv.config({ path: resolve(rootDir, '.env') })

export * from './types.js'
export * from './usage-tracker.js'
export * from './providers/claude.js'
export * from './providers/openai.js'
export * from './providers/gemini.js'
export * from './providers/whisper.js'
export * from './providers/mock.js'
export * from './composer.js'
export * from './generator.js'
