import { test as setup } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);

  await page
    .locator('form')
    .getByRole('button', { name: /entrar/i })
    .click();

  // Aguarda login completar
  await page.waitForURL(/^(?!.*login).*$/, { timeout: 10000 });

  // Salva estado autenticado
  await page.context().storageState({ path: authFile });
});
