import { test, expect } from '@playwright/test';

test.describe('Monetization', () => {
  test('monetization page should load', async ({ page }) => {
    const response = await page.goto('/dashboard/monetization');
    expect(response?.status()).toBeLessThan(500);
  });
});
