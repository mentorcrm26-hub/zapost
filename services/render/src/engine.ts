import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { FORMAT_SIZES, type RenderJob } from '@zapost/contracts'
import { getLoadedFonts } from './fonts.js'
import { getTemplate } from './templates/index.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(currentDir, '../../..')

/**
 * Converte arquivo local ou URL em data URI base64 para uso no Satori.
 */
export async function resolvePhotoDataUri(photoSource: string | null): Promise<string | null> {
  if (!photoSource) return null

  // Se já for data URI, retorna diretamente
  if (photoSource.startsWith('data:image/')) {
    return photoSource
  }

  // Se for URL http/https
  if (photoSource.startsWith('http://') || photoSource.startsWith('https://')) {
    try {
      const response = await fetch(photoSource)
      if (!response.ok) {
        console.warn(`[render] Falha ao baixar imagem: ${photoSource} (${response.status})`)
        return null
      }
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      return `data:${contentType};base64,${buffer.toString('base64')}`
    } catch (err) {
      console.warn(`[render] Erro ao buscar URL de imagem: ${photoSource}`, err)
      return null
    }
  }

  // Se for nome de arquivo ou ID local (ex: "sample-sala-limpa")
  const potentialPaths = [
    photoSource,
    resolve(rootDir, 'samples/assets', `${photoSource}.jpg`),
    resolve(rootDir, 'samples/assets', `${photoSource}.png`),
    resolve(rootDir, 'samples/assets', photoSource),
    resolve(rootDir, 'services/render/assets', `${photoSource}.jpg`),
    resolve(rootDir, 'services/render/assets', photoSource),
    resolve(rootDir, photoSource),
  ]

  for (const pathCandidate of potentialPaths) {
    if (existsSync(pathCandidate)) {
      const buffer = readFileSync(pathCandidate)
      const ext = pathCandidate.endsWith('.png') ? 'png' : 'jpeg'
      return `data:image/${ext};base64,${buffer.toString('base64')}`
    }
  }

  console.warn(`[render] Imagem não encontrada localmente: ${photoSource}`)
  return null
}

/**
 * Renderiza um RenderJob para SVG usando Satori.
 */
export async function renderJobToSvg(job: RenderJob): Promise<string> {
  const size = FORMAT_SIZES[job.format]
  if (!size) {
    throw new Error(`Formato desconhecido: ${job.format}`)
  }

  const template = getTemplate(job.templateId)
  const fonts = getLoadedFonts()
  const photoDataUri = await resolvePhotoDataUri(job.photoUrl)

  const element = template.render({
    job,
    width: size.w,
    height: size.h,
    photoDataUri,
  })

  // Satori JSX -> SVG
  const svg = await satori(element as any, {
    width: size.w,
    height: size.h,
    fonts,
  })

  return svg
}

/**
 * Renderiza um RenderJob diretamente para Buffer PNG usando Satori + resvg.
 */
export async function renderJob(job: RenderJob): Promise<Buffer> {
  const size = FORMAT_SIZES[job.format]
  const svg = await renderJobToSvg(job)

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: size.w,
    },
    font: {
      loadSystemFonts: false, // Garante determinismo total sem puxar fontes do SO
    },
  })

  const pngData = resvg.render()
  return pngData.asPng()
}
