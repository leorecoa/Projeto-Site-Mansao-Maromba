import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=/entrar|login/i')).toBeVisible()
  })

  test('should display email input', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  test('should display password input', async ({ page }) => {
    await page.goto('/login')
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
  })

  test('should show Google OAuth button', async ({ page }) => {
    await page.goto('/login')
    const googleBtn = page.locator('button:has-text("Google")')
    await expect(googleBtn).toBeVisible()
  })

  test('should validate empty form', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    
    // Browser validation should prevent submission
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeFocused()
  })

  test('should redirect to home after login', async ({ page }) => {
    // This test requires valid credentials
    // Skip in CI or use test account
    test.skip(!!process.env.CI, 'Requires test credentials')
    
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/', { timeout: 10000 })
  })
})
