import { test, expect } from '@playwright/test'

test.describe('Cart Flow', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/')
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    // Click first "Adicionar" button
    await page.click('button:has-text("Adicionar")').catch(() => {})
    
    // Open cart
    await page.click('[aria-label="Carrinho"]')
    
    // Check cart has items
    const cartItems = page.locator('[data-testid="cart-item"]')
    await expect(cartItems.first()).toBeVisible({ timeout: 5000 })
  })

  test('should update quantity in cart', async ({ page }) => {
    await page.goto('/')
    
    // Add product
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.click('button:has-text("Adicionar")').catch(() => {})
    
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
    await page.goto('/')
    
    // Add product
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.click('button:has-text("Adicionar")').catch(() => {})
    
    // Open cart
    await page.click('[aria-label="Carrinho"]')
    
    // Remove item
    await page.click('button[aria-label="Remover"]').catch(() => {})
    
    // Check cart is empty
    const emptyMessage = page.locator('text=/carrinho vazio/i')
    await expect(emptyMessage).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to checkout', async ({ page }) => {
    await page.goto('/')
    
    // Add product
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.click('button:has-text("Adicionar")').catch(() => {})
    
    // Open cart
    await page.click('[aria-label="Carrinho"]')
    
    // Click checkout
    await page.click('button:has-text("Finalizar")')
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/login|checkout/)
  })
})
