import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Mansão Maromba/i)
  })

  test('should display navbar', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('text=/ENERGIA|ATITUDE/i')
    await expect(hero).toBeVisible()
  })

  test('should display products section', async ({ page }) => {
    await page.goto('/')
    await page.locator('text=/produtos/i').first().scrollIntoViewIfNeeded()
    const products = page.locator('[data-testid="product-card"]').first()
    await expect(products).toBeVisible({ timeout: 10000 })
  })

  test('should open cart modal', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Carrinho"]')
    const modal = page.locator('text=/carrinho/i')
    await expect(modal).toBeVisible()
  })
})
