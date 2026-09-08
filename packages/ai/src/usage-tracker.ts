import { appendFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AiUsageRecord } from './types.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(currentDir, '../../..')
const usageFilePath = resolve(rootDir, '.ai-usage.jsonl')

export function recordAiUsage(record: Omit<AiUsageRecord, 'timestamp'>): void {
  const isMock = record.provider.startsWith('mock')
  const fullRecord: AiUsageRecord = {
    timestamp: new Date().toISOString(),
    ...record,
    ...(isMock ? { costUsd: 0, mock: true } : {}),
  }

  const line = JSON.stringify(fullRecord) + '\n'

  try {
    appendFileSync(usageFilePath, line, 'utf8')
  } catch (err) {
    console.warn('[ai-usage] Falha ao registrar uso de IA em .ai-usage.jsonl:', err)
  }
}
