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
import { buildSearchClause, applyKeysetWhere, buildKeysetOrderBy } from "@/lib/query-builder";
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

// ─── Sort Resolution ──────────────────────────────────────────────

/**
 * Resolve the marketplace `sort` query token to a (sortField, order) pair.
 *
 *   "newest"     → createdAt DESC (default)
 *   "price-asc"  → price ASC
 *   "price-desc" → price DESC
 *
 * Both `createdAt` and `price` are keyset-safe (DateTime/Decimal columns
 * accept range predicates with string cursor values), so cursor pagination
 * works for every marketplace sort.
 */
export function resolveMarketplaceSort(sort?: string): {
  sortField: "createdAt" | "price";
  order: "asc" | "desc";
} {
  if (sort === "price-asc") return { sortField: "price", order: "asc" };
  if (sort === "price-desc") return { sortField: "price", order: "desc" };
  return { sortField: "createdAt", order: "desc" };
}

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

  const { sortField, order } = resolveMarketplaceSort(filters?.sort);
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortField]: order,
  };

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

/**
 * Keyset (cursor) pagination over ACTIVE marketplace products — the scalable
 * deep-page alternative to OFFSET pagination.
 *
 * Same contract as the other cursor services (`findPublicArtworksCursor`,
 * `findUsersCursor`, ...): walks the index with a range predicate
 * (`sortField < :cursorValue OR (= AND id < :cursorId)`) instead of
 * `OFFSET n LIMIT k`, so page depth stays O(log n). The `+1` lookahead row is
 * used to compute `hasNextPage`/`nextCursor` without a boundary count query.
 *
 * Works for every marketplace sort token — `newest` drives a `createdAt`
 * keyset, `price-asc`/`price-desc` drive a `price` keyset (Decimal columns
 * accept string cursor values like "12.99"). Search composes via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when the resolved sort is
 *                keyset-safe (always true here: createdAt | price).
 */
export async function findMarketplaceProductsCursor(
  pagination: PaginationParams,
  filters?: MarketplaceFilters,
  cursor?: { sortValue: string; id: string } | null,
): Promise<{
  products: MarketplaceProductItem[];
  total: number;
  hasNextPage: boolean;
}> {
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

  const { sortField, order } = resolveMarketplaceSort(filters?.sort);

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.ProductWhereInput = { ...where };

  // Keyset predicate + array orderBy (see query-builder helpers). Both
  // marketplace sorts (createdAt / price) are keyset-safe.
  applyKeysetWhere(where, cursor, sortField, order);
  const orderBy = buildKeysetOrderBy<Prisma.ProductOrderByWithRelationInput>(
    sortField,
    order,
  );

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: productListSelect,
    }),
    prisma.product.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const products = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { products, total, hasNextPage };
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
