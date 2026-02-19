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

    // Check cart has items
    const cartItems = page.locator('[data-testid="cart-item"]')
    await expect(cartItems.first()).toBeVisible({ timeout: 5000 })
  })

  test('should show toast notification when adding item', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Check for toast notification
    await expect(page.locator('text=/adicionado!/i')).toBeVisible({ timeout: 5000 })
  })

  test('should update quantity in cart', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

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

    // Wait for cart item to be visible (modal animation finished)
    const cartItem = page.locator('[data-testid="cart-item"]').first()
    await expect(cartItem).toBeVisible()

    // Remove item
    await page.locator('button[aria-label="Remover"]').first().click()

    // Verify item is removed (action confirmation)
    await expect(cartItem).not.toBeVisible()

    // Check cart is empty
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })

  test('should navigate to checkout', async ({ page }) => {
    // Add product
    const addBtn = await getAddToCartBtn(page)
    await addBtn.waitFor({ state: 'visible', timeout: 30000 })
    await addBtn.click()

    // Click checkout
    await page.click('button:has-text("FINALIZAR PEDIDO"), button:has-text("Finalizar")')

    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/login|checkout/)
  })
})
