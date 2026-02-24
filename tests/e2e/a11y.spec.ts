import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function runA11yScan(page: Page, route: string): Promise<void> {
  await page.goto(route);

  await expect(page.getByRole('main')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('main')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('.animate-spin')
    .analyze();

  if (results.violations.length > 0) {
    await test.info().attach(`a11y-${route}`, {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
  }

  expect(results.violations).toEqual([]);
}

test.describe('Validação de Acessibilidade (WCAG 2.1 AA)', () => {
  test('Home Page deve estar acessível', async ({ page }) => {
    await runA11yScan(page, '/');
  });

  test('Login Page deve estar acessível', async ({ page }) => {
    await runA11yScan(page, '/login');
  });
});
