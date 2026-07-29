/**
 * AniVerse — Character Service Layer
 *
 * Encapsulates Character-related database queries
 * for public-facing content (browsing, discovery).
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";

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

  if (filters?.search) {
    const q = filters.search.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { personality: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  const allowedSortFields = ["createdAt", "name", "updatedAt"];
  const sortField = allowedSortFields.includes(pagination.sort)
    ? pagination.sort
    : "createdAt";

  const orderBy: Prisma.CharacterOrderByWithRelationInput = {
    [sortField]: pagination.order,
  };

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
