# ✅ CHECKLIST MANUAL - TESTE DE CHECKOUT

## 📋 PREPARAÇÃO
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em http://localhost:5174
- [ ] Console do navegador aberto (F12)

---

## 🛒 PASSO 1: ADICIONAR PRODUTO AO CARRINHO

### Ações:
1. [ ] Acesse a home (/)
2. [ ] Clique em "GARANTIR COMBO" em qualquer produto
3. [ ] Modal do carrinho deve abrir automaticamente

### Verificações:
- [ ] ✅ Modal apareceu?
- [ ] ✅ Produto está listado no modal?
- [ ] ✅ Contador do carrinho (badge) mostra "1"?
- [ ] ✅ Botão "Finalizar Compra" visível?

### ❌ Se falhar:
- Verifique console por erros
- Verifique se `useCart()` está funcionando
- Teste: `localStorage.getItem('mansao-maromba-cart')`

---

## 🔐 PASSO 2: TENTAR CHECKOUT SEM LOGIN

### Ações:
1. [ ] No modal do carrinho, clique em "Finalizar Compra"

### Verificações:
- [ ] ✅ Redirecionou para `/login`?
- [ ] ✅ URL contém `?redirect=/checkout`?

### ❌ Se falhar:
- Verifique `handleCheckout()` no App.tsx
- Verifique `isAuthenticated` do useAuth()

---

## 👤 PASSO 3: FAZER LOGIN

### Ações:
1. [ ] Na página de login, preencha:
   - Email: seu-email@gmail.com
   - Senha: sua-senha
2. [ ] Clique em "Entrar"

### Verificações:
- [ ] ✅ Login bem-sucedido?
- [ ] ✅ Redirecionou para `/checkout`?
- [ ] ✅ Navbar mostra seu nome?

### ❌ Se falhar:
- Verifique credenciais do Supabase
- Verifique .env.local
- Console: erros de autenticação?

---

## 📝 PASSO 4: PREENCHER DADOS PESSOAIS (Step 1)

### Ações:
1. [ ] Preencha os campos:
   - Nome: João da Silva
   - CPF: 529.982.247-25 (válido)
   - Email: joao@exemplo.com
   - Telefone: (11) 99999-8888

2. [ ] Clique em "Ir para Entrega"

### Verificações:
- [ ] ✅ Máscara de CPF aplicada automaticamente?
- [ ] ✅ Máscara de telefone aplicada?
- [ ] ✅ Validação em tempo real funciona?
- [ ] ✅ Avançou para Step 2?
- [ ] ✅ Stepper visual mostra Step 2 ativo?

### ❌ Se falhar:
- Teste CPF inválido: 111.111.111-11 (deve dar erro)
- Verifique `CustomerForm.tsx`
- Console: erros de validação Zod?

---

## 🏠 PASSO 5: PREENCHER ENDEREÇO (Step 2)

### Ações:
1. [ ] Preencha CEP: 01310-100
2. [ ] Clique fora do campo (blur) ou pressione Tab
3. [ ] Aguarde 2 segundos (busca ViaCEP)
4. [ ] Verifique se campos foram preenchidos automaticamente
5. [ ] Preencha Número: 123
6. [ ] Clique em "Ir para Pagamento"

### Verificações:
- [ ] ✅ Loader apareceu durante busca?
- [ ] ✅ Cidade preenchida: São Paulo?
- [ ] ✅ Rua preenchida: Avenida Paulista?
- [ ] ✅ Bairro preenchido: Bela Vista?
- [ ] ✅ Estado preenchido: SP?
- [ ] ✅ Campos ficaram readonly (exceto Número)?
- [ ] ✅ Avançou para Step 3?

### ❌ Se falhar:
- Teste CEP inválido: 00000-000
- Verifique `ShippingForm.tsx`
- Verifique `useCep()` hook
- Console: erro na API ViaCEP?

---

## 💳 PASSO 6: VERIFICAR CRIAÇÃO DO PEDIDO

### Ações:
1. [ ] Ao chegar no Step 3, abra DevTools → Network
2. [ ] Filtre por "orders"
3. [ ] Verifique requisições POST

### Verificações:
- [ ] ✅ POST para `/rest/v1/customers` (201 Created)?
- [ ] ✅ POST para `/rest/v1/orders` (201 Created)?
- [ ] ✅ POST para `/rest/v1/order_items` (201 Created)?
- [ ] ✅ Carrinho foi limpo (badge zerado)?
- [ ] ✅ PaymentForm renderizado?

### ❌ Se falhar:
- Verifique `createOrder()` em CheckoutPage
- Console: erros do Supabase?
- Verifique permissões RLS no Supabase

---

## 💰 PASSO 7: RESUMO DO PEDIDO (Sidebar)

### Verificações:
- [ ] ✅ Sidebar "Resumo do Pedido" visível?
- [ ] ✅ Produtos listados com imagens?
- [ ] ✅ Quantidades corretas?
- [ ] ✅ Preços corretos?
- [ ] ✅ Subtotal calculado?
- [ ] ✅ Total em destaque (amarelo)?

---

## 🎯 PASSO 8: PAGAMENTO (Step 3)

### Ações:
1. [ ] Selecione método de pagamento (PIX/Cartão/Boleto)
2. [ ] Preencha dados do pagamento
3. [ ] Clique em "Confirmar Pagamento"

### Verificações:
- [ ] ✅ Formulário de pagamento renderizado?
- [ ] ✅ Opções de pagamento visíveis?
- [ ] ✅ Após confirmar, redireciona para `/checkout/success`?

### ❌ Se falhar:
- Verifique `PaymentForm.tsx`
- Verifique `handlePaymentSuccess()`

---

## ✅ PASSO 9: PÁGINA DE SUCESSO

### Verificações:
- [ ] ✅ Mensagem de sucesso exibida?
- [ ] ✅ Número do pedido visível?
- [ ] ✅ Botão "Ver Meus Pedidos" funciona?

---

## 🐛 PROBLEMAS COMUNS

### Problema 1: "Não sai da home"
**Solução**: 
- Limpe cache (Ctrl+Shift+R)
- Verifique console por erros
- Teste rota direta: http://localhost:5174/test

### Problema 2: "Redireciona para login mas não volta"
**Solução**:
- Verifique `?redirect=/checkout` na URL
- Verifique `LoginPage` se usa o redirect param

### Problema 3: "CEP não preenche automaticamente"
**Solução**:
- Verifique conexão com internet
- Teste API: https://viacep.com.br/ws/01310100/json/
- Verifique `useCep()` hook

### Problema 4: "Erro ao criar pedido"
**Solução**:
- Verifique Supabase está online
- Verifique .env.local
- Verifique RLS policies no Supabase

---

## 📊 RESULTADO ESPERADO

### ✅ Fluxo Completo Funcionando:
```
Home → Adicionar Produto → Carrinho → Login → 
Checkout Step 1 (Dados) → Step 2 (Endereço) → 
Step 3 (Pagamento) → Sucesso
```

### Tempo Estimado: 3-5 minutos

---

## 📝 ANOTAÇÕES

Use este espaço para anotar problemas encontrados:

```
Problema:
Passo:
Erro no console:
Solução tentada:
```

---

**Última atualização**: 2025-01-XX
**Status**: ⚠️ AGUARDANDO TESTE MANUAL
