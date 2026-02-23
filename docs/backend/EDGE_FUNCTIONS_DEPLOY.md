# Supabase Edge Functions - Guia de publicacao

## Pre-requisitos

```bash
# Instalar Supabase CLI
npm install -g supabase

# Verificar instalacao
supabase --version
```

## Configuracao inicial

### 1. Login no Supabase
```bash
supabase login
```

### 2. Link com o Projeto
```bash
supabase link --project-ref ftgzoulanmsrmujtgrvj
```

## publicacao das funcoes

### Webhook de pagamento
```bash
supabase functions deploy payment-webhook
```

**Segredos necessarios:**
```bash
supabase secrets set WEBHOOK_SECRET=your-webhook-secret-key
```

**URL da funcao:**
```
https://ftgzoulanmsrmujtgrvj.supabase.co/functions/v1/payment-webhook
```

**Configurar no gateway de pagamento:**
- Stripe: Painel -> Webhooks -> Adicionar endpoint
- Mercado Pago: Configuracoes -> Webhooks -> Adicionar URL

---

### Envio de email
```bash
supabase functions deploy send-email
```

**Segredos necessarios:**
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key
```

**Obter API Key:**
1. Criar conta em [Resend.com](https://resend.com)
2. Verificar dominio (ou usar sandbox)
3. Gerar API Key em Configuracoes -> API Keys

**Alternativa (SendGrid):**
```bash
supabase secrets set SENDGRID_API_KEY=SG.your_api_key
```

---

### Processar pedido
```bash
supabase functions deploy process-order
```

**Uso:**
```bash
curl -X POST \
  https://ftgzoulanmsrmujtgrvj.supabase.co/functions/v1/process-order \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "uuid-do-pedido",
    "action": "confirm"
  }'
```

## Testar localmente

### 1. Iniciar Supabase local
```bash
supabase start
```

### 2. Servir funcao localmente
```bash
supabase functions serve payment-webhook --env-file .env.local
```

### 3. Testar com cURL
```bash
curl -X POST http://localhost:54321/functions/v1/payment-webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: test-signature" \
  -d '{
    "event": "payment.success",
    "order_id": "uuid-do-pedido",
    "payment_id": "pay_123",
    "amount": 100.00,
    "payment_method": "credit_card"
  }'
```

## Monitoramento

### Ver logs em tempo real
```bash
supabase functions logs payment-webhook --tail
```

### Ver logs especificos
```bash
supabase functions logs payment-webhook --since 1h
```

## Variaveis de ambiente

Criar arquivo `.env.local` para desenvolvimento:

```env
SUPABASE_URL=https://ftgzoulanmsrmujtgrvj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEBHOOK_SECRET=your-webhook-secret
RESEND_API_KEY=re_your_api_key
```

** NUNCA commitar este arquivo!**

## Seguranca

### Validar assinatura do webhook

**Stripe:**
```typescript
import Stripe from 'https://esm.sh/stripe@13.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const signature = req.headers.get('stripe-signature')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

const event = stripe.webhooks.constructEvent(
  await req.text(),
  signature,
  webhookSecret
)
```

**Mercado Pago:**
```typescript
import crypto from 'https://deno.land/std@0.168.0/node/crypto.ts'

const signature = req.headers.get('x-signature')!
const secret = Deno.env.get('MP_WEBHOOK_SECRET')!
const body = await req.text()

const hash = crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex')

if (hash !== signature) {
  throw new Error('Invalid signature')
}
```

## Performance

### Otimizar inicializacao fria
```typescript
// Importar apenas o necessario
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Reutilizar conexoes
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})
```

### Cache de dados
```typescript
// Cache em memoria (valido durante execucao)
const cache = new Map()

const getCachedData = async (key: string) => {
  if (cache.has(key)) return cache.get(key)

  const data = await fetchData(key)
  cache.set(key, data)
  return data
}
```

## Solucao de problemas

### Erro: "Function not found"
```bash
# Verificar se esta deployada
supabase functions list

# Re-deploy
supabase functions deploy function-name
```

### Erro: "Missing environment variable"
```bash
# Listar secrets
supabase secrets list

# Setar secret
supabase secrets set KEY=value
```

### Erro: "CORS"
```typescript
// Adicionar headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Responder OPTIONS
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders })
}
```

## Recursos

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Documentacao do Deno publicacao](https://deno.com/publicacao/docs)
- [Resend API Docs](https://resend.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Mercado Pago Webhooks](https://www.mercadopago.com.br/developers/pt/docs/webhooks)

## Checklist de publicacao

- [ ] Instalar Supabase CLI
- [ ] Login e link com projeto
- [ ] Publicar payment-webhook
- [ ] Publicar send-email
- [ ] Publicar process-order
- [ ] Configurar segredos (WEBHOOK_SECRET, RESEND_API_KEY)
- [ ] Testar localmente
- [ ] Configurar webhook no gateway de pagamento
- [ ] Monitorar logs
- [ ] Documentar URLs das functions

---

**Desenvolvido com  para Mansao Maromba**


