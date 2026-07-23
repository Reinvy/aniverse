---
name: aniverse-self-improving
description: "🌀 AniVerse — 11 autonomous daily cron agents for AI Anime Creator Ecosystem: from trend research to monetization, marketing, and community building"
version: 1.0.0
author: Hermes Agent
---

# 🌀 AniVerse Self-Improving

> 11 autonomous daily cron agents that run the full lifecycle of the AniVerse AI Anime Creator Ecosystem — from trend research and content generation to monetization, marketing, and community building.

## 1. Overview

**AniVerse** is an AI-powered anime artwork creation platform where users generate, share, discover, buy, and sell AI-generated anime art. Built with Next.js 16, PostgreSQL (Prisma 7 ORM), and Tailwind CSS v4.

The **Self-Improving** system is an ecosystem of **11 autonomous cron agents** that operate daily to:

- Research anime/art trends and generate relevant content
- Create and publish SEO blog articles
- Manage social media posting across platforms
- Run community challenges and gamification
- Monitor marketplace activity and optimize monetization
- Track analytics and produce daily digests
- Self-correct through a 3-layer gate-keeping QA system

Each agent runs on a schedule (WIB / UTC+7), reads the output of previous agents via GitHub PR diffs, and contributes its own changes through a structured PR workflow.

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                   ORCHESTRATOR                       │
│        (Gate Keeper Layer 3 — Final QA + Merge)      │
└──────────────────────┬──────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Agent   │   │  Agent   │   │  Agent   │
│  1 - 4   │──▶│  5 - 8   │──▶│ 9 - 11   │
│(Research)│   │(Create)  │   │(Market)  │
└──────────┘   └──────────┘   └──────────┘
       │               │               │
       ▼               ▼               ▼
┌─────────────────────────────────────────────────────┐
│             3-LAYER GATE KEEPING                     │
│  Layer 1: QA Agent (automated checks + lint)         │
│  Layer 2: Content Quality Agent (relevance + tone)   │
│  Layer 3: Orchestrator (final sign-off + squash-merge)│
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
Agent 1 (Trend Research) 
  └─▶ produces trend report → saved as structured data
Agent 2 (Content Generation) 
  └─▶ reads Agent 1 trends → generates anime artwork
Agent 3 (SEO Blog Agent) 
  └─▶ reads Agents 1-2 → writes + publishes blog articles
Agent 4 (Social Media Agent) 
  └─▶ reads Agents 1-3 → schedules cross-platform posts
Agent 5 (Challenge Agent) 
  └─▶ reads Agent 1 trends → creates daily/weekly challenges
Agent 6 (Community Engagement Agent) 
  └─▶ reads Agent 4-5 output → monitors + engages
Agent 7 (Marketplace Agent) 
  └─▶ analyzes sales data → optimizes listings
Agent 8 (Analytics Agent) 
  └─▶ reads all agents → aggregates metrics
Agent 9 (Monetization Agent) 
  └─▶ reads Agent 7-8 → adjusts pricing/promotions
Agent 10 (Marketing Agent) 
  └─▶ reads Agents 1-9 → cross-platform content distribution
Agent 11 (Orchestrator / Daily Digest)
  └─▶ reads all → compiles daily report → posts to Telegram
```

## 3. Agent Schedule & Dependencies

All times are in **WIB (Western Indonesia Time, UTC+7)**.

| # | Time (WIB) | Agent Name | Role | Depends On | Description |
|---|------------|-----------|------|-----------|-------------|
| 1 | 00:00 | Trend Research Agent | Research | — | Scans Twitter/X, Pixiv, Reddit, Google Trends for anime/art trends, popular characters, styles, and keywords. Saves structured trend report to DB. |
| 2 | 01:00 | Content Generation Agent | Create | Agent 1 | Generates AI anime artwork based on trending topics. Creates 3-5 new pieces using the AniVerse AI engine. Saves Artwork records. |
| 3 | 02:00 | SEO Blog Agent | Write | Agents 1-2 | Writes and publishes SEO-optimized blog articles (tutorials, trend analysis, artist spotlights). Creates BlogArticle records. |
| 4 | 03:00 | Social Media Agent | Post | Agents 1-3 | Creates and schedules social media posts (Twitter/X, Instagram, TikTok, DeviantArt, Pixiv). Creates SocialMediaPost records. |
| 5 | 04:00 | Challenge Agent | Gamify | Agent 1 | Creates daily/weekly art challenges with prompts, reward structures, and deadlines. Creates Challenge records. |
| 6 | 05:00 | Community Engagement Agent | Engage | Agents 4-5 | Monitors comments, likes, follows. Engages with the community. Flags toxic content. Tracks engagement metrics. |
| 7 | 06:00 | Marketplace Agent | Commerce | Agents 1-2 | Reviews product listings, commissions, pricing. Optimizes marketplace placements. Creates/updates Product records. |
| 8 | 07:00 | Analytics Agent | Measure | Agents 1-7 | Aggregates all activity data, computes KPIs (DAU, MAU, conversion, revenue). Generates AnalyticsEvent summaries. |
| 9 | 08:00 | Monetization Agent | Revenue | Agents 7-8 | Adjusts pricing tiers, creates promotions, optimizes subscription offers, sets up Stripe coupon campaigns. |
| 10 | 09:00 | Marketing Agent | Distribute | Agents 1-9 | Cross-publishes content to all platforms. Runs ad campaigns. Distributes blog articles to Medium, Dev.to, etc. |
| 11 | 10:00 | Orchestrator Agent | Report | Agents 1-10 | Compiles daily digest, runs final QA, creates summary report, posts to Telegram, squash-merges all PRs. |

### Schedule Notes

- All agents run **daily** unless otherwise noted.
- If an agent fails, the downstream agents still run but note the failure in their reports.
- Agents check `git log` and PR diffs from previous agents before starting (per AGENTS.md §4.1).
- The entire chain takes ~11 hours to complete (midnight to 11 AM WIB).

## 4. Chain Flow

### Step-by-step data handoff:

1. **Agent 1 (00:00)** — Queries external APIs (Twitter, Reddit, Pixiv, Google Trends). Saves trending topics, keywords, styles as structured JSON in the database. Output: `TrendReport` record.

2. **Agent 2 (01:00)** — Reads Agent 1's trend report. Selects 3-5 trending topics. Sends prompts to AI generation engine. Saves produced artwork (title, imageUrl, style, prompt, creatorId for system user). Checks outputs for NSFW/quality issues.

3. **Agent 3 (02:00)** — Reads Agents 1-2 outputs. Writes 1-2 blog articles (minimum 800 words). Generates SEO metadata (title, slug, excerpt, tags, seoTitle, seoDesc). Saves to BlogArticle table with `isPublished: true`.

4. **Agent 4 (03:00)** — Reads Agents 1-3 outputs. Creates 2-3 social media posts per platform. Schedules them for optimal posting times. Saves to SocialMediaPost with appropriate platform, content, imageUrl.

5. **Agent 5 (04:00)** — Reads Agent 1 trends. Designs 1 daily challenge + 1 weekly challenge. Sets start/end times, reward coins, prompts. Saves to Challenge table.

6. **Agent 6 (05:00)** — Reads Agents 4-5 outputs. Checks for new comments (polymorphic Comment model). Responds to questions. Likes/engages with community content. Reports any flagged content.

7. **Agent 7 (06:00)** — Reads Agent 1-2 outputs. Reviews Product records for stale/underperforming listings. Adjusts prices. Creates new products from top-performing artwork. Manages Commission requests.

8. **Agent 8 (07:00)** — Queries AnalyticsEvent, User, Order, Transaction, Subscription tables. Computes: DAU, MAU, artwork generated, sales volume, revenue, subscription conversion. Saves KPI snapshot.

9. **Agent 9 (08:00)** — Reads Agents 7-8 metrics. Evaluates current pricing vs. market. Creates promo codes. Adjusts subscription tier features if needed. Generates Stripe coupon campaigns.

10. **Agent 10 (09:00)** — Reads all prior agents. Cross-publishes top blog articles to Medium/Dev.to. Posts curated content to all social platforms. Optionally runs paid ad campaigns via API.

11. **Agent 11 (10:00)** — Gathers reports from all 10 agents. Runs final lint checks. Compiles daily digest in markdown. Posts to Telegram channel. Squash-merges all approved PRs. Cleans up branches.

## 5. 3-Layer Gate Keeping

Every change goes through **three independent quality gates** before reaching production.

### Layer 1: QA Agent (Automated)

```
Checklist:
├── TypeScript strict compilation — no errors
├── ESLint — zero warnings
├── Prettier — code format compliance
├── Next.js build — successful
├── Unit tests — all pass
└── Branch naming — follows feat/aniverse-* convention
```

- Runs `npm run build` and `npm run lint` on every PR branch.
- Fails the PR if any check fails.
- Posts failure details as PR comment.

### Layer 2: Content Quality Agent

```
Checklist:
├── Content relevance — matches AniVerse brand voice
├── No NSFW / prohibited content
├── No hallucinated statistics or fake data
├── SEO metadata completeness (title, description, tags)
├── Image quality — minimum resolution, no artifacts
├── Social media post tone — appropriate per platform
├── Blog article — minimum 800 words, original content
└── Pricing/monetization — realistic values only
```

- Reviews all generated content before merge.
- Flags questionable content with specific reasoning.
- Can request changes via PR comments.

### Layer 3: Orchestrator Agent (Final Sign-Off)

```
Checklist:
├── Layers 1 & 2 both passed
├── All 10 agents completed successfully
├── No merge conflicts with main
├── Daily digest compiled
├── All PR descriptions follow AGENTS.md §2.2
├── Branch cleanup verified
└── Final approval granted
```

- Only the Orchestrator can squash-merge to main.
- If any agent failed, the Orchestrator notes it and merges with degraded status.
- Posts final daily summary to Telegram.

## 6. Repository

```
GitHub: https://github.com/Reinvy/aniverse
Clone:  git clone https://github.com/Reinvy/aniverse.git
```

### Key Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Agent protocol, git conventions, PR workflow |
| `.cron/git_helper.sh` | Git automation script (branch, PR, merge) |
| `prisma/schema.prisma` | Complete database schema (20 models) |
| `skills-lock.json` | Skill registry for agent tooling |
| `src/` | Next.js application source code |

## 7. Monetization

AniVerse has **8 revenue streams** managed by the autonomous agents:

| # | Stream | Model | Agent |
|---|--------|-------|-------|
| 1 | **Pro Subscription** ($9.99/mo) | 100 AI generations/mo, HD, commercial license | Agent 9 |
| 2 | **Studio Subscription** ($24.99/mo) | Unlimited generations, 4K, API access, team | Agent 9 |
| 3 | **Marketplace Sales** | Creator sells digital artwork + prints | Agent 7 |
| 4 | **Commission Fees** | Percentage on commissioned artwork | Agent 7 |
| 5 | **Digital Products** | Premium assets, style packs, brushes | Agent 7 |
| 6 | **Promoted Content** | Sponsored posts, featured gallery slots | Agent 10 |
| 7 | **Affiliate Program** | Referral commissions for referrals | Agent 9 |
| 8 | **In-App Currency (Coins)** | Microtransactions for boosts/features | Agent 9 |

### Pricing Tiers

| Tier | Price | Generations | Resolution | License |
|------|-------|-------------|------------|---------|
| Free | $0 | 10/mo | 512×512 | Personal |
| Pro | $9.99/mo | 100/mo | 1024×1024 | Commercial |
| Studio | $24.99/mo | Unlimited | 2048×2048 | Commercial + Resale |

## 8. Marketing

Content is auto-published to **6 platforms** by the autonomous agents:

| Platform | Content Type | Agent |
|----------|-------------|-------|
| Twitter / X | Artwork + short posts | Agent 4 → Agent 10 |
| Instagram | Gallery posts + Stories | Agent 4 → Agent 10 |
| TikTok | Short-form video showcases | Agent 4 → Agent 10 |
| DeviantArt | Full gallery uploads | Agent 4 → Agent 10 |
| Pixiv | Curated anime artwork | Agent 4 → Agent 10 |
| Medium / Dev.to | Blog articles (cross-post) | Agent 3 → Agent 10 |

### Marketing Automation Flow

1. **Agent 3** writes SEO blog articles → saves to `BlogArticle` table
2. **Agent 4** creates social media posts → saves to `SocialMediaPost` table with scheduled times
3. **Agent 10** reads pending + scheduled posts → publishes via platform APIs → updates `postUrl` and `status`
4. **Agent 8** tracks engagement metrics → feeds back to Agent 10 for optimization

## 9. Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 16.2.11 |
| **Language** | TypeScript | ^5 (strict mode) |
| **Database** | PostgreSQL | — |
| **ORM** | Prisma | ^7.9.0 |
| **Auth** | next-auth | ^5.0.0-beta.32 |
| **Styling** | Tailwind CSS | v4 |
| **Payments** | Stripe | ^22.3.2 |
| **File Upload** | UploadThing | ^7.7.4 |
| **Animation** | Framer Motion | ^12.42.2 |
| **UI** | Radix UI + shadcn-style | — |
| **Forms** | react-hook-form + zod | — |
| **Charts** | recharts | ^3.10.0 |
| **Linting** | ESLint | ^9 |
| **Formatting** | Prettier | ^3.9.6 |
| **Git Automation** | bash + curl + jq | — |

### Database Models (20 tables)

User, Account, Session, VerificationToken, Artwork, Character, Story, Chapter, WebtoonPanel, Gallery, GalleryItem, Comment, Like, Follow, Commission, Product, Order, OrderItem, Transaction, UserSubscription, SocialMediaPost, BlogArticle, Challenge, ChallengeSubmission, AnalyticsEvent

## 10. Setup

### Prerequisites

```bash
# Node.js 20+ and PostgreSQL required
node --version  # >= 20
psql --version  # >= 14
```

### 1. Clone & Install

```bash
git clone https://github.com/Reinvy/aniverse.git
cd aniverse
npm install
```

### 2. Environment Variables

Copy `.env` with the required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/aniverse"

# Auth (next-auth)
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# UploadThing (file uploads)
UPLOADTHING_TOKEN="..."

# Social Platform API Keys (for agents)
TWITTER_API_KEY="..."
INSTAGRAM_ACCESS_TOKEN="..."
TIKTOK_ACCESS_TOKEN="..."
DEVIANTART_API_KEY="..."
PIXIV_API_KEY="..."
MEDIUM_API_KEY="..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
# or for production:
npx prisma migrate dev
```

### 4. Create System User for Agents

```sql
INSERT INTO "User" (id, name, email, role, "premiumTier", username)
VALUES ('agent-system', 'AniVerse Bot', 'system@aniverse.ai', 'ADMIN', 'ULTIMATE', 'aniversebot');
```

### 5. Configure Cron Agents

Each agent is a shell script or Node.js module triggered via cron. The `.cron/` directory contains the `git_helper.sh` for Git operations.

Example cron entry (run on a server with WIB timezone):

```cron
# AniVerse Daily Agent Chain (WIB = UTC+7)
0 0 * * * /opt/data/workspace/aniverse/agents/01-trend-research.sh
0 1 * * * /opt/data/workspace/aniverse/agents/02-content-generation.sh
0 2 * * * /opt/data/workspace/aniverse/agents/03-seo-blog.sh
0 3 * * * /opt/data/workspace/aniverse/agents/04-social-media.sh
0 4 * * * /opt/data/workspace/aniverse/agents/05-challenge.sh
0 5 * * * /opt/data/workspace/aniverse/agents/06-community-engagement.sh
0 6 * * * /opt/data/workspace/aniverse/agents/07-marketplace.sh
0 7 * * * /opt/data/workspace/aniverse/agents/08-analytics.sh
0 8 * * * /opt/data/workspace/aniverse/agents/09-monetization.sh
0 9 * * * /opt/data/workspace/aniverse/agents/10-marketing.sh
0 10 * * * /opt/data/workspace/aniverse/agents/11-orchestrator.sh
```

### 6. Agent Script Pattern

Every agent follows this structure:

```bash
#!/usr/bin/env bash
# Agent N: Name
set -euo pipefail

WORKDIR="/opt/data/workspace/aniverse"
source "$WORKDIR/.cron/git_helper.sh"

export GITHUB_TOKEN=$(extract_token)

# Step 1: Ensure repo is up to date
ensure_repo "$WORKDIR"

# Step 2: Create branch
BRANCH="feat/aniverse-agent-N-description"
create_branch "$BRANCH"

# Step 3: Read previous agent's output (check PRs)
# git fetch origin && git log origin/main --oneline -10

# Step 4: Do the work
# ... generate content, update database, etc.

# Step 5: Commit and push
git add -A
git commit -m "feat: agent N output for $(date +%Y-%m-%d)"
push_branch

# Step 6: Create PR
PR_BODY=$(cat <<EOF
## What
Agent N output for $(date +%Y-%m-%d)

## Why
Daily autonomous run of Agent N ($ROLE)

## Testing
Verify the generated content in the database.
EOF
)
echo "$PR_BODY" > /tmp/pr_body.md
create_pr "feat: Agent N — $(date +%Y-%m-%d)" /tmp/pr_body.md
```

## 11. Pitfalls

### Known Issues & Edge Cases

#### Database

| Issue | Cause | Mitigation |
|-------|-------|-----------|
| Connection pool exhaustion | All 11 agents + web app sharing same pool | Use PgBouncer or connection pooling middleware |
| `cuid()` collisions (rare) | Concurrent agent inserts | Prisma handles conflicts; retry on unique constraint violation |
| Stale `prisma generate` | Schema changes between agent runs | Run `npx prisma generate` at start of each agent |
| Migration conflicts | Two agents modifying schema simultaneously | Schema changes require human review; agents only add data |

#### Git & CI

| Issue | Cause | Mitigation |
|-------|-------|-----------|
| Merge conflicts | Two agents editing same files | Agents should work on disjoint data sets. Orchestrator handles conflict resolution via `--theirs` strategy. |
| Stale branch | Agent starts before previous agent's PR merged | Always `git pull --ff-only origin main` at start |
| GitHub API rate limits | 5000 req/hr exceeded | Cache tokens, batch operations, stagger agent runs |
| Credential expiry | GitHub token rotates | `git_helper.sh` reads from credential store; set up token refresh |

#### Content Quality

| Issue | Cause | Mitigation |
|-------|-------|-----------|
| Hallucinated trends | AI makes up data | Content Quality Agent verifies facts against source APIs |
| Repetitive content | Same prompts daily | Trend Research Agent varies sources; dedup check before generation |
| NSFW generation | AI safety filter bypass | Layer 2 quality gate; explicit prompt blocking list |
| SEO keyword stuffing | Over-optimization | Content Quality Agent checks keyword density < 3% |
| Platform API changes | Social platforms update APIs | Agent scripts include version-check headers; fallback to draft mode |

#### Scheduling

| Issue | Cause | Mitigation |
|-------|-------|-----------|
| Agent chain delay | One agent takes too long | Each agent has a 45-minute max runtime. Orchestrator checks timestamps. |
| Timezone mismatch | Server not in WIB | Set `TZ=Asia/Jakarta` in cron environment; use UTC internally |
| Daylight saving | WIB does not observe DST | No issue — WIB is fixed UTC+7 year-round |

#### Data Integrity

| Issue | Cause | Mitigation |
|-------|-------|-----------|
| Duplicate blog slugs | Two agents writing similar articles | BlogArticle model has `slug` unique constraint; catch and rename |
| Orphaned records | Agent fails mid-way | Wrap each agent's work in a transaction; rollback on failure |
| Missing `creatorId` | Agent system user not found | Check system user exists at agent startup; create if missing |

### Recovery Procedures

```bash
# If an agent fails:
cd /opt/data/workspace/aniverse
git checkout main
git pull --ff-only origin main

# Manually run the failed agent:
bash agents/03-seo-blog.sh

# If merge is stuck:
.cron/git_helper.sh resolve-conflicts
.cron/git_helper.sh push-branch
.cron/git_helper.sh create-pr "feat: manual recovery $(date +%Y-%m-%d)"
```

## 12. Git Protocol

From `AGENTS.md` — all agents must follow these conventions:

### Branch Naming

```
feat/aniverse-{short-description}
# Example: feat/aniverse-trend-report-2026-07-24
```

### No Direct Pushes to `main`

All changes go through **Pull Requests**. Direct pushes to `main` are strictly forbidden.

### Commit Messages

```
feat: agent N — YYYY-MM-DD
# or with scope:
feat(agent-3): add SEO blog article about trending anime styles
```

### PR Description Template

Every PR must include:

```markdown
## What
[summary of changes]

## Why
[context and motivation]

## How to Test
[manual or automated steps]

## Environment Variables Affected
[none, or list]
```

### Squash-Merge Only

All merges to `main` must be **squash-merged** to keep history clean. The Orchestrator Agent (Agent 11) handles this.

### PR Review Workflow

1. Agent creates branch → commits → pushes → creates PR
2. **Layer 1 QA Agent** runs automated checks → passes or requests changes
3. **Layer 2 Content Quality Agent** reviews content → approves or requests changes
4. **Layer 3 Orchestrator Agent** gives final sign-off → squash-merges
5. Branch is cleaned up (local + remote)

## 13. Daily Digest

The Orchestrator Agent (Agent 11) compiles a daily report and posts it to Telegram at 10:00 WIB.

### Digest Format

```
🌀 AniVerse Daily Digest — 2026-07-24

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Today's Metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Artworks generated:        12
• Blog articles published:   2
• Social media posts:        8
• Challenges created:        2 (1 daily + 1 weekly)
• Marketplace sales:         $42.50
• New users:                 18
• Active DAU:                147
• Subscription revenue:      $89.91

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Trending Topics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cyberpunk samurai aesthetic
2. Studio Ghibli color palette
3. Chibi space explorers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Agent Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#1  Trend Research       ✅ (0:12)
#2  Content Generation   ✅ (0:08)
#3  SEO Blog             ✅ (0:15)
#4  Social Media         ✅ (0:06)
#5  Challenge            ✅ (0:04)
#6  Community Engagement ✅ (0:05)
#7  Marketplace          ✅ (0:09)
#8  Analytics            ✅ (0:03)
#9  Monetization         ✅ (0:07)
#10 Marketing            ✅ (0:11)
#11 Orchestrator         ✅ (0:02)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Twitter API rate limit at 92% — consider staggering posts
• No trending data from Pixiv — API returned 503 (retry at 23:00)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 PRs Merged
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• #42 feat/aniverse-trend-report-2026-07-24
• #43 feat/aniverse-content-generation-2026-07-24
• #44 feat/aniverse-seo-blog-2026-07-24
• #45 feat/aniverse-social-media-2026-07-24
• #46 feat/aniverse-challenge-2026-07-24
• #47 feat/aniverse-community-2026-07-24
• #48 feat/aniverse-marketplace-2026-07-24
• #49 feat/aniverse-analytics-2026-07-24
• #50 feat/aniverse-monetization-2026-07-24
• #51 feat/aniverse-marketing-2026-07-24

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Next: Tomorrow's chain starts at 00:00 WIB
```

### Telegram Channel

The digest is posted to the **AniVerse Status** Telegram channel (configured via `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` env vars).

---

## Appendix

### A. AGENTS.md Reference

Key rules from `AGENTS.md` that apply to all cron agents:

1. **§1.1** — `git pull --ff-only origin main` before starting
2. **§1.2** — Branch naming: `feat/aniverse-{short-description}`
3. **§1.3** — No direct pushes to `main`
4. **§2.1** — Always create a PR
5. **§2.4** — Squash-merge only
6. **§4.1** — Read diffs of previous agents' PRs before starting
7. **§4.2** — Output structured summary

### B. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `GITHUB_TOKEN` | ✅ | GitHub personal access token (for PR/merge) |
| `TELEGRAM_BOT_TOKEN` | ✅ | Telegram bot for daily digest |
| `TELEGRAM_CHAT_ID` | ✅ | Telegram chat/channel for digest |
| `NEXTAUTH_SECRET` | ✅ | NextAuth encryption secret |
| `STRIPE_SECRET_KEY` | ⬜ | Stripe for payments (if monetization active) |
| `UPLOADTHING_TOKEN` | ⬜ | File upload service |
| `TWITTER_API_KEY` | ⬜ | Twitter/X API |
| `INSTAGRAM_ACCESS_TOKEN` | ⬜ | Instagram Graph API |
| `PIXIV_API_KEY` | ⬜ | Pixiv API |
| `MEDIUM_API_KEY` | ⬜ | Medium integration token |

### C. File Layout

```
aniverse/
├── AGENTS.md              # Agent protocol & conventions
├── .cron/
│   └── git_helper.sh      # Git automation (branch, PR, merge)
├── prisma/
│   └── schema.prisma      # Database schema (20 models)
├── skills/
│   └── devops/
│       └── aniverse-self-improving/
│           └── SKILL.md   # This file
├── src/                   # Next.js application
│   ├── app/               # Pages & routes
│   ├── components/        # UI components
│   ├── generated/         # Prisma generated client
│   └── lib/               # Utilities & constants
└── agents/                # (to create) Agent scripts
    ├── 01-trend-research.sh
    ├── 02-content-generation.sh
    ├── 03-seo-blog.sh
    ├── 04-social-media.sh
    ├── 05-challenge.sh
    ├── 06-community-engagement.sh
    ├── 07-marketplace.sh
    ├── 08-analytics.sh
    ├── 09-monetization.sh
    ├── 10-marketing.sh
    └── 11-orchestrator.sh
```
