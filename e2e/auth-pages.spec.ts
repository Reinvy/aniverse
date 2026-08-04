import { test, expect } from '@playwright/test';

/**
 * Auth page UI integration tests — login/register forms must render
 * with the design-system styling and show graceful errors on bad input
 * (no redirect, no crash, no server error).
 */
test.describe('Auth Pages', () => {
  test('login page should render email/password form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    // Design-system markers
    await expect(page.locator('.cut-corner').first()).toBeVisible();
    await expect(page.getByText('AUTHENTICATION // LOGIN').first()).toBeVisible();
  });

  test('login with invalid credentials should show error and stay on /login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input#email').fill('nonexistent@test.com');
    await page.locator('input#password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should NOT navigate away
    await expect(page).toHaveURL(/\/login/);
    // Form-level error element (red text) should appear
    await expect(page.locator('.text-red-400').first()).toBeVisible({ timeout: 10000 });
  });

  test('register page should render all required fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input#firstName')).toBeVisible();
    await expect(page.locator('input#lastName')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.getByText('REGISTRATION // NEW USER').first()).toBeVisible();
  });

  test('register with empty fields should show client-side validation errors', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: /create account|register|sign up/i }).first().click();

    // Client-side validation messages appear without a server round-trip
    await expect(page.getByText('First name is required').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Last name is required').first()).toBeVisible();
    await expect(page.getByText('Email is required').first()).toBeVisible();
    await expect(page.getByText('Password is required').first()).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });
});
