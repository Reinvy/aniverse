/**
 * AniVerse — Auth Service Layer
 *
 * Encapsulates User/Auth-related database queries so route handlers stay
 * thin and DB access is centralized (DRY). Login/register/me routes should
 * delegate here instead of touching `prisma` directly.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// ─── Selects (never include the password hash in API payloads) ────

/** Credentials lookup — includes `password` for bcrypt verification ONLY. */
const userCredentialsSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  premiumTier: true,
  avatar: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

/** Public profile payload for /api/auth/me. */
const userProfileSelect = {
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

/** Public shape returned on register (no avatar — not set yet). */
const newUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  premiumTier: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

// ─── Service Methods ──────────────────────────────────────────────

/**
 * Find a user by email including the hashed password (login flow).
 * The caller MUST verify the password with bcrypt and must never
 * serialize `password` into an API response.
 */
export async function findUserWithCredentials(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: userCredentialsSelect,
  });
}

/**
 * Cheap existence check (id-only fetch) used to reject duplicate
 * registrations without pulling the full row.
 */
export async function findExistingUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
}

/**
 * Create a new user with a pre-hashed password and return the public shape.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return prisma.user.create({
    data,
    select: newUserSelect,
  });
}

/**
 * Fetch a user's own profile by id (for /api/auth/me).
 */
export async function findUserProfileById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userProfileSelect,
  });
}
