import { test, expect } from '@playwright/test';

/**
 * Game-style 404 page (AniVerse Design System v2) — added 2026-08-04 (PR #85).
 * Unknown routes must render the themed "lost node" page, not a generic error,
 * and its action links must navigate to real pages.
 */
test.describe('Game-Style 404 Page', () => {
  const BOGUS_ROUTE = '/this-route-does-not-exist-xyz';

  test('unknown route should return 404 with game-style markers', async ({ page }) => {
    const response = await page.goto(BOGUS_ROUTE);
    expect(response?.status()).toBe(404);

    // HUD error code
    await expect(page.getByText('[SYS.ERR] // 404').first()).toBeVisible();
    // Glitch code block
    await expect(page.getByText('404', { exact: true }).first()).toBeVisible();
    // Themed headline
    await expect(page.getByText('Signal lost — this coordinate does not exist').first()).toBeVisible();
    // Status tag
    await expect(page.getByText('NODE NOT FOUND').first()).toBeVisible();
    // Design-system glass panel with corner brackets is present
    await expect(page.locator('.glass.cut-corner').first()).toBeVisible();
    await expect(page.locator('.bracket-corner').first()).toBeVisible();
  });

  test('404 "Return to Base" button should navigate home', async ({ page }) => {
    await page.goto(BOGUS_ROUTE);
    await expect(page.getByRole('button', { name: /return to base/i })).toBeVisible();
    await page.getByRole('button', { name: /return to base/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 action buttons should navigate to real pages', async ({ page }) => {
    await page.goto(BOGUS_ROUTE);

    // Explore Characters → /characters
    await page.getByRole('button', { name: /explore characters/i }).click();
    await expect(page).toHaveURL(/\/characters/);
    await expect(page.locator('body')).toBeVisible();

    // Read the Blog → /blog
    await page.goto(BOGUS_ROUTE);
    await page.getByRole('button', { name: /read the blog/i }).click();
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 footer strip links should be real routes (no dead placeholders)', async ({ page }) => {
    await page.goto(BOGUS_ROUTE);

    const footerTargets = ['/challenges', '/dashboard/gallery', '/dashboard/create'];
    for (const target of footerTargets) {
      const link = page.locator(`a[href="${target}"]`).first();
      await expect(link).toBeVisible();
      const response = await page.goto(target);
      // Protected dashboard routes may redirect to login — but must never 500
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
      await page.goto(BOGUS_ROUTE);
    }
  });
});

/**
 * Protected /dashboard/* routing — the proxy redirects unauthenticated users to
 * /login, and unknown dashboard sub-routes must 404 (not silently render the
 * dashboard shell) once the proxy check is passed.
 */
test.describe('Protected Dashboard Routing', () => {
  // Proxy (src/proxy.ts) only validates token length (>= 20) before passing
  // through; actual verification happens in API routes / client AuthGuard.
  const FAKE_TOKEN = 'x'.repeat(40);

  test('unknown dashboard sub-routes should 404 when a token is present', async ({ request }) => {
    for (const path of ['/dashboard/nonexistent-page-xyz', '/dashboard/deep/nested/xyz']) {
      const response = await request.get(path, {
        headers: { Cookie: `aniverse_token=${FAKE_TOKEN}` },
        maxRedirects: 0,
      });
      expect(response.status()).toBe(404);
    }
  });

  test('unknown dashboard sub-routes should redirect to /login when unauthenticated', async ({ request }) => {
    const response = await request.get('/dashboard/nonexistent-page-xyz', { maxRedirects: 0 });
    // Proxy redirects every /dashboard/* path to /login for unauthenticated users
    expect([302, 307, 308]).toContain(response.status());
  });
});
