'use client'

import React, { useState } from 'react'
import {
  Cpu,
  RefreshCw,
  Play,
  Trash2,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Server,
  Radio
} from 'lucide-react'

interface QueueInfo {
  id: string
  name: string
  description: string
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  avgLatencyMs: number
  throughputPerMin: number
  status: 'healthy' | 'warning' | 'paused'
}

interface FailedJob {
  id: string
  queue: string
  tenantId: string
  tenantName: string
  errorReason: string
  attemptsMade: number
  failedAt: string
}

const INITIAL_QUEUES: QueueInfo[] = [
  {
    id: 'transcricao',
    name: 'Fila de Transcrição',
    description: 'Processamento de áudio via Whisper / Deepgram',
    waiting: 1,
    active: 2,
    completed: 1840,
    failed: 3,
    delayed: 0,
    avgLatencyMs: 840,
    throughputPerMin: 18,
    status: 'healthy',
  },
  {
    id: 'geracao',
    name: 'Fila de Geração LLM',
    description: 'Chamadas ao Claude 3.5 Sonnet / Haiku para CreativeBrief',
    waiting: 4,
    active: 3,
    completed: 4120,
    failed: 2,
    delayed: 0,
    avgLatencyMs: 1420,
    throughputPerMin: 28,
    status: 'healthy',
  },
  {
    id: 'render',
    name: 'Fila de Render Puppeteer',
    description: 'Renderização headless de templates 4:5 e 9:16 em alta resolução',
    waiting: 8,
    active: 4,
    completed: 8250,
    failed: 5,
    delayed: 0,
    avgLatencyMs: 1100,
    throughputPerMin: 42,
    status: 'healthy',
  },
  {
    id: 'entrega',
    name: 'Fila de Entrega / Notificação',
    description: 'Webhooks, Telegram Bot e disparos WhatsApp',
    waiting: 0,
    active: 1,
    completed: 5310,
    failed: 1,
    delayed: 0,
    avgLatencyMs: 320,
    throughputPerMin: 24,
    status: 'healthy',
  },
]

const INITIAL_FAILED_JOBS: FailedJob[] = [
  {
    id: 'job-render-8821',
    queue: 'render',
    tenantId: 't-003',
    tenantName: 'Auto Peças Silva',
    errorReason: 'Navigation timeout 15000ms exceeded while loading Google Fonts',
    attemptsMade: 3,
    failedAt: '07/09 19:42',
  },
  {
    id: 'job-geracao-4190',
    queue: 'geracao',
    tenantId: 't-001',
    tenantName: 'Barbearia Don Corleone',
    errorReason: 'Anthropic rate limit 429 - provider failover triggered successfully',
    attemptsMade: 2,
    failedAt: '07/09 18:10',
  },
  {
    id: 'job-transcricao-1102',
    queue: 'transcricao',
    tenantId: 't-007',
    tenantName: 'Marmitaria Fitness',
    errorReason: 'Audio payload corrupted / unreadable format .ogg',
    attemptsMade: 3,
    failedAt: '07/09 16:04',
  },
]

export default function FilasPage() {
  const [queues, setQueues] = useState<QueueInfo[]>(INITIAL_QUEUES)
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>(INITIAL_FAILED_JOBS)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showFeedback('Métricas das filas atualizadas em tempo real!')
    }, 600)
  }

  const handleRetryJob = (jobId: string) => {
    setFailedJobs(failedJobs.filter((j) => j.id !== jobId))
    showFeedback(`Job ${jobId} reenviado para a fila de execução!`)
  }

  const handleRetryAllFailed = () => {
    const count = failedJobs.length
    setFailedJobs([])
    showFeedback(`${count} jobs falhos reenfileirados para reprocessamento imediato!`)
  }

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  const totalWaiting = queues.reduce((acc, q) => acc + q.waiting, 0)
  const totalActive = queues.reduce((acc, q) => acc + q.active, 0)
  const totalFailed = failedJobs.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Cpu className="w-6 h-6 text-amber-400" />
            Monitor de Filas BullMQ & Jobs
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Status operacional, latência média e gestão de Dead Letter Queue das 4 etapas assíncronas do ZaPost.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            Atualizar
          </button>

          {failedJobs.length > 0 && (
            <button
              onClick={handleRetryAllFailed}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Reprocessar Todos Falhos ({failedJobs.length})
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Global Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Em Execução (Active)</div>
            <div className="text-2xl font-bold text-sky-400 font-mono mt-1">{totalActive}</div>
          </div>
          <Activity className="w-6 h-6 text-sky-400/60 animate-pulse" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Aguardando (Waiting)</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{totalWaiting}</div>
          </div>
          <Clock className="w-6 h-6 text-amber-400/60" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Jobs com Falha (DLQ)</div>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{totalFailed}</div>
          </div>
          <AlertOctagon className="w-6 h-6 text-rose-400/60" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Workers Conectados</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">4 / 4</div>
          </div>
          <Radio className="w-6 h-6 text-emerald-400/60" />
        </div>
      </div>

      {/* Queues List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queues.map((q) => (
          <div key={q.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{q.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    Online
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{q.description}</p>
              </div>
              <span className="text-xs font-mono text-neutral-500">ID: {q.id}</span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-center font-mono">
              <div className="bg-neutral-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-neutral-500 block">Waiting</span>
                <span className="text-sm font-bold text-amber-400">{q.waiting}</span>
              </div>
              <div className="bg-neutral-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-neutral-500 block">Active</span>
                <span className="text-sm font-bold text-sky-400">{q.active}</span>
              </div>
              <div className="bg-neutral-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-neutral-500 block">Done</span>
                <span className="text-sm font-bold text-emerald-400">{q.completed}</span>
              </div>
              <div className="bg-neutral-950/60 p-2 rounded-lg">
                <span className="text-[10px] text-neutral-500 block">Failed</span>
                <span className="text-sm font-bold text-rose-400">{q.failed}</span>
              </div>
            </div>

            {/* Throughput & Latency */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-1">
              <span>Latência Média: <strong className="text-white">{q.avgLatencyMs}ms</strong></span>
              <span>Throughput: <strong className="text-emerald-400">{q.throughputPerMin} jobs/min</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Dead Letter Queue & Failed Jobs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Dead Letter Queue (Jobs com Falha)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Jobs que excederam o número máximo de retentativas automáticas e requerem reprocessamento manual.
            </p>
          </div>
        </div>

        {failedJobs.length === 0 ? (
          <div className="bg-neutral-950 rounded-xl p-8 text-center text-xs text-neutral-500 font-mono">
            Nenhum job com falha no momento. Todas as filas estão limpas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Fila</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Motivo da Falha</th>
                  <th className="py-3 px-4">Tentativas</th>
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-mono">
                {failedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-amber-400 font-bold">{job.id}</td>
                    <td className="py-3.5 px-4 text-neutral-300">{job.queue}</td>
                    <td className="py-3.5 px-4 font-sans text-white">{job.tenantName}</td>
                    <td className="py-3.5 px-4 text-rose-300 text-[11px] max-w-xs truncate font-sans">
                      {job.errorReason}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">{job.attemptsMade}/3</td>
                    <td className="py-3.5 px-4 text-neutral-500">{job.failedAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRetryJob(job.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        Reprocessar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
