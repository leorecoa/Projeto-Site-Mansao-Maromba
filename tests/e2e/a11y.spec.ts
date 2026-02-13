import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Validação de Acessibilidade (A11y)', () => {
    test('Home Page deve estar acessível (WCAG 2.1 AA)', async ({ page }) => {
        await page.goto('/')

        // Aguarda a página carregar completamente
        await page.waitForLoadState('networkidle')

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .exclude('.animate-spin') // Exclui loaders animados que podem gerar falsos positivos de contraste
            .analyze()

        // Anexa o relatório de violações ao resultado do teste para debug
        if (accessibilityScanResults.violations.length > 0) {
            await test.info().attach('accessibility-scan-results', {
                body: JSON.stringify(accessibilityScanResults.violations, null, 2),
                contentType: 'application/json'
            })
        }

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Login Page deve estar acessível (WCAG 2.1 AA)', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

        if (accessibilityScanResults.violations.length > 0) {
            await test.info().attach('accessibility-scan-results', {
                body: JSON.stringify(accessibilityScanResults.violations, null, 2),
                contentType: 'application/json'
            })
        }

        expect(accessibilityScanResults.violations).toEqual([])
    })
})