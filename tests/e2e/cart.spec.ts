import { test, expect } from '@playwright/test'
import { login, getAddToCartBtn } from './utils'

test.describe('Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('should add product to cart', async ({ page }) => {
    // Wait for products to load
    // Fix: Wait for the button directly instead of data-testid which might be missing
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Open cart
    await page.click('[aria-label="Carrinho"]')

    // Check cart has items
    const cartItems = page.locator('[data-testid="cart-item"]')
    await expect(cartItems.first()).toBeVisible({ timeout: 5000 })
  })

  test('should update quantity in cart', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Open cart
    await page.click('[aria-label="Carrinho"]')

    // Increase quantity
    const increaseBtn = page.locator('button:has-text("+")').first()
    await increaseBtn.click()

    // Check quantity updated
    const quantity = page.locator('[data-testid="item-quantity"]').first()
    await expect(quantity).toContainText('2')
  })

  test('should remove item from cart', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Open cart
    await page.click('[aria-label="Carrinho"]')

    // Remove item
    await page.click('button[aria-label="Remover"]').catch(() => { })

    // Check cart is empty
    const emptyMessage = page.locator('text=/carrinho vazio/i')
    await expect(emptyMessage).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to checkout', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Open cart
    await page.click('[aria-label="Carrinho"]')

    // Click checkout
    await page.click('button:has-text("FINALIZAR PEDIDO"), button:has-text("Finalizar")')

    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/login|checkout/)
  })
})
