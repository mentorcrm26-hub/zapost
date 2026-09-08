# Infraestrutura — quando cada coisa entra

VPS: `187.124.242.118` · Ubuntu 24.04 · 8 GB RAM · 2 vCPU · 100 GB · Nginx na porta 80

---

## Faça agora, independente de fase

São **filas de espera**: você aguarda enquanto programa. Se deixar para a fase em que
precisa, fica parado.

1. **Registrar `zapost.com`** — o nome está fechado, não há mais motivo para segurar
   o crédito de domínio.
2. **Abrir a verificação do Meta Business** — exige documento da empresa nos EUA e
   demora dias ou semanas. É o que destrava a Cloud API do WhatsApp na Fase 3.

---

## O que cada fase precisa

| Fase | VPS? | O quê |
|---|---|---|
| 1 · render | não | Roda local. Não perca tempo com infra |
| 2 · IA | não | Local. Só chaves de API |
| 3 · bot | **sim** | `api.zapost.com` com HTTPS válido |
| 4a · banco | **sim** | Postgres e Redis de produção |
| 4b · webapp | **sim** | `app.zapost.com` |
| 4c · admin | **sim** | `admin.zapost.com` |
| 5 · cobrança | sim | Webhook do Stripe em `api.zapost.com` |
| 6 · landing | **sim** | `zapost.com` e `www` |

**O gatilho do subdomínio é a Fase 3, não a 4.** O WhatsApp Cloud API só entrega
mensagem em endpoint HTTPS público com certificado válido — não dá para testar em
localhost. Túnel (ngrok, cloudflared) funciona, mas a URL muda a cada reinício e você
teria que reconfigurar o webhook na Meta toda vez.

Em desenvolvimento, sempre Postgres e Redis em **Docker local**. A VPS é só produção.

---

## Plano de subdomínios

| Subdomínio | Aponta para | Entra na fase |
|---|---|---|
| `api.zapost.com` | API NestJS — webhooks do bot e do Stripe | 3 |
| `app.zapost.com` | Webapp Next.js | 4b |
| `admin.zapost.com` | Painel do admin | 4c |
| `media.zapost.com` | MinIO | 4a |
| `zapost.com` + `www` | Página de vendas | 6 |

O admin fica em subdomínio separado de propósito: escopo de cookie próprio e
isolamento de sessão. Não sirva o painel em `app.zapost.com/admin`.

Tudo atrás do Nginx que já existe, com certificado do Let's Encrypt (`certbot --nginx`).
Custo: zero.

---

## Três armadilhas nesta VPS

### 1. Não compartilhe o Redis com o projeto Whats

O WhatsApp Campaign Master já usa BullMQ no Redis dessa máquina. Fila com o mesmo nome
no mesmo Redis significa um worker consumindo job do outro projeto — e o sintoma é
horrível de diagnosticar. Use um container separado, ou no mínimo um índice de banco
diferente com prefixo de chave próprio (`zapost:`).

### 2. Banco separado, nunca só schema separado

Postgres novo, ou pelo menos um database novo na mesma instância. As tabelas do ZaPost
nunca convivendo com as do Whats — backup, restore e migration precisam ser independentes.

### 3. Vigie a RAM

A máquina já roda Evolution API, Postgres, Redis, NestJS e Next.js do outro projeto.
Somar API, web, Postgres, Redis e o worker de render do ZaPost aperta.

Antes da Fase 3, meça:

```
free -h
docker stats --no-stream
df -h
```

**O worker de render é o mais faminto de CPU** e é o primeiro candidato a sair para
máquina própria se apertar. É exatamente por isso que o CLAUDE.md proíbe Playwright
(regra 14): Chromium headless sozinho comeria o que sobra.

---

## Ambientes

Enquanto for solo e sem cliente pagante: **dev local + produção na VPS**, só isso.

Staging só passa a valer a pena quando existir cliente pagando — aí você não pode mais
descobrir que quebrou alguma coisa depois do deploy. Até lá, é infraestrutura que custa
tempo e não compra nada.
