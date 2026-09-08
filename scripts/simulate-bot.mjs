#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

// Importa componentes do pacote conversation
import {
  ConversationEngine,
  MemorySessionStore,
  MemoryChannelAdapter,
} from '../packages/conversation/dist/index.js'

async function runSimulation() {
  console.log('='.repeat(70))
  console.log('🚀 INICIANDO SIMULAÇÃO DA MÁQUINA DE ESTADOS DO ZAPOST (FASE 3)')
  console.log('='.repeat(70))

  const sessionStore = new MemorySessionStore()
  const engine = new ConversationEngine(sessionStore)
  const adapter = new MemoryChannelAdapter()

  const userId = 'simulated-user-123'

  /* =========================================================================
     CENÁRIO 1: Envio parcial (Foto sem áudio, depois áudio)
     ========================================================================= */
  console.log('\n--- [TESTE 1] Envio Parcial: Foto isolada, depois Áudio ---')

  // 1.1 Inicia conversa mandando apenas foto
  console.log('\n👤 [Usuário]: (Envia foto do serviço)')
  await engine.handleMessage(
    {
      userId,
      photoUrl: 'sample-sala-limpa',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 1.2 Envia o áudio explicativo
  console.log('\n👤 [Usuário]: (Envia áudio: "Oi, queria divulgar limpeza de casa pra essa semana por 120 dólares")')
  await engine.handleMessage(
    {
      userId,
      text: 'Oi, queria divulgar limpeza de casa pra essa semana por 120 dólares em Framingham',
    },
    adapter
  )
  imprimirMensagens(adapter)

  /* =========================================================================
     CENÁRIO 2: Caminho Feliz do Briefing Adaptativo
     ========================================================================= */
  console.log('\n--- [TESTE 2] Briefing Adaptativo, Confirmação e Geração ---')

  // 2.1 Responde Objetivo: Promoção
  console.log('\n👤 [Usuário Clica]: 🏷️ Fazer promoção')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'obj_promocao',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 2.2 Responde Oferta: Falei no áudio
  console.log('\n👤 [Usuário Clica]: ✅ Falei no áudio ($120)')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'oferta_audio',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 2.3 Responde Prazo: Esta semana
  console.log('\n👤 [Usuário Clica]: 📅 Esta semana')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'prazo_esta_semana',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 2.4 Responde Redes: Insta + WhatsApp
  console.log('\n👤 [Usuário Clica]: 📸 Insta + WhatsApp')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'rede_insta_status',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 2.5 Confirmação do Cartão
  console.log('\n👤 [Usuário Clica]: ⚡ Sim, pode gerar!')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'confirma_sim',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // 2.6 Escolha do Template 1 (bold-price)
  console.log('\n👤 [Usuário Clica]: 1️⃣ Opção 1 (Preço Gigante)')
  await engine.handleMessage(
    {
      userId,
      buttonPayload: 'escolha_bold-price',
    },
    adapter
  )
  imprimirMensagens(adapter)

  /* =========================================================================
     CENÁRIO 3: Resposta Inválida e Saída de Emergência
     ========================================================================= */
  console.log('\n--- [TESTE 3] Resposta Inválida e Saída de Emergência ---')

  const userErr = 'user-err-456'
  // Inicia
  await engine.handleMessage({ userId: userErr, text: 'Olá' }, adapter)
  adapter.clear()

  // Usuário manda foto e texto
  await engine.handleMessage(
    {
      userId: userErr,
      photoUrl: 'sample-sala-limpa',
      text: 'Quero divulgar limpeza',
    },
    adapter
  )
  adapter.clear()

  // No estado de objetivo, usuário manda texto inválido
  console.log('\n👤 [Usuário]: "Batata frita com queijo"')
  await engine.handleMessage(
    {
      userId: userErr,
      text: 'Batata frita com queijo',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // Usuário escolhe falar com atendente (0)
  console.log('\n👤 [Usuário]: "0"')
  await engine.handleMessage(
    {
      userId: userErr,
      text: '0',
    },
    adapter
  )
  imprimirMensagens(adapter)

  // Usuário escolhe recomeçar (1)
  console.log('\n👤 [Usuário]: "1"')
  await engine.handleMessage(
    {
      userId: userErr,
      text: '1',
    },
    adapter
  )
  imprimirMensagens(adapter)

  /* =========================================================================
     CENÁRIO 4: Expiração de Sessão por Inatividade (> 30 min)
     ========================================================================= */
  console.log('\n--- [TESTE 4] Expiração de Sessão por Inatividade ---')
  const userExpired = 'user-expired-789'
  await engine.handleMessage({ userId: userExpired, photoUrl: 'sample-sala-limpa' }, adapter)
  adapter.clear()

  // Simula passagem de tempo: 31 minutos no passado
  const sess = await sessionStore.get(userExpired)
  if (sess) {
    sess.lastActivity = Date.now() - 31 * 60 * 1000
    // Salva com TTL expirado ou remove
    await sessionStore.set(userExpired, sess, 0)
  }

  // Próxima mensagem deve recomeçar sessão
  console.log('\n👤 [Usuário após 31 minutos]: "Ainda tá aí?"')
  await engine.handleMessage({ userId: userExpired, text: 'Ainda tá aí?' }, adapter)
  imprimirMensagens(adapter)

  console.log('\n' + '='.repeat(70))
  console.log('✅ TODAS AS SIMULAÇÕES DA FASE 3 CONCLUÍDAS COM SUCESSO!')
  console.log('='.repeat(70))
}

function imprimirMensagens(adapter) {
  const msgs = adapter.getSentMessages()
  for (const m of msgs) {
    if (m.type === 'text') {
      console.log(`🤖 [Bot]: ${m.text.replace(/<[^>]+>/g, '')}`)
    } else if (m.type === 'buttons') {
      console.log(`🤖 [Bot]: ${m.text.replace(/<[^>]+>/g, '')}`)
      console.log(`   [Botões]: ${m.buttons.map((b) => `[${b.label}]`).join('  ')}`)
    } else if (m.type === 'images') {
      console.log(`🤖 [Bot]: (Enviou ${m.images.length} imagens) - Legenda: "${m.caption}"`)
    } else if (m.type === 'file') {
      const fname = m.file?.filename || m.filename || 'criativo.png'
      console.log(`🤖 [Bot]: (Enviou Arquivo: "${fname}") - Descrição: "${m.name}"`)
    }
  }
  adapter.clear()
}

runSimulation().catch((err) => {
  console.error('❌ ERRO NA SIMULAÇÃO:', err)
  process.exit(1)
})
