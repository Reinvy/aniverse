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
import { CHALLENGE_SORT_FIELDS } from "@/lib/services/sort-config";

// ─── Types ────────────────────────────────────────────────────────

export type ChallengeListItem = Prisma.ChallengeGetPayload<{
  select: typeof challengeListSelect;
}>;

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
 */
export async function findActiveChallenges(pagination: PaginationParams) {
  const where: Prisma.ChallengeWhereInput = {
    status: "ACTIVE",
    startsAt: { lte: new Date() },
    endsAt: { gte: new Date() },
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
 */
export async function findCurrentChallenge(): Promise<ChallengeDetail | null> {
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
  if (daily) return daily;

  return prisma.challenge.findFirst({
    where: { ...where, type: "WEEKLY" },
    orderBy: { startsAt: "desc" },
    select: challengeDetailSelect,
  });
}

/**
 * List all challenges (including past) with pagination.
 */
export async function findAllChallenges(pagination: PaginationParams) {
  const orderBy = buildOrderBy(pagination, CHALLENGE_SORT_FIELDS, "startsAt");

  const [challenges, total] = await Promise.all([
    prisma.challenge.findMany({
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: challengeListSelect,
    }),
    prisma.challenge.count(),
  ]);

  return { challenges, total };
}
