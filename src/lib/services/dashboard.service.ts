/**
 * AniVerse — Dashboard Service Layer
 *
 * Encapsulates all dashboard stats and activity feed queries.
 * Extracted from the route handler to keep routes thin and testable.
 */

import { prisma } from "@/lib/prisma";
import { TIERS } from "@/lib/constants";
import { createTtlCache } from "@/lib/ttl-cache";
import { countUserArtworks, findUserArtworkIds } from "@/lib/services/artwork.service";

// ─── Types ────────────────────────────────────────────────────────

interface DashboardStats {
  generationsUsed: number;
  generationLimit: number | string;
  generationsLeft: number;
  usagePercent: number;
  totalArtworks: number;
  totalLikes: number;
  likesReceived: number;
  totalFollowers: number;
  totalFollowing: number;
  totalEarnings: number;
  coinBalance: number;
  daysUntilReset: number;
  tier: string;
  isUnlimited: boolean;
}

interface ActivityItem {
  type: string;
  action: string;
  detail: string;
  time: string;
}

interface DashboardResult {
  stats: DashboardStats;
  activity: ActivityItem[];
  user: { name: string | null; email: string | null; role: string };
}

// ─── Per-user TTL cache ───────────────────────────────────────────

/**
 * The dashboard stats endpoint aggregates 5-6 DB queries per request
 * (user + _count, monthly generations, earnings sum, artwork ids, likes
 * received, and a 3-query activity feed). On a read-heavy dashboard that
 * cost is paid on every navigation — even when the HTTP layer 304s, each
 * serverless instance still re-runs the queries on every cache miss.
 *
 * A short per-user in-memory TTL (30s) collapses repeated visits into ONE
 * computed payload per user per window. Freshness is preserved by
 * {@link invalidateDashboardStats}, which mutation routes (artwork
 * create/delete) call so counts reflect new activity immediately.
 *
 * NOTE: per-instance cache (see ttl-cache docs) — a scalability win for
 * read-heavy repeat traffic, not a cross-instance store.
 */
const DASHBOARD_STATS_TTL_MS = 30_000;
const dashboardStatsCache = createTtlCache<DashboardResult>(
  DASHBOARD_STATS_TTL_MS,
);

/**
 * Drop the cached dashboard payload for a user after a mutation that
 * changes their counts (e.g. artwork created/deleted). Safe to call
 * unconditionally — deleting a missing key is a no-op.
 */
export function invalidateDashboardStats(userId: string): void {
  dashboardStatsCache.delete(userId);
}

// ─── Service Methods ──────────────────────────────────────────────

/**
 * Get all dashboard stats for a user.
 *
 * Results are TTL-cached per user (30s) — see {@link dashboardStatsCache}.
 * Mutation routes must call {@link invalidateDashboardStats} after
 * create/delete so the cached counts don't go stale.
 */
export async function getDashboardStats(userId: string): Promise<DashboardResult> {
  const cached = dashboardStatsCache.get(userId);
  if (cached) return cached;

  const result = await computeDashboardStats(userId);
  dashboardStatsCache.set(userId, result);
  return result;
}

/**
 * Compute dashboard stats from the database (uncached).
 *
 * Extracted so the TTL wrapper above stays a one-liner; all query work
 * lives here. 5-6 queries per call, batched into two parallel groups.
 */
async function computeDashboardStats(userId: string): Promise<DashboardResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      premiumTier: true,
      coinBalance: true,
      _count: {
        select: {
          artworks: true,
          likes: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // ── Generation stats ──
  const tierKey = user.premiumTier as keyof typeof TIERS;
  const tierConfig = TIERS[tierKey] || TIERS.FREE;
  const generationLimit =
    tierConfig.credits === "Unlimited" ? Infinity : Number(tierConfig.credits) || 10;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ── Parallel batch #1: independent aggregations ──
  // These queries only depend on `userId`, so they can run concurrently
  // instead of serially (3 round trips → 1).
  const [generationsThisMonth, earningsAgg, artworkIds] = await Promise.all([
    countUserArtworks(userId, {
      gte: firstOfMonth,
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        status: "COMPLETED",
        type: { in: ["PURCHASE", "DEPOSIT", "COMMISSION"] },
      },
      _sum: { amount: true },
    }),
    findUserArtworkIds(userId),
  ]);

  const generationsUsed = generationsThisMonth;
  const generationsLeft = Math.max(0, generationLimit - generationsUsed);
  const usagePercent =
    generationLimit === Infinity
      ? 0
      : Math.min(100, Math.round((generationsUsed / generationLimit) * 100));

  // ── Earnings ──
  const totalEarnings = Number(earningsAgg._sum.amount ?? 0);

  // ── Likes received + activity feed (parallel batch #2) ──
  // Both depend only on `artworkIds` from batch #1 — running them
  // concurrently instead of serially saves a round trip per request.
  const [likesReceived, activity] = await Promise.all([
    artworkIds.length > 0
      ? prisma.like.count({
          where: {
            targetType: "Artwork",
            targetId: { in: artworkIds },
          },
        })
      : Promise.resolve(0),
    buildActivityFeed(userId, artworkIds),
  ]);

  // ── Days until reset ──
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilReset = Math.ceil(
    (lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const stats: DashboardStats = {
    generationsUsed,
    generationLimit:
      generationLimit === Infinity ? "Unlimited" : generationLimit,
    generationsLeft,
    usagePercent,
    totalArtworks: user._count.artworks,
    totalLikes: user._count.likes,
    likesReceived,
    totalFollowers: user._count.followers,
    totalFollowing: user._count.following,
    totalEarnings,
    coinBalance: user.coinBalance,
    daysUntilReset: generationLimit === Infinity ? 0 : daysUntilReset,
    tier: user.premiumTier,
    isUnlimited: generationLimit === Infinity,
  };

  return {
    stats,
    activity: activity.slice(0, 10),
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Build the activity feed from recent artworks, likes, and comments.
 */
async function buildActivityFeed(
  userId: string,
  artworkIds: string[],
): Promise<ActivityItem[]> {
  const feed: ActivityItem[] = [];

  // ── Parallel: recent artworks, likes, and comments ──
  // All three only depend on (userId, artworkIds) and are independent,
  // so they run concurrently (3 sequential round trips → 1).
  const [recentArtworks, recentLikes, recentComments] = await Promise.all([
    prisma.artwork.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    }),
    artworkIds.length > 0
      ? prisma.like.findMany({
          where: {
            targetType: "Artwork",
            targetId: { in: artworkIds },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            createdAt: true,
            user: { select: { name: true } },
            targetId: true,
          },
        })
      : Promise.resolve([]),
    prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        content: true,
        createdAt: true,
        targetType: true,
      },
    }),
  ]);

  for (const art of recentArtworks) {
    feed.push({
      type: "create",
      action: "Created artwork",
      detail: art.title,
      time: art.createdAt.toISOString(),
    });
  }

  // Recent likes
  for (const like of recentLikes) {
    feed.push({
      type: "like",
      action: "Liked your artwork",
      detail: `by ${like.user?.name ?? "someone"}`,
      time: like.createdAt.toISOString(),
    });
  }

  // Recent comments by user
  for (const comment of recentComments) {
    feed.push({
      type: "comment",
      action: `Commented on ${comment.targetType}`,
      detail:
        comment.content.length > 60
          ? comment.content.slice(0, 60) + "..."
          : comment.content,
      time: comment.createdAt.toISOString(),
    });
  }

  // Sort by time descending
  feed.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  return feed;
}
