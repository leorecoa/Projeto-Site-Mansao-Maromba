import { test, expect } from '@playwright/test'

test.describe('Fluxo de Checkout Completo', () => {
    // Configuração para rodar antes de cada teste
    test.beforeEach(async ({ page }) => {
        // 1. Login (Necessário para acessar o checkout)
        await page.goto('/login')

        // IMPORTANTE: Substitua por credenciais válidas do seu banco local/teste
        // Se não tiver usuário, crie um manualmente no banco ou via signup
        const email = process.env.TEST_USER_EMAIL
        const password = process.env.TEST_USER_PASSWORD

        if (!email || !password) throw new Error('Credenciais de teste não definidas no .env')

        await page.fill('input[type="email"]', email)
        await page.fill('input[type="password"]', password) // Use a senha correta

        await page.click('button:has-text("Entrar")')
        await page.waitForURL('/', { timeout: 10000 })
    })

    test('deve realizar uma compra completa com sucesso (Happy Path)', async ({ page }) => {
        // 2. Adicionar produto ao carrinho
        // Aguarda carregar a lista de produtos
        await page.waitForSelector('button:has-text("Adicionar")', { timeout: 10000 })
        // Clica no primeiro botão "Adicionar" que encontrar
        await page.locator('button:has-text("Adicionar")').first().click()

        // 3. Abrir carrinho e ir para checkout
        await page.click('[aria-label="Carrinho"]')
        await expect(page.locator('text=Seu Carrinho')).toBeVisible()
        await page.click('button:has-text("Finalizar")')

        // 4. Checkout Passo 1 - Resumo
        await expect(page).toHaveURL('/checkout')
        await expect(page.locator('h2')).toContainText('Resumo do Pedido')
        await page.click('button:has-text("Continuar")')

        // 5. Checkout Passo 2 - Endereço (Usa os IDs que adicionamos)
        await expect(page.locator('h2')).toContainText('Dados de Entrega')

        await page.fill('#customer_name', 'Tester Playwright')
        await page.fill('#customer_email', 'tester@playwright.com')
        await page.fill('#customer_phone', '11999999999')
        await page.fill('#customer_zipcode', '01001-000')
        await page.fill('#customer_address', 'Rua de Teste Automatizado, 123')
        await page.fill('#customer_city', 'São Paulo')
        await page.fill('#customer_state', 'SP')

        await page.click('button:has-text("Continuar")')

        // 6. Checkout Passo 3 - Pagamento
        await expect(page.locator('h2')).toContainText('Pagamento')
        await page.click('#payment_pix') // Seleciona PIX
        await page.fill('#order_notes', 'Pedido de teste automatizado via Playwright')

        // Finalizar Pedido
        await page.click('button:has-text("Finalizar Pedido")')

        // 7. Validar Tela de Sucesso
        // Aumentamos o timeout pois a RPC do banco pode levar alguns segundos
        await expect(page.locator('text=Pedido Realizado!')).toBeVisible({ timeout: 20000 })
        await expect(page.locator('text=Número do Pedido')).toBeVisible()

        console.log('✅ Fluxo de checkout completado com sucesso!')
    })
})