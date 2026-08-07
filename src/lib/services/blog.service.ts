/**
 * AniVerse — Blog Article Service Layer
 *
 * Encapsulates all BlogArticle-related database queries with:
 * - Optimized selects
 * - Built-in pagination and filtering
 * - DRY: uses shared query-builder utilities
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildOrderBy, buildSearchClause } from "@/lib/query-builder";
import { createTtlCache } from "@/lib/ttl-cache";
import { BLOG_ARTICLE_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export interface BlogArticleFilters {
  search?: string;
  tag?: string;
  featured?: boolean;
}

export type BlogArticleListItem = Prisma.BlogArticleGetPayload<{
  select: typeof blogListSelect;
}>;

export type BlogArticleDetail = Prisma.BlogArticleGetPayload<{
  select: typeof blogDetailSelect;
}>;

// ─── Selects (optimized — only fetch required fields) ────────────

const blogListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  tags: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
} satisfies Prisma.BlogArticleSelect;

const blogDetailSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  coverImage: true,
  tags: true,
  seoTitle: true,
  seoDesc: true,
  isPublished: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
    },
  },
} satisfies Prisma.BlogArticleSelect;

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List published blog articles with pagination and optional filtering.
 */
export async function findPublishedArticles(
  pagination: PaginationParams,
  filters?: BlogArticleFilters,
) {
  const where: Prisma.BlogArticleWhereInput = {
    isPublished: true,
    publishedAt: { lte: new Date() },
  };

  // Use shared buildSearchClause for text search
  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "title",
      "excerpt",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  if (filters?.tag) {
    where.tags = { has: filters.tag };
  }

  if (filters?.featured !== undefined) {
    where.featured = filters.featured;
  }

  const orderBy = buildOrderBy(pagination, BLOG_ARTICLE_SORT_FIELDS, "publishedAt");

  const [articles, total] = await Promise.all([
    prisma.blogArticle.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: blogListSelect,
    }),
    prisma.blogArticle.count({ where }),
  ]);

  return { articles, total };
}

/**
 * Keyset (cursor) pagination over published blog articles — the scalable
 * deep-page alternative to OFFSET pagination.
 *
 * Same contract as `findPublicArtworksCursor`: walks the index with a range
 * predicate (`sortField < :cursorValue OR (= AND id < :cursorId)`) instead of
 * `OFFSET n LIMIT k`, so page depth stays O(log n). The `+1` lookahead row is
 * used to compute `hasNextPage`/`nextCursor` without a boundary count query.
 *
 * Filters (search/tag/featured) compose with the keyset predicate via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when `pagination.sort` is
 *                both keyset-safe AND in `BLOG_ARTICLE_SORT_FIELDS`.
 */
export async function findPublishedArticlesCursor(
  pagination: PaginationParams,
  filters?: BlogArticleFilters,
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.BlogArticleWhereInput = {
    isPublished: true,
    publishedAt: { lte: new Date() },
  };

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "title",
      "excerpt",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  if (filters?.tag) {
    where.tags = { has: filters.tag };
  }

  if (filters?.featured !== undefined) {
    where.featured = filters.featured;
  }

  // The route already whitelisted the sort field; fall back to publishedAt so
  // the keyset predicate below is always well-formed.
  const sortField = BLOG_ARTICLE_SORT_FIELDS.includes(
    pagination.sort as (typeof BLOG_ARTICLE_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "publishedAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.BlogArticleWhereInput = { ...where };

  if (cursor) {
    const cmp = pagination.order === "desc" ? "lt" : "gt";
    where.AND = [
      {
        OR: [
          { [sortField]: { [cmp]: cursor.sortValue } },
          { [sortField]: cursor.sortValue, id: { [cmp]: cursor.id } },
        ],
      },
    ];
  }

  // Prisma 7 requires ARRAY form for multi-field orderBy (a two-key object
  // passes typecheck but fails runtime validation). Cast is intentional: the
  // generated types accept the single-object form that Prisma rejects at
  // runtime — the array form is the only shape that actually works.
  const orderBy = [
    { [sortField]: pagination.order },
    { id: pagination.order },
  ] as Prisma.BlogArticleOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.blogArticle.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: blogListSelect,
    }),
    prisma.blogArticle.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const articles = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { articles, total, hasNextPage };
}

/**
 * Get a single published article by slug.
 */
export async function findArticleBySlug(
  slug: string,
): Promise<BlogArticleDetail | null> {
  return prisma.blogArticle.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    select: blogDetailSelect,
  });
}

/**
 * Get all unique tags from published articles.
 *
 * Optimized: only the `tags` column is fetched, the scan is bounded to the
 * most recent `TAG_SCAN_LIMIT` articles, and rows are ordered newest-first.
 * Tag vocabulary is stable over time, so sampling recent articles keeps the
 * query O(recent) as the blog table grows instead of O(all rows).
 *
 * The result is TTL-cached (60s) because the tag vocabulary only changes when
 * an article is published/edited — a 300-row scan per blog-list request is
 * pure waste on a read-heavy public endpoint. The cache is keyed globally
 * (tags are not user-specific).
 */
const TAG_SCAN_LIMIT = 300;

const tagsCache = createTtlCache<string[]>(60_000);
const TAGS_CACHE_KEY = "global";

export async function findArticleTags(): Promise<string[]> {
  const cached = tagsCache.get(TAGS_CACHE_KEY);
  if (cached) return cached;

  const articles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    select: { tags: true },
    orderBy: { publishedAt: "desc" },
    take: TAG_SCAN_LIMIT,
  });

  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagSet.add(tag);
    }
  }

  const tags = Array.from(tagSet).sort();
  tagsCache.set(TAGS_CACHE_KEY, tags);
  return tags;
}

/**
 * Get the single latest featured published article (curated hero for the
 * blog landing page). Returns null when no featured article exists yet.
 *
 * TTL-cached (60s): the featured hero only changes when an admin edits which
 * article is featured, so caching for a minute is imperceptible to users but
 * removes a DB query from every unfiltered blog-list request.
 */
const featuredCache = createTtlCache<BlogArticleListItem | null>(60_000);
const FEATURED_CACHE_KEY = "global";

export async function findFeaturedArticle(): Promise<BlogArticleListItem | null> {
  const cached = featuredCache.get(FEATURED_CACHE_KEY);
  if (cached !== undefined) return cached;

  const article = await prisma.blogArticle.findFirst({
    where: {
      isPublished: true,
      featured: true,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    select: blogListSelect,
  });

  featuredCache.set(FEATURED_CACHE_KEY, article);
  return article;
}

/**
 * Find related published articles that share at least one tag with the
 * given article, ordered by tag overlap (most related first), then recency.
 * Excludes the article itself. Returns at most `limit` results.
 */
export async function findRelatedArticles(
  slug: string,
  tags: string[],
  limit = 3,
): Promise<BlogArticleListItem[]> {
  if (tags.length === 0) return [];

  const where: Prisma.BlogArticleWhereInput = {
    isPublished: true,
    publishedAt: { lte: new Date() },
    slug: { not: slug },
    OR: tags.map((tag) => ({ tags: { has: tag } })),
  };

  return prisma.blogArticle.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }],
    take: limit,
    select: blogListSelect,
  });
}
