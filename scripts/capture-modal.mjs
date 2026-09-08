import { chromium } from 'playwright'

const ARTIFACTS_DIR = 'C:/Users/Daian/.gemini/antigravity-ide/brain/39cb5fe0-7f30-4c37-a94a-ddab02309646'

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  })
  const page = await context.newPage()

  await page.goto('http://localhost:3005/conta')
  await page.waitForTimeout(1000)

  // Clicar em Mudar Plano
  await page.getByRole('button', { name: 'Mudar Plano' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${ARTIFACTS_DIR}/fase5_planos_stripe.png` })

  await browser.close()
  console.log('Screenshot do modal de planos salvo com sucesso!')
}

run()
