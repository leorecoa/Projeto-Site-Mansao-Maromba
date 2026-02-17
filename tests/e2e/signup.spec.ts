import { test, expect } from '@playwright/test';

test.describe('Fluxo de Cadastro (Sign Up)', () => {
    test('deve permitir o cadastro de um novo usuário com sucesso', async ({ page }) => {
        // 1. Mock da resposta de Signup do Supabase (POST /signup)
        await page.route('**/auth/v1/signup', async (route) => {
            const requestBody = JSON.parse(route.request().postData() || '{}');

            // Validação básica para garantir que o frontend enviou os dados
            if (!requestBody.email || !requestBody.password || !requestBody.data?.full_name) {
                await route.abort();
                return;
            }

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'new-user-id-123',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: requestBody.email,
                    confirmation_sent_at: new Date().toISOString(),
                    app_metadata: { provider: 'email', providers: ['email'] },
                    user_metadata: {
                        full_name: requestBody.data.full_name,
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }),
            });
        });

        // --- ETAPA 1: Acessar Página de Login ---
        await page.goto('/login');

        // --- ETAPA 2: Alternar para Cadastro ---
        // Procura pelo link/botão que alterna o formulário para "Criar conta"
        // Ajuste o texto conforme o que está no seu LoginPage (ex: "Não tem uma conta?", "Cadastre-se")
        const toggleButton = page.locator('button').filter({ hasText: /cadastre-se|criar conta|não tem uma conta/i }).first();
        await expect(toggleButton).toBeVisible();
        await toggleButton.click();

        // Verifica se o formulário mudou (ex: botão de submit mudou texto ou campo nome apareceu)
        await expect(page.getByRole('button', { name: /cadastrar|criar conta/i })).toBeVisible();

        // --- ETAPA 3: Preencher Formulário ---
        // Nome (Geralmente só aparece no cadastro)
        const nameInput = page.locator('input[type="text"]').first(); // Ou input[name="fullName"] se tiver name
        await expect(nameInput).toBeVisible();
        await nameInput.fill('Novo Usuário Teste');

        // Email
        await page.locator('input[type="email"]').fill('novo.usuario@teste.com');

        // Senha
        await page.locator('input[type="password"]').fill('SenhaForte123!');

        // --- ETAPA 4: Submeter ---
        await page.getByRole('button', { name: /cadastrar|criar conta/i }).click();

        // --- ETAPA 5: Validar Sucesso ---
        // Geralmente o Supabase envia um email de confirmação e o frontend mostra um Toast ou Mensagem
        // Verifica se apareceu uma mensagem de sucesso ou instrução para verificar o email
        await expect(page.getByText(/verifique seu email|cadastro realizado|sucesso/i)).toBeVisible();

        // Opcional: Verificar se o formulário foi limpo ou se redirecionou
        // Se o fluxo for login automático após cadastro (sem confirmação de email), 
        // você verificaria o redirecionamento para '/'
    });
});