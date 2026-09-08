# ZaPost

Manda a foto e fala o que você quer. Sai pronto, em português e em inglês.

Micro-SaaS que transforma uma foto e um áudio em posts e carrosséis para redes sociais.
Público: brasileiros donos de pequeno negócio nos Estados Unidos.

As regras do projeto estão em [CLAUDE.md](CLAUDE.md). Leia antes de escrever código.

---

## Estado

**Fase 1 — provar o motor de render.** Nada de IA, nada de banco, nada de interface.
Um JSON entra, PNGs vendáveis saem. Se a qualidade não convencer aqui, o resto não importa.

---

## Estrutura

```
zapost/
├── CLAUDE.md                       # regras inegociáveis do projeto
├── packages/
│   ├── contracts/src/
│   │   └── creative-brief.ts       # ★ o contrato central — tudo passa por aqui
│   └── tokens/
│       ├── tokens.css              # paleta, tipografia, espaçamento
│       └── tailwind-preset.js      # o mesmo, para o Tailwind
├── samples/
│   └── brief-limpeza.json          # entrada de exemplo da Fase 1
├── services/render/                # (a construir) HTML/SVG → PNG
│   ├── templates/
│   └── src/
├── skills/                         # (a construir) skills de marketing em YAML
├── apps/api/                       # (fase 4) NestJS
├── apps/web/                       # (fase 4) Next.js
└── database/migrations/            # (fase 4)
```

O centro de gravidade é `packages/contracts`. O LLM devolve um `CreativeBrief`, o render
consome um `CreativeBrief`, o frontend exibe um `CreativeBrief`.

---

## Paleta

| Papel | Cor | Uso |
|---|---|---|
| Petróleo | `#0F2E2A` | Texto, estrutura, barras |
| Âmbar | `#FFB300` | O raio ⚡ — botão principal e créditos |
| Âmbar profundo | `#B87E00` | Âmbar legível sobre fundo claro |
| Papel | `#F4F6F4` | Fundo |
| Verde pronto | `#12B76A` | Aprovado |
| Vermelho | `#D92D20` | Erro e ação destrutiva |

O app é uma moldura para conteúdo colorido — os criativos usam as cores da marca **do
cliente**. Por isso a interface tem fundo calmo e um acento forte só.

---

## Como rodar

Precisa de Node 22+ e pnpm. Se `pnpm` não estiver no PATH:

```
npm install -g pnpm
```

(ou, num PowerShell como administrador, uma vez só: `corepack enable pnpm`)

```
pnpm install         # instala o workspace
pnpm check:sample    # valida os exemplos contra o contrato
pnpm typecheck       # verifica os tipos de todos os pacotes
pnpm build           # compila tudo
```

`pnpm check:sample` é a rede de proteção do contrato: se alguém mudar o `CreativeBrief`
e esquecer de atualizar os exemplos, quebra aqui e não em produção.

---

## Próximos passos da Fase 1

1. `services/render` com Satori + resvg (nunca Playwright — estoura a RAM da VPS)
2. Três templates: `bold-price`, `photo-overlay`, `clean-split`
3. CLI: `pnpm render samples/brief-limpeza.json --out ./out`
4. Conferir os PNGs em PT e EN, em tela de celular de verdade

---

## Documentos

- [Produto e arquitetura](https://claude.ai/code/artifact/3e3e1b99-d427-40c0-ab59-75145d66dea3)
- [Protótipo navegável das telas](https://claude.ai/code/artifact/acdfdcab-f9a2-4fa7-9ef4-4511ec61e4b6)
