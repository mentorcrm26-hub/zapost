# Prompt — Fase 1: o motor de render

Cole o bloco abaixo numa sessão de IA aberta na pasta do projeto.

Escopo deliberadamente estreito: **só o motor de render**. Não peça o produto inteiro num
prompt só — o resultado vira código genérico que não serve. Cada fase tem o seu.

---

```
Você vai trabalhar no ZaPost, um micro-SaaS que transforma uma foto e um áudio em posts
e carrosséis para redes sociais, em português e inglês. O público são brasileiros donos
de pequeno negócio nos Estados Unidos: dona de empresa de limpeza, salão, food truck.

Projeto em: D:\Backup PC HP\Projetos\Prosper 360\Maquina de Criativos\Arquivos

ANTES DE ESCREVER QUALQUER CÓDIGO, leia nesta ordem:
  1. CLAUDE.md — as 17 regras inegociáveis do projeto
  2. packages/contracts/src/creative-brief.ts — o contrato central, principalmente
     os tipos RenderJob, LocalizedContent, Format e FORMAT_SIZES
  3. samples/brief-limpeza.json — a entrada de teste

TAREFA — Fase 1: construir services/render

Um JSON entra, PNGs vendáveis saem. Sem IA, sem banco, sem interface, sem fila.
Se a qualidade da imagem não convencer aqui, o resto do produto não importa.

Entregas:

1. services/render/package.json como "@zapost/render", dentro do workspace pnpm,
   dependendo de @zapost/contracts e @zapost/tokens.

2. Pipeline com satori (JSX -> SVG) e @resvg/resvg-js (SVG -> PNG).
   NUNCA Playwright, Puppeteer ou Chrome headless: a VPS tem 8 GB e já roda outro
   projeto. Isso não é preferência, é restrição de infraestrutura.

3. Fontes baixadas como arquivo local em services/render/fonts/ e carregadas como
   buffer. Satori precisa do binário da fonte, não do nome dela. Escolha uma display
   de impacto para a headline e uma de texto legível para o resto.

4. Três templates, cada um recebendo um RenderJob e devolvendo o elemento do Satori:
     bold-price     — preço gigante, foto ao fundo escurecida
     photo-overlay  — foto sangrando, texto sobre gradiente na parte de baixo
     clean-split    — metade foto, metade bloco sólido na cor da marca do cliente

5. Cada template declara as próprias regras num objeto exportado: máximo de caracteres
   por campo, se exige foto, onde entra o logo, quais formatos suporta.

6. Ajuste automático do corpo da fonte para o texto caber na caixa sem estourar e sem
   cortar. Texto em português é cerca de 20% mais longo que em inglês — o mesmo
   template precisa aguentar os dois sem quebrar o layout.

7. Marca d'água discreta quando RenderJob.watermark for true.

8. CLI:
     pnpm render samples/brief-limpeza.json --out ./out
     pnpm render samples/brief-limpeza.json --out ./out --mode final --template bold-price

RESTRIÇÕES

- As cores do criativo vêm de brandKit.colors, que é a marca DO CLIENTE.
  Os tokens em packages/tokens são a paleta do ZaPost e servem só para a interface
  do app — nunca pinte o criativo do cliente com eles.
- Nenhuma chamada de modelo de IA nesta fase. Nenhuma.
- Nenhum texto é desenhado por modelo de imagem, agora nem nunca (regra 13).
- Regra 17: no modo prévia, as 3 opções renderizam em UM formato e UM idioma só
  (feed_45, primeiro idioma). Só no modo final é que a opção aprovada expande para
  todos os formatos e idiomas.
- Não invente campo fora do contrato. Se faltar alguma coisa, proponha a alteração em
  creative-brief.ts e me explique o porquê antes de mudar.

CRITÉRIO DE ACEITE

Rodar o CLI com o sample e conferir que:
  - modo prévia gera 3 PNGs em 1080x1350, um por template, em português
  - modo final gera 4 PNGs: feed e story, em português e inglês
  - nenhum texto cortado, estourado ou sobreposto, em nenhuma das versões
  - a headline continua legível quando a imagem é reduzida para 200px de largura,
    que é o tamanho que a pessoa vê antes de decidir parar de rolar
  - o @ e o telefone do brandKit aparecem quando existem
  - o preço aparece com destaque quando priceLabel não é nulo

NÃO FAÇA

- Não crie API, banco de dados, frontend, fila nem autenticação.
- Não instale Playwright, Puppeteer nem nada que baixe um navegador.
- Não crie editor com camadas ou canvas (regra 1).
- Não escreva testes elaborados de unidade agora. O CLI rodando e os PNGs bons são o teste.

AO TERMINAR

Rode o CLI, me diga quantos arquivos saíram e onde estão, e aponte qualquer template
que você ache que não passou no teste dos 200px.
```

---

## Como usar nas próximas fases

O mesmo formato, trocando o miolo. A estrutura que faz o prompt funcionar:

| Bloco | Por que existe |
|---|---|
| Contexto em 3 linhas | Sem isso a IA escreve código genérico de SaaS |
| **Leia antes de codar** | Faz ela carregar as regras em vez de adivinhar |
| Tarefa com entregas numeradas | Ambiguidade vira retrabalho |
| Restrições | O que ela faria de errado por padrão (Playwright é o caso clássico) |
| **Critério de aceite** | O bloco que quase todo mundo esquece — sem ele "pronto" é opinião |
| Não faça | Impede o alargamento de escopo, que é o erro mais caro |
| Ao terminar | Obriga a rodar de verdade em vez de só entregar arquivo |

Próximos prompts, na ordem do roadmap: pipeline de IA (fase 2), conversa no bot
(fase 3), multi-tenant e webapp (fase 4), créditos e Stripe (fase 5).
