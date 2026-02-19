# 🐛 DEBUG: Problemas de Navegação

## ❌ PROBLEMA REPORTADO
"App não funciona nada! Não sai da tela de home, os caminhos não abrem"

## 🔍 DIAGNÓSTICO

### 1. **Verificar Console do Navegador**
Abra DevTools (F12) e verifique:
- ❌ Erros em vermelho?
- ⚠️ Warnings em amarelo?
- 🔵 Network requests falhando?

### 2. **Possíveis Causas**

#### A) **Rota /orders não existe**
```typescript
// Navbar.tsx linha 56
navigate('/orders')  // ❌ ROTA NÃO EXISTE!

// Deveria ser:
navigate('/minha-conta')  // ✅ ROTA EXISTE
```

#### B) **React Router não inicializado**
```typescript
// index.tsx - Verificar se tem BrowserRouter
<BrowserRouter>
  <App />
</BrowserRouter>
```

#### C) **Erro no Supabase**
```typescript
// App.tsx - fetchProducts() pode estar travando
// Verificar se .env.local tem as variáveis corretas
```

## 🔧 SOLUÇÕES

### **Solução 1: Corrigir Navbar**
```typescript
// components/layout/Navbar.tsx

// ANTES (linha 56):
navigate('/orders')

// DEPOIS:
navigate('/minha-conta')
```

### **Solução 2: Verificar index.tsx**
```typescript
// index.tsx
import { BrowserRouter } from 'react-router-dom'

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>  {/* ✅ DEVE ESTAR AQUI */}
      <App />
    </BrowserRouter>
  </QueryClientProvider>
)
```

### **Solução 3: Verificar .env.local**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_GA_MEASUREMENT_ID=G-GF264GFHB4
```

### **Solução 4: Limpar Cache**
```bash
# Parar servidor (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

## 🧪 TESTES

### Teste 1: Navegação Manual
```
1. Abra http://localhost:5174
2. Abra DevTools (F12) → Console
3. Digite: window.location.href = '/login'
4. Funcionou? ✅ Router OK | ❌ Router com problema
```

### Teste 2: Links da Navbar
```
1. Clique em "Home" → Deve ficar em /
2. Clique em "ENTRAR" → Deve ir para /login
3. Clique no carrinho → Deve abrir modal
```

### Teste 3: Rotas Diretas
```
Digite na barra de endereço:
- http://localhost:5174/login
- http://localhost:5174/products/1
- http://localhost:5174/search
```

## 📋 CHECKLIST DE DEBUG

- [ ] Console sem erros vermelhos
- [ ] BrowserRouter no index.tsx
- [ ] .env.local configurado
- [ ] Navbar sem links quebrados
- [ ] Cache limpo
- [ ] Servidor reiniciado

## 🚨 ERROS COMUNS

### Erro 1: "Cannot read property 'navigate' of undefined"
**Causa**: useNavigate() fora do BrowserRouter
**Solução**: Verificar index.tsx

### Erro 2: "No routes matched location"
**Causa**: Rota não existe em App.tsx
**Solução**: Adicionar rota ou corrigir link

### Erro 3: "Failed to fetch"
**Causa**: Supabase não configurado
**Solução**: Verificar .env.local

### Erro 4: Página branca
**Causa**: Erro de JavaScript não tratado
**Solução**: Verificar console

## 🔍 COMANDOS DE DEBUG

```bash
# Ver erros do TypeScript
npm run type-check

# Ver erros do ESLint
npm run lint

# Limpar tudo e reinstalar
rm -rf node_modules .vite dist
npm install
npm run dev
```

## 📞 PRÓXIMOS PASSOS

1. **Abra o console do navegador (F12)**
2. **Copie TODOS os erros que aparecem**
3. **Me envie os erros**
4. **Vou corrigir especificamente**

---

**Status**: 🔴 Aguardando informações do console
