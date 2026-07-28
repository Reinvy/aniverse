/**
 * AniVerse — Artwork Service Layer
 *
 * Encapsulates all Artwork-related database queries with:
 * - Optimized selects (only fetch what's needed)
 * - Built-in pagination, sorting, and filtering
 * - Consistent error handling
 */

import { prisma } from "@/lib/prisma";
import type { ArtworkStyle, Prisma } from "@/generated/prisma/client";
import type { PaginationParams } from "@/lib/api-helpers";

// ─── Types ────────────────────────────────────────────────────────

export interface ArtworkFilters {
  style?: ArtworkStyle;
  isPublic?: boolean;
  search?: string;
  creatorId?: string;
  characterId?: string;
}

export interface CreateArtworkInput {
  title: string;
  prompt?: string;
  style?: string;
  imageUrl: string;
  width?: number;
  height?: number;
  characterId?: string;
  isPublic?: boolean;
}

export type ArtworkListItem = Prisma.ArtworkGetPayload<{
  select: typeof artworkListSelect;
}>;

export type ArtworkDetailItem = Prisma.ArtworkGetPayload<{
  select: typeof artworkDetailSelect;
}>;

// ─── Selects (optimized — only fetch required fields) ────────────

const artworkListSelect = {
  id: true,
  title: true,
  style: true,
  imageUrl: true,
  prompt: true,
  width: true,
  height: true,
  isPublic: true,
  createdAt: true,
  _count: { select: { products: true } },
} satisfies Prisma.ArtworkSelect;

const artworkDetailSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  style: true,
  prompt: true,
  modelUsed: true,
  width: true,
  height: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  creatorId: true,
  characterId: true,
  _count: { select: { products: true } },
} satisfies Prisma.ArtworkSelect;

// ─── Build Where Clause ──────────────────────────────────────────

function buildWhereClause(
  baseUserId: string,
  filters?: ArtworkFilters,
): Prisma.ArtworkWhereInput {
  const where: Prisma.ArtworkWhereInput = {};

  // Always scope to the authenticated user
  where.creatorId = filters?.creatorId ?? baseUserId;

  if (filters?.style) {
    where.style = filters.style;
  }

  if (filters?.isPublic !== undefined) {
    where.isPublic = filters.isPublic;
  }

  if (filters?.characterId) {
    where.characterId = filters.characterId;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { prompt: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  return where;
}

// ─── Service Methods ──────────────────────────────────────────────

/**
 * List artworks for a user with pagination, sorting, and filtering.
 */
export async function findUserArtworks(
  userId: string,
  pagination: PaginationParams,
  filters?: ArtworkFilters,
) {
  const where = buildWhereClause(userId, filters);

  // Build orderBy from sort param
  const allowedSortFields = ["createdAt", "title", "updatedAt", "style"];
  const sortField = allowedSortFields.includes(pagination.sort)
    ? pagination.sort
    : "createdAt";

  const orderBy: Prisma.ArtworkOrderByWithRelationInput = {
    [sortField]: pagination.order,
  };

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      select: artworkListSelect,
    }),
    prisma.artwork.count({ where }),
  ]);

  return { artworks, total };
}

/**
 * Get a single artwork by ID (scoped to user).
 */
export async function findArtworkById(
  artworkId: string,
  userId: string,
): Promise<ArtworkDetailItem | null> {
  return prisma.artwork.findFirst({
    where: { id: artworkId, creatorId: userId },
    select: artworkDetailSelect,
  });
}

/**
 * Create a new artwork.
 */
export async function createArtwork(
  data: CreateArtworkInput,
  creatorId: string,
): Promise<ArtworkDetailItem> {
  return prisma.artwork.create({
    data: {
      title: data.title.trim(),
      prompt: data.prompt?.trim() || null,
      style: (data.style as ArtworkStyle) || "ANIME",
      imageUrl: data.imageUrl.trim(),
      width: data.width || null,
      height: data.height || null,
      characterId: data.characterId || null,
      isPublic: data.isPublic ?? true,
      creatorId,
    },
    select: artworkDetailSelect,
  });
}

/**
 * Count artworks for a user, optionally filtered by time range.
 */
export async function countUserArtworks(
  userId: string,
  createdAt?: { gte?: Date; lte?: Date },
): Promise<number> {
  return prisma.artwork.count({
    where: {
      creatorId: userId,
      ...(createdAt ? { createdAt } : {}),
    },
  });
}

/**
 * Get all artwork IDs for a user (lightweight).
 */
export async function findUserArtworkIds(userId: string): Promise<string[]> {
  const artworks = await prisma.artwork.findMany({
    where: { creatorId: userId },
    select: { id: true },
  });
  return artworks.map((a) => a.id);
}
