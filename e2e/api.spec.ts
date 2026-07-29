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
});
