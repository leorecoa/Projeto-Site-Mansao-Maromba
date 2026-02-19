# 🛡️ Configuração Admin Permanente - Guia Completo

## 📋 Passo a Passo

### 1️⃣ Fazer Login no App
```
Email: leorecoa1@hotmail.com
Senha: 292404Leo@
```

Acesse: http://localhost:5173/login

### 2️⃣ Executar Script SQL no Supabase

1. Acesse: https://supabase.com/dashboard/project/ftgzoulanmsrmujtgrvj/sql/new
2. Cole o conteúdo do arquivo `SETUP_ADMIN_PERMANENTE.sql`
3. Clique em **RUN**
4. Verifique a mensagem: `Admin configurado com sucesso: leorecoa1@hotmail.com`

### 3️⃣ Fazer Logout e Login Novamente

1. No app, clique em **Sair**
2. Faça login novamente
3. O `useAuth` vai buscar o novo role

### 4️⃣ Acessar Admin

Acesse: http://localhost:5173/admin

Deve ver o Dashboard com métricas!

---

## 🔍 Como Verificar se Está Funcionando

### No Console do Navegador (F12):
```
🛡️ AdminRoute check: { isAdmin: true, isAuthenticated: true }
```

### No Supabase SQL Editor:
```sql
SELECT email, role FROM user_profiles WHERE email = 'leorecoa1@hotmail.com';
```

Resultado esperado:
```
email                    | role
-------------------------|-------
leorecoa1@hotmail.com   | admin
```

---

## 🗺️ Rotas Admin Disponíveis

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard com métricas |
| `/admin/orders` | Lista de todos os pedidos |
| `/admin/orders/:id` | Detalhes de um pedido |
| `/admin/products` | Lista de produtos (CRUD) |
| `/admin/products/new` | Criar novo produto |
| `/admin/products/:id` | Editar produto |

---

## 🔒 Proteções Implementadas

### 1. AdminRoute Component
- ✅ Verifica `isAdmin` do `useAuth`
- ✅ Redireciona não-autenticados para `/login`
- ✅ Redireciona não-admins para `/`
- ✅ Usa `useRef` para evitar dupla verificação

### 2. useAuth Hook
- ✅ Busca `role` da tabela `user_profiles`
- ✅ Expõe `isAdmin` boolean
- ✅ Atualiza automaticamente via `onAuthStateChange`

### 3. Supabase RLS Policies
- ✅ Apenas admins podem criar produtos
- ✅ Apenas admins podem editar produtos
- ✅ Apenas admins podem deletar produtos
- ✅ Função `is_admin(user_id)` no banco

---

## 🚨 Troubleshooting

### Problema: "Não consigo acessar /admin"

**Solução 1:** Verificar role no banco
```sql
SELECT * FROM user_profiles WHERE email = 'leorecoa1@hotmail.com';
```

Se `role` não for `'admin'`, execute:
```sql
UPDATE user_profiles SET role = 'admin' WHERE email = 'leorecoa1@hotmail.com';
```

**Solução 2:** Limpar cache e fazer logout/login
```javascript
// Console do navegador
localStorage.clear();
sessionStorage.clear();
// Depois faça login novamente
```

**Solução 3:** Verificar console do navegador
```
Deve aparecer: 🛡️ AdminRoute check: { isAdmin: true, ... }
Se aparecer isAdmin: false, o role não está correto no banco
```

---

## 🔄 Como Adicionar Mais Admins

```sql
-- 1. Buscar ID do usuário
SELECT id, email FROM auth.users WHERE email = 'novo-admin@email.com';

-- 2. Atualizar role
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'novo-admin@email.com';

-- 3. Verificar
SELECT email, role FROM user_profiles WHERE role = 'admin';
```

---

## 📊 Estrutura do Sistema Admin

```
useAuth Hook
    ↓
Busca user_profiles.role
    ↓
Expõe isAdmin boolean
    ↓
AdminRoute verifica isAdmin
    ↓
Se true → Renderiza página admin
Se false → Redireciona para /
```

---

## ✅ Checklist Final

- [ ] Script SQL executado no Supabase
- [ ] Verificado role = 'admin' no banco
- [ ] Logout e login realizados
- [ ] Console mostra `isAdmin: true`
- [ ] Acesso a `/admin` funciona
- [ ] Dashboard carrega com métricas
- [ ] Todas as rotas admin acessíveis

---

## 🎯 Garantias de Funcionamento Permanente

1. **Trigger automático** cria perfil para novos usuários
2. **RLS Policies** protegem dados no banco
3. **AdminRoute** verifica role em tempo real
4. **useAuth** sincroniza automaticamente
5. **Script SQL** é idempotente (pode executar múltiplas vezes)

---

**Desenvolvido com segurança enterprise-level** 🛡️
