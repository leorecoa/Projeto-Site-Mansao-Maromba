import { test, expect } from '@playwright/test';

test.describe('Navegação Básica', () => {
  test('deve carregar a home page', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await expect(page).toHaveTitle(/Mansão Maromba/i);
    console.log('✅ Home page carregada');
  });

  test('deve navegar para login', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.click('text=ENTRAR');
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Navegação para /login funcionando');
  });

  test('deve voltar para home ao clicar no logo', async ({ page }) => {
    await page.goto('http://localhost:5174/login');
    await page.click('img[alt="Mansão Maromba"]');
    await expect(page).toHaveURL('http://localhost:5174/');
    console.log('✅ Navegação para / funcionando');
  });

  test('deve abrir modal do carrinho', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.click('[aria-label="Carrinho"]');
    await expect(page.locator('text=Carrinho')).toBeVisible();
    console.log('✅ Modal do carrinho abre');
  });

  test('deve navegar para página de produto', async ({ page }) => {
    await page.goto('http://localhost:5174');
    const firstProduct = page.locator('text=Ver Detalhes').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/.*products/);
    console.log('✅ Navegação para /products/:id funcionando');
  });
});

test.describe('Rotas Públicas', () => {
  const publicRoutes = [
    { path: '/search', text: 'Buscar' },
    { path: '/terms', text: 'Termos' },
    { path: '/privacy', text: 'Privacidade' },
    { path: '/faq', text: 'FAQ' },
  ];

  for (const route of publicRoutes) {
    test(`deve acessar ${route.path}`, async ({ page }) => {
      await page.goto(`http://localhost:5174${route.path}`);
      await expect(page).toHaveURL(new RegExp(route.path));
      console.log(`✅ Rota ${route.path} acessível`);
    });
  }
});

test.describe('Rotas Protegidas', () => {
  test('deve redirecionar para login se não autenticado', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Proteção de rota funcionando');
  });
});
