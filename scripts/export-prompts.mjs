/**
 * Extrai o prompt puro de cada prompts/fase-*.md para prompts/txt/*.txt
 *
 *   pnpm prompts
 *
 * Os .md têm explicação em volta; os .txt têm só o prompt. Abre o .txt,
 * Ctrl+A, Ctrl+C, e cola na IA — sem precisar selecionar dentro do bloco.
 *
 * Editou um .md? Rode de novo para regenerar os .txt.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'prompts')
const out = join(src, 'txt')

mkdirSync(out, { recursive: true })

const files = readdirSync(src)
  .filter((f) => f.startsWith('fase-') && f.endsWith('.md'))
  .sort()

let count = 0
for (const file of files) {
  const md = readFileSync(join(src, file), 'utf8')

  // Pega o conteúdo do primeiro bloco cercado por ``` — é sempre o prompt.
  const match = md.match(/^```\r?\n([\s\S]*?)^```\r?$/m)
  if (!match) {
    console.log(`  AVISO   ${file}: nenhum bloco de prompt encontrado`)
    continue
  }

  const target = file.replace(/\.md$/, '.txt')
  writeFileSync(join(out, target), match[1].trimEnd() + '\n', 'utf8')
  const lines = match[1].trimEnd().split('\n').length
  console.log(`  ok      ${target}  (${lines} linhas)`)
  count++
}

console.log(`\n${count} prompts exportados para prompts/txt/\n`)
