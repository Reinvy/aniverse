import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: '.cron/reports/e2e-report.json' }],
  ],
  use: {
    baseURL: process.env.URL || 'https://aniverse-one-khaki.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
