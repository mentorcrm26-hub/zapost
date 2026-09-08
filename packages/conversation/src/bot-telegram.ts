import { Bot } from 'grammy'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { ConversationEngine } from './state-machine.js'
import { TelegramChannelAdapter } from './adapters/telegram-adapter.js'
import { RedisSessionStore } from './session/redis-store.js'
import { MemorySessionStore } from './session/memory-store.js'
import type { SessionStore } from './types.js'

// Carrega .env da raiz do projeto
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../..')
dotenv.config({ path: path.join(rootDir, '.env') })

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) {
  console.error('❌ ERRO: TELEGRAM_BOT_TOKEN não foi configurado no .env')
  process.exit(1)
}

// Inicializa Session Store
let sessionStore: SessionStore
if (process.env.REDIS_URL) {
  console.log('📦 Usando RedisSessionStore:', process.env.REDIS_URL)
  sessionStore = new RedisSessionStore({ redisUrl: process.env.REDIS_URL })
} else {
  console.log('⚠️ Usando MemorySessionStore (sessões em memória com TTL de 30min)')
  sessionStore = new MemorySessionStore()
}

const bot = new Bot(token)
const engine = new ConversationEngine(sessionStore)

// Middleware de log de requisições
bot.use(async (ctx, next) => {
  const user = ctx.from?.username || ctx.from?.first_name || ctx.from?.id
  console.log(`[Telegram] Recebido evento de ${user} (Chat ID: ${ctx.chat?.id})`)
  await next()
})

// Tratamento de comandos
bot.command('start', async (ctx) => {
  if (!ctx.chat) return
  const adapter = new TelegramChannelAdapter(bot, ctx.chat.id)
  await engine.handleMessage({ userId: String(ctx.chat.id), text: '1' }, adapter)
})

bot.command('recomecar', async (ctx) => {
  if (!ctx.chat) return
  const adapter = new TelegramChannelAdapter(bot, ctx.chat.id)
  await engine.handleMessage({ userId: String(ctx.chat.id), text: '1' }, adapter)
})

bot.command('ajuda', async (ctx) => {
  if (!ctx.chat) return
  const adapter = new TelegramChannelAdapter(bot, ctx.chat.id)
  await engine.handleMessage({ userId: String(ctx.chat.id), text: '0' }, adapter)
})

// Tratamento de botões inline
bot.on('callback_query:data', async (ctx) => {
  const chatId = ctx.chat?.id || ctx.from.id
  const buttonPayload = ctx.callbackQuery.data
  await ctx.answerCallbackQuery()
  const adapter = new TelegramChannelAdapter(bot, chatId)
  await engine.handleMessage({ userId: String(chatId), buttonPayload }, adapter)
})

// Tratamento de fotos
bot.on('message:photo', async (ctx) => {
  const chatId = ctx.chat.id
  const photos = ctx.message.photo
  const bestPhoto = photos[photos.length - 1] // maior resolução
  if (!bestPhoto) return

  try {
    const file = await ctx.api.getFile(bestPhoto.file_id)
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`
    const response = await fetch(fileUrl)
    const buffer = Buffer.from(await response.arrayBuffer())

    const adapter = new TelegramChannelAdapter(bot, chatId)
    await engine.handleMessage({ userId: String(chatId), photoBuffer: buffer }, adapter)
  } catch (err) {
    console.error('Erro ao baixar foto:', err)
    await ctx.reply('⚠️ Ocorreu um erro ao processar sua foto. Por favor, tente novamente.')
  }
})

// Tratamento de mensagens de voz e áudio
bot.on(['message:voice', 'message:audio'], async (ctx) => {
  const chatId = ctx.chat.id
  const audioObj = ctx.message.voice || ctx.message.audio
  if (!audioObj) return

  try {
    const file = await ctx.api.getFile(audioObj.file_id)
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`
    const response = await fetch(fileUrl)
    const buffer = Buffer.from(await response.arrayBuffer())

    const adapter = new TelegramChannelAdapter(bot, chatId)
    await engine.handleMessage({ userId: String(chatId), audioBuffer: buffer }, adapter)
  } catch (err) {
    console.error('Erro ao baixar áudio:', err)
    await ctx.reply('⚠️ Ocorreu um erro ao processar seu áudio. Por favor, tente novamente.')
  }
})

// Tratamento de mensagens de texto
bot.on('message:text', async (ctx) => {
  const chatId = ctx.chat.id
  const adapter = new TelegramChannelAdapter(bot, chatId)
  await engine.handleMessage({ userId: String(chatId), text: ctx.message.text }, adapter)
})

// Tratamento de erros globais do bot
bot.catch((err) => {
  console.error('❌ Erro no bot Telegram:', err)
})

// Inicia polling
console.log('🚀 ZaPost Telegram Bot iniciado via Polling...')
bot.start()
