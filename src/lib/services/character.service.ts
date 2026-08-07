/**
 * AniVerse — Character Service Layer
 *
 * Encapsulates Character-related database queries
 * for public-facing content (browsing, discovery).
 * DRY: uses shared query-builder utilities.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildOrderBy, buildSearchClause } from "@/lib/query-builder";
import { CHARACTER_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export interface CharacterFilters {
  search?: string;
}

export type CharacterListItem = Prisma.CharacterGetPayload<{
  select: typeof characterListSelect;
}>;

export type CharacterDetail = Prisma.CharacterGetPayload<{
  select: typeof characterDetailSelect;
}>;

// ─── Selects ──────────────────────────────────────────────────────

const characterListSelect = {
  id: true,
  name: true,
  appearanceDesc: true,
  personality: true,
  referenceImages: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  _count: { select: { artworks: true } },
} satisfies Prisma.CharacterSelect;

const characterDetailSelect = {
  id: true,
  name: true,
  appearanceDesc: true,
  personality: true,
  backstory: true,
  referenceImages: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
    },
  },
  _count: { select: { artworks: true } },
} satisfies Prisma.CharacterSelect;

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List public characters with pagination and optional search.
 */
export async function findPublicCharacters(
  pagination: PaginationParams,
  filters?: CharacterFilters,
) {
  const where: Prisma.CharacterWhereInput = {
    isPublic: true,
  };

  // Use shared buildSearchClause for text search
  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "name",
      "personality",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  const orderBy = buildOrderBy(pagination, CHARACTER_SORT_FIELDS, "createdAt");

  const [characters, total] = await Promise.all([
    prisma.character.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: characterListSelect,
    }),
    prisma.character.count({ where }),
  ]);

  return { characters, total };
}

/**
 * Keyset (cursor) pagination over public characters — the scalable deep-page
 * alternative to OFFSET pagination.
 *
 * Same contract as `findPublicArtworksCursor`: walks the index with a range
 * predicate (`sortField < :cursorValue OR (= AND id < :cursorId)`) instead of
 * `OFFSET n LIMIT k`, so page depth stays O(log n). The `+1` lookahead row is
 * used to compute `hasNextPage`/`nextCursor` without a boundary count query.
 *
 * Search filters compose with the keyset predicate via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when `pagination.sort` is
 *                both keyset-safe AND in `CHARACTER_SORT_FIELDS`.
 */
export async function findPublicCharactersCursor(
  pagination: PaginationParams,
  filters?: CharacterFilters,
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.CharacterWhereInput = {
    isPublic: true,
  };

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "name",
      "personality",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  // The route already whitelisted the sort field; fall back to createdAt so
  // the keyset predicate below is always well-formed.
  const sortField = CHARACTER_SORT_FIELDS.includes(
    pagination.sort as (typeof CHARACTER_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "createdAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.CharacterWhereInput = { ...where };

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
  ] as Prisma.CharacterOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.character.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: characterListSelect,
    }),
    prisma.character.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const characters = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { characters, total, hasNextPage };
}

/**
 * Get a single character by ID.
 */
export async function findCharacterById(
  id: string,
): Promise<CharacterDetail | null> {
  return prisma.character.findFirst({
    where: { id, isPublic: true },
    select: characterDetailSelect,
  });
}
