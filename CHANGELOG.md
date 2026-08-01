# Changelog

All notable changes to AniVerse are documented here.

## [Unreleased]

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
