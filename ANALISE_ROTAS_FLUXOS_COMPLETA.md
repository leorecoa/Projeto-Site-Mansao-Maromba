# 🗺️ Análise Completa de Rotas e Fluxos - Mansão Maromba

## 📋 Índice
1. [Mapa de Rotas](#mapa-de-rotas)
2. [Fluxos de Navegação](#fluxos-de-navegação)
3. [Sistema de Autenticação](#sistema-de-autenticação)
4. [Proteção de Rotas](#proteção-de-rotas)
5. [Fluxo de Checkout](#fluxo-de-checkout)
6. [Fluxo Admin](#fluxo-admin)
7. [Estado Global](#estado-global)

---

## 🗺️ Mapa de Rotas

### **Rotas Públicas**
```
/                          → Landing Page (Hero + Sections)
/login                     → Página de Login/Cadastro
/auth/callback             → Callback OAuth (Google)
/products/:id              → Detalhes do Produto
/search                    → Busca de Produtos
/terms                     → Termos de Uso
/privacy                   → Política de Privacidade
/faq                       → Perguntas Frequentes
/test                      → Página de Testes
/error                     → Página de Erro
/*                         → 404 Not Found
```

### **Rotas Protegidas** (Requer Autenticação)
```
/minha-conta               → Conta do Usuário + Meus Pedidos
/checkout                  → Checkout (3 etapas)
/checkout/success          → Confirmação de Pedido
/admin                     → Dashboard Admin
/admin/orders              → Lista de Pedidos (Admin)
/admin/orders/:id          → Detalhes do Pedido (Admin)
/admin/products            → Lista de Produtos (Admin)
/admin/products/new        → Criar Produto (Admin)
/admin/products/:id        → Editar Produto (Admin)
```

---

## 🔄 Fluxos de Navegação

### **1. Fluxo de Compra (Happy Path)**
```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE COMPRA                          │
└─────────────────────────────────────────────────────────────┘

1. Landing Page (/)
   ↓
2. Usuário clica em "Adicionar ao Carrinho"
   ↓ [useCart.addToCart()]
3. Modal do Carrinho abre automaticamente
   ↓
4. Usuário clica em "Finalizar Compra"
   ↓
5. Sistema verifica autenticação
   │
   ├─ Autenticado? → /checkout
   │
   └─ Não autenticado? → /login?redirect=/checkout
      ↓
      Login bem-sucedido → /checkout

6. Checkout - Etapa 1: Identificação
   ↓ [Validação com Zod]
7. Checkout - Etapa 2: Entrega
   ↓ [Busca CEP via ViaCEP]
   ↓ [Cria pedido no Supabase]
8. Checkout - Etapa 3: Pagamento
   ↓ [Simula pagamento]
9. Sucesso → /checkout/success
   ↓
10. Limpa carrinho [clearCart()]
```

### **2. Fluxo de Autenticação**
```
┌─────────────────────────────────────────────────────────────┐
│              FLUXO DE AUTENTICAÇÃO                          │
└─────────────────────────────────────────────────────────────┘

OPÇÃO A: Email/Senha
─────────────────────
/login
  ↓
Usuário preenche email + senha
  ↓
[supabase.auth.signInWithPassword()]
  ↓
Sucesso → Redireciona para "/"
  ↓
[useAuth] detecta sessão
  ↓
Busca perfil em "user_profiles"
  ↓
Define role (customer/admin)


OPÇÃO B: Google OAuth
──────────────────────
/login
  ↓
Usuário clica "Continuar com Google"
  ↓
[supabase.auth.signInWithOAuth({ provider: 'google' })]
  ↓
Redireciona para Google
  ↓
Usuário autoriza
  ↓
Google redireciona → /auth/callback
  ↓
[AuthCallback] processa tokens
  ↓
Redireciona para "/"
  ↓
[useAuth] detecta sessão
```

### **3. Fluxo de Navegação no Site**
```
┌─────────────────────────────────────────────────────────────┐
│                NAVEGAÇÃO PRINCIPAL                          │
└─────────────────────────────────────────────────────────────┘

Navbar (Sempre visível)
  │
  ├─ Logo → "/"
  ├─ Home → "/"
  ├─ Meus Pedidos → "/minha-conta" (se autenticado)
  ├─ Carrinho → Abre CartModal
  └─ Login/Logout → "/login" ou signOut()

Footer
  │
  ├─ Termos → "/terms"
  ├─ Privacidade → "/privacy"
  └─ FAQ → "/faq"

Landing Page (/)
  │
  ├─ Hero (Carrossel 3D)
  ├─ ProductSection → Adiciona ao carrinho
  ├─ AboutSection
  ├─ ReviewSection
  └─ MapSection
```

---

## 🔐 Sistema de Autenticação

### **Hook: useAuth**
```typescript
// hooks/useAuth.ts

Estado:
- user: User | null              // Usuário do Supabase
- profile: UserProfile | null    // Perfil com role
- loading: boolean               // Carregando sessão
- isAuthenticated: boolean       // !!user
- isAdmin: boolean               // profile.role === 'admin'

Métodos:
- signOut()                      // Logout
```

### **Fluxo de Inicialização**
```
App carrega
  ↓
useAuth() executa
  ↓
[supabase.auth.getSession()]
  ↓
Sessão existe?
  │
  ├─ SIM → Busca user_profiles
  │         ↓
  │         Define role
  │         ↓
  │         setLoading(false)
  │
  └─ NÃO → setUser(null)
            ↓
            setLoading(false)

[supabase.auth.onAuthStateChange()]
  ↓
Escuta mudanças de sessão
  ↓
Atualiza estado em tempo real
```

---

## 🛡️ Proteção de Rotas

### **ProtectedRoute Component**
```typescript
// components/auth/ProtectedRoute.tsx

Lógica:
1. Verifica loading
   ↓ Se true → Mostra spinner
   
2. Verifica isAuthenticated
   ↓ Se false → <Navigate to="/login" />
   
3. Se autenticado → <Outlet /> (renderiza rota filha)
```

### **AdminRoute Component**
```typescript
// components/auth/AdminRoute.tsx

Lógica:
1. Verifica loading
   ↓ Se true → Mostra spinner
   
2. Verifica isAuthenticated
   ↓ Se false → <Navigate to="/login" />
   
3. Busca role no Supabase
   ↓ Se role !== 'admin' → <Navigate to="/" />
   
4. Se admin → <Outlet />
```

### **Estrutura no App.tsx**
```tsx
<Routes>
  {/* Públicas */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protegidas */}
  <Route element={<ProtectedRoute />}>
    <Route path="/minha-conta" element={<AccountPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/admin" element={<DashboardPage />} />
    {/* ... outras rotas admin */}
  </Route>
</Routes>
```

---

## 🛒 Fluxo de Checkout Detalhado

### **Etapas do Checkout**
```
┌─────────────────────────────────────────────────────────────┐
│                  CHECKOUT - 3 ETAPAS                        │
└─────────────────────────────────────────────────────────────┘

ETAPA 1: IDENTIFICAÇÃO (CustomerForm)
──────────────────────────────────────
Campos:
- Nome Completo
- Email
- Telefone
- CPF

Validação: Zod Schema (checkoutSchema.customer)
Ação: Clica "Ir para Entrega" → setCurrentStep(2)


ETAPA 2: ENTREGA (ShippingForm)
────────────────────────────────
Campos:
- CEP (busca automática via ViaCEP)
- Rua (preenchido automaticamente)
- Número
- Complemento
- Bairro (preenchido automaticamente)
- Cidade (preenchido automaticamente)
- Estado (preenchido automaticamente)

Validação: Zod Schema (checkoutSchema.shipping)
Ação: Clica "Ir para Pagamento"
  ↓
  [createOrder()] executa:
    1. Upsert em "customers"
    2. Insert em "orders"
    3. Insert em "order_items"
    4. clearCart()
  ↓
  setCurrentStep(3)


ETAPA 3: PAGAMENTO (PaymentForm)
─────────────────────────────────
Campos:
- Método de Pagamento (PIX/Cartão/Boleto)
- Dados do Cartão (se cartão)

Ação: Clica "Finalizar Pedido"
  ↓
  [handlePaymentSuccess()]
  ↓
  navigate('/checkout/success', { state: { orderId } })
```

### **Validação com Zod**
```typescript
// types/checkout.ts

checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(3).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10,11}$/),
    cpf: z.string().regex(/^\d{11}$/)
  }),
  shipping: z.object({
    zip: z.string().regex(/^\d{8}$/),
    street: z.string().min(3),
    number: z.string().min(1),
    neighborhood: z.string().min(2),
    city: z.string().min(2),
    state: z.string().length(2)
  }),
  payment: z.object({
    method: z.enum(['pix', 'credit_card', 'boleto'])
  })
})
```

### **Integração com Supabase**
```typescript
// pages/checkout/CheckoutPage.tsx

createOrder():
  1. Upsert Customer
     ↓
     supabase.from('customers').upsert({
       auth_user_id: user.id,
       full_name, email, phone,
       address_*
     })
  
  2. Create Order
     ↓
     supabase.from('orders').insert({
       user_id: user.id,
       customer_id: customer.id,
       total_amount: cartTotal,
       status: 'pending',
       shipping_address_snapshot: formData.shipping
     })
  
  3. Create Order Items
     ↓
     supabase.from('order_items').insert(
       cart.map(item => ({
         order_id: order.id,
         product_id: item.id,
         quantity: item.quantity,
         unit_price: item.price
       }))
     )
```

---

## 👑 Fluxo Admin

### **Acesso ao Admin**
```
Usuário autenticado
  ↓
Navega para /admin
  ↓
[AdminRoute] verifica role
  ↓
role === 'admin'?
  │
  ├─ SIM → Renderiza Dashboard
  │
  └─ NÃO → Redireciona para "/"
```

### **Páginas Admin**
```
/admin (Dashboard)
  │
  ├─ Estatísticas:
  │   - Receita Total
  │   - Vendas Totais
  │   - Novos Pedidos
  │   - Ticket Médio
  │
  └─ Pedidos Recentes (últimos 5)

/admin/orders (Lista de Pedidos)
  │
  ├─ Filtros por status
  ├─ Busca por ID/Cliente
  └─ Clica em pedido → /admin/orders/:id

/admin/orders/:id (Detalhes do Pedido)
  │
  ├─ Informações do cliente
  ├─ Itens do pedido
  ├─ Status tracking
  └─ Ações (Atualizar status)

/admin/products (Lista de Produtos)
  │
  ├─ Grid de produtos
  ├─ Editar → /admin/products/:id
  └─ Criar → /admin/products/new

/admin/products/new (Criar Produto)
  │
  ├─ Formulário completo
  ├─ Upload de imagem (Supabase Storage)
  └─ Preview em tempo real

/admin/products/:id (Editar Produto)
  │
  ├─ Carrega dados existentes
  ├─ Permite edição
  └─ Atualiza no Supabase
```

---

## 🌐 Estado Global

### **1. Carrinho (Zustand + LocalStorage)**
```typescript
// store/useCart.ts

Estado:
- cart: CartItem[]
- isCartOpen: boolean
- cartTotal: number
- cartCount: number

Métodos:
- addToCart(product)      // Adiciona + abre modal
- removeFromCart(id)      // Remove item
- updateQuantity(id, qty) // Atualiza quantidade
- clearCart()             // Limpa tudo
- setIsCartOpen(open)     // Controla modal

Persistência:
- LocalStorage: 'mansao-maromba-cart'
- Hidratação automática ao carregar
```

### **2. Toast (Zustand)**
```typescript
// store/useToast.ts

Estado:
- toasts: Toast[]

Métodos:
- addToast(message, type)
- removeToast(id)

Tipos:
- success (verde)
- error (vermelho)
- info (azul)
```

### **3. Navegação (Zustand)**
```typescript
// hooks/useNavigation.ts

Estado:
- currentPath: string

Métodos:
- navigate(path)  // Navega + scroll to top

Nota: Usado em conjunto com React Router
```

---

## 🔄 Fluxos de Dados

### **Produtos**
```
Supabase (products table)
  ↓
[useProducts hook]
  ↓
React Query (cache)
  ↓
Componentes (ProductSection, etc)
```

### **Pedidos**
```
Supabase (orders + order_items)
  ↓
[useOrders hook] (cliente)
[useAdminOrders hook] (admin)
  ↓
React Query (cache)
  ↓
Componentes (MyOrders, OrdersList)
```

### **Carrinho**
```
LocalStorage
  ↓
Zustand (useCart)
  ↓
Componentes (CartModal, Navbar badge)
```

---

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  React   │  │  Zustand │  │  React   │  │  React   │  │
│  │  Router  │  │  Store   │  │  Query   │  │  Hook    │  │
│  │          │  │          │  │          │  │  Form    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │             │         │
│       └─────────────┴─────────────┴─────────────┘         │
│                         │                                  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │ Database │  │ Storage  │  │   RLS    │  │
│  │  (JWT)   │  │(Postgres)│  │  (CDN)   │  │ Policies │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Pontos-Chave

### **Segurança**
✅ Todas as rotas admin protegidas com RBAC
✅ Validação de inputs com Zod
✅ RLS Policies no Supabase
✅ Tokens JWT gerenciados pelo Supabase

### **Performance**
✅ Cache com React Query
✅ Persistência do carrinho no LocalStorage
✅ Code splitting automático (Vite)
✅ Lazy loading de componentes

### **UX**
✅ Feedback visual (toasts)
✅ Loading states em todas as operações
✅ Redirecionamento inteligente após login
✅ Modal do carrinho abre automaticamente

### **Escalabilidade**
✅ Separação de responsabilidades (hooks, services, components)
✅ Estado global centralizado (Zustand)
✅ Tipagem forte (TypeScript)
✅ Validação runtime (Zod)

---

## 🚀 Melhorias Futuras

1. **Implementar Rate Limiting** nas rotas de API
2. **Adicionar Testes E2E** para todos os fluxos críticos
3. **Implementar PWA** com Service Worker
4. **Adicionar Monitoramento** (Sentry)
5. **Implementar Pagamento Real** (Stripe/Mercado Pago)
6. **Adicionar Sistema de Reviews** com moderação
7. **Implementar Busca Avançada** com filtros
8. **Adicionar Cálculo de Frete** via API dos Correios

---

**Documentação gerada em:** 2025
**Versão:** 1.1.0
**Autor:** Leandro Jessé
