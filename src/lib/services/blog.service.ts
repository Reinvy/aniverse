/**
 * AniVerse — Blog Article Service Layer
 *
 * Encapsulates all BlogArticle-related database queries with:
 * - Optimized selects
 * - Built-in pagination
 * - Consistent error handling
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";

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
 * List published blog articles with pagination.
 */
export async function findPublishedArticles(
  pagination: PaginationParams,
  filters?: BlogArticleFilters,
) {
  const where: Prisma.BlogArticleWhereInput = {
    isPublished: true,
    publishedAt: { lte: new Date() },
  };

  if (filters?.search) {
    const q = filters.search.trim();
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  if (filters?.tag) {
    where.tags = { has: filters.tag };
  }

  const allowedSortFields = ["publishedAt", "title", "createdAt"];
  const sortField = allowedSortFields.includes(pagination.sort)
    ? pagination.sort
    : "publishedAt";

  const orderBy: Prisma.BlogArticleOrderByWithRelationInput = {
    [sortField]: pagination.order,
  };

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
 */
export async function findArticleTags(): Promise<string[]> {
  const articles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}
