/**
 * AniVerse — User Service Layer
 *
 * Encapsulates User-related database queries.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// ─── Types ────────────────────────────────────────────────────────

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

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
