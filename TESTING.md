# 🧪 Testes Automatizados - Guia Completo

## 📋 Visão Geral

Sistema completo de testes com:
- ✅ **Unit Tests** - Vitest (store, validations)
- ✅ **E2E Tests** - Playwright (user flows)
- ✅ **Coverage** - Relatórios de cobertura
- ✅ **CI Integration** - GitHub Actions

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

### 2. Instalar Browsers (Playwright)

```bash
npm run playwright:install
```

### 3. Rodar Testes

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🧪 Unit Tests (Vitest)

### Rodar Testes

```bash
# Watch mode
npm test

# Run once
npm test -- --run

# UI mode
npm run test:ui

# Coverage
npm run test:coverage
```

### Testes Implementados

#### 1. **Store Tests** (`tests/store.test.ts`)
- ✅ Add item to cart
- ✅ Increase quantity if exists
- ✅ Remove item
- ✅ Update quantity
- ✅ Clear cart
- ✅ Calculate total

#### 2. **Validation Tests** (`tests/validations.test.ts`)
- ✅ Checkout validation (email, phone, address)
- ✅ Product validation (price, description)
- ✅ Empty cart rejection
- ✅ Invalid data rejection

### Criar Novo Teste

```typescript
// tests/myFeature.test.ts
import { describe, it, expect } from 'vitest'

describe('My Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })
})
```

---

## 🎭 E2E Tests (Playwright)

### Rodar Testes

```bash
# Headless mode
npm run test:e2e

# UI mode (visual)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed

# Specific browser
npx playwright test --project=chromium
```

### Testes Implementados

#### 1. **Landing Page** (`tests/e2e/landing.spec.ts`)
- ✅ Load homepage
- ✅ Display navbar
- ✅ Display hero section
- ✅ Display products
- ✅ Open cart modal

#### 2. **Cart Flow** (`tests/e2e/cart.spec.ts`)
- ✅ Add product to cart
- ✅ Update quantity
- ✅ Remove item
- ✅ Navigate to checkout

#### 3. **Authentication** (`tests/e2e/auth.spec.ts`)
- ✅ Show login page
- ✅ Display inputs
- ✅ Google OAuth button
- ✅ Form validation
- ✅ Redirect after login

### Criar Novo Teste E2E

```typescript
// tests/e2e/myFlow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('My Flow', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Mansão Maromba/)
  })
})
```

---

## 📊 Coverage

### Gerar Relatório

```bash
npm run test:coverage
```

### Ver Relatório

```bash
# Abre no navegador
open coverage/index.html
```

### Meta de Coverage

- **Target:** 80%+
- **Atual:** ~60% (store + validations)

### Arquivos Excluídos

- `node_modules/`
- `tests/`
- `*.config.ts`
- `supabase/functions/`
- `dist/`

---

## 🔄 CI Integration

### GitHub Actions

Testes rodam automaticamente em:
- Push para `main` ou `develop`
- Pull Requests

### Workflow

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm test -- --run

- name: Run E2E tests
  run: npm run test:e2e
```

---

## 📝 Boas Práticas

### Unit Tests

1. **Arrange, Act, Assert**
```typescript
it('should add item', () => {
  // Arrange
  const store = useCartStore.getState()
  
  // Act
  store.addToCart(product)
  
  // Assert
  expect(store.items).toHaveLength(1)
})
```

2. **Limpar estado entre testes**
```typescript
beforeEach(() => {
  useCartStore.setState({ items: [] })
})
```

3. **Testar casos extremos**
```typescript
it('should handle negative quantity', () => {
  // Test edge case
})
```

### E2E Tests

1. **Usar data-testid**
```tsx
<div data-testid="product-card">...</div>
```

```typescript
await page.locator('[data-testid="product-card"]')
```

2. **Esperar elementos**
```typescript
await page.waitForSelector('[data-testid="product"]')
```

3. **Usar Page Objects (opcional)**
```typescript
class LoginPage {
  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email)
    await this.page.fill('input[type="password"]', password)
    await this.page.click('button[type="submit"]')
  }
}
```

---

## 🐛 Debugging

### Vitest

```bash
# Debug mode
npm test -- --inspect-brk

# UI mode (melhor para debug)
npm run test:ui
```

### Playwright

```bash
# UI mode
npm run test:e2e:ui

# Debug mode
npx playwright test --debug

# Headed mode
npm run test:e2e:headed
```

### Screenshots

Playwright tira screenshots automaticamente em falhas:
```
test-results/
  auth-should-login/
    test-failed-1.png
```

---

## 📈 Próximos Passos

### Testes a Adicionar

1. **Component Tests**
   - Navbar component
   - ProductCard component
   - CartModal component

2. **Integration Tests**
   - useAuth hook
   - useProducts hook
   - useOrders hook

3. **E2E Tests**
   - Checkout flow completo
   - Admin panel CRUD
   - Order history

4. **Performance Tests**
   - Lighthouse CI
   - Bundle size checks

---

## 🔧 Configuração

### Vitest (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Playwright (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ]
})
```

---

## ✅ Checklist

- [x] Vitest instalado e configurado
- [x] Playwright instalado e configurado
- [x] Setup file criado
- [x] Store tests implementados
- [x] Validation tests implementados
- [x] E2E landing page tests
- [x] E2E cart flow tests
- [x] E2E auth tests
- [x] Scripts no package.json
- [x] CI integration
- [ ] Coverage > 80%
- [ ] Component tests
- [ ] Integration tests

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**🎉 Testes automatizados completos!**

Coverage atual: ~60%
Meta: 80%+
