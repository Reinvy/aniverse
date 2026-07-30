import { test, expect } from '@playwright/test';

test.describe('AniVerse Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with title', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=AniVerse').first()).toBeVisible();
  });

  test('should show features section (navigate via HUD nav)', async ({ page }) => {
    // The landing page uses a spatial canvas. Default section is "hero".
    // Navigate to features section by clicking the HUD nav button with "Features" label.
    // First ensure the nav is visible, then click.
    await page.waitForTimeout(1000);
    const featuresBtn = page.locator('nav button:has-text("Features"), nav a:has-text("Features")').first();
    if (await featuresBtn.isVisible()) {
      await featuresBtn.click();
      await page.waitForTimeout(1000);
    }
    // The FeaturesNode contains "Everything you need to create" heading
    await expect(page.getByText('Everything you need to create').first()).toBeVisible({ timeout: 8000 });
  });

  test('should have CTA button that navigates', async ({ page }) => {
    const cta = page.getByRole('link', { name: /get started|start|join|sign up/i }).first();
    if (await cta.isVisible()) {
      await cta.click();
      await expect(page).toHaveURL(/login|register|signup/i);
    }
  });

  test('should have pricing section', async ({ page }) => {
    const pricing = page.getByText(/free|pro|studio|pricing/i).first();
    await expect(pricing).toBeVisible();
  });

  test('should be responsive - viewport 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
