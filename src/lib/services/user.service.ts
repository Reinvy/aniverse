/**
 * AniVerse — User Service Layer
 *
 * Encapsulates User-related database queries.
 * DRY: uses shared query-builder utilities.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma, Role, PremiumTier } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildOrderBy, buildSearchClause } from "@/lib/query-builder";
import { USER_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export interface UserFilters {
  search?: string;
  role?: Role;
  premiumTier?: PremiumTier;
}

const userListSelect = {
  id: true,
  name: true,
  username: true,
  avatar: true,
  bio: true,
  role: true,
  premiumTier: true,
  createdAt: true,
  _count: {
    select: {
      artworks: true,
      followers: true,
    },
  },
} satisfies Prisma.UserSelect;

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List users with pagination, search, and optional role/premiumTier filters.
 * Returns safe user data (no sensitive fields) suitable for discovery features.
 */
export async function findUsers(
  pagination: PaginationParams,
  filters?: UserFilters,
) {
  const where: Prisma.UserWhereInput = {};

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "name",
      "username",
      "email",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.premiumTier) {
    where.premiumTier = filters.premiumTier;
  }

  const orderBy = buildOrderBy(pagination, USER_SORT_FIELDS, "createdAt");

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: userListSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

/**
 * Keyset (cursor) pagination over users — the scalable deep-page alternative
 * to OFFSET pagination.
 *
 * Same contract as `findPublicArtworksCursor`: walks the index with a range
 * predicate (`sortField < :cursorValue OR (= AND id < :cursorId)`) instead of
 * `OFFSET n LIMIT k`, so page depth stays O(log n). The `+1` lookahead row is
 * used to compute `hasNextPage`/`nextCursor` without a boundary count query.
 *
 * Search/role/premiumTier filters compose with the keyset predicate via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when `pagination.sort` is
 *                both keyset-safe AND in `USER_SORT_FIELDS`.
 */
export async function findUsersCursor(
  pagination: PaginationParams,
  filters?: UserFilters,
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.UserWhereInput = {};

  if (filters?.search) {
    const searchClause = buildSearchClause(filters.search, [
      "name",
      "username",
      "email",
    ]);
    if (searchClause) {
      where.OR = searchClause;
    }
  }

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.premiumTier) {
    where.premiumTier = filters.premiumTier;
  }

  // The route already whitelisted the sort field; fall back to createdAt so
  // the keyset predicate below is always well-formed.
  const sortField = USER_SORT_FIELDS.includes(
    pagination.sort as (typeof USER_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "createdAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.UserWhereInput = { ...where };

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
  ] as Prisma.UserOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: userListSelect,
    }),
    prisma.user.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const users = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { users, total, hasNextPage };
}
