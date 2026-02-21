import { test, expect } from '@playwright/test';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

const TEST_CUSTOMER = {
  fullName: 'Joao Silva',
  email: 'joao@example.com',
  phone: '11987654321',
  cpf: '12345678909',
  zip: '01310100',
  number: '1000',
};

test.describe('Checkout Completo (credenciais reais)', () => {
  test.beforeEach(async ({ page }) => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      test.skip(true, 'TEST_USER_EMAIL/TEST_USER_PASSWORD nao configurados.');
    }

    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', TEST_USER_PASSWORD!);
    await page.locator('form').getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  });

  test('deve concluir o fluxo atual: /checkout -> pagamento -> /checkout/success', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("GARANTIR COMBO")').first().click();
    await page.getByRole('button', { name: /finalizar compra|finalizar pedido/i }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.locator('input[name="customer.fullName"]').fill(TEST_CUSTOMER.fullName);
    await page.locator('input[name="customer.email"]').fill(TEST_CUSTOMER.email);
    await page.locator('input[name="customer.phone"]').fill(TEST_CUSTOMER.phone);
    await page.locator('input[name="customer.cpf"]').fill(TEST_CUSTOMER.cpf);
    await page.getByRole('button', { name: /ir para entrega/i }).click();

    await page.locator('input[name="shipping.zip"]').fill(TEST_CUSTOMER.zip);
    await page.locator('input[name="shipping.zip"]').blur();
    await page.locator('input[name="shipping.number"]').fill(TEST_CUSTOMER.number);
    await page.getByRole('button', { name: /ir para pagamento/i }).click();

    await expect(page.getByRole('button', { name: /pagar com cartao|pagar com pix|pagar com boleto/i })).toBeVisible();
  });
});
