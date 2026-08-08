import { test, expect } from '@playwright/test';

test.describe('Challenges', () => {
  test('public challenges page should load', async ({ page }) => {
    const response = await page.goto('/challenges');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('dashboard challenges page should load or redirect gracefully', async ({ page }) => {
    const response = await page.goto('/dashboard/challenges');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
    const url = page.url();
    const isValidPage = url.includes('/login') || url.includes('/dashboard/challenges');
    expect(isValidPage).toBe(true);
  });
});
