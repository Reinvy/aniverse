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

  test('GET /api/dashboard/stats should return 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/dashboard/stats');
    // Should return 401 or 403 since we're not authenticated
    expect([401, 403]).toContain(response.status());
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
});
