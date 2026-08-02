# Changelog

All notable changes to AniVerse are documented here.

## [Unreleased]

### Performance & Maintenance (2026-08-02)
- Cleaned dead code: removed **3 unreferenced components** (verified 0 imports across the codebase):
  - `src/components/ui/modal.tsx` (game-style Modal — no longer used, replaced by inline panels)
  - `src/components/ui/select.tsx` (custom Select — no longer used, replaced by native/API-driven controls)
  - `src/components/trending-palettes.tsx` (TrendingPalettes — no longer used)
- Security hardening: added `poweredByHeader: false` to `next.config.ts` — hides the `X-Powered-By: Next.js` framework fingerprint from response headers
- Security audit: `npm audit --audit-level=high` → **0 vulnerabilities**; verified `.env` is NOT tracked in git (only `.env.example` with placeholders)
- Verified structured error handling: all 11 API routes use try/catch + `console.error` + standardized `errorResponse`/`notFoundResponse` helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 25 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-01)
- Bundle size & dependency cleanup: removed **17 unused npm packages** (`recharts`, `stripe`, `@stripe/stripe-js`, `react-dropzone`, `react-markdown`, `react-hook-form`, `@hookform/resolvers`, `uuid`, `zod`, `next-auth`, `@auth/prisma-adapter`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `uploadthing`, `@uploadthing/react`, `@types/uuid`) — shrinks install from 700+ to 543 packages
- Security: `npm audit` → **0 vulnerabilities** (was 4 high). The remaining `effect` advisory chain was eliminated by removing the unused `uploadthing` / `@uploadthing/react` dependencies
- Fixed phantom dependency: promoted `jose` (^6.2.4) to a direct dependency — `src/lib/auth.ts` imports it directly but it was only available transitively via `@auth/prisma-adapter`; removing the unused adapter would have broken the build
- Cleaned dead code: removed unused `calculateSkip` export from `src/lib/query-builder.ts` (skip is already computed in `parsePagination`)
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 25 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-01)
- Cleaned dead code: removed unused `src/lib/services/auth.service.ts` (unreferenced duplicate of auth route logic)
- Fixed all 14 ESLint warnings → **0 warnings, 0 errors**:
  - Converted `<img>` → `next/image` in blog, blog/[slug], characters pages (LCP/bandwidth optimization)
  - Added `alt=""` to decorative lucide `Image` icons (dashboard, gallery, marketplace, create, SpatialCanvasContent)
  - Removed unused `Spinner` import in dashboard/gallery
  - Removed unused eslint-disable directive in AuthProvider
  - Fixed unused catch binding in `.cron/create_pr.js`
- Security: `npm audit` reduced 9 → 4 vulnerabilities via `overrides` in package.json:
  - `sharp` 0.34.5 → 0.35.3 (patches libvips CVEs)
  - `postcss` 8.4.31 → 8.5.22 (patches XSS / source-map advisories)
  - Verified no secrets tracked in git; `.env.example` placeholders only
- Added `.cron/reports/*.json` to `.gitignore` (runtime report noise)
- Remaining advisory: `effect@3.17.7` (uploadthing pins exact version — requires upstream v7 update)

### Performance & Maintenance (2026-07-30)
- Cleaned dead code: removed 8 unused blog markdown files from `src/data/blog/`
- Fixed 36 ESLint warnings: removed unused imports across 10+ files (pricing.ts, AuthProvider, dashboard pages, components)
- Fixed unused eslint-disable directives in AuthProvider.tsx
- Cleaned unused `actionTypes` constant in use-toast.ts (replaced with inline type)
- Removed unused `action` destructuring in Toaster component
- Removed unused `cn` import from TrendingPalettes
- Removed unused `SectionId` type import from SpatialViewport
- Updated CHANGELOG.md with this entry

### Performance & Maintenance (2026-07-29)
- Cleaned dead code: removed 35 unused data files from `src/data/`
- Created `.env.example` with all required environment variables
- Enhanced `next.config.ts` with image optimization and bundle analysis config
- Fixed design system consistency in `TrendingPalettes` (uses `glass`, `cut-corner`, `btn-glow-sweep`)
- Created comprehensive CHANGELOG.md

## [2026-07-29]

### Features
- Architecture scalability improvements
- Premium Anime Game UI Design System v2 — tokens, micro-details, transitions
- Anime Game UI redesign — full HUD-style overhaul
- UI/UX improvements across dashboard and public pages
- Content seeding with blog articles, challenges, and characters

### Fixes
- Login/register race condition — `setUser` + `router.push` timing fix
- Auth cookie for middleware — login redirect loop resolved
- E2E tests and navigation fixes

## [2026-07-28]

### Features
- E2E testing infrastructure
- Performance optimization and code maintenance

### Database
- Initial Prisma schema with User, Artwork, Character, Challenge, BlogArticle models
- PostgreSQL integration with Prisma ORM

### Infrastructure
- Vercel deployment pipeline
- GitHub Actions CI/CD
- Cron agent automation with self-healing
