# WhatsApp Cloud API — o que fazer e quando

Direto na Meta, **sem intermediário**. Twilio, 360dialog e MessageBird cobram mensalidade
e markup em cima de uma API que é gratuita no nosso padrão de uso.

---

## Duas linhas do tempo diferentes

| | Quando | Depende de código? |
|---|---|---|
| **Burocracia da Meta** | Começar **hoje** | Não |
| **Código do bot** | Fase 3 | Sim, depois da Fase 2 |

A verificação do Meta Business leva de dias a semanas. Comece agora e a aprovação chega
antes de você precisar dela.

**O número de teste da Meta funciona sem verificação de negócio.** Dá para construir a
Fase 3 inteira com ele. A verificação só trava a ida para clientes reais.

---

## O que fazer agora, sem escrever código

### 1. Meta Business Account · business.facebook.com

Crie ou use a conta da sua empresa dos EUA e abra a **verificação de negócio**.
Costumam pedir:

- Nome legal da empresa, exatamente como no registro
- Endereço, telefone e site (o `zapost.tech` serve — deixe no ar antes de submeter)
- Documento de constituição da empresa, carta do EIN ou licença de funcionamento
- Comprovante de endereço (conta de serviço ou extrato bancário) **com o mesmo endereço**

O motivo mais comum de reprovação é divergência entre o endereço do documento e o
cadastrado. Confira caractere por caractere antes de enviar.

### 2. App na Meta · developers.facebook.com

Crie um app do tipo **Business** e adicione o produto **WhatsApp**. Isso já libera o
número de teste e um token temporário.

### 3. Decida o número de produção

**A armadilha mais comum do projeto inteiro:** o número não pode estar ativo no WhatsApp
comum nem no WhatsApp Business. Se estiver, você precisa apagar aquela conta antes — e
perde o histórico dela.

Use um número novo, dedicado. Não use o seu pessoal nem o do outro projeto.

### 4. Nome de exibição

Passa por aprovação e precisa ter relação com o negócio. "ZaPost" está bem.

---

## O que fazer na Fase 3, com código

### 5. Token permanente

O token que aparece no painel **expira em 24 horas**. É a pegadinha clássica: você
configura, funciona, e no dia seguinte tudo para.

O token de verdade sai de **Business Settings → System Users**: crie um system user,
dê a ele acesso ao app e ao WhatsApp Business Account, e gere um token permanente com
as permissões `whatsapp_business_messaging` e `whatsapp_business_management`.

### 6. Webhook

Precisa de **HTTPS público com certificado válido** — é o que exige o subdomínio.

```
URL:      https://api.zapost.tech/webhooks/whatsapp
Verify:   o valor de WHATSAPP_VERIFY_TOKEN no .env
Assinar:  campo "messages"
```

A Meta faz um GET de verificação antes de aceitar. O endpoint precisa devolver o
`hub.challenge` quando o `hub.verify_token` bater.

Localhost não funciona. Túnel (ngrok, cloudflared) funciona mas a URL muda a cada
reinício, e você teria que reconfigurar na Meta toda vez — por isso o subdomínio fixo.

### 7. Variáveis no `.env`

```
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ACCESS_TOKEN=          # o permanente, do system user
WHATSAPP_VERIFY_TOKEN=          # string que você inventa
WHATSAPP_APP_SECRET=            # para validar a assinatura do webhook
```

Valide a assinatura `X-Hub-Signature-256` de toda requisição recebida. Sem isso,
qualquer um que descubra a URL manda mensagem falsa para o seu bot.

---

## Custo

**Conversa iniciada pelo cliente, respondida dentro de 24 horas: gratuita.** É todo o
nosso fluxo — o cliente sempre começa.

**Mensagem iniciada pelo negócio é template pago.** É o que faria a sugestão proativa
("faz 5 dias que você não posta") custar dinheiro. Está na v2 justamente por isso;
orce antes de ligar.

As faixas e regras da Meta mudam. **Confirme os valores atuais no painel antes de
lançar** — não confie nesta página nem em post de blog.

---

## Limites de volume

Números novos começam limitados em conversas iniciadas pelo negócio por dia, e sobem
de faixa conforme a qualidade se mantém. Como o ZaPost é sempre inbound, isso não
restringe o produto — só importaria se um dia ligarmos a sugestão proativa.

O que importa vigiar é a **classificação de qualidade** do número. Se cair, a Meta
reduz o limite. Ela cai por bloqueio e denúncia de usuários — improvável no nosso caso,
já que só respondemos quem escreveu primeiro.

---

## Enquanto a Meta não aprova

O canal de desenvolvimento é o **Telegram**: grátis, funciona em horas, botões inline
nativos, sem verificação nenhuma. A máquina de estados da conversa é a mesma — só muda
o `ChannelAdapter`. Veja `prompts/fase-3-bot.md`.
