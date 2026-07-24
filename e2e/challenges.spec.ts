import { test, expect } from '@playwright/test';

test.describe('Challenges', () => {
  test('challenges page should load', async ({ page }) => {
    const response = await page.goto('/dashboard/challenges');
    expect(response?.status()).toBeLessThan(500);
  });
});
