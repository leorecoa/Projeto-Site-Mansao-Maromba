# Checklist Manual - Teste de Checkout

## Preparacao
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador aberto em http://localhost:5174
- [ ] Console do navegador aberto (F12)

---

## Passo 1: Adicionar Produto ao Carrinho

### Acoes
1. [ ] Acesse a home (/)
2. [ ] Clique em "GARANTIR COMBO" em qualquer produto
3. [ ] Modal do carrinho deve abrir automaticamente

### Verificacoes
- [ ]  Modal apareceu?
- [ ]  Produto esta listado no modal?
- [ ]  Contador do carrinho (badge) mostra "1"?
- [ ]  Botao "Finalizar Compra" visivel?

### Se falhar
- Verifique console por erros
- Verifique se `useCart()` esta funcionando
- Teste: `localStorage.getItem('mansao-maromba-cart')`

---

## Passo 2: Tentar Checkout sem Login

### Acoes
1. [ ] No modal do carrinho, clique em "Finalizar Compra"

### Verificacoes
- [ ]  Redirecionou para `/login`?
- [ ]  URL contem `?redirect=/checkout`?

### Se falhar
- Verifique `handleCheckout()` no App.tsx
- Verifique `isAuthenticated` do useAuth()

---

## Passo 3: Fazer Login

### Acoes
1. [ ] Na pagina de login, preencha:
   - Email: seu-email@gmail.com
   - Senha: sua-senha
2. [ ] Clique em "Entrar"

### Verificacoes
- [ ]  Login bem-sucedido?
- [ ]  Redirecionou para `/checkout`?
- [ ]  Navbar mostra seu nome?

### Se falhar
- Verifique credenciais do Supabase
- Verifique .env.local
- Console: erros de autenticacao?

---

## Passo 4: Preencher dados pessoais (Etapa 1)

### Acoes
1. [ ] Preencha os campos:
   - Nome: Joao da Silva
   - CPF: 529.982.247-25 (valido)
   - Email: joao@exemplo.com
   - Telefone: (11) 99999-8888

2. [ ] Clique em "Ir para Entrega"

### Verificacoes
- [ ]  Mascara de CPF aplicada automaticamente?
- [ ]  Mascara de telefone aplicada?
- [ ]  Validacao em tempo real funciona?
- [ ]  Avancou para Step 2?
- [ ]  Stepper visual mostra Step 2 ativo?

### Se falhar
- Teste CPF invalido: 111.111.111-11 (deve dar erro)
- Verifique `CustomerForm.tsx`
- Console: erros de validacao Zod?

---

## Passo 5: Preencher endereco (Etapa 2)

### Acoes
1. [ ] Preencha CEP: 01310-100
2. [ ] Clique fora do campo (blur) ou pressione Tab
3. [ ] Aguarde 2 segundos (busca ViaCEP)
4. [ ] Verifique se campos foram preenchidos automaticamente
5. [ ] Preencha Numero: 123
6. [ ] Clique em "Ir para Pagamento"

### Verificacoes
- [ ]  Loader apareceu durante busca?
- [ ]  Cidade preenchida: Sao Paulo?
- [ ]  Rua preenchida: Avenida Paulista?
- [ ]  Bairro preenchido: Bela Vista?
- [ ]  Estado preenchido: SP?
- [ ]  Campos ficaram readonly (exceto Numero)?
- [ ]  Avancou para Step 3?

### Se falhar
- Teste CEP invalido: 00000-000
- Verifique `ShippingForm.tsx`
- Verifique `useCep()` hook
- Console: erro na API ViaCEP?

---

## Passo 6: Verificar Criacao do Pedido

### Acoes
1. [ ] Ao chegar no Step 3, abra DevTools -> Network
2. [ ] Filtre por "orders"
3. [ ] Verifique requisicoes POST

### Verificacoes
- [ ]  POST para `/rest/v1/customers` (201 Created)?
- [ ]  POST para `/rest/v1/orders` (201 Created)?
- [ ]  POST para `/rest/v1/order_items` (201 Created)?
- [ ]  Carrinho foi limpo (badge zerado)?
- [ ]  PaymentForm renderizado?

### Se falhar
- Verifique `createOrder()` em CheckoutPage
- Console: erros do Supabase?
- Verifique permissoes RLS no Supabase

---

## Passo 7: Resumo do pedido (Sidebar)

### Verificacoes
- [ ]  Sidebar "Resumo do Pedido" visivel?
- [ ]  Produtos listados com imagens?
- [ ]  Quantidades corretas?
- [ ]  Precos corretos?
- [ ]  Subtotal calculado?
- [ ]  Total em destaque (amarelo)?

---

## Passo 8: Pagamento (Etapa 3)

### Acoes
1. [ ] Selecione metodo de pagamento (PIX/Cartao/Boleto)
2. [ ] Preencha dados do pagamento
3. [ ] Clique em "Confirmar Pagamento"

### Verificacoes
- [ ]  Formulario de pagamento renderizado?
- [ ]  Opcoes de pagamento visiveis?
- [ ]  Apos confirmar, redireciona para `/checkout/success`?

### Se falhar
- Verifique `PaymentForm.tsx`
- Verifique `handlePaymentSuccess()`

---

## Passo 9: Pagina de Sucesso

### Verificacoes
- [ ]  Mensagem de sucesso exibida?
- [ ]  Numero do pedido visivel?
- [ ]  Botao "Ver Meus Pedidos" funciona?

---

## Problemas comuns

### Problema 1: "Nao sai da home"
**Solucao**:
- Limpe cache (Ctrl+Shift+R)
- Verifique console por erros
- Teste rota direta: http://localhost:5174/test

### Problema 2: "Redireciona para login mas nao volta"
**Solucao**:
- Verifique `?redirect=/checkout` na URL
- Verifique `LoginPage` se usa o redirect param

### Problema 3: "CEP nao preenche automaticamente"
**Solucao**:
- Verifique conexao com internet
- Teste API: https://viacep.com.br/ws/01310100/json/
- Verifique `useCep()` hook

### Problema 4: "Erro ao criar pedido"
**Solucao**:
- Verifique Supabase esta online
- Verifique .env.local
- Verifique RLS policies no Supabase

---

## Resultado esperado

### Fluxo completo funcionando
```
Home -> Adicionar Produto -> Carrinho -> Login -> ok
Checkout Step 1 (Dados) -> Step 2 (Endereco) -> ok
Step 3 (Pagamento) -> Sucesso
```

### Tempo Estimado: 3-5 minutos

---

## Anotacoes

Use este espaco para anotar problemas encontrados:

```
Problema:
Passo:
Erro no console:
Solucao tentada:
```

---

**Ultima atualizacao**: 2025-01-XX
**Status**:  AGUARDANDO TESTE MANUAL


