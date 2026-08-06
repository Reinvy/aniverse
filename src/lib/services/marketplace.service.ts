/**
 * AniVerse — Marketplace Service Layer
 *
 * Encapsulates all Product/Order queries for the public marketplace:
 * - Listing query (pagination, search, price sorting) with optimized selects
 * - Aggregate stat-bar stats (total listings, active creators, avg price,
 *   total sales) — TTL-cached so the expensive groupBy/aggregate queries run
 *   at most once per minute instead of on every catalog request.
 *
 * DRY: uses the shared query-builder utilities and ttl-cache.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildSearchClause } from "@/lib/query-builder";
import { createTtlCache } from "@/lib/ttl-cache";

// ─── Types ────────────────────────────────────────────────────────

export interface MarketplaceFilters {
  search?: string;
  /** "newest" | "price-asc" | "price-desc" */
  sort?: string;
}

export interface MarketplaceStats {
  totalListings: number;
  activeCreators: number;
  avgPrice: number;
  totalSales: number;
}

export type MarketplaceProductItem = Prisma.ProductGetPayload<{
  select: typeof productListSelect;
}>;

// ─── Selects (optimized — only fetch required fields) ────────────

const productListSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
    },
  },
  artwork: {
    select: {
      id: true,
      title: true,
      imageUrl: true,
      style: true,
    },
  },
} satisfies Prisma.ProductSelect;

// ─── Listing Query ────────────────────────────────────────────────

/**
 * List ACTIVE marketplace products with pagination, free-text search, and
 * price sorting. Returns `{ products, total }`.
 */
export async function findMarketplaceProducts(
  pagination: PaginationParams,
  filters?: MarketplaceFilters,
): Promise<{ products: MarketplaceProductItem[]; total: number }> {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "name",
      "description",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };
  if (filters?.sort === "price-asc") orderBy = { price: "asc" };
  if (filters?.sort === "price-desc") orderBy = { price: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: productListSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

// ─── Aggregate Stats (TTL-cached) ─────────────────────────────────

/**
 * The four aggregate stat-bar queries are global (unfiltered) and only change
 * when products/orders change, so caching them for 60s removes 4 DB queries
 * from every catalog request while staying fresh enough for a stat bar.
 */
const statsCache = createTtlCache<MarketplaceStats>(60_000);
const STATS_CACHE_KEY = "global";

async function computeMarketplaceStats(): Promise<MarketplaceStats> {
  const [totalListings, creatorGroups, priceAgg, salesAgg] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.groupBy({
        by: ["creatorId"],
        where: { isActive: true },
        _count: { _all: true },
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _avg: { price: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "COMPLETED"] } },
        _sum: { total: true },
      }),
    ]);

  return {
    totalListings,
    activeCreators: creatorGroups.length,
    avgPrice: priceAgg._avg.price ? Number(priceAgg._avg.price) : 0,
    totalSales: salesAgg._sum.total ? Number(salesAgg._sum.total) : 0,
  };
}

/**
 * Get marketplace aggregate stats, serving from the in-memory TTL cache when
 * warm. Returns a fresh copy so callers can't mutate the cached object.
 */
export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  const cached = statsCache.get(STATS_CACHE_KEY);
  if (cached) return { ...cached };

  const stats = await computeMarketplaceStats();
  statsCache.set(STATS_CACHE_KEY, stats);
  return { ...stats };
}
