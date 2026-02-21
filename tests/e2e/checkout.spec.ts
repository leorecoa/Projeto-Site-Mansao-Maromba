import { test, expect } from '@playwright/test';

const MOCK_USER = {
  id: 'user-e2e-123',
  email: 'teste@e2e.com',
  user_metadata: { full_name: 'Usuario E2E' },
  app_metadata: { provider: 'email' },
  aud: 'authenticated',
  role: 'authenticated',
};

const MOCK_PRODUCT = {
  id: 'prod-e2e-1',
  name: 'Whey Protein E2E',
  price: 150,
  image_url: 'https://via.placeholder.com/150',
  description: 'Produto de teste automatizado',
  volume: '900g',
  type: 'suplemento',
  stock_quantity: 99,
  is_active: true,
  theme: { primary: '#FFD700', secondary: '#000000', bg: '#111111' },
};

const mockSession = () => ({
  access_token: 'fake-access-token',
  refresh_token: 'fake-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: MOCK_USER,
});

test.describe('Fluxo de Checkout (rotas e seletores atuais)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/products**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([MOCK_PRODUCT]),
        });
        return;
      }
      await route.continue();
    });
  });

  test('deve redirecionar para login quando nao autenticado', async ({ page }) => {
    await page.goto('/');
    const addToCart = page.getByRole('button', { name: /garantir|adicionar|comprar/i }).first();
    await expect(addToCart).toBeVisible();
    await addToCart.click();
    await page.getByRole('button', { name: /finalizar compra|finalizar pedido/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve concluir checkout em /checkout e finalizar em /checkout/success', async ({ page }) => {
    await page.addInitScript((session) => {
      window.localStorage.setItem('sb-auth-token', JSON.stringify(session));
    }, mockSession());

    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_USER),
      });
    });

    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSession()),
      });
    });

    await page.route('**/rest/v1/user_profiles**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: MOCK_USER.id, email: MOCK_USER.email, role: 'customer' }),
      });
    });

    await page.route('**/rest/v1/customers**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'customer-e2e-1',
            auth_user_id: MOCK_USER.id,
            full_name: 'Usuario E2E',
            email: MOCK_USER.email,
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/orders**', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'order-e2e-123',
            status: 'pending',
            total_amount: 150,
          }),
        });
        return;
      }

      if (method === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'order-e2e-123', status: 'paid' }]),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/order_items**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'item-e2e-1' }]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('https://viacep.com.br/ws/**/json/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cep: '01310-100',
          logradouro: 'Avenida Paulista',
          complemento: '',
          bairro: 'Bela Vista',
          localidade: 'Sao Paulo',
          uf: 'SP',
          ibge: '3550308',
          ddd: '11',
        }),
      });
    });

    await page.goto('/');
    const addToCart = page.getByRole('button', { name: /garantir|adicionar|comprar/i }).first();
    await expect(addToCart).toBeVisible();
    await addToCart.click();
    await page.getByRole('button', { name: /finalizar compra|finalizar pedido/i }).click();

    await expect(page).toHaveURL(/\/checkout$/);

    await page.locator('input[name="customer.fullName"]').fill('Usuario E2E');
    await page.locator('input[name="customer.email"]').fill('teste@e2e.com');
    await page.locator('input[name="customer.cpf"]').fill('12345678909');
    await page.locator('input[name="customer.phone"]').fill('11999998888');
    await page.getByRole('button', { name: /ir para entrega/i }).click();

    await page.locator('input[name="shipping.zip"]').fill('01310-100');
    await page.locator('input[name="shipping.zip"]').blur();
    await page.locator('input[name="shipping.number"]').fill('1000');
    await page.getByRole('button', { name: /ir para pagamento/i }).click();

    await expect(page.getByText(/pagar com cartao/i)).toBeVisible();
    await page.getByRole('button', { name: /pagar com cartao/i }).click();

    await expect(page).toHaveURL(/\/checkout\/success$/);
    await expect(page.getByRole('heading', { name: /obrigado pelo seu pedido/i })).toBeVisible();
  });
});
