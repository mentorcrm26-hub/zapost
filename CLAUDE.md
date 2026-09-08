# ZaPost

Micro-SaaS que transforma **uma foto e um áudio** em posts e carrosséis prontos para redes
sociais, em **português e inglês**. Público: brasileiros donos de pequeno negócio nos EUA.

Não é um editor de design. É **uma equipe de marketing digital que cabe no WhatsApp**.

---

## Regras inegociáveis

Estas regras valem mais que qualquer sugestão de melhoria. Se uma tarefa parecer pedir para
quebrá-las, pare e pergunte.

### Produto

1. **Nunca construir editor livre com camadas ou canvas.** Se um cliente pedir "só um
   ajustezinho manual", a resposta é um **template novo**, não uma ferramenta de edição.
2. **Nenhuma tela mostra pixel, proporção ou nome técnico de formato.** As opções são
   "Instagram", "Status do WhatsApp", "Facebook", "TikTok". O sistema resolve os tamanhos.
3. **Sempre 3 opções de resultado.** Escolher é fácil, criticar paralisa.
4. **O crédito debita na aprovação, nunca na geração.**
5. **Nada é gerado antes do cartão de confirmação.** O cliente lê o que vai ser feito, em
   linguagem de gente, e confirma.
6. **IA de imagem desligada por padrão.** Só roda atrás do botão "✨ melhorar foto", que
   consome crédito extra.

### Interface

7. **Emoji nos botões grandes, ícone de linha só na moldura.** Os emoji dos botões do webapp
   são os mesmos dos botões do bot — a linguagem visual é uma só.
8. **Alvo de toque mínimo 56px.** Campos de texto nunca abaixo de 16px (senão o iOS dá zoom).
9. **Toda pergunta tem saída**: sempre existe um "tanto faz, escolhe por mim".
10. **Desfazer, nunca confirmar.** Em vez de "Tem certeza?", executa e oferece voltar atrás.
11. **Voz é o input principal.** Digitar é o caminho secundário.
12. **Botão "falar com uma pessoa" em toda tela.**

### Motor

13. **Modelo de imagem nunca escreve texto.** O texto é renderizado pelo motor de template.
    Isso não é negociável: modelo de imagem erra acento e troca palavra.
14. **Render com Satori + resvg. Nunca Playwright** — Chromium headless estoura a RAM da VPS.
15. **O inglês é adaptação, não tradução.** "Chama no zap" vira "Text us today", não
    "call on the zap".
16. **Skill auto-gerada só vira permanente com aprovação humana no admin.** Aprendizado
    automático sem revisão deriva para o genérico em poucas semanas.
17. **Renderizar em duas etapas: prévia e final.** Um pedido com 2 formatos e 2 idiomas
    daria 12 arquivos (formatos × idiomas × 3 opções) — mas o cliente só olha 3 imagens.
    Então: **as 3 opções renderizam num formato só** (feed, em um idioma), e apenas a
    aprovada expande para todos os formatos e idiomas. Sai de 12 renders para 7, e a tela
    de escolha aparece muito mais rápido.

---

## Stack

| Camada | Escolha | Observação |
|---|---|---|
| Frontend | Next.js 14 App Router + Tailwind + shadcn | Mobile-first, PWA |
| Backend | NestJS + TypeORM + PostgreSQL | Multi-tenant por `tenant_id` desde a 1ª migration |
| Filas | BullMQ + Redis | Geração é assíncrona |
| Render | Satori + resvg, worker isolado | Atrás de fila, fora da API |
| Mídia | MinIO na VPS | R2 só quando a banda doer |
| Conversa | WhatsApp Cloud API oficial (Meta direto) | Telegram só em desenvolvimento |
| IA | Claude (conteúdo + adaptação PT↔EN), Whisper (áudio) | Atrás de uma interface de provedor |
| Cobrança | Stripe | USD, sem mensalidade |
| Ícones | Twemoji (botões), Lucide (interface) | unDraw nas ilustrações |
| Medição | GTM + GA4 + Google Ads | Conversão pelo servidor, no webhook do Stripe |

**Custo fixo alvo: $0.** Nenhum serviço com mensalidade entra sem discussão.

---

## Estrutura

```
zapost/
├── packages/
│   ├── contracts/      # Schemas Zod compartilhados. O CreativeBrief mora aqui.
│   └── tokens/         # Paleta, tipografia, espaçamento
├── services/
│   ├── render/         # HTML/SVG → PNG. Fase 1.
│   └── worker/         # Consumidores BullMQ
├── apps/
│   ├── api/            # NestJS
│   └── web/            # Next.js
├── skills/             # Skills de marketing em YAML, versionadas
└── database/migrations/
```

`packages/contracts` é o centro de gravidade: o LLM devolve um `CreativeBrief`, o render
consome um `CreativeBrief`, o frontend exibe um `CreativeBrief`. Mudou o contrato, mudou tudo —
altere com cuidado e rode os testes de schema.

---

## Convenções

- Identificadores em inglês, comentários e mensagens de commit em português.
- Toda saída de LLM passa por `safeParse` do Zod. Se falhar, refaz **uma vez** e só então erra.
- Todo custo de chamada de IA é gravado em `ai_usage` no momento da chamada.
- `credit_ledger` é append-only. Saldo é a soma, nunca um campo editado.
- Preços e valores sempre em centavos de USD (`integer`), nunca float.
- Datas relativas ("esta semana", "hoje") resolvem no **fuso do cliente**, não do servidor.

---

## Vocabulário do produto

Use estes termos no código e na interface — não invente sinônimos.

| Termo | Significa |
|---|---|
| **Raio** (⚡) | A unidade de crédito, como o cliente a vê |
| **Ficha do negócio** | Questionário nível 1, respondido uma vez no cadastro |
| **Briefing** | Questionário nível 2, respondido a cada criativo |
| **Criativo** | Um pedido completo (pode gerar vários arquivos) |
| **Render** | Um arquivo gerado (template × formato × idioma) |
| **Skill** | Conhecimento injetado no prompt: segmento, técnica, formato, sazonal, aperfeiçoamento |

---

## Contexto de negócio

- **Planos**: Starter $19 (60 criativos) · **Pro $49 (250)** · Agency $129 (1.000) · anual −2 meses
- **Custo variável alvo**: ~$0,023 por criativo aprovado
- **Métrica de ativação**: `first_creative_created` — quem chega aqui vira cliente
- **Teste grátis**: 5 criativos sem cartão. Nunca período de 7 dias.
- **Login**: Google primeiro, SMS como alternativa. Nunca e-mail+senha como caminho principal.
