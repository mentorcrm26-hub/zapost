# Prompt — Fase 6: página de vendas e lançamento

O último prompt de código. Depois dele o trabalho é seu: vender.

```
Você está trabalhando no ZaPost. Leia CLAUDE.md e a seção "Quem é o cliente" do
documento: https://claude.ai/code/artifact/3e3e1b99-d427-40c0-ab59-75145d66dea3

TAREFA — Fase 6: a porta de entrada

Entregas:

1. Página de vendas em português, mobile-first. O cliente é brasileiro dono de pequeno
   negócio nos EUA: limpeza, beleza, comida, construção, transporte. Ele fatura em
   dólar e não tem tempo. A promessa é:
     "Manda a foto e fala o que você quer. Sai pronto, em português e em inglês."

   Não venda "gerador de imagem com IA". Venda "uma equipe de marketing digital que
   cabe no seu WhatsApp". A objeção real que você precisa derrubar é
   "por que não uso o Canva de graça?" — e a resposta é que o Canva entrega uma tela
   em branco, e não é isso que falta para ele.

2. O PRIMEIRO POST GRÁTIS ANTES DO CADASTRO. Qualquer visitante manda foto e áudio na
   própria página e recebe as 3 opções com marca d'água. O cadastro só aparece na hora
   de baixar. A diferença de conversão entre "experimente" e "cadastre-se para
   experimentar" é enorme, e este produto tem um momento de mágica que precisa
   acontecer antes de qualquer fricção.

   Proteja contra abuso: limite por IP e por sessão, e desligue a IA de imagem aqui.

3. Prova social bilíngue: exemplos reais de post em PT e em EN lado a lado. É o
   diferencial que nenhuma ferramenta americana nem brasileira entrega, e precisa
   estar visível sem rolar muito.

4. Preços em dólar, com o Pro destacado. Deixe explícito que a trava do Pro é o
   bilíngue.

5. Obrigações legais, em inglês:
     - Termos de uso e política de privacidade
     - Cancelamento visível e fácil (exigência em vários estados)
     - Aviso de cookies com Consent Mode v2 já integrado da Fase 5
   Deixe um TODO marcado sobre sales tax de SaaS por estado: é conversa de meia hora
   com um contador, não de código.

6. Moderação de conteúdo: uma checagem ANTES de gastar IA, barrando promessa médica,
   garantia de renda e serviço de imigração com promessa de resultado. Registre quem
   pediu o quê. Vai acontecer, e é melhor barrar antes de gastar.

7. SEO local: páginas por região metropolitana — Boston, Orlando, Newark, Danbury,
   Marietta — porque é onde a comunidade está concentrada e é muito mais barato que
   competir por termo genérico.

RESTRIÇÕES

- Todas as regras de interface do CLAUDE.md valem aqui também.
- Nada de jargão de marketing digital na página. O leitor é dono de empresa de
  limpeza, não profissional de marketing.
- Nenhum dado pessoal em parâmetro de URL.

CRITÉRIO DE ACEITE

- um visitante gera um post de verdade sem se cadastrar, no celular, em menos de 2 min
- a página carrega em menos de 3 segundos em 3G lento
- Lighthouse acima de 90 em performance e acessibilidade
- o gclid é capturado na primeira visita e sobrevive até o cadastro
- termos, privacidade e cancelamento acessíveis em no máximo 2 cliques

NÃO FAÇA

- Não peça cartão para o teste grátis.
- Não use período de 7 dias: o teste é por quantidade, 5 criativos.
- Não prometa resultado de vendas para o cliente. É o tipo de promessa que atrai
  reclamação e não segura ninguém.

AO TERMINAR

Rode o Lighthouse e me mostre o resultado, mais o fluxo do visitante sem cadastro.
```

---

## Depois deste prompt não tem mais código

O que vem é trabalho humano, e é a parte mais valiosa do projeto:

1. **Verificação do Meta Business** — abra o processo cedo, tem espera
2. **Os 15 templates** — 2 a 4 horas cada, e a maior parte do tempo é você olhando
   e dizendo "esse não". É gosto, e o gosto é seu
3. **Escolher uma cidade só** para os dez primeiros clientes. Framingham, Newark ou
   Orlando. Espalhar por cinco estados desperdiça o efeito de indicação
4. **Montar a ficha e a marca junto com cada cliente**, na venda. Não escala além de
   umas dezenas — e é exatamente por isso que funciona nos primeiros
5. **Cada conversa vira uma skill de segmento e uma correção de template**
