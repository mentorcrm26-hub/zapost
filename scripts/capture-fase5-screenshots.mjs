import puppeteer from '../services/render/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js'
import path from 'path'

const ARTIFACTS_DIR = 'C:/Users/Daian/.gemini/antigravity-ide/brain/39cb5fe0-7f30-4c37-a94a-ddab02309646'

async function run() {
  console.log('Iniciando captura com Puppeteer...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })

  // 1. Minha Conta
  console.log('Navegando para http://localhost:3005/conta...')
  await page.goto('http://localhost:3005/conta', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'minha_conta_fase5.png'), fullPage: true })
  console.log('Screenshot 1 salvo: minha_conta_fase5.png')

  // 2. Clicar em "Mudar Plano" para abrir Modal
  console.log('Abrindo modal de planos...')
  const mudarPlanoBtn = await page.$('button ::-p-text(Mudar Plano)')
  if (mudarPlanoBtn) {
    await mudarPlanoBtn.click()
    await new Promise((r) => setTimeout(r, 600))
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'planos_stripe_mensal.png') })
    console.log('Screenshot 2 salvo: planos_stripe_mensal.png')

    // 3. Alternar para Anual
    const anualBtn = await page.$('button ::-p-text(Anual)')
    if (anualBtn) {
      await anualBtn.click()
      await new Promise((r) => setTimeout(r, 600))
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'planos_stripe_anual.png') })
      console.log('Screenshot 3 salvo: planos_stripe_anual.png')
    }
  }

  await browser.close()
  console.log('Capturas concluídas com sucesso!')
}

run().catch((err) => {
  console.error('Erro na captura:', err)
  process.exit(1)
})
