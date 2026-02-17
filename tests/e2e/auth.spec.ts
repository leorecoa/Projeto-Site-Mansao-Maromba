import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação (Login/Logout)', () => {
  test('deve realizar login com sucesso, persistir sessão e fazer logout', async ({ page }) => {
    // 1. Mock da resposta de Login do Supabase (POST /token)
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fake-refresh-token',
          user: {
            id: 'user-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'teste@exemplo.com',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            user_metadata: {
              full_name: 'Usuário Teste',
            },
            app_metadata: {
              provider: 'email',
              providers: ['email'],
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }),
      });
    });

    // 2. Mock da resposta de User (GET /user) para validação de sessão persistida
    await page.route('**/auth/v1/user', async (route) => {
      const headers = route.request().headers();
      // Simula validação do token
      if (headers['authorization']?.includes('fake-access-token')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'user-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'teste@exemplo.com',
            user_metadata: { full_name: 'Usuário Teste' }
          })
        });
      } else {
        await route.fulfill({ status: 401, body: JSON.stringify({ error: 'Unauthorized' }) });
      }
    });

    // 3. Mock do Logout (POST /logout)
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({ status: 204 });
    });

    // --- ETAPA 1: LOGIN ---
    await page.goto('/login');

    // Preencher formulário
    await page.locator('input[type="email"]').fill('teste@exemplo.com');
    await page.locator('input[type="password"]').fill('senha123');

    // Clicar em Entrar
    await page.getByRole('button', { name: /Entrar|Login/i }).click();

    // Verificar redirecionamento para Home
    await expect(page).toHaveURL('/');

    // Verificar se a UI mudou (ex: Botão de Sair visível ou Ícone de Usuário)
    const logoutButton = page.locator('button').filter({ hasText: /Sair|Logout/i }).first();
    await expect(logoutButton).toBeVisible();

    // --- ETAPA 2: PERSISTÊNCIA ---
    // Verificar se o token foi salvo no LocalStorage
    const localStorage = await page.evaluate(() => window.localStorage);
    // O Supabase salva com uma chave que contém o ID do projeto, ex: sb-<id>-auth-token
    const sbTokenKey = Object.keys(localStorage).find(key => key.includes('auth-token'));

    expect(sbTokenKey, 'Token do Supabase deve existir no LocalStorage').toBeDefined();
    expect(localStorage[sbTokenKey!]).toContain('fake-access-token');

    // Recarregar a página para garantir que a sessão se mantém
    await page.reload();
    await expect(logoutButton).toBeVisible();

    // --- ETAPA 3: LOGOUT ---
    await logoutButton.click();

    // Verificar se voltou para estado deslogado (Botão de Entrar visível)
    await expect(page.getByRole('button', { name: /Entrar|Login/i })).toBeVisible();

    // Verificar limpeza do LocalStorage
    const localStorageAfter = await page.evaluate(() => window.localStorage);
    const sbTokenKeyAfter = Object.keys(localStorageAfter).find(key => key.includes('auth-token'));

    // Dependendo da implementação, a chave pode ser removida ou o valor ficar null
    expect(sbTokenKeyAfter, 'Token do Supabase deve ser removido após logout').toBeUndefined();
  });
});
