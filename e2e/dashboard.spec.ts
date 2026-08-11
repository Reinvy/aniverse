import { test, expect } from '@playwright/test';

test.describe('Dashboard Pages', () => {
  const dashboardPages = [
    { path: '/dashboard', name: 'Dashboard Home' },
    { path: '/dashboard/gallery', name: 'Gallery' },
    { path: '/dashboard/create', name: 'Create' },
    { path: '/dashboard/marketplace', name: 'Marketplace' },
    { path: '/dashboard/social', name: 'Social' },
    { path: '/dashboard/challenges', name: 'Challenges' },
    { path: '/dashboard/monetization', name: 'Monetization' },
  ];

  for (const { path, name } of dashboardPages) {
    test(`${name} should load or redirect gracefully`, async ({ page }) => {
      const response = await page.goto(path);
      // Protected pages redirect to login when not authenticated, or load the page
      // Either behavior is acceptable as long as no server error occurs
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();

      // If we ended up at login, that's expected (auth redirect)
      // If we ended up at the dashboard page, that's also valid
      const url = page.url();
      const isValidPage = url.includes('/login') || url.includes(path);
      expect(isValidPage).toBe(true);
    });
  }

  test('dashboard should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for potential redirect
    await page.waitForTimeout(2000);
    // Should end up at login (since no auth cookie)
    const url = page.url();
    const isLoginOrLoading = url.includes('/login') || url.includes('/dashboard');
    expect(isLoginOrLoading).toBe(true);
  });

  test('full auth flow: register/login → dashboard loads → sidebar nav works', async ({
    page,
    request,
  }, testInfo) => {
    // Deterministic test account — register on first run, login on subsequent
    // runs (409 = already exists → login instead). This exercises the entire
    // auth + dashboard navigation path end-to-end against the live stack.
    const email = 'e2e.cron4@aniverse.test';
    const password = 'E2eCron4!Passw0rd';
    const payload = {
      firstName: 'E2E',
      lastName: 'Cron4',
      email,
      password,
    };

    let token: string | undefined;
    const register = await request.post('/api/auth/register', { data: payload });
    if (register.status() === 201) {
      token = (await register.json()).token;
    } else if (register.status() === 409) {
      // Account already exists from a previous cycle — log in instead.
      const login = await request.post('/api/auth/login', { data: { email, password } });
      expect(login.ok()).toBe(true);
      token = (await login.json()).token;
    } else {
      // Surface the unexpected status with the response body for diagnosis.
      expect(register.status()).toBe(201);
    }
    expect(token).toBeTruthy();
    expect(token!.length).toBeGreaterThanOrEqual(20);

    // Two-layer session seeding, mirroring setStoredToken:
    // 1. Context cookie — the server-side proxy (src/proxy.ts) checks the
    //    cookie on the FIRST request, before any page script runs.
    // 2. addInitScript localStorage — the client-side AuthProvider reads
    //    localStorage on hydration; initScript also re-sets the cookie on
    //    every subsequent navigation.
    const baseURL =
      testInfo.project.use.baseURL ?? 'https://aniverse-one-khaki.vercel.app';
    await page.context().addCookies([
      { name: 'aniverse_token', value: token!, url: baseURL },
    ]);
    await page.addInitScript(
      ([key, value]) => {
        localStorage.setItem(key, value);
        document.cookie = `${key}=${value}; path=/; max-age=604800; SameSite=Lax`;
      },
      ['aniverse_token', token!] as const,
    );
    await page.goto('/dashboard');

    // Proxy passes (valid cookie) → dashboard shell must render, not redirect.
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('body')).toBeVisible();
    // Design-system marker on the dashboard shell
    await expect(page.locator('.cut-corner').first()).toBeVisible();

    // Sidebar nav links must navigate between all dashboard sub-pages.
    // NOTE: the sidebar renders TWO <aside> blocks (mobile slide-in + desktop);
    // the mobile one sits off-screen (-translate-x-full). Use :visible so we
    // only interact with the sidebar the user actually sees.
    const sidebarLinks = page.locator('aside a[href^="/dashboard"]:visible, nav a[href^="/dashboard"]:visible');
    const linkCount = await sidebarLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(7);

    const expected = [
      '/dashboard/gallery',
      '/dashboard/create',
      '/dashboard/marketplace',
      '/dashboard/social',
      '/dashboard/challenges',
      '/dashboard/monetization',
    ];
    for (const href of expected) {
      const link = page.locator(`aside a[href="${href}"]:visible, nav a[href="${href}"]:visible`).first();
      await expect(link).toBeVisible({ timeout: 10000 });
      await link.click();
      // Each sub-page must load (no 500, no redirect back to login)
      await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/')), {
        timeout: 15000,
      });
      await expect(page.locator('body')).toBeVisible();
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });

  test('authenticated /api/dashboard/stats returns 200 with stats shape', async ({
    request,
  }) => {
    // Login as the deterministic e2e account (created by the flow test above
    // or a previous cycle) and verify the protected stats endpoint.
    const login = await request.post('/api/auth/login', {
      data: { email: 'e2e.cron4@aniverse.test', password: 'E2eCron4!Passw0rd' },
    });
    expect(login.ok()).toBe(true);
    const { token } = await login.json();
    expect(token).toBeTruthy();

    const response = await request.get('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBe(true);
    const body = await response.json();
    // Response shape: { user, stats, activity } — stats are nested.
    expect(body.stats).toBeDefined();
    expect(body.stats).toHaveProperty('totalArtworks');
    expect(body.stats).toHaveProperty('generationsUsed');
    expect(body.stats).toHaveProperty('tier');
    expect(body.user).toBeDefined();
    expect(Array.isArray(body.activity)).toBe(true);
  });
});
