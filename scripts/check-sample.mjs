/**
 * Valida os JSONs de exemplo contra os schemas do contrato.
 *
 *   pnpm check:sample
 *
 * Serve de rede de proteção: se alguém mudar o CreativeBrief e esquecer de
 * atualizar os exemplos (ou vice-versa), isso quebra aqui e não em produção.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import * as C from '../packages/contracts/dist/index.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const samplePath = resolve(root, 'samples/brief-limpeza.json')
const s = JSON.parse(readFileSync(samplePath, 'utf8'))

const checks = [
  ['BusinessProfile', C.BusinessProfile, s.businessProfile],
  ['BrandKit',        C.BrandKit,        s.brandKit],
  ['CreativeRequest', C.CreativeRequest, s.creativeRequest],
  ['CreativeBrief',   C.CreativeBrief,   s.creativeBrief],
]

let failures = 0
console.log(`\nValidando ${samplePath}\n`)

for (const [name, schema, data] of checks) {
  const r = schema.safeParse(data)
  if (r.success) {
    console.log(`  ok      ${name}`)
  } else {
    failures++
    console.log(`  FALHOU  ${name}`)
    for (const issue of r.error.issues.slice(0, 5)) {
      console.log(`          ${issue.path.join('.')}: ${issue.message}`)
    }
  }
}

const { objective, networks, languages } = s.creativeRequest
const formats = C.formatsFor(networks)

console.log(`
  objetivo "${objective}" seleciona a estratégia "${C.AWARENESS_BY_OBJECTIVE[objective]}"
  redes ${JSON.stringify(networks)}
    resolvem em ${JSON.stringify(formats)}
  ${formats.length} formatos x ${languages.length} idiomas x 3 opções = ${formats.length * languages.length * 3} arquivos por pedido
`)

process.exit(failures === 0 ? 0 : 1)
