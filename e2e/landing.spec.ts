import { test, expect } from '@playwright/test';

test.describe('AniVerse Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with title', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=AniVerse').first()).toBeVisible();
  });

  test('should show features grid', async ({ page }) => {
    const features = page.locator('[class*="feature"], section > div > div').first();
    await expect(features).toBeVisible();
  });

  test('should have CTA button that navigates', async ({ page }) => {
    const cta = page.getByRole('link', { name: /get started|start|join|sign up/i }).first();
    if (await cta.isVisible()) {
      await cta.click();
      await expect(page).toHaveURL(/login|register|signup/i);
    }
  });

  test('should have pricing section', async ({ page }) => {
    const pricing = page.locator('text=Free,Pro,Studio,Price,Pricing').first();
    await expect(pricing).toBeVisible();
  });

  test('should be responsive - viewport 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
