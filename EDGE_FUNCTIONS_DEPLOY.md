# 🚀 Supabase Edge Functions - Guia de Deploy

## 📋 Pré-requisitos

```bash
# Instalar Supabase CLI
npm install -g supabase

# Verificar instalação
supabase --version
```

## 🔐 Configuração Inicial

### 1. Login no Supabase
```bash
supabase login
```

### 2. Link com o Projeto
```bash
supabase link --project-ref ftgzoulanmsrmujtgrvj
```

## 📦 Deploy das Functions

### Payment Webhook
```bash
supabase functions deploy payment-webhook
```

**Secrets necessários:**
```bash
supabase secrets set WEBHOOK_SECRET=your-webhook-secret-key
```

**URL da função:**
```
https://ftgzoulanmsrmujtgrvj.supabase.co/functions/v1/payment-webhook
```

**Configurar no gateway de pagamento:**
- Stripe: Dashboard → Webhooks → Add endpoint
- Mercado Pago: Configurações → Webhooks → Adicionar URL

---

### Send Email
```bash
supabase functions deploy send-email
```

**Secrets necessários:**
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key
```

**Obter API Key:**
1. Criar conta em [Resend.com](https://resend.com)
2. Verificar domínio (ou usar sandbox)
3. Gerar API Key em Settings → API Keys

**Alternativa (SendGrid):**
```bash
supabase secrets set SENDGRID_API_KEY=SG.your_api_key
```

---

### Process Order
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

## 🧪 Testar Localmente

### 1. Iniciar Supabase Local
```bash
supabase start
```

### 2. Servir Function Localmente
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

## 📊 Monitoramento

### Ver Logs em Tempo Real
```bash
supabase functions logs payment-webhook --tail
```

### Ver Logs Específicos
```bash
supabase functions logs payment-webhook --since 1h
```

## 🔧 Variáveis de Ambiente

Criar arquivo `.env.local` para desenvolvimento:

```env
SUPABASE_URL=https://ftgzoulanmsrmujtgrvj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEBHOOK_SECRET=your-webhook-secret
RESEND_API_KEY=re_your_api_key
```

**⚠️ NUNCA commitar este arquivo!**

## 🔒 Segurança

### Validar Assinatura do Webhook

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

## 📈 Performance

### Otimizar Cold Start
```typescript
// Importar apenas o necessário
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Reutilizar conexões
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})
```

### Cache de Dados
```typescript
// Cache em memória (válido durante execução)
const cache = new Map()

const getCachedData = async (key: string) => {
  if (cache.has(key)) return cache.get(key)
  
  const data = await fetchData(key)
  cache.set(key, data)
  return data
}
```

## 🐛 Troubleshooting

### Erro: "Function not found"
```bash
# Verificar se está deployada
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

## 📚 Recursos

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Docs](https://deno.com/deploy/docs)
- [Resend API Docs](https://resend.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Mercado Pago Webhooks](https://www.mercadopago.com.br/developers/pt/docs/webhooks)

## ✅ Checklist de Deploy

- [ ] Instalar Supabase CLI
- [ ] Login e link com projeto
- [ ] Deploy payment-webhook
- [ ] Deploy send-email
- [ ] Deploy process-order
- [ ] Configurar secrets (WEBHOOK_SECRET, RESEND_API_KEY)
- [ ] Testar localmente
- [ ] Configurar webhook no gateway de pagamento
- [ ] Monitorar logs
- [ ] Documentar URLs das functions

---

**Desenvolvido com ❤️ para Mansão Maromba**
