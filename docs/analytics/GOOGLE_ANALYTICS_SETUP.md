# Google Analytics 4 - Guia de Configuracao

## O que foi implementado

1.  Hook `useAnalytics.ts` criado
2.  Script GA4 adicionado no `index.html`
3.  Tracking automatico de paginas
4.  Funcao `trackEvent()` para eventos customizados

---

## Como configurar

### Passo 1: Criar Conta Google Analytics

1. Acesse: https://analytics.google.com
2. Clique em "Comecar a medir"
3. Crie uma conta
4. Crie uma propriedade (nome: "Mansao Maromba")
5. Configure o fluxo de dados da Web
6. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Passo 2: Adicionar no Vercel

1. Acesse: https://vercel.com/seu-usuario/projeto-site-mansao-maromba/settings/environment-variables
2. Adicione nova variavel:
   - **Name:** `VITE_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (seu ID)
   - **Ambientes:** Producao, preview, Desenvolvimento
3. Clique em "Save"
4. Faca Redeploy

### Passo 3: Testar Localmente

```bash
# Adicione no .env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Reinicie o servidor
npm run dev
```

---

## O que sera rastreado automaticamente

### Paginas

- Home (`/`)
- Login (`/login`)
- Admin (`/admin`)
- Checkout (`/checkout`)
- Pedidos (`/orders`)

### Eventos Automaticos (GA4)

- page_view
- session_start
- first_visit
- scroll
- click

---

## Como adicionar eventos customizados

### Exemplo 1: Rastrear Adicionar ao Carrinho

```typescript
// components/products/ProductCard.tsx
import { useAnalytics } from '../../hooks/useAnalytics';

const { trackEvent } = useAnalytics();

const handleAddToCart = () => {
  addToCart(product);

  // Track evento
  trackEvent('add_to_cart', {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity: 1,
  });
};
```

### Exemplo 2: Rastrear Compra

```typescript
// components/checkout/CheckoutPage.tsx
import { useAnalytics } from '../../hooks/useAnalytics';

const { trackEvent } = useAnalytics();

const handleSubmit = async () => {
  await createOrder(orderData);

  // Track compra
  trackEvent('purchase', {
    transaction_id: orderId,
    value: cartTotal,
    currency: 'BRL',
    items: cart.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};
```

### Exemplo 3: Rastrear Busca

```typescript
// components/search/SearchBar.tsx
const { trackEvent } = useAnalytics();

const handleSearch = (query: string) => {
  trackEvent('search', {
    search_term: query,
  });
};
```

---

## Metricas disponiveis no GA4

### Tempo Real

- Usuarios ativos agora
- Paginas mais visitadas
- Eventos em tempo real

### Aquisicao

- De onde vem os usuarios
- Canais (organico, direto, social)
- Campanhas

### Engajamento

- Paginas mais visitadas
- Tempo medio na pagina
- Taxa de rejeicao

### Conversoes

- Compras
- Valor total
- Taxa de conversao

---

## Como testar

### Teste 1: Verificar se esta funcionando

1. Abra o app no navegador
2. Abra o Console (F12)
3. Digite: `window.gtag`
4. Se retornar uma funcao, esta funcionando!

### Teste 2: Ver eventos em tempo real

1. Acesse: https://analytics.google.com
2. Va em "Relatorios" -> "Tempo real"
3. Navegue no seu app
4. Deve aparecer voce como usuario ativo!

---

## Importante

- GA4 nao quebra o app se nao configurado
- Funciona apenas em producao/preview (nao em localhost sem .env)
- Leva 24-48h para dados aparecerem nos relatorios
- Tempo real funciona imediatamente

---

## Proximos passos

Depois de configurar, voce pode:

1. **Criar Conversoes Personalizadas**
   - Marcar "purchase" como conversao
   - Marcar "add_to_cart" como conversao

2. **Configurar Funis**
   - Ver onde usuarios abandonam o checkout

3. **Integrar com Google Ads**
   - Remarketing
   - Campanhas otimizadas

---

## Checklist

- [ ] Criar conta GA4
- [ ] Copiar Measurement ID
- [ ] Adicionar no Vercel (variavel de ambiente)
- [ ] Fazer Redeploy
- [ ] Testar em tempo real
- [ ] Adicionar eventos customizados (opcional)

---

**Status:** Implementado e pronto para configurar!

**Tempo para configurar:** 10 minutos

**Proxima funcionalidade:** Busca e Filtros
