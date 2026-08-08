/**
 * AniVerse — Challenge Service Layer
 *
 * Encapsulates all Challenge-related database queries.
 * DRY: uses shared query-builder utilities.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";
import { buildOrderBy } from "@/lib/query-builder";
import { createTtlCache } from "@/lib/ttl-cache";
import { CHALLENGE_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export type ChallengeDetail = Prisma.ChallengeGetPayload<{
  select: typeof challengeDetailSelect;
}>;

// ─── Selects ──────────────────────────────────────────────────────

const challengeListSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  status: true,
  startsAt: true,
  endsAt: true,
  rewardCoins: true,
  prompt: true,
  createdAt: true,
  _count: { select: { submissions: true } },
} satisfies Prisma.ChallengeSelect;

const challengeDetailSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  status: true,
  startsAt: true,
  endsAt: true,
  rewardCoins: true,
  prompt: true,
  requirements: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { submissions: true } },
} satisfies Prisma.ChallengeSelect;

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List active challenges with pagination.
 *
 * @param type Optional ChallengeType filter ("DAILY" | "WEEKLY"). When set,
 *   only challenges of that type are returned.
 */
export async function findActiveChallenges(
  pagination: PaginationParams,
  type?: "DAILY" | "WEEKLY",
) {
  const where: Prisma.ChallengeWhereInput = {
    status: "ACTIVE",
    startsAt: { lte: new Date() },
    endsAt: { gte: new Date() },
    ...(type ? { type } : {}),
  };

  const orderBy = buildOrderBy(pagination, CHALLENGE_SORT_FIELDS, "endsAt");

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: challengeListSelect,
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total };
}

/**
 * Get a single challenge by ID.
 */
export async function findChallengeById(
  id: string,
): Promise<ChallengeDetail | null> {
  return prisma.challenge.findUnique({
    where: { id },
    select: challengeDetailSelect,
  });
}

/**
 * Get the current active challenge (DAILY first, then WEEKLY as fallback).
 *
 * "Current" = the most recently started challenge whose window is live right
 * now (`startsAt <= now <= endsAt`). Daily challenges are preferred so the
 * homepage/hero can always surface today's prompt; if no daily is live, the
 * most recent weekly is returned. Returns null when nothing is active.
 *
 * TTL-cached (60s): the active challenge only changes on a daily/weekly
 * cadence, so caching for a minute is imperceptible but removes up to two DB
 * queries from every homepage / challenges-current request.
 */
const currentChallengeCache = createTtlCache<ChallengeDetail | null>(60_000);
const CURRENT_CHALLENGE_CACHE_KEY = "global";

export async function findCurrentChallenge(): Promise<ChallengeDetail | null> {
  const cached = currentChallengeCache.get(CURRENT_CHALLENGE_CACHE_KEY);
  if (cached !== undefined) return cached;

  const now = new Date();
  const where: Prisma.ChallengeWhereInput = {
    status: "ACTIVE",
    startsAt: { lte: now },
    endsAt: { gte: now },
  };

  const daily = await prisma.challenge.findFirst({
    where: { ...where, type: "DAILY" },
    orderBy: { startsAt: "desc" },
    select: challengeDetailSelect,
  });
  const challenge = daily ?? (await prisma.challenge.findFirst({
    where: { ...where, type: "WEEKLY" },
    orderBy: { startsAt: "desc" },
    select: challengeDetailSelect,
  }));

  currentChallengeCache.set(CURRENT_CHALLENGE_CACHE_KEY, challenge);
  return challenge;
}

/**
 * List all challenges (including past) with pagination.
 *
 * @param type Optional ChallengeType filter ("DAILY" | "WEEKLY"). When set,
 *   only challenges of that type are returned.
 */
export async function findAllChallenges(
  pagination: PaginationParams,
  type?: "DAILY" | "WEEKLY",
) {
  const where: Prisma.ChallengeWhereInput = type ? { type } : {};
  const orderBy = buildOrderBy(pagination, CHALLENGE_SORT_FIELDS, "startsAt");

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: challengeListSelect,
    }),
    prisma.challenge.count({ where }),
  ]);

  return { challenges, total };
}

// ─── Keyset (Cursor) Pagination ───────────────────────────────────

/**
 * Keyset (cursor) pagination over ACTIVE challenges — the scalable deep-page
 * alternative to OFFSET pagination.
 *
 * Same contract as the other cursor services: walks the index with a range
 * predicate (`sortField < :cursorValue OR (= AND id < :cursorId)`) instead of
 * `OFFSET n LIMIT k`, so page depth stays O(log n). The `+1` lookahead row is
 * used to compute `hasNextPage`/`nextCursor` without a boundary count query.
 *
 * Keyset-safe sort fields for challenges: `createdAt`, `startsAt`, `endsAt`
 * (DateTime) and `title` (String) — all accept range predicates with string
 * cursor values. Enum sorts (`type`, `status`) and `rewardCoins` (Int) are
 * NOT keyset-safe: the route must fall back to offset pagination for them.
 * The active-window filter (`status`/`startsAt`/`endsAt` bounds) composes
 * with the keyset predicate via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when `pagination.sort` is
 *                both keyset-safe AND in `CHALLENGE_SORT_FIELDS`.
 */
export async function findActiveChallengesCursor(
  pagination: PaginationParams,
  type?: "DAILY" | "WEEKLY",
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.ChallengeWhereInput = {
    status: "ACTIVE",
    startsAt: { lte: new Date() },
    endsAt: { gte: new Date() },
    ...(type ? { type } : {}),
  };

  // The route already whitelisted the sort field; fall back to endsAt so the
  // keyset predicate below is always well-formed.
  const sortField = CHALLENGE_SORT_FIELDS.includes(
    pagination.sort as (typeof CHALLENGE_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "endsAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.ChallengeWhereInput = { ...where };

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
  ] as Prisma.ChallengeOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: challengeListSelect,
    }),
    prisma.challenge.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const challenges = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { challenges, total, hasNextPage };
}

/**
 * Keyset (cursor) pagination over ALL challenges (including past) — the
 * scalable deep-page alternative to OFFSET pagination.
 *
 * Same keyset contract as `findActiveChallengesCursor`. The optional `type`
 * filter composes with the keyset predicate via AND.
 *
 * @param cursor  Decoded cursor from `decodeCursor()` (or null for page 1).
 *                The route must only pass a cursor when `pagination.sort` is
 *                both keyset-safe AND in `CHALLENGE_SORT_FIELDS`.
 */
export async function findAllChallengesCursor(
  pagination: PaginationParams,
  type?: "DAILY" | "WEEKLY",
  cursor?: { sortValue: string; id: string } | null,
) {
  const where: Prisma.ChallengeWhereInput = type ? { type } : {};

  const sortField = CHALLENGE_SORT_FIELDS.includes(
    pagination.sort as (typeof CHALLENGE_SORT_FIELDS)[number],
  )
    ? pagination.sort
    : "startsAt";

  // Count against the base filters only (no keyset predicate).
  const baseWhere: Prisma.ChallengeWhereInput = { ...where };

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

  // Prisma 7 requires ARRAY form for multi-field orderBy (see above).
  const orderBy = [
    { [sortField]: pagination.order },
    { id: pagination.order },
  ] as Prisma.ChallengeOrderByWithRelationInput[];

  // Fetch one extra row to detect whether another page exists.
  const [rows, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      select: challengeListSelect,
    }),
    prisma.challenge.count({ where: baseWhere }),
  ]);

  const hasNextPage = rows.length > pagination.limit;
  const challenges = hasNextPage ? rows.slice(0, pagination.limit) : rows;

  return { challenges, total, hasNextPage };
}
