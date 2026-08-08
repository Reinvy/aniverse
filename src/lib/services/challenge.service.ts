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
