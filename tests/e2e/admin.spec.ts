import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Usa a sessão de admin gerada no globalSetup
test.use({ storageState: path.join(__dirname, '../../playwright/.auth/admin.json') })

test.describe('Admin Flow (Product Management)', () => {
    test('Admin deve criar, editar e excluir produto', async ({ page }) => {
        const productName = `Produto Teste ${Date.now()}`

        // 1️⃣ Navega explicitamente para a página correta
        await page.goto('/admin/products')

        // Aguarda estabilização (redirecionamentos client-side)
        await page.waitForTimeout(2000)

        // 2️⃣ Diagnóstico: Verifica se caiu no Login ou Acesso Negado
        const loginHeading = page.getByRole('heading', { name: /Entrar|Login/i })
        if (await loginHeading.isVisible()) {
            throw new Error('🚨 O teste foi redirecionado para o Login. A sessão do admin.json pode estar inválida.')
        }

        const deniedHeading = page.getByRole('heading', { name: /Acesso Negado/i })
        if (await deniedHeading.isVisible()) {
            throw new Error('🚨 O teste foi redirecionado para "Acesso Negado". O usuário não tem role="admin" correta.')
        }

        // Verifica se caiu na Home (redirecionamento comum quando não autorizado)
        const currentUrl = page.url().replace(/\/$/, '')
        const baseUrl = (process.env.BASE_URL || 'http://localhost:3001').replace(/\/$/, '')
        if (currentUrl === baseUrl) {
            throw new Error('🚨 O teste foi redirecionado para a Home. O usuário logado não tem permissão de Admin ou a sessão é inválida.')
        }

        // 3️⃣ Garante que a página carregou antes de continuar
        // Substituindo 'main' por um seletor mais robusto (título da página)
        await expect(page.getByRole('heading', { name: /Admin|Produtos/i }).first()).toBeVisible({ timeout: 20000 })

        // 4️⃣ Espera o botão existir antes de clicar
        const newProductButton = page.getByRole('button', { name: 'Novo Produto' })
        await expect(newProductButton).toBeVisible()

        // 5️⃣ Abre o modal
        await newProductButton.click()

        // 6️⃣ Espera o heading real do modal aparecer
        const modalTitle = page.getByRole('heading', { name: 'Novo Produto' })
        await expect(modalTitle).toBeVisible()

        // 7️⃣ Sobe até o container real do modal (portal-safe)
        const modal = modalTitle.locator(
            'xpath=ancestor::*[self::div or self::section][1]'
        )

        // 8️⃣ Preenche campos dentro do modal
        await modal.getByRole('textbox').first().fill(productName)
        await modal.getByRole('spinbutton').fill('150.00')
        await modal.getByRole('textbox').nth(1).fill(
            'Descrição do produto de teste automatizado via Playwright'
        )

        // 9️⃣ Submete criação
        await modal.getByRole('button', { name: /Criar Produto/i }).click()

        // 🔟 Confirma fechamento do modal
        await expect(modalTitle).not.toBeVisible()

        // 1️⃣1️⃣ Valida que o produto apareceu na lista
        // Localiza o card/linha específico que contém o texto do nome do produto
        const productCard = page.locator('div, tr').filter({ hasText: productName }).first()
        await expect(productCard).toBeVisible({ timeout: 10000 })

        // 1️⃣2️⃣ Edição
        // Clica no botão Editar DENTRO do card do produto criado
        await productCard.getByRole('button', { name: /Editar/i }).click()

        // Espera modal de edição abrir (pode ter título "Editar Produto" ou similar)
        // Usamos um seletor genérico para dialog ou container de modal
        const editModal = page.locator('div[role="dialog"], section[role="dialog"], .fixed').filter({ hasText: /Editar|Salvar/i }).first()
        await expect(editModal).toBeVisible()

        // Atualiza preço
        await editModal.getByRole('spinbutton').fill('200.00')

        // Salva (Botão pode ser Salvar, Atualizar, Confirmar)
        await editModal.getByRole('button', { name: /Salvar|Atualizar|Confirmar/i }).click()

        // Espera modal fechar
        await expect(editModal).not.toBeVisible()

        // 1️⃣3️⃣ Exclusão
        // Re-localiza o card pois o DOM pode ter sido recriado após a edição
        const productCardAfterEdit = page.locator('div, tr').filter({ hasText: productName }).first()

        // Prepara para aceitar dialog nativo (window.confirm) se houver
        page.once('dialog', dialog => dialog.accept())

        // Clica em Deletar/Excluir dentro do card
        await productCardAfterEdit.getByRole('button', { name: /Deletar|Excluir/i }).click()

        // Se houver modal de confirmação customizado (além ou em vez do dialog nativo)
        const confirmDeleteBtn = page.getByRole('button', { name: /Sim|Confirmar|Tenho certeza/i })
        if (await confirmDeleteBtn.isVisible({ timeout: 3000 })) {
            await confirmDeleteBtn.click()
        }

        // 1️⃣4️⃣ Valida que o produto sumiu da lista
        await expect(page.getByText(productName)).not.toBeVisible()
    })
})
