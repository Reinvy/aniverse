## What
Fixed E2E test failures — all 17 specs were failing with "Cannot navigate to invalid URL" because the Playwright config's `baseURL` defaulted to `http://localhost:3000` which has no local server. Changed default to the production URL `https://aniverse-one-khaki.vercel.app`.

## Why
The E2E test suite (A12) runs against production. When `URL` env var isn't set, the config fell back to `http://localhost:3000` which doesn't have a running server, causing all navigation to fail.

## How to Test
Run: `npx playwright test`
Or with explicit URL: `URL=https://aniverse-one-khaki.vercel.app npx playwright test`

## Environment Variables
- `URL` — optional, defaults to production URL now (was localhost)
