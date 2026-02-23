# Testes Automatizados - Guia Completo

## Visao geral

Sistema completo de testes com:
- **Testes unitarios** - Vitest (estado, validacoes)
- **Testes E2E** - Playwright (fluxos de usuario)
- **Cobertura** - Relatorios de cobertura
- **Integracao com CI** - GitHub Actions

---

## Inicio rapido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Instalar Browsers (Playwright)

```bash
npm run playwright:install
```

### 3. Rodar Testes

```bash
# Testes unitarios
npm test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

---

## Testes unitarios (Vitest)

### Rodar Testes

```bash
# Watch mode
npm test

# Executar uma vez
npm test -- --run

# Modo UI
npm run test:ui

# Cobertura
npm run test:coverage
```

### Testes implementados

#### 1. **Testes de estado** (`tests/store.test.ts`)
- Adicionar item ao carrinho
- Aumentar quantidade se ja existir
- Remover item
- Atualizar quantidade
- Limpar carrinho
- Calcular total

#### 2. **Testes de validacao** (`tests/validations.test.ts`)
- Validacao de checkout (email, telefone, endereco)
- Validacao de produto (preco, descricao)
- Rejeicao de carrinho vazio
- Rejeicao de dados invalidos

### Criar novo Teste

```typescript
// tests/myFeature.test.ts
import { describe, it, expect } from 'vitest'

describe('Minha funcionalidade', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })
})
```

---

## Testes E2E (Playwright)

### Rodar Testes

```bash
# Modo headless
npm run test:e2e

# Modo UI (visual)
npm run test:e2e:ui

# Modo com navegador (see browser)
npm run test:e2e:headed

# Navegador especifico
npx playwright test --project=chromium
```

### Testes implementados

#### 1. **Pagina inicial** (`tests/E2E/landing.spec.ts`)
- Load homepage
- Exibir barra de navegacao
- Exibir secao principal
- Exibir produtos
- Open cart modal

#### 2. **Fluxo do carrinho** (`tests/E2E/cart.spec.ts`)
- Add product to cart
- Atualizar quantidade
- Remover item
- Navigate to checkout

#### 3. **Autenticacao** (`tests/E2E/auth.spec.ts`)
- Show login page
- Exibir campos de entrada
- Google OAuth button
- Form validacao
- Redirect after login

### Criar novo Teste E2E

```typescript
// tests/e2e/myFlow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Meu fluxo', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Mansao Maromba/)
  })
})
```

---

## Cobertura

### Gerar relatorio

```bash
npm run test:coverage
```

### Ver relatorio

```bash
# Abre no navegador
open coverage/index.html
```

### Meta de cobertura

- **Target:** 80%+
- **Atual:** ~60% (estado + validacoes)

### Arquivos excluidos

- `node_modules/`
- `tests/`
- `*.config.ts`
- `supabase/functions/`
- `dist/`

---

## Integracao com CI

### GitHub Actions

Testes rodam automaticamente em:
- Push para `main` ou `develop`
- Pull Requests

### Fluxo

```yaml
# Github/workflows/CI.yml
- name: Executar testes
  run: npm test -- --run

- name: Executar testes E2E
  run: npm run test:e2e
```

---

## Boas praticas

### Testes unitarios

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

### Testes E2E

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

## Depuracao

### Vitest

```bash
# Modo debug
npm test -- --inspect-brk

# Modo UI (melhor para debug)
npm run test:ui
```

### Playwright

```bash
# Modo UI
npm run test:e2e:ui

# Modo debug
npx playwright test --debug

# Modo com navegador
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

## Proximos passos

### Testes a adicionar

1. **Testes de componentes**
   - Navbar component
   - ProductCard component
   - CartModal component

2. **Testes de integracao**
   - useAuth hook
   - useProducts hook
   - useOrders hook

3. **Testes E2E**
   - Checkout flow completo
   - Admin panel CRUD
   - Order history

4. **Testes de performance**
   - Lighthouse CI
   - Bundle size checks

---

## Configuracao

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

## Checklist

- [x] Vitest instalado e configurado
- [x] Playwright instalado e configurado
- [x] Configuracao file criado
- [x] estado tests implementados
- [x] validacao tests implementados
- [x] E2E landing page tests
- [x] E2E cart flow tests
- [x] E2E auth tests
- [x] Scripts no package.json
- [x] CI integration
- [ ] Cobertura > 80%
- [ ] Component tests
- [ ] Testes de integracao

---

## Recursos

- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [Testes Library](https://testing-library.com)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

** Testes automatizados completos!**

Cobertura atual: ~60%
Meta: 80%+



