import { test, expect, type Page } from '@playwright/test';
import path from 'path';

const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL || process.env.TEST_USER_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || process.env.TEST_USER_PASSWORD || 'admin123',
};

const TEST_PRODUCT = {
  name: `Produto Teste E2E ${Date.now()}`,
  description: 'Descricao do produto de teste',
  price: '99.90',
  stock: '50',
};
const HAS_EXPLICIT_ADMIN_ENV = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

async function login(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.goto('/login');
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await expect(emailInput).toBeEditable({ timeout: 15000 });
  await expect(passwordInput).toBeEditable({ timeout: 15000 });
  await emailInput.fill(ADMIN_USER.email);
  await passwordInput.fill(ADMIN_USER.password);
  await page
    .locator('form')
    .getByRole('button', { name: /entrar/i })
    .click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

async function hasAdminAccess(page: Page): Promise<boolean> {
  await page.goto('/admin');
  await page.waitForLoadState('domcontentloaded');
  return await page
    .getByRole('heading', { name: /dashboard admin/i })
    .isVisible({ timeout: 5000 })
    .catch(() => false);
}

test.describe('Admin Panel (requires admin credentials)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('1. Acessar dashboard admin', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await expect(page.getByRole('heading', { name: /dashboard admin/i })).toBeVisible();
  });

  test('2. Listar produtos', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/products');
    await expect(page.getByRole('heading', { name: /gerenciar produtos/i })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('3. Criar novo produto', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/products/new');
    await expect(page.getByRole('heading', { name: /novo produto/i })).toBeVisible();

    await page.locator('input[name="name"]').fill(TEST_PRODUCT.name);
    await page.locator('textarea[name="description"]').fill(TEST_PRODUCT.description);
    await page.locator('input[name="price"]').fill(TEST_PRODUCT.price);
    await page.locator('input[name="stock_quantity"]').fill(TEST_PRODUCT.stock);
    await page.getByRole('button', { name: /salvar produto/i }).click();

    await expect(page).toHaveURL(/\/admin\/products$/);
  });

  test('4. Editar produto existente', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/products');
    await expect(page.locator('table').first()).toBeVisible();

    const editButton = page.locator('button[title="Editar"]').first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page).toHaveURL(/\/admin\/products\/.+/);
    await page.locator('input[name="price"]').fill('149.90');
    await page.getByRole('button', { name: /salvar produto/i }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
  });

  test('5. Deletar produto de teste se existir', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/products');
    await expect(page.locator('table').first()).toBeVisible();

    const row = page.locator('tr', { hasText: TEST_PRODUCT.name }).first();
    if (await row.isVisible().catch(() => false)) {
      page.once('dialog', (dialog) => dialog.accept());
      await row.locator('button[title="Excluir"]').click();
      await expect(page.getByText(TEST_PRODUCT.name)).not.toBeVisible({ timeout: 10000 });
    }
  });

  test('6. Listar pedidos', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/orders');
    await expect(page.getByRole('heading', { name: /gerenciar pedidos/i })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('7. Acoes de pedido disponiveis na lista', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/orders');
    await expect(page.locator('table').first()).toBeVisible();
    await expect(page.locator('button[title="Ver Detalhes"]').first()).toBeVisible();
  });

  test('8. Filtro de status em pedidos', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    test.skip(!adminOk, 'Credenciais atuais nao possuem acesso admin');

    await page.goto('/admin/orders');
    await expect(page.locator('table').first()).toBeVisible();

    const paidBtn = page.getByRole('button', { name: /^paid$/i }).first();
    await paidBtn.click();
    await expect(paidBtn).toHaveClass(/bg-yellow-400/);
  });

  test('10. Campo de upload de imagem disponivel no form de produto', async ({ page }) => {
    const adminOk = await hasAdminAccess(page);
    if (!adminOk && !HAS_EXPLICIT_ADMIN_ENV) {
      test.skip(true, 'Credenciais atuais nao possuem acesso admin');
    }

    if (!adminOk && HAS_EXPLICIT_ADMIN_ENV) {
      throw new Error('ADMIN_EMAIL/ADMIN_PASSWORD definidos, mas sem acesso admin em /admin.');
    }

    await page.goto('/admin/products/new');
    await expect(page.getByRole('heading', { name: /novo produto/i })).toBeVisible();
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeAttached();

    const fixturePath = path.resolve(process.cwd(), 'public', 'images', 'products', 'vodka.png');
    await fileInput.setInputFiles(fixturePath);

    await expect(page.locator('img[alt="Preview"]')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Admin Route Protection', () => {
  test('9. Sem autenticacao nao acessa admin', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.context().clearCookies();

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
