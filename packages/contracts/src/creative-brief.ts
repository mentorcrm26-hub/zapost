import { z } from 'zod'

/**
 * ZaPost — o contrato central.
 *
 * Tudo passa por aqui: o LLM devolve um CreativeBrief, o motor de render consome
 * um CreativeBrief, o frontend exibe um CreativeBrief. Mudou este arquivo, mudou
 * o sistema inteiro — altere com cuidado.
 *
 * Fluxo:
 *   BusinessProfile (uma vez)  ─┐
 *   BrandKit        (uma vez)  ─┼─→ LLM ─→ CreativeBrief ─→ RenderJob[] ─→ arquivos
 *   CreativeRequest (por post) ─┘
 */

/* ============================================================
   Nível 1 — Ficha do negócio (respondida uma vez, no cadastro)
   ============================================================ */

export const Segment = z.enum([
  'comida', 'beleza', 'limpeza', 'construcao',
  'transporte', 'loja', 'servicos', 'saude', 'outro',
])

export const Language = z.enum(['pt', 'en'])

export const ContactChannel = z.enum(['whatsapp', 'direct', 'telefone', 'link'])

export const BusinessProfile = z.object({
  segment: Segment,
  /** Cidade e estado. Alimenta o conteúdo local: "atendo Framingham e região". */
  city: z.string().min(1),
  state: z.string().length(2),
  /** IANA, ex. "America/New_York". "hoje" e "esta semana" resolvem NESTE fuso. */
  timezone: z.string().min(1),
  audience: z.enum(['brasileiros', 'americanos', 'ambos']),
  languages: z.array(Language).min(1),
  contactChannel: ContactChannel,
  contactValue: z.string().min(1),
})

export const BrandKit = z.object({
  logoUrl: z.string().url().nullable(),
  /** Extraídas do logo. A primeira é a dominante. */
  colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(1).max(4),
  fontFamily: z.string().nullable(),
  handle: z.string().nullable(),
  phone: z.string().nullable(),
  signature: z.string().nullable(),
})

/* ============================================================
   Nível 2 — Briefing do criativo (3 a 5 toques, adaptativo)
   ============================================================ */

export const Objective = z.enum([
  'divulgar',        // divulgar serviço ou produto
  'promocao',        // oferta com preço e prazo
  'trabalho_feito',  // antes e depois, portfólio
  'data',            // data comemorativa
  'vaga',            // vaga de emprego
  'depoimento',      // depoimento de cliente
])

export const Network = z.enum(['instagram', 'whatsapp_status', 'facebook', 'tiktok'])

/** Perguntado só quando o objetivo é `divulgar` ou `promocao`. */
export const Offer = z.object({
  /** Centavos de USD. Nunca float. */
  priceCents: z.number().int().positive().nullable(),
  priceMode: z.enum(['exato', 'a_partir_de']),
  discountPercent: z.number().int().min(1).max(90).nullable(),
})

/** Perguntado só quando o objetivo é `promocao`. */
export const Deadline = z.enum(['hoje', 'esta_semana', 'ate_acabar', 'sem_prazo'])

export const CreativeRequest = z.object({
  objective: Objective,
  offer: Offer.nullable(),
  deadline: Deadline.nullable(),
  /** A transcrição do áudio, ou o texto digitado. É o que só o cliente sabe. */
  rawInput: z.string().min(1),
  photoIds: z.array(z.string()).default([]),
  networks: z.array(Network).min(1),
  languages: z.array(Language).min(1),
  kind: z.enum(['post', 'carousel']),
  /** Só para carrossel. Entre 3 e 8 — abaixo de 3 não é carrossel, acima de 8 ninguém termina. */
  slideCount: z.number().int().min(3).max(8).nullable(),
  /** Ligado só pelo botão "✨ melhorar foto". Consome crédito extra. */
  enhancePhoto: z.boolean().default(false),
})

/* ============================================================
   Estratégia — os 5 níveis de consciência (Eugene Schwartz)
   ============================================================ */

export const AwarenessLevel = z.enum([
  'unaware', 'problem_aware', 'solution_aware', 'product_aware', 'most_aware',
])

/**
 * O encaixe que sustenta o produto: a primeira pergunta do briefing já seleciona
 * a estratégia profissional de headline, e o cliente nunca sabe que isso existe.
 *
 *   "Promoção"              → most_aware      → headline vai direto no preço
 *   "Divulgar meu serviço"  → problem_aware   → headline começa pela dor
 *   "Mostrar trabalho feito"→ solution_aware  → headline lidera pelo resultado
 */
export const AWARENESS_BY_OBJECTIVE: Record<
  z.infer<typeof Objective>,
  z.infer<typeof AwarenessLevel>
> = {
  promocao:       'most_aware',
  divulgar:       'problem_aware',
  trabalho_feito: 'solution_aware',
  depoimento:     'product_aware',
  vaga:           'solution_aware',
  data:           'unaware',
}

/* ============================================================
   Saída do LLM — validada com safeParse. Falhou, refaz UMA vez.
   ============================================================ */

/** Um slide de carrossel. */
export const Slide = z.object({
  eyebrow: z.string().max(28).nullish(),
  headline: z.string().min(1).max(64),
  body: z.string().max(140).nullish(),
})

export const LocalizedContent = z.object({
  /** O que aparece grande na imagem. Curto: tem que caber e ser lido em miniatura. */
  headline: z.string().min(1).max(64),
  subheadline: z.string().max(90).nullish(),
  /** Já formatado para exibição: "$120", "a partir de $120". */
  priceLabel: z.string().max(32).nullish(),
  cta: z.string().min(1).max(40),
  /** A legenda para copiar e colar. Esta pode ser longa. */
  caption: z.string().min(1).max(2200),
  hashtags: z.array(z.string().regex(/^#\w+$/)).max(12).default([]),
  slides: z.preprocess(
    (v) => (Array.isArray(v) && v.length === 0 ? null : v),
    z.array(Slide).min(3).max(8).nullish(),
  ),
})

export const CreativeBrief = z.object({
  requestId: z.string().uuid(),
  awarenessLevel: AwarenessLevel,
  /** Ids de template sugeridos pela skill, em ordem de preferência. */
  templateHints: z.array(z.string()).min(1).max(5),
  /** Skills usadas nesta geração. Guardar para medir qual aprova mais. */
  skillsUsed: z.array(z.string()),
  content: z.object({
    pt: LocalizedContent.nullish(),
    /** Adaptação, não tradução: "chama no zap" → "Text us Today". */
    en: LocalizedContent.nullish(),
  }).refine(
    (c) => Boolean(c.pt || c.en),
    { message: 'Pelo menos um idioma precisa vir preenchido' },
  ),
})

/* ============================================================
   Render — o que o worker recebe
   ============================================================ */

export const Format = z.enum(['feed_45', 'story_916', 'square_11', 'carousel_45'])

/** O cliente escolhe rede; o sistema resolve formato. Ele nunca vê "1080 × 1350". */
export const FORMATS_BY_NETWORK: Record<z.infer<typeof Network>, z.infer<typeof Format>[]> = {
  instagram:       ['feed_45', 'story_916'],
  whatsapp_status: ['story_916'],
  facebook:        ['feed_45', 'square_11'],
  tiktok:          ['story_916'],
}

export const FORMAT_SIZES: Record<z.infer<typeof Format>, { w: number; h: number }> = {
  feed_45:     { w: 1080, h: 1350 },
  story_916:   { w: 1080, h: 1920 },
  square_11:   { w: 1080, h: 1080 },
  carousel_45: { w: 1080, h: 1350 },
}

export const RenderJob = z.object({
  briefId: z.string().uuid(),
  templateId: z.string(),
  format: Format,
  language: Language,
  brandKit: BrandKit,
  content: LocalizedContent,
  photoUrl: z.string().url().nullable(),
  /** Marca d'água até a aprovação. Sai quando o crédito é debitado. */
  watermark: z.boolean().default(true),
})

/* ============================================================
   Tipos
   ============================================================ */

export type Segment = z.infer<typeof Segment>
export type Language = z.infer<typeof Language>
export type BusinessProfile = z.infer<typeof BusinessProfile>
export type BrandKit = z.infer<typeof BrandKit>
export type Objective = z.infer<typeof Objective>
export type Network = z.infer<typeof Network>
export type Offer = z.infer<typeof Offer>
export type Deadline = z.infer<typeof Deadline>
export type CreativeRequest = z.infer<typeof CreativeRequest>
export type AwarenessLevel = z.infer<typeof AwarenessLevel>
export type Slide = z.infer<typeof Slide>
export type LocalizedContent = z.infer<typeof LocalizedContent>
export type CreativeBrief = z.infer<typeof CreativeBrief>
export type Format = z.infer<typeof Format>
export type RenderJob = z.infer<typeof RenderJob>

/** Expande as redes escolhidas nos formatos a renderizar, sem repetir. */
export function formatsFor(networks: Network[]): Format[] {
  return [...new Set(networks.flatMap((n) => FORMATS_BY_NETWORK[n]))]
}
