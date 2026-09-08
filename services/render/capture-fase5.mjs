import puppeteer from 'puppeteer'
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
  const buttons = await page.$$('button')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text && text.includes('Mudar Plano')) {
      await btn.click()
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'planos_stripe_mensal.png') })
      console.log('Screenshot 2 salvo: planos_stripe_mensal.png')
      break
    }
  }

  // 3. Alternar para Anual
  const modalButtons = await page.$$('button')
  for (const btn of modalButtons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text && text.includes('Anual')) {
      await btn.click()
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'planos_stripe_anual.png') })
      console.log('Screenshot 3 salvo: planos_stripe_anual.png')
      break
    }
  }

  await browser.close()
  console.log('Capturas concluídas com sucesso!')
}

run().catch((err) => {
  console.error('Erro na captura:', err)
  process.exit(1)
})
