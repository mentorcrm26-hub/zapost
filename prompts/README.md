# Os prompts do ZaPost

Oito prompts, na ordem. Cada um abre uma sessão de IA nova, na pasta do projeto.

**Nunca peça o produto inteiro num prompt só.** A IA entrega, compila e parece pronto —
e todas as decisões que a gente refinou vão virar escolha genérica de SaaS. O código é a
parte fácil; o produto são as decisões.

---

## A ordem

| # | Arquivo | Entrega | Portão para seguir |
|---|---|---|---|
| 1 | `fase-1-render.md` | Motor de render, 3 templates, CLI | **Você olharia esses PNGs e postaria?** |
| 2 | `fase-2-ia.md` | Áudio → transcrição → LLM → JSON válido → PNG | Validou de primeira em 8 de 10? Custo abaixo de $0,03? |
| 3 | `fase-3-bot.md` | A conversa: briefing, botões, sessão, entrega | Alguém que nunca viu conseguiu criar um post sozinho? |
| 4a | `fase-4a-fundacao.md` | API, banco, multi-tenant, login | Um tenant enxerga dado do outro? Se sim, pare tudo |
| 4b | `fase-4b-webapp.md` | As 11 telas do cliente | Funciona em 360px? Alguém criou post sem ajuda? |
| 4c | `fase-4c-admin.md` | Sala de controle: custos, skills, aprendizados | Você consegue ver quem está queimando sua margem? |
| 5 | `fase-5-cobranca.md` | Créditos, Stripe, GA4 e Ads | Um clique de anúncio chega até a venda 3 dias depois? |
| 6 | `fase-6-lancamento.md` | Página de vendas, teste grátis, legal | Um visitante gera post sem cadastro em 2 minutos? |

---

## Como copiar

Os `.md` têm explicação em volta. Os `.txt` em `prompts/txt/` têm **só o prompt** —
abre, Ctrl+A, Ctrl+C, cola na IA.

Editou um `.md`? Rode `pnpm prompts` para regenerar os `.txt`.

---

## O portão da Fase 1 é o único que pode matar o projeto

Depois do prompt 1 você terá PNGs numa pasta e mais nada — sem login, sem cobrança,
sem WhatsApp. Parece pouco. Mas eles respondem a única pergunta que decide tudo:

> uma dona de salão em Framingham postaria isso?

Se sim, as outras sete semanas se justificam. Se não, você descobriu em uma semana em
vez de dois meses — e o problema é template, que se conserta, não arquitetura, que não.

**Não pule para a Fase 2 antes de responder isso olhando as imagens no celular.**

---

## Por que a 4 tem três partes

A Fase 4 é a maior do projeto: banco, autenticação, onze telas e um painel. Num prompt
só, a IA faz banco e telas mal, porque são disciplinas diferentes. Separada, cada
sessão faz uma coisa bem.

A 5 junta cobrança e medição de propósito: **é o mesmo webhook do Stripe que confirma o
pagamento e dispara a conversão do Google Ads.** Separar seria escrever o mesmo código
duas vezes.

---

## A anatomia, se você quiser escrever os seus

| Bloco | Por que existe |
|---|---|
| Contexto em 3 linhas | Sem isso a IA escreve SaaS genérico |
| **Leia antes de codar** | Faz carregar as regras em vez de adivinhar |
| Entregas numeradas | Ambiguidade vira retrabalho |
| Restrições | O que ela faria de errado por padrão — Playwright é o caso clássico |
| **Critério de aceite** | O que quase todo mundo esquece. Sem ele, "pronto" é opinião |
| Não faça | Impede alargamento de escopo, o erro mais caro |
| Ao terminar | Obriga a rodar de verdade em vez de só entregar arquivo |

---

## Entre uma fase e outra

Rode sempre, antes de abrir o próximo prompt:

```
pnpm check:sample    # o contrato e os exemplos ainda combinam?
pnpm typecheck       # nada quebrou nos outros pacotes?
pnpm build
```

Se o `CreativeBrief` mudou, o `check:sample` quebra — e é exatamente aí que você quer
descobrir, não em produção.

---

## Documentos de apoio

- [Produto e arquitetura](https://claude.ai/code/artifact/3e3e1b99-d427-40c0-ab59-75145d66dea3)
- [Protótipo navegável das telas](https://claude.ai/code/artifact/acdfdcab-f9a2-4fa7-9ef4-4511ec61e4b6)
- `../CLAUDE.md` — as 17 regras inegociáveis
