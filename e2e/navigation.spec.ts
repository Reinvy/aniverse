import { test, expect } from '@playwright/test';

/** Routes under /dashboard/ that require authentication. */
const PROTECTED_ROUTES = ['/dashboard/gallery', '/dashboard/marketplace', '/dashboard/create'];

test.describe('Navigation', () => {
  test('should navigate between all public pages', async ({ page }) => {
    const pages = ['/', '/login', '/register'];
    for (const path of pages) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click each navigation link and verify no crash
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        await link.click();

        // Protected routes redirect to /login when unauthenticated — that's expected.
        const isProtected = PROTECTED_ROUTES.some((route) => href.startsWith(route));
        if (isProtected) {
          await expect(page).toHaveURL(/\/login/);
        } else {
          await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/')));
        }

        await page.goto('/');
      }
    }
  });
});
