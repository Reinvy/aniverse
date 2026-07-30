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

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

export interface UserFilters {
  search?: string;
  role?: Role;
  premiumTier?: PremiumTier;
}

// Always select non-sensitive fields
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  premiumTier: true,
  username: true,
  bio: true,
  avatar: true,
  coinBalance: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

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
 * Find a user by ID with safe fields (no password).
 */
export async function findUserById(
  userId: string,
): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect,
  });
}

/**
 * Find a user by email with safe fields.
 */
export async function findUserByEmail(
  email: string,
): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: safeUserSelect,
  });
}

/**
 * Check if an email is already registered.
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true },
  });
  return user !== null;
}

/**
 * Get user counts (followers, following, artworks, likes).
 */
export async function getUserCounts(userId: string): Promise<{
  artworks: number;
  followers: number;
  following: number;
  likes: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: {
          artworks: true,
          followers: true,
          following: true,
          likes: true,
        },
      },
    },
  });

  if (!user) {
    return { artworks: 0, followers: 0, following: 0, likes: 0 };
  }

  return {
    artworks: user._count.artworks,
    followers: user._count.followers,
    following: user._count.following,
    likes: user._count.likes,
  };
}

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
