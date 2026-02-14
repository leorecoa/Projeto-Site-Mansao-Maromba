import { test, expect } from '@playwright/test'
import { login, getAddToCartBtn } from './utils'

test.describe('Fluxo de Checkout Completo', () => {
    // Configuração para rodar antes de cada teste
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test('deve realizar uma compra completa com sucesso (Happy Path)', async ({ page }) => {
        // 2. Adicionar produto ao carrinho
        // Aguarda carregar a lista de produtos
        // IMPORTANTE: Certifique-se de que há produtos cadastrados no banco de dados
        // Atualizado para encontrar "GARANTIR COMBO" (Hero) ou "Adicionar" (Legado/Lista)
        const addProductBtn = await getAddToCartBtn(page)
        await addProductBtn.waitFor({ state: 'visible', timeout: 20000 })

        await addProductBtn.click()

        // 3. Abrir carrinho e ir para checkout
        // O carrinho costuma abrir automaticamente ao adicionar item.
        // Verificamos se o título "CARRINHO" já está visível para evitar erro de clique interceptado.
        const cartHeading = page.locator('h2', { hasText: 'CARRINHO' })

        if (!(await cartHeading.isVisible())) {
            await page.click('[aria-label="Carrinho"]')
        }

        await expect(cartHeading).toBeVisible()
        await page.click('button:has-text("FINALIZAR PEDIDO")')

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

        // 8. Verificar redirecionamento para Meus Pedidos
        await page.click('button:has-text("Ver Meus Pedidos")')
        await expect(page).toHaveURL('/orders')
        // Opcional: Verificar se a página de pedidos carregou (ex: título)

        console.log('✅ Fluxo de checkout completado com sucesso!')
    })
})