import { test, expect, type Page } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function loginAsAdmin(page: Page) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    if (process.env.CI) {
      throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD sao obrigatorios no CI para o gate de ErrorBoundary admin.');
    }

    test.skip(true, 'ADMIN_EMAIL/ADMIN_PASSWORD nao configurados para teste admin.');
  }

  await page.goto('/login');
  await page.fill('input[type="email"]', ADMIN_EMAIL!);
  await page.fill('input[type="password"]', ADMIN_PASSWORD!);
  await page.locator('form').getByRole('button', { name: /entrar/i }).click();
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
}

test.describe('Global Error Boundary', () => {
  test('deve exibir fallback e permitir recuperacao apos unhandled rejection', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('nav')).toBeVisible({ timeout: 30000 });

    await page.evaluate(() => {
      setTimeout(() => {
        Promise.reject(new Error('E2E boundary test'));
      }, 0);
    });

    await expect(page.getByRole('heading', { name: /algo deu errado/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeVisible();

    await page.getByRole('button', { name: /tentar novamente/i }).click();
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
  });

  test('deve exibir fallback e recuperar em rota admin autenticada', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /dashboard admin/i })).toBeVisible({ timeout: 15000 });

    await page.evaluate(() => {
      setTimeout(() => {
        Promise.reject(new Error('E2E admin boundary test'));
      }, 0);
    });

    await expect(page.getByRole('heading', { name: /algo deu errado/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeVisible();

    await page.getByRole('button', { name: /tentar novamente/i }).click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: /dashboard admin/i })).toBeVisible({ timeout: 15000 });
  });
});
