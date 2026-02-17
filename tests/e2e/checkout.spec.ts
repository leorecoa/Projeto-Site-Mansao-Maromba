import { test, expect } from '@playwright/test'

test.describe('Fluxo de Checkout Completo', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Mock da API de Produtos (Supabase)
        // Intercepta a chamada para buscar produtos e retorna um produto de teste
        await page.route('**/rest/v1/products*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: 'prod-e2e-1',
                        name: 'Whey Protein E2E',
                        price: 150.00,
                        image_url: 'https://via.placeholder.com/150',
                        description: 'Produto de teste automatizado',
                        volume: '900g',
                        type: 'suplemento',
                        theme: { primary: '#FFD700', secondary: '#000000', bg: '#111111' }
                    }
                ])
            });
        });

        // 2. Mock da Criação de Pedido (RPC create_order)
        await page.route('**/rest/v1/rpc/create_order', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    order_id: 'order-e2e-123'
                })
            });
        });

        // 3. Mock da Sessão de Auth (Para simular usuário logado)
        // Isso evita o redirecionamento para /login
        await page.addInitScript(() => {
            window.localStorage.setItem('sb-project-auth-token', JSON.stringify({
                access_token: 'fake-jwt-token',
                refresh_token: 'fake-refresh-token',
                user: {
                    id: 'user-e2e-123',
                    email: 'teste@e2e.com',
                    user_metadata: { full_name: 'Usuário E2E' }
                }
            }));
        });
    });

    test('deve realizar uma compra completa com sucesso (Happy Path)', async ({ page }) => {
        // --- PASSO 1: Home e Adicionar ao Carrinho ---
        await page.goto('/');

        // Aguarda o produto renderizar
        await expect(page.getByText('Whey Protein E2E')).toBeVisible();

        // Clica no botão de adicionar (procura por texto comum em botões de compra)
        // Ajuste o seletor conforme seu componente Hero ou ProductCard
        const addBtn = page.locator('button').filter({ hasText: /Adicionar|Comprar|Garantir/ }).first();
        await addBtn.click();

        // --- PASSO 2: Modal do Carrinho ---
        // Verifica se o modal abriu
        await expect(page.getByText('Carrinho', { exact: false })).toBeVisible();
        await expect(page.getByText('R$ 150,00')).toBeVisible();

        // Clica em Finalizar Compra
        await page.getByRole('button', { name: 'Finalizar Compra' }).click();

        // --- PASSO 3: Página de Checkout (Formulários) ---
        await expect(page).toHaveURL(/\/checkout/);

        // Preencher Dados Pessoais
        // O nome já deve vir preenchido pelo mock do Auth, mas vamos garantir
        await expect(page.locator('input[name="customer.fullName"]')).toHaveValue('Usuário E2E');

        await page.locator('input[name="customer.cpf"]').fill('123.456.789-00');
        await page.locator('input[name="customer.phone"]').fill('(11) 99999-9999');

        // Preencher Endereço
        // Simulamos a digitação do CEP. O ShippingForm dispara busca no onBlur.
        // Como estamos mockando apenas Supabase, a API do ViaCEP será chamada de verdade ou falhará.
        // Para robustez, preenchemos manualmente os campos que seriam auto-completados.
        await page.locator('input[name="shipping.zip"]').fill('01001-000');
        await page.locator('input[name="shipping.zip"]').blur(); // Dispara onBlur

        // Preenchimento manual para garantir
        await page.locator('input[name="shipping.street"]').fill('Praça da Sé');
        await page.locator('input[name="shipping.number"]').fill('100');
        await page.locator('input[name="shipping.neighborhood"]').fill('Sé');
        await page.locator('input[name="shipping.city"]').fill('São Paulo');
        await page.locator('input[name="shipping.state"]').fill('SP');

        // Submeter Formulário
        await page.getByRole('button', { name: 'Confirmar e Ir para Pagamento' }).click();

        // --- PASSO 4: Pagamento ---
        // O formulário de pagamento é renderizado após o sucesso do create_order no useCheckout
        // O useCheckout navega para /checkout/payment/:id
        await expect(page).toHaveURL(/\/checkout\/payment\/order-e2e-123/);

        // Verifica elementos da página de sucesso/pagamento
        await expect(page.getByText('Pedido Realizado!')).toBeVisible();
        await expect(page.getByText('Pagamento via PIX')).toBeVisible(); // Default mockado

        // Verifica se o valor está correto
        await expect(page.getByText('R$ 150,00')).toBeVisible();

        // --- PASSO 5: Navegação Final ---
        await page.getByRole('button', { name: 'Ver Meus Pedidos' }).click();
        await expect(page).toHaveURL(/\/orders/);
    });

    test('deve exibir erro quando o pagamento falha (Unhappy Path)', async ({ page }) => {
        // --- PASSO 1: Home e Adicionar ao Carrinho ---
        await page.goto('/');

        // Aguarda o produto renderizar
        await expect(page.getByText('Whey Protein E2E')).toBeVisible();

        // Clica no botão de adicionar
        const addBtn = page.locator('button').filter({ hasText: /Adicionar|Comprar|Garantir/ }).first();
        await addBtn.click();

        // --- PASSO 2: Modal do Carrinho ---
        await expect(page.getByText('Carrinho', { exact: false })).toBeVisible();
        await page.getByRole('button', { name: 'Finalizar Compra' }).click();

        // --- PASSO 3: Página de Checkout (Formulários) ---
        await expect(page).toHaveURL(/\/checkout/);

        // Preencher formulários
        await page.locator('input[name="customer.cpf"]').fill('123.456.789-00');
        await page.locator('input[name="customer.phone"]').fill('(11) 99999-9999');
        await page.locator('input[name="shipping.zip"]').fill('01001-000');
        await page.locator('input[name="shipping.zip"]').blur();

        // Preenchimento manual
        await page.locator('input[name="shipping.street"]').fill('Rua Falha');
        await page.locator('input[name="shipping.number"]').fill('000');
        await page.locator('input[name="shipping.neighborhood"]').fill('Bairro Erro');
        await page.locator('input[name="shipping.city"]').fill('São Paulo');
        await page.locator('input[name="shipping.state"]').fill('SP');

        // Submeter Formulário
        await page.getByRole('button', { name: 'Confirmar e Ir para Pagamento' }).click();

        // --- PASSO 4: Pagamento ---
        await expect(page).toHaveURL(/\/checkout\/payment\/order-e2e-123/);

        // Interceptar a requisição de atualização do pedido para simular falha
        await page.route('**/rest/v1/orders*', async (route) => {
            if (route.request().method() === 'PATCH') {
                await route.fulfill({
                    status: 402,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: 'Cartão recusado: Saldo insuficiente'
                    })
                });
            } else {
                await route.continue();
            }
        });

        // Tentar pagar com Cartão
        await page.getByRole('button', { name: /Pagar com Cartão/ }).click();

        // Verificar se a mensagem de erro aparece
        await expect(page.getByText('Cartão recusado: Saldo insuficiente')).toBeVisible();

        // Verificar que NÃO redirecionou (ainda na página de pagamento)
        await expect(page).toHaveURL(/\/checkout\/payment\/order-e2e-123/);
    });
});