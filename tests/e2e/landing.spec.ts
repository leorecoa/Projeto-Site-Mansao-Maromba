import { test, expect } from '@playwright/test'
import { login, ADD_TO_CART_SELECTOR } from './utils'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Mansão Maromba/i)
  })

  test('should display navbar', async ({ page }) => {
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('text=/ENERGIA|ATITUDE/i')
    await expect(hero).toBeVisible()
  })

  test('should display products section', async ({ page }) => {
    // Fix: Use button selector as proxy for product card existence
    const products = page.locator(ADD_TO_CART_SELECTOR).first()
    // Aumentado timeout para 20s para lidar com cold start do backend/banco
    await expect(products).toBeVisible({ timeout: 30000 })
  })

  test('should open cart modal', async ({ page }) => {
    // Garante que o botão está interativo antes de clicar
    const cartButton = page.getByRole('button', { name: /carrinho/i }).first()
    await cartButton.waitFor({ state: 'visible', timeout: 20000 })
    await cartButton.click()

    const cartHeading = page.locator('h2', { hasText: 'CARRINHO' })
    await expect(cartHeading).toBeVisible()
  })
})
