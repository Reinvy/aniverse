# Changelog

All notable changes to AniVerse are documented here.

## [Unreleased]

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
