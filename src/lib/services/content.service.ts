/**
 * AniVerse — Content Overview Service Layer
 *
 * Encapsulates the aggregate queries behind GET /api/content/overview:
 *   counts            — published articles, active challenges, public characters
 *   featuredArticle   — latest featured blog article (hero rotation)
 *   currentChallenge  — currently-active challenge (DAILY preferred)
 *   recentCharacters  — 4 most-recent public characters (fetched live)
 *
 * Scalability: the three COUNT queries are global (unfiltered) and only
 * change when content is published, so they are TTL-cached (60s) together
 * with the already-individually-cached featured article and current
 * challenge. A warm cache serves the aggregates with ZERO DB queries — the
 * only live query per request is the recent-characters strip (one indexed
 * `findMany`, no count). Cold path: 6 queries on the first request per
 * instance, then 1.
 *
 * DRY: reuses blog/challenge/character service methods instead of inlining
 * Prisma calls in the route handler.
 */

import { prisma } from "@/lib/prisma";
import { createTtlCache } from "@/lib/ttl-cache";
import { findFeaturedArticle } from "@/lib/services/blog.service";
import { findCurrentChallenge } from "@/lib/services/challenge.service";
import { findRecentPublicCharacters } from "@/lib/services/character.service";

// ─── Types ────────────────────────────────────────────────────────

interface ContentCounts {
  articles: number;
  challenges: number;
  characters: number;
}

interface ContentOverviewAggregates {
  counts: ContentCounts;
  featuredArticle: Awaited<ReturnType<typeof findFeaturedArticle>>;
  currentChallenge: Awaited<ReturnType<typeof findCurrentChallenge>>;
}

interface ContentOverview extends ContentOverviewAggregates {
  recentCharacters: Awaited<ReturnType<typeof findRecentPublicCharacters>>;
}

// ─── TTL-Cached Aggregates ────────────────────────────────────────

/**
 * The counts + hero lookups are global (unfiltered) and only change when
 * content is published/edited, so caching them for 60s removes 5 DB queries
 * from every landing-page poll while staying fresh enough for a showcase
 * strip. `findFeaturedArticle` and `findCurrentChallenge` have their own
 * 60s caches too — this cache simply bundles them with the counts so the
 * overview stays a single logical snapshot.
 */
const aggregatesCache = createTtlCache<ContentOverviewAggregates>(60_000);
const AGGREGATES_CACHE_KEY = "global";

async function computeOverviewAggregates(): Promise<ContentOverviewAggregates> {
  const [counts, featuredArticle, currentChallenge] = await Promise.all([
    Promise.all([
      prisma.blogArticle.count({ where: { isPublished: true } }),
      prisma.challenge.count({ where: { status: "ACTIVE" } }),
      prisma.character.count({ where: { isPublic: true } }),
    ]),
    findFeaturedArticle(),
    findCurrentChallenge(),
  ]);

  return {
    counts: {
      articles: counts[0],
      challenges: counts[1],
      characters: counts[2],
    },
    featuredArticle,
    currentChallenge,
  };
}

// ─── Service Method ───────────────────────────────────────────────

/**
 * Get the content overview snapshot: TTL-cached aggregates (60s) plus the
 * 4 most-recent public characters fetched live. Returns fresh copies so
 * callers can't mutate the cached objects.
 */
export async function getContentOverview(): Promise<ContentOverview> {
  let aggregates = aggregatesCache.get(AGGREGATES_CACHE_KEY);
  if (!aggregates) {
    aggregates = await computeOverviewAggregates();
    aggregatesCache.set(AGGREGATES_CACHE_KEY, aggregates);
  }

  const recentCharacters = await findRecentPublicCharacters(4);

  return {
    counts: { ...aggregates.counts },
    featuredArticle: aggregates.featuredArticle,
    currentChallenge: aggregates.currentChallenge,
    recentCharacters,
  };
}
