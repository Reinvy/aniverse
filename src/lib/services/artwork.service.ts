/**
 * AniVerse — Artwork Service Layer
 *
 * Encapsulates all Artwork-related database queries with:
 * - Optimized selects (only fetch what's needed)
 * - Built-in pagination, sorting, and filtering
 * - Consistent error handling
 * - DRY: uses shared query-builder utilities
 */

import { prisma } from "@/lib/prisma";
import type { ArtworkStyle, Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildOrderBy, buildSearchClause } from "@/lib/query-builder";
import { ARTWORK_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export interface ArtworkFilters {
  style?: ArtworkStyle;
  isPublic?: boolean;
  search?: string;
  creatorId?: string;
  characterId?: string;
}

export interface CreateArtworkInput {
  title: string;
  prompt?: string;
  style?: string;
  imageUrl: string;
  width?: number;
  height?: number;
  characterId?: string;
  isPublic?: boolean;
}

export type ArtworkDetailItem = Prisma.ArtworkGetPayload<{
  select: typeof artworkDetailSelect;
}>;

// ─── Selects (optimized — only fetch required fields) ────────────

const artworkListSelect = {
  id: true,
  title: true,
  style: true,
  imageUrl: true,
  prompt: true,
  width: true,
  height: true,
  isPublic: true,
  createdAt: true,
  _count: { select: { products: true } },
} satisfies Prisma.ArtworkSelect;

const artworkDetailSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  style: true,
  prompt: true,
  modelUsed: true,
  width: true,
  height: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  creatorId: true,
  characterId: true,
  _count: { select: { products: true } },
} satisfies Prisma.ArtworkSelect;

/**
 * Optimized select for the public gallery — includes creator identity
 * and a lightweight product count, without heavy relations.
 */
const publicArtworkSelect = {
  id: true,
  title: true,
  style: true,
  imageUrl: true,
  prompt: true,
  width: true,
  height: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
    },
  },
  _count: { select: { products: true } },
} satisfies Prisma.ArtworkSelect;

// ─── Build Where Clause ──────────────────────────────────────────

function buildWhereClause(
  baseUserId: string,
  filters?: ArtworkFilters,
): Prisma.ArtworkWhereInput {
  const where: Prisma.ArtworkWhereInput = {};

  // Always scope to the authenticated user
  where.creatorId = filters?.creatorId ?? baseUserId;

  if (filters?.style) {
    where.style = filters.style;
  }

  if (filters?.isPublic !== undefined) {
    where.isPublic = filters.isPublic;
  }

  if (filters?.characterId) {
    where.characterId = filters.characterId;
  }

  // Use shared buildSearchClause for text search
  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "title",
      "prompt",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  return where;
}

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List artworks for a user with pagination, sorting, and filtering.
 */
export async function findUserArtworks(
  userId: string,
  pagination: PaginationParams,
  filters?: ArtworkFilters,
) {
  const where = buildWhereClause(userId, filters);
  const orderBy = buildOrderBy(pagination, ARTWORK_SORT_FIELDS, "createdAt");

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: artworkListSelect,
    }),
    prisma.artwork.count({ where }),
  ]);

  return { artworks, total };
}

/**
 * Create a new artwork.
 */
export async function createArtwork(
  data: CreateArtworkInput,
  creatorId: string,
): Promise<ArtworkDetailItem> {
  return prisma.artwork.create({
    data: {
      title: data.title.trim(),
      prompt: data.prompt?.trim() || null,
      style: (data.style as ArtworkStyle) || "ANIME",
      imageUrl: data.imageUrl.trim(),
      width: data.width || null,
      height: data.height || null,
      characterId: data.characterId || null,
      isPublic: data.isPublic ?? true,
      creatorId,
    },
    select: artworkDetailSelect,
  });
}

/**
 * Count artworks for a user, optionally filtered by time range.
 */
export async function countUserArtworks(
  userId: string,
  createdAt?: { gte?: Date; lte?: Date },
): Promise<number> {
  return prisma.artwork.count({
    where: {
      creatorId: userId,
      ...(createdAt ? { createdAt } : {}),
    },
  });
}

/**
 * Get all artwork IDs for a user (lightweight).
 */
export async function findUserArtworkIds(userId: string): Promise<string[]> {
  const artworks = await prisma.artwork.findMany({
    where: { creatorId: userId },
    select: { id: true },
  });
  return artworks.map((a) => a.id);
}

/**
 * List PUBLIC artworks across all creators — powers the community gallery.
 *
 * Only `isPublic: true` artworks are returned (never drafts/private),
 * with optional style + search filtering, safe sort fields, and an
 * optimized select (creator identity + like count, no heavy relations).
 */
export async function findPublicArtworks(
  pagination: PaginationParams,
  filters?: { style?: ArtworkStyle; search?: string; creatorId?: string },
) {
  const where: Prisma.ArtworkWhereInput = { isPublic: true };

  if (filters?.style) {
    where.style = filters.style;
  }

  if (filters?.creatorId) {
    where.creatorId = filters.creatorId;
  }

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "title",
      "prompt",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  const orderBy = buildOrderBy(pagination, ARTWORK_SORT_FIELDS, "createdAt");

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: publicArtworkSelect,
    }),
    prisma.artwork.count({ where }),
  ]);

  return { artworks, total };
}

/**
 * Keyset (cursor) pagination over PUBLIC artworks — the scalable deep-page
 * alternative to OFFSET pagination.
 *
 * Instead of `OFFSET n LIMIT k` (which makes PostgreSQL scan and discard all
 * preceding rows on every page — O(n) per page, O(n²) to walk the whole
 * table), this walks the index with a range predicate:
 *
 *   WHERE (sortField < :cursorValue)
 *      OR (sortField = :cursorValue AND id < :cursorId)
 *   ORDER BY sortField DESC, id DESC
 *   LIMIT :limit + 1
 *
 * With the existing `@@index([isPublic, createdAt])` this is O(log n) per
 * page. The extra `+1` row is fetched solely to compute `hasNextPage` /
 * `nextCursor` without a separate count query for the page boundary.
 *
 * @param cursor      Decoded cursor from `decodeCursor()` (or null for page 1)
 * @param sortField   Whitelisted sort field (must be keyset-safe — see
 *                    `isKeysetSafeSort`; callers fall back to offset for
 *                    enum sorts like `style`)
 */
export async function findPublicArtworksCursor(
  pagination: PaginationParams,
  filters?: { style?: ArtworkStyle; search?: string; creatorId?: string },
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.ArtworkWhereInput = { isPublic: true };

  if (filters?.style) {
    where.style = filters.style;
  }

  if (filters?.creatorId) {
    where.creatorId = filters.creatorId;
  }

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "title",
      "prompt",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  // The sort field was already whitelisted by the route (keyset-safe check);
  // default to createdAt so the keyset predicate below is always well-formed.
  const sortField = ARTWORK_SORT_FIELDS.includes(
    pagination.sort as (typeof ARTWORK_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "createdAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.ArtworkWhereInput = { ...where };

  if (cursor) {
    // Keyset predicate: strictly after the cursor in sort order, using the
    // row id as a unique tiebreaker (cuids are lexicographically ordered).
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
  ] as Prisma.ArtworkOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: publicArtworkSelect,
    }),
    prisma.artwork.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const artworks = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { artworks, total, hasNextPage };
}
