# 📊 Google Analytics 4 - Guia de Configuração

## ✅ O Que Foi Implementado:

1. ✅ Hook `useAnalytics.ts` criado
2. ✅ Script GA4 adicionado no `index.html`
3. ✅ Tracking automático de páginas
4. ✅ Função `trackEvent()` para eventos customizados

---

## 🔧 Como Configurar:

### Passo 1: Criar Conta Google Analytics

1. Acesse: https://analytics.google.com
2. Clique em "Começar a medir"
3. Crie uma conta
4. Crie uma propriedade (nome: "Mansão Maromba")
5. Configure o fluxo de dados da Web
6. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Passo 2: Adicionar no Vercel

1. Acesse: https://vercel.com/seu-usuario/projeto-site-mansao-maromba/settings/environment-variables
2. Adicione nova variável:
   - **Name:** `VITE_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (seu ID)
   - **Environments:** Production, Preview, Development
3. Clique em "Save"
4. Faça Redeploy

### Passo 3: Testar Localmente

```bash
# Adicione no .env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Reinicie o servidor
npm run dev
```

---

## 📈 O Que Será Rastreado Automaticamente:

### Páginas:
- ✅ Home (`/`)
- ✅ Login (`/login`)
- ✅ Admin (`/admin`)
- ✅ Checkout (`/checkout`)
- ✅ Pedidos (`/orders`)

### Eventos Automáticos (GA4):
- ✅ page_view
- ✅ session_start
- ✅ first_visit
- ✅ scroll
- ✅ click

---

## 🎯 Como Adicionar Eventos Customizados:

### Exemplo 1: Rastrear Adicionar ao Carrinho

```typescript
// components/products/ProductCard.tsx
import { useAnalytics } from '../../hooks/useAnalytics'

const { trackEvent } = useAnalytics()

const handleAddToCart = () => {
  addToCart(product)
  
  // Track evento
  trackEvent('add_to_cart', {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1
  })
}
```

### Exemplo 2: Rastrear Compra

```typescript
// components/checkout/CheckoutPage.tsx
import { useAnalytics } from '../../hooks/useAnalytics'

const { trackEvent } = useAnalytics()

const handleSubmit = async () => {
  await createOrder(orderData)
  
  // Track compra
  trackEvent('purchase', {
    transaction_id: orderId,
    value: cartTotal,
    currency: 'BRL',
    items: cart.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  })
}
```

### Exemplo 3: Rastrear Busca

```typescript
// components/search/SearchBar.tsx
const { trackEvent } = useAnalytics()

const handleSearch = (query: string) => {
  trackEvent('search', {
    search_term: query
  })
}
```

---

## 📊 Métricas Disponíveis no GA4:

### Tempo Real:
- Usuários ativos agora
- Páginas mais visitadas
- Eventos em tempo real

### Aquisição:
- De onde vêm os usuários
- Canais (orgânico, direto, social)
- Campanhas

### Engajamento:
- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição

### Conversões:
- Compras
- Valor total
- Taxa de conversão

---

## 🧪 Como Testar:

### Teste 1: Verificar se está funcionando

1. Abra o app no navegador
2. Abra o Console (F12)
3. Digite: `window.gtag`
4. Se retornar uma função, está funcionando! ✅

### Teste 2: Ver eventos em tempo real

1. Acesse: https://analytics.google.com
2. Vá em "Relatórios" → "Tempo real"
3. Navegue no seu app
4. Deve aparecer você como usuário ativo! ✅

---

## ⚠️ Importante:

- ✅ GA4 não quebra o app se não configurado
- ✅ Funciona apenas em produção/preview (não em localhost sem .env)
- ✅ Leva 24-48h para dados aparecerem nos relatórios
- ✅ Tempo real funciona imediatamente

---

## 🚀 Próximos Passos:

Depois de configurar, você pode:

1. **Criar Conversões Personalizadas**
   - Marcar "purchase" como conversão
   - Marcar "add_to_cart" como conversão

2. **Configurar Funis**
   - Ver onde usuários abandonam o checkout

3. **Integrar com Google Ads**
   - Remarketing
   - Campanhas otimizadas

---

## ✅ Checklist:

- [ ] Criar conta GA4
- [ ] Copiar Measurement ID
- [ ] Adicionar no Vercel (variável de ambiente)
- [ ] Fazer Redeploy
- [ ] Testar em tempo real
- [ ] Adicionar eventos customizados (opcional)

---

**Status:** ✅ Implementado e pronto para configurar!

**Tempo para configurar:** 10 minutos

**Próxima feature:** Busca e Filtros
