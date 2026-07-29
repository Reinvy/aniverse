import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between all public pages', async ({ page }) => {
    const pages = ['/', '/login', '/register', '/blog', '/challenges', '/characters'];
    for (const path of pages) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/')));
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have working header navigation', async ({ page }) => {
    // The header has links to both public pages and protected dashboard pages.
    // Protected pages redirect to /login when not authenticated.
    const protectedPrefixes = ['/dashboard'];

    await page.goto('/');
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click each navigation link and verify no crash
    for (let i = 0; i < Math.min(count, 8); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
        // Determine if the link targets a protected dashboard route
        const isProtected = protectedPrefixes.some((prefix) => href.startsWith(prefix));

        await link.click();

        if (isProtected) {
          // Protected routes redirect to login when not authenticated
          await expect(page).toHaveURL(/\/login/);
        } else {
          await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/')));
        }

        // Navigate back to home for next test
        await page.goto('/');
      }
    }
  });

  test('header should contain branding and key links', async ({ page }) => {
    await page.goto('/');
    // Brand should be visible
    await expect(page.locator('header').first()).toBeVisible();
    // Logo link should exist
    await expect(page.locator('header a[href="/"]').first()).toBeVisible();
  });
});
