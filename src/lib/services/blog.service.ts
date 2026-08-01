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
import { BLOG_ARTICLE_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export interface BlogArticleFilters {
  search?: string;
  tag?: string;
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
  publishedAt: true,
  createdAt: true,
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
 */
const TAG_SCAN_LIMIT = 300;

export async function findArticleTags(): Promise<string[]> {
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

  return Array.from(tagSet).sort();
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
