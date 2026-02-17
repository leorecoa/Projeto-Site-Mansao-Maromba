import { test, expect } from '@playwright/test';

test.describe('Fluxo de Admin (Gerenciamento de Produtos)', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Mock da Sessão de Admin (LocalStorage)
        // Simula um usuário logado com permissões de admin para pular a tela de login
        await page.addInitScript(() => {
            window.localStorage.setItem('sb-project-auth-token', JSON.stringify({
                access_token: 'fake-admin-token',
                refresh_token: 'fake-refresh-token',
                user: {
                    id: 'admin-user-123',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'admin@maromba.com',
                    app_metadata: { provider: 'email' },
                    user_metadata: { role: 'admin', full_name: 'Admin User' }
                }
            }));
        });

        // 2. Mock da Lista de Produtos (GET)
        await page.route('**/rest/v1/products*', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([
                        {
                            id: 'prod-existing-1',
                            name: 'Produto Existente',
                            price: 99.90,
                            image_url: 'https://via.placeholder.com/150',
                            description: 'Descrição existente',
                            volume: '900g',
                            type: 'suplemento',
                            theme: { primary: '#000000' }
                        }
                    ])
                });
            } else {
                await route.continue();
            }
        });

        // 3. Mock da Criação de Produto (POST)
        await page.route('**/rest/v1/products', async (route) => {
            if (route.request().method() === 'POST') {
                const body = JSON.parse(route.request().postData() || '{}');
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: `new-prod-${Date.now()}`,
                        ...body,
                        created_at: new Date().toISOString()
                    })
                });
            } else {
                await route.continue();
            }
        });
    });

    test('Admin deve criar um novo produto com sucesso', async ({ page }) => {
        const productName = 'Creatina Teste E2E';

        // --- PASSO 1: Acessar Painel de Produtos ---
        await page.goto('/admin/products');

        // Verifica se carregou a lista (mockada)
        await expect(page.getByText('Produto Existente')).toBeVisible();

        // --- PASSO 2: Abrir Modal/Formulário ---
        // Procura botão de novo produto (ajuste o texto conforme sua UI: "Novo Produto", "+", "Adicionar")
        const newProductBtn = page.getByRole('button', { name: /Novo Produto|Adicionar/i });
        await newProductBtn.click();

        // --- PASSO 3: Preencher Formulário ---
        // Aguarda o formulário estar visível
        await expect(page.getByRole('dialog').or(page.locator('form'))).toBeVisible();

        // Preenche os campos (ajuste os seletores 'name' conforme seu ProductForm)
        await page.locator('input[name="name"]').fill(productName);
        await page.locator('input[name="price"]').fill('120.50');
        await page.locator('textarea[name="description"]').fill('Descrição do produto de teste automatizado.');
        await page.locator('input[name="image_url"]').fill('https://via.placeholder.com/300');

        // --- PASSO 4: Salvar ---
        await page.getByRole('button', { name: /Salvar|Criar|Confirmar/i }).click();

        // --- PASSO 5: Validar Sucesso ---
        // Verifica se apareceu mensagem de sucesso ou se o modal fechou
        // Como o mock de GET não atualiza automaticamente a lista com o novo item (a menos que o front faça update otimista),
        // validamos o feedback visual de sucesso.
        await expect(page.getByText(/sucesso|criado/i)).toBeVisible();
    });
});
