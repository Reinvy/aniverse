import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('GET /api/artworks should return 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/artworks');
    // Requires authentication - should be 401
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/blog should return 200', async ({ request }) => {
    const response = await request.get('/api/blog');
    expect(response.ok()).toBe(true);
  });

  test('GET /api/characters should return 200', async ({ request }) => {
    const response = await request.get('/api/characters');
    expect(response.ok()).toBe(true);
  });

  test('GET /api/challenges should return 200', async ({ request }) => {
    const response = await request.get('/api/challenges');
    expect(response.ok()).toBe(true);
  });

  test('GET /api/characters/[id] should return 200 for an existing character', async ({ request }) => {
    // Fetch the list first to get a real character id (ids are DB-generated, not slugs)
    const listResponse = await request.get('/api/characters');
    expect(listResponse.ok()).toBe(true);
    const listBody = await listResponse.json();
    const characters = Array.isArray(listBody) ? listBody : listBody.characters ?? listBody.data ?? [];
    expect(characters.length).toBeGreaterThan(0);
    const firstId = characters[0].id;
    expect(firstId).toBeTruthy();

    const response = await request.get(`/api/characters/${firstId}`);
    expect(response.ok()).toBe(true);
    const body = await response.json();
    const character = body.character ?? body;
    expect(character.name).toBeDefined();
  });

  test('GET /api/characters/[id] should return 404 for an unknown id', async ({ request }) => {
    const response = await request.get('/api/characters/this-id-does-not-exist-xyz');
    expect([404, 400]).toContain(response.status());
  });

  test('GET /api/dashboard/stats should return 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/dashboard/stats');
    // Should return 401 or 403 since we're not authenticated
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/auth/me should return 401 when no token is present', async ({ request }) => {
    const response = await request.get('/api/auth/me');
    expect([401, 403]).toContain(response.status());
    const body = await response.json();
    // Graceful JSON error, not an HTML crash page
    expect(body.error ?? body.message).toBeDefined();
  });

  test('GET /api/gallery should return 200 with artworks', async ({ request }) => {
    const response = await request.get('/api/gallery');
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(Array.isArray(body.artworks)).toBe(true);
  });

  test('GET /api/challenges/current should respond gracefully (active or empty state)', async ({ request }) => {
    const response = await request.get('/api/challenges/current');
    // Either an active challenge (200) or a graceful empty state (404 JSON) is valid
    expect([200, 404]).toContain(response.status());
    const body = await response.json();
    if (response.status() === 200) {
      expect(body.challenge ?? body).toBeDefined();
    } else {
      // Empty state must be a JSON error object, not an HTML crash page
      expect(body.error).toBeDefined();
    }
  });

  test('POST /api/auth/login with invalid credentials should return 401', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'nonexistent@test.com', password: 'wrongpassword' },
    });
    expect([401, 400]).toContain(response.status());
  });

  test('POST /api/auth/register with validation errors should return 400', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: { email: '', password: '' },
    });
    expect(response.status()).toBe(400);
  });

  test('GET /api/users should return 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/users');
    expect([401, 403]).toContain(response.status());
  });

  test('GET /api/blog/[slug] should return 200 for existing slug', async ({ request }) => {
    const response = await request.get('/api/blog/original-character-universe-worldbuilding-2026');
    expect(response.ok()).toBe(true);
  });

  test('GET /api/blog/[slug] should return 404 for unknown slug', async ({ request }) => {
    const response = await request.get('/api/blog/this-slug-does-not-exist-xyz');
    expect([404, 400]).toContain(response.status());
  });

  test('GET /api/health should return 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.status).toBeDefined();
  });

  test('GET /feed.xml should return XML with 200', async ({ request }) => {
    const response = await request.get('/feed.xml');
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain('<?xml');
    expect(text).toContain('<rss');
  });

  test('GET /robots.txt should return 200 with sitemap reference', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain('User-Agent');
    expect(text).toContain('sitemap');
    expect(text).toContain('aniverse-one-khaki.vercel.app');
  });

  test('GET /sitemap.xml should return 200 with public routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain('<urlset');
    expect(text).toContain('/blog');
    expect(text).toContain('/characters');
    // Auth-gated routes must NOT be listed (consistent with robots disallow)
    expect(text).not.toContain('/dashboard');
    expect(text).not.toContain('/login');
  });
});
