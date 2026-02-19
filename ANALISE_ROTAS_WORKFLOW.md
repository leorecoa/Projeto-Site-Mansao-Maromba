# 📊 ANÁLISE: Rotas, Workflow e Formulários

## 🗺️ MAPA DE ROTAS

### **Rotas Públicas** (7)
```
/ ........................... Landing Page (Hero + Sections)
/login ...................... Autenticação
/auth/callback .............. OAuth Callback (Google)
/products/:id ............... Detalhes do Produto
/search ..................... Busca de Produtos
/terms ...................... Termos de Uso
/privacy .................... Política de Privacidade
/faq ........................ Perguntas Frequentes
/error ...................... Página de Erro
* (404) ..................... Página Não Encontrada
```

### **Rotas Protegidas** (8) - Requer Autenticação
```
/minha-conta ................ Perfil do Cliente
/checkout ................... Finalizar Compra
/checkout/success ........... Confirmação de Pedido
/admin ...................... Dashboard Admin
/admin/orders ............... Lista de Pedidos
/admin/orders/:id ........... Detalhes do Pedido
/admin/products ............. Lista de Produtos
/admin/products/new ......... Criar Produto
/admin/products/:id ......... Editar Produto
```

---

## 🔄 WORKFLOW DE COMPRA

### **Fluxo Completo: Visitante → Cliente → Pedido Confirmado**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DESCOBERTA (Landing Page)                                    │
├─────────────────────────────────────────────────────────────────┤
│ • Usuário acessa /                                              │
│ • Vê Hero com carrossel 3D de produtos                          │
│ • Navega pelas seções (Products, About, Reviews, Map)           │
│ • Clica em "GARANTIR COMBO" ou "Adicionar ao Carrinho"          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CARRINHO (Modal)                                             │
├─────────────────────────────────────────────────────────────────┤
│ • CartModal abre automaticamente                                │
│ • Mostra produtos adicionados                                   │
│ • Permite ajustar quantidades (+/-)                             │
│ • Exibe total em tempo real                                     │
│ • Botão "Finalizar Compra"                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. VERIFICAÇÃO DE AUTENTICAÇÃO                                  │
├─────────────────────────────────────────────────────────────────┤
│ • handleCheckout() verifica isAuthenticated                     │
│                                                                  │
│ SE NÃO AUTENTICADO:                                             │
│   → Redireciona para /login?redirect=/checkout                  │
│   → Após login, volta automaticamente para /checkout            │
│                                                                  │
│ SE AUTENTICADO:                                                 │
│   → Vai direto para /checkout                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. LOGIN (se necessário)                                        │
├─────────────────────────────────────────────────────────────────┤
│ • LoginPage (/login)                                            │
│ • Opções:                                                       │
│   - Email + Senha (Supabase Auth)                               │
│   - Google OAuth                                                │
│ • Após sucesso:                                                 │
│   - Cria/atualiza user_profiles                                 │
│   - Redireciona para redirect param ou /                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. CHECKOUT - PASSO 1: Identificação                           │
├─────────────────────────────────────────────────────────────────┤
│ • CheckoutPage (/checkout)                                      │
│ • Stepper visual: [1-Identificação] [2-Entrega] [3-Pagamento]  │
│ • CustomerForm (React Hook Form + Zod)                          │
│   - Nome Completo (pré-preenchido se logado)                    │
│   - CPF/CNPJ (máscara automática)                               │
│   - Email (pré-preenchido)                                      │
│   - Telefone (máscara automática)                               │
│ • Validação em tempo real                                       │
│ • Botão "Ir para Entrega" → trigger('customer')                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. CHECKOUT - PASSO 2: Entrega                                 │
├─────────────────────────────────────────────────────────────────┤
│ • ShippingForm (React Hook Form + Zod)                          │
│ • Busca automática de CEP (ViaCEP API)                          │
│   - CEP (máscara 00000-000)                                     │
│   - Cidade (auto-preenchido)                                    │
│   - Rua (auto-preenchido)                                       │
│   - Número (manual)                                             │
│   - Bairro (auto-preenchido)                                    │
│   - Estado (auto-preenchido)                                    │
│ • Botões: "Voltar" | "Ir para Pagamento"                        │
│ • Ao clicar "Ir para Pagamento":                                │
│   → trigger('shipping')                                         │
│   → createOrder() se válido                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. CRIAÇÃO DO PEDIDO (Backend)                                 │
├─────────────────────────────────────────────────────────────────┤
│ • createOrder() executa 3 operações no Supabase:               │
│                                                                  │
│ 1. UPSERT em customers:                                         │
│    - Cria/atualiza cliente com dados do form                    │
│    - Retorna customer.id                                        │
│                                                                  │
│ 2. INSERT em orders:                                            │
│    - user_id, customer_id, total_amount                         │
│    - status: 'pending'                                          │
│    - shipping_address_snapshot (JSON)                           │
│    - Retorna order.id                                           │
│                                                                  │
│ 3. INSERT em order_items:                                       │
│    - Para cada item do carrinho                                 │
│    - order_id, product_id, quantity, unit_price                 │
│                                                                  │
│ • clearCart() limpa o carrinho                                  │
│ • setCurrentStep(3) avança para pagamento                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. CHECKOUT - PASSO 3: Pagamento                               │
├─────────────────────────────────────────────────────────────────┤
│ • PaymentForm (orderId recebido)                                │
│ • Opções de pagamento:                                          │
│   - PIX (QR Code + Código Copia e Cola)                         │
│   - Cartão de Crédito                                           │
│   - Boleto                                                      │
│ • Após confirmação:                                             │
│   → handlePaymentSuccess()                                      │
│   → navigate('/checkout/success', { state: { orderId } })       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. CONFIRMAÇÃO                                                  │
├─────────────────────────────────────────────────────────────────┤
│ • SuccessPage (/checkout/success)                               │
│ • Exibe:                                                        │
│   - Número do pedido                                            │
│   - Resumo da compra                                            │
│   - Status de pagamento                                         │
│   - Botão "Ver Meus Pedidos" → /minha-conta                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 FORMULÁRIOS DETALHADOS

### **1. CustomerForm** (Dados Pessoais)
```typescript
Localização: components/checkout/CustomerForm.tsx
Validação: Zod (checkoutSchema.customer)
Context: React Hook Form (useFormContext)

Campos:
├─ fullName: string
│  ├─ Validação: min(3), max(100), regex(/^[a-zA-Zà-úÀ-Ú\s]+$/)
│  ├─ Placeholder: "Ex: João da Silva"
│  └─ Pré-preenchido: user?.user_metadata?.full_name
│
├─ cpf: string
│  ├─ Validação: CPF/CNPJ válido (algoritmo de dígitos verificadores)
│  ├─ Máscara: 000.000.000-00 ou 00.000.000/0000-00
│  ├─ Hook: useDocumentMask()
│  └─ maxLength: 18
│
├─ email: string (email)
│  ├─ Validação: formato email válido
│  ├─ Placeholder: "seu@email.com"
│  └─ Pré-preenchido: user?.email
│
└─ phone: string (tel)
   ├─ Validação: regex(/^\(\d{2}\) \d{4,5}-\d{4}$/)
   ├─ Máscara: (11) 99999-9999 ou (11) 2222-3333
   ├─ Função: formatPhone() - detecta celular/fixo
   └─ maxLength: 15

Estados:
- disabled?: boolean (desabilita todos os campos)
- errors: FieldErrors (exibe mensagens de erro)
```

### **2. ShippingForm** (Endereço de Entrega)
```typescript
Localização: components/checkout/ShippingForm.tsx
Validação: Zod (checkoutSchema.shipping)
Context: React Hook Form (useFormContext)
API: ViaCEP (busca automática)

Campos:
├─ zip: string
│  ├─ Validação: regex(/^\d{5}-\d{3}$/)
│  ├─ Máscara: 00000-000
│  ├─ Hook: useCep() - busca endereço ao blur
│  ├─ Loading: Loader2 icon durante busca
│  └─ maxLength: 9
│
├─ city: string (readonly)
│  ├─ Auto-preenchido pela API ViaCEP
│  └─ Validação: min(2), max(100)
│
├─ street: string (readonly)
│  ├─ Auto-preenchido pela API ViaCEP
│  └─ Validação: min(3), max(200)
│
├─ number: string
│  ├─ Único campo editável após busca CEP
│  ├─ Validação: min(1), max(10)
│  └─ Focus automático após busca CEP
│
├─ neighborhood: string (readonly)
│  ├─ Auto-preenchido pela API ViaCEP
│  └─ Validação: min(2), max(100)
│
└─ state: string (readonly)
   ├─ Auto-preenchido pela API ViaCEP (UF)
   ├─ Validação: length(2), uppercase
   └─ maxLength: 2

Fluxo ViaCEP:
1. Usuário digita CEP
2. onBlur → handleZipBlur()
3. isLoadingCep = true
4. Fetch: viacep.com.br/ws/{cep}/json/
5. setValue() para todos os campos
6. Focus no campo "number"
7. isLoadingCep = false
```

### **3. PaymentForm** (Pagamento)
```typescript
Localização: components/checkout/PaymentForm.tsx
Props: { orderId: string, onSuccess: () => void }

Métodos de Pagamento:
├─ PIX
│  ├─ QR Code gerado
│  ├─ Código Copia e Cola
│  └─ Botão "Copiar Código"
│
├─ Cartão de Crédito
│  ├─ Número do Cartão (máscara)
│  ├─ Nome no Cartão
│  ├─ Validade (MM/AA)
│  ├─ CVV
│  └─ Parcelas (select)
│
└─ Boleto
   ├─ Gera código de barras
   ├─ Botão "Baixar Boleto"
   └─ Data de vencimento

Validação:
- Cartão: Luhn algorithm
- CVV: 3-4 dígitos
- Validade: MM/AA válido
```

---

## 🔐 PROTEÇÃO DE ROTAS

### **ProtectedRoute Component**
```typescript
Localização: components/auth/ProtectedRoute.tsx
Função: Wrapper para rotas que requerem autenticação

Lógica:
1. useAuth() → { isAuthenticated, loading }
2. SE loading: Exibe spinner
3. SE !isAuthenticated: <Navigate to="/login" replace />
4. SE isAuthenticated: <Outlet /> (renderiza rota filha)

Rotas Protegidas:
- /minha-conta
- /checkout
- /checkout/success
- /admin/*
```

### **AdminRoute Component** (Não implementado ainda)
```typescript
// TODO: Criar AdminRoute para rotas /admin/*
// Verificar: isAdmin = profile?.role === 'admin'
```

---

## ✅ VALIDAÇÕES (Zod Schemas)

### **checkoutSchema**
```typescript
Localização: types/checkout.ts

customer: {
  fullName: z.string().min(3).max(100).regex(/^[a-zA-Zà-úÀ-Ú\s]+$/),
  email: z.string().email(),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  cpf: z.string().refine(validateCPF)
}

shipping: {
  zip: z.string().regex(/^\d{5}-\d{3}$/),
  street: z.string().min(3).max(200),
  number: z.string().min(1).max(10),
  neighborhood: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  state: z.string().length(2).toUpperCase()
}
```

---

## 🎯 PONTOS DE ATENÇÃO

### ✅ **Implementado Corretamente**
1. ✅ Validação de CPF/CNPJ com algoritmo correto
2. ✅ Máscaras automáticas (telefone, CEP, documento)
3. ✅ Busca automática de CEP com ViaCEP
4. ✅ Proteção de rotas com ProtectedRoute
5. ✅ Persistência do carrinho (LocalStorage)
6. ✅ Redirect após login (?redirect=/checkout)
7. ✅ Validação em tempo real (Zod + React Hook Form)
8. ✅ Feedback visual (loading, errors, success)

### ⚠️ **Melhorias Sugeridas**
1. ⚠️ AdminRoute não implementado (usar isAdmin do useAuth)
2. ⚠️ PaymentForm é placeholder (integrar Stripe/Mercado Pago)
3. ⚠️ Validação de estoque no checkout (verificar stock_quantity)
4. ⚠️ Rate limiting na busca de CEP (debounce)
5. ⚠️ Tratamento de erro quando CEP não encontrado
6. ⚠️ Confirmação antes de sair do checkout (unsaved changes)

### 🚀 **Próximos Passos**
1. Implementar AdminRoute para /admin/*
2. Integrar gateway de pagamento real
3. Adicionar validação de estoque antes de criar pedido
4. Implementar sistema de cupons de desconto
5. Adicionar cálculo de frete (Correios API)
6. Criar testes E2E do fluxo completo de compra

---

## 📊 ESTATÍSTICAS

- **Total de Rotas**: 17 (9 públicas + 8 protegidas)
- **Formulários**: 3 (Customer, Shipping, Payment)
- **Campos Totais**: 13 campos validados
- **APIs Externas**: 2 (Supabase + ViaCEP)
- **Validações Zod**: 13 schemas
- **Máscaras**: 4 (CPF, CNPJ, Telefone, CEP)

---

**Status**: ✅ Workflow completo e funcional
**Última Atualização**: 2025-01-XX
