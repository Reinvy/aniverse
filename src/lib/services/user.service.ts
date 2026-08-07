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
