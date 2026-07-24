import { test, expect } from '@playwright/test';

test.describe('Dashboard Pages', () => {
  const dashboardPages = [
    { path: '/dashboard', name: 'Dashboard Home' },
    { path: '/dashboard/gallery', name: 'Gallery' },
    { path: '/dashboard/create', name: 'Create' },
    { path: '/dashboard/marketplace', name: 'Marketplace' },
  ];

  for (const { path, name } of dashboardPages) {
    test(`${name} should load successfully`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('dashboard sidebar should be visible', async ({ page }) => {
    await page.goto('/dashboard');
    const sidebar = page.locator('nav, aside, [class*="sidebar"]').first();
    await expect(sidebar).toBeVisible();
  });
});
