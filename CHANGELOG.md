# Changelog

All notable changes to AniVerse are documented here.

## [Unreleased]

### Performance & Maintenance (2026-08-14)
- **Dead-link cleanup — footer social icons** (`src/components/layout/footer.tsx`): the GitHub icon linked to the generic `https://github.com` homepage and the Twitter icon linked to a placeholder `https://twitter.com` with no real AniVerse account (decorative dead links per the discoverability policy). The GitHub icon now points to the real project repo (`https://github.com/Reinvy/aniverse`); the placeholder Twitter link was removed (no real account exists) along with its now-unused `AtSign` import.
- **LCP optimization — `priority` on hero images** (skips lazy-loading the largest contentful paint image on 3 public routes):
  - `src/components/blog/featured-article-hero.tsx` — featured hero cover on `/blog`
  - `src/app/blog/[slug]/page.tsx` — article cover on `/blog/[slug]`
  - `src/app/characters/[id]/page.tsx` — character reference image on `/characters/[id]`
- Security audit: `npm audit --audit-level=high` → **0 vulnerabilities** (verified; no new advisories)
- Verified structured error handling: all **17** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Verified no secrets in tracked files: `.env` NOT in git (only `.env.example` with placeholders); no `console.log`/`console.debug` in `src/`; no TODO/FIXME markers; no `any` escape hatches outside `src/generated/` (Prisma client output)
- Verified dead-code status: 0 unreferenced modules across `src/components`, `src/lib`, `src/data`, `src/hooks` (all have ≥1 consumer); the new `PublicPageShell` + `CtaCard` from PR #122 are consumed by all 5 public pages
- Verified SEO consistency: `sitemap.ts` lists only publicly indexable pages (no `/dashboard/*`, `/login`, `/register` — matches `robots.ts` disallow rules); `robots.ts` sitemap URL uses `APP_URL`
- Verified design-system consistency: `CtaCard`/`PublicPageShell` (PR #122) use the canonical game-style classes (`glass`, `cut-corner`, `bracket-corner`, `diamond-indicator`, `energy-sweep`, `sys-label`, `btn-glow-sweep` primary button); landing EXPLORE // QUICK LINKS + footer strip all use real hrefs
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 33 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-13)
- **🔐 SECURITY (critical) — removed hardcoded JWT fallback secret** (`src/lib/auth.ts`): the module previously fell back to `"aniverse-dev-secret-key"` when `JWT_SECRET` was unset, meaning any deployment without the env var silently accepted tokens signed with a publicly-known key (anyone who read the repo could forge JWTs for any user). `JWT_SECRET` is now resolved lazily via `getJwtSecret()` and **fails closed** — signing/verifying throws with a clear message when the env var is missing. Deployments MUST set `JWT_SECRET`:
  - Set on Vercel project `prj_nCzg89eX82InxCfAz3bKKW6D5ZoR` for `production` + `preview` + `development` (generated via `openssl rand -base64 48`)
  - Added to local `.env` (gitignored) and `.env.example` now documents it as REQUIRED
- **Security audit**: `npm audit --audit-level=high` → **0 vulnerabilities** (verified; no new advisories)
- **Cleaned dead exports** (verified 0 imports across `src/`, e2e, `.cron` — de-exported internal-only types, no runtime change):
  - `src/lib/services/artwork.service.ts`: `ArtworkFilters`, `CreateArtworkInput`, `ArtworkDetailItem`, `UpdateArtworkInput`
  - `src/lib/services/blog.service.ts`: `BlogArticleFilters`, `BlogArticleListItem`, `BlogArticleDetail`
  - `src/lib/services/challenge.service.ts`: `ChallengeDetail`
  - `src/lib/services/character.service.ts`: `CharacterFilters`, `CharacterDetail`
  - `src/lib/services/content.service.ts`: `ContentCounts`, `ContentOverviewAggregates`, `ContentOverview`
  - `src/lib/services/dashboard.service.ts`: `DashboardStats`, `ActivityItem`, `DashboardResult`
  - `src/lib/services/marketplace.service.ts`: `MarketplaceFilters`, `MarketplaceStats`, `MarketplaceProductItem`
  - `src/lib/services/user.service.ts`: `UserFilters`
  - `src/lib/api-helpers.ts`: `CacheDuration`, `AuthenticatedRequestResult`
  - `src/lib/spatial-store.tsx`: `SectionConfig` (kept `SECTIONS` + `SectionId` — still consumed)
  - `src/lib/ttl-cache.ts`: `TtlCache` (kept `createTtlCache` — consumed by 6 services)
- Verified structured error handling: all **17** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (auth routes intentionally return client-friendly `{ errors: { _form } }` shapes — no raw 500s leak internal details)
- Verified no secrets in tracked files: `.env` NOT in git (only `.env.example` with placeholders); no `console.log`/`console.debug` in `src/`; no TODO/FIXME markers
- Verified bundle/config consistency: `next.config.ts` optimal (`removeConsole` prod-only, `productionBrowserSourceMaps: false`, AVIF/WebP, `poweredByHeader: false`, no-store on `/api/*`); no unreferenced component/lib/data modules; lucide-react named imports tree-shake cleanly
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 31 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-12)
- **Fixed lint error — `react-hooks/set-state-in-effect`** (`src/lib/spatial-store.tsx`): the hash-anchor deep-link effect (added 2026-08-12 in the e2e PR) called `setActiveSection` synchronously in the effect body, which cascades an extra render. Split into two effects: the initial hash resolution now defers via `setTimeout(..., 0)` (state update happens after the commit phase) and the `hashchange` listener stays in its own effect. Behavior unchanged — deep links from header nav (`/#features`, `/#pricing`) still mount the correct section. `npm run lint` → 0 errors, 0 warnings.
- **Performance — memoized `cameraTransform`** (`src/lib/spatial-store.tsx`): the desktop camera CSS-transform string is derived purely from `activeSection` but was rebuilt on every provider render; now wrapped in `useMemo([activeSection])` so it only recomputes on section change.
- **Cleanup — de-exported internal-only `NavDirection`** (`src/lib/spatial-store.tsx`): the type is used solely inside `spatial-store.tsx` (context value, state, ref) — zero external consumers, so it no longer ships as a public export.
- Security audit: `npm audit --audit-level=high` → **0 vulnerabilities** (verified; no new advisories)
- Verified structured error handling: all **17** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Verified no secrets in tracked files: `.env` NOT in git (only `.env.example` with placeholders); no `console.log`/`console.debug` in `src/`; no TODO/FIXME markers; no `any` escape hatches outside `src/generated/` (Prisma client output)
- Verified bundle/config consistency: `next.config.ts` optimal (`removeConsole` prod-only, `productionBrowserSourceMaps: false`, AVIF/WebP, `poweredByHeader: false`, no-store on `/api/*`); lucide-react named imports tree-shake cleanly; all `src/components/**` & `src/lib/**` modules have ≥1 consumer; `ParticleBackground` keeps DPR cap (≤2) + 80-particle ceiling
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 31 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-09)
- **Performance — parallelized dashboard stats & activity queries** (`src/lib/services/dashboard.service.ts`):
  - `getDashboardStats`: `likesReceived` count + `buildActivityFeed` now run concurrently (batch #2 via `Promise.all`) instead of serially — both only depend on `artworkIds` from batch #1 → saves 1 round trip per `/api/dashboard/stats` request
  - `buildActivityFeed`: the 3 feed queries (recent artworks / likes / comments) now run in one `Promise.all` — 3 sequential round trips → 1
- **DRY refactor — dashboard page fetch logic** (`src/app/dashboard/page.tsx`): extracted the duplicated `/api/dashboard/stats` fetch (initial mount effect + "Try Again" retry button) into a single `loadStats` `useCallback`; the retry button now calls `loadStats()` instead of re-implementing the fetch. Also removed the now-unneeded inline eslint-disable for the direct `setState` in effect (moved to the shared callback).
- Security audit: `npm audit --audit-level=high` → **0 vulnerabilities** (verified; no new advisories)
- Verified structured error handling: all **16** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Verified no secrets in tracked files: `.env` NOT in git (only `.env.example` with placeholders); no `console.log`/`console.debug` in `src/`; no TODO/FIXME markers
- Verified bundle/config consistency: `next.config.ts` optimal (`removeConsole` prod-only, `productionBrowserSourceMaps: false`, AVIF/WebP, `poweredByHeader: false`, no-store on `/api/*`); lucide-react named imports tree-shake cleanly; no unused component files (all `src/components/**` & `src/lib/**` modules have ≥1 consumer)
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 31 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-08)
- Security audit fix: `npm audit fix` bumped `nanoid` `3.3.16` → `3.3.18` (transitive via `postcss` → `@tailwindcss/postcss`) — closes GHSA-2v37-7h3g-55p8 (custom generators can loop indefinitely when size is zero; high severity). `npm audit --audit-level=high` → **0 vulnerabilities**
- Cleaned dead code (verified 0 references across `src/`, e2e, `.cron`):
  - `src/lib/services/artwork.service.ts`: removed unused `ArtworkListItem` + `PublicArtworkItem` type aliases (Prisma `GetPayload` projections over `artworkListSelect`/`publicArtworkSelect` — the selects remain, used by the list/detail queries; only the exported aliases were orphaned)
  - `src/lib/services/challenge.service.ts`: removed unused `ChallengeListItem` type alias (only `ChallengeDetail` is consumed)
  - `src/lib/services/character.service.ts`: removed unused `CharacterListItem` type alias (only `CharacterDetail` is consumed)
  - `src/lib/services/sort-config.ts`: removed 5 unused derived type aliases (`ArtworkSortField`, `BlogArticleSortField`, `CharacterSortField`, `ChallengeSortField`, `UserSortField`) — callers already use `(typeof X_SORT_FIELDS)[number]` inline, the standalone aliases had zero consumers
- Verified structured error handling: all **15** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Verified bundle/design consistency: `next.config.ts` already optimal (`removeConsole` prod-only, `productionBrowserSourceMaps: false`, AVIF/WebP image formats, capped device sizes, `poweredByHeader: false`, no-store on `/api/*`); design tokens (`bg-eclipse`, `bg-starfield`, `glass`, `cut-corner`, `sys-label`) present across page components; Button uses Astral Luxury `chamfered-sm` + `light-sweep`
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 29 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-07)
- Security audit fix: `npm audit fix` bumped `js-yaml` `4.3.0` → `4.3.1` (transitive via `eslint` → `@eslint/eslintrc`) — closes CVE-2026-59870 (GHSA-5p4m-2wfm-xmqj, quadratic CPU consumption in `!!omap` resolution). `npm audit` → **0 vulnerabilities**
- Cleaned dead code (verified 0 imports across `src/`, e2e, `.cron`):
  - `src/lib/query-builder.ts`: removed unused `paginatedFetch` generic helper (every service layer inlines its own `Promise.all([findMany, count])` — zero call sites)
  - `src/lib/services/user.service.ts`: removed 4 unused functions — `findUserById`, `findUserByEmail`, `isEmailRegistered`, `getUserCounts` (only `findUsers` is consumed, by `/api/users`)
  - `src/lib/services/artwork.service.ts`: removed unused `findArtworkById` (no `/api/artworks/[id]` route exists)
  - `src/components/ui/spinner.tsx`: removed unused `InlineSpinner` + `PageLoadingShell` exports (only `Spinner` is consumed) and the orphaned `Loader2` import
  - De-exported internal-only symbols (used solely inside their own modules): `rateLimiter`, `rateLimitResponse`, `RateLimiterOptions`, `RateLimitResult` (`rate-limiter.ts`), `SITE_URL`, `SITE_TITLE`, `SITE_DESCRIPTION`, `findRssArticles`, `RSS_FEED_LIMIT` (`rss.service.ts`), `reducer` (`use-toast.ts`), `authenticateRequest`, `AuthResult`, `encodeCursor`, `computeEtag` (`api-helpers.ts` — all remain as internal helpers)
- Verified structured error handling: all **15** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)
- Security audit: `.env` NOT tracked in git (only `.env.example` with placeholders); no secrets in tracked files; no `console.log` statements in `src/`
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 30 routes + Proxy (middleware) intact

### Performance & Maintenance (2026-08-05)
- Security audit fix: bumped `postcss` override `8.5.22` → `^8.5.25` in `package.json` — closes GHSA-fxqj-rqcc-2cmp (attacker-controlled `sourceMappingURL` reads arbitrary `.map` files; affects postcss ≤8.5.22 via the `next` dependency chain)
- `npm audit fix` → **0 vulnerabilities** (was 2 high: `brace-expansion` <5.0.9 DoS via unbounded intermediate arrays, `fast-uri` <3.1.5 host confusion via backslash authority introducer)
- Cleaned dead code (verified 0 imports across `src/`, e2e, `.cron`):
  - `src/data/daily-art-20260727.ts` — unreferenced daily-art data file (12.6 KB)
  - `src/lib/utils.ts`: removed 3 unused exports — `truncate`, `generateId`, `isClient`
  - `src/lib/query-builder.ts`: de-exported internal-only `SearchFieldConfig` interface (used only inside the file)
- DRY / domain single-source-of-truth: `src/lib/services/rss.service.ts` now imports `SITE_URL` from `APP_URL` in `@/lib/constants` instead of hardcoding `https://aniverse-one-khaki.vercel.app` (extends the 08-03 pattern; `/feed.xml` links can never drift from the real Vercel alias)
- Verified structured error handling: all **15** API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers`
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build

### Performance & Maintenance (2026-08-03)
- Cleaned dead code: removed **18 unused exports** (verified 0 imports across the entire repo — `src/`, e2e, `.cron`):
  - `src/lib/constants.ts` (9): `APP_TAGLINE`, `DASHBOARD_NAV` (sidebar defines its own local nav), `TierId`, `ANNUAL_PRICES`, `COIN_PACKS`, `MARKETPLACE_COMMISSION_RATE`, `REFERRAL_REWARDS`, `PRICING_INTERVALS`, `FEATURED_ARTWORKS`
  - `src/lib/pricing.ts` (9): `PricingTierId`, `annualPrices`, `annualSavings`, `perGenerationCost`, `MARKETPLACE_COMMISSION`, `REFERRAL_REWARDS`, `upgradeReasons`, `formatPrice`, `getPriceId` — the file now keeps only the two exports actually consumed by the app (`pricingTiers`, `coinPacks`)
- DRY / domain single-source-of-truth: `sitemap.ts` and `robots.ts` now import `APP_URL` from `@/lib/constants` instead of hardcoding the production domain (prevents the stale-domain bug class where SEO metadata drifts from the real Vercel alias)
- Verified `npm run lint` → 0 errors, 0 warnings; `npm run build` → clean production build, all 28 routes + Proxy (middleware) intact
- Security audit: `npm audit --audit-level=high` → **0 vulnerabilities**; `.env` NOT tracked in git (only `.env.example` with placeholders); no `console.log` statements in `src/`
- Verified structured error handling: all 13 API routes use try/catch + `console.error` + standardized helpers from `@/lib/api-helpers` (no raw 500s leak internal details)

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
