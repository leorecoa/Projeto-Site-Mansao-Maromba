import { Page, Locator } from '@playwright/test';

// Seletor centralizado para evitar duplicação e facilitar manutenção
export const ADD_TO_CART_SELECTOR =
  'button:has-text("Adicionar"), button:has-text("GARANTIR COMBO")';

export async function login(page: Page) {
  // Aumenta timeout para evitar falhas em cold start
  await page.goto('/login', { timeout: 60000 });

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Credenciais de teste (TEST_USER_EMAIL, TEST_USER_PASSWORD) não definidas no .env'
    );
  }

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Entrar")');

  // Fail fast: Verifica erro de login
  const loginError = page.locator('text=Invalid login credentials');
  if (await loginError.isVisible()) {
    throw new Error(
      'Login falhou: Credenciais inválidas. Verifique se o usuário existe no banco de dados local.'
    );
  }

  await page.waitForURL('/', { timeout: 20000 });

  // Melhoria: Espera explícita por um elemento que confirma que a Home carregou e o usuário está logado
  // Isso substitui o networkidle de forma mais robusta
  await page.locator('nav').waitFor({ state: 'visible', timeout: 15000 });
}

export async function getAddToCartBtn(page: Page): Promise<Locator> {
  return page.locator(ADD_TO_CART_SELECTOR).first();
}
