/**
 * AniVerse — Shared Query Builder Utilities
 *
 * DRY helpers for building Prisma query clauses (where, orderBy, select)
 * consistently across service layers. Reduces boilerplate in service files.
 *
 * Each service still defines its own selects (they're unique per entity),
 * but sorting/filtering/where-building patterns are shared here.
 */

import type { PaginationParams } from "@/lib/api-helpers";

// ─── Sort / OrderBy ───────────────────────────────────────────────

/**
 * Build a Prisma orderBy object from pagination params and allowed fields.
 *
 * Usage:
 *   const orderBy = buildOrderBy(pagination, ["createdAt", "title", "updatedAt"]);
 *   // => { createdAt: "desc" }
 *
 * Falls back to `defaultField` if `pagination.sort` is not in `allowedFields`.
 */
export function buildOrderBy<T extends string>(
  pagination: PaginationParams,
  allowedFields: readonly T[],
  defaultField: T = "createdAt" as T,
): Record<string, "asc" | "desc"> {
  const field = allowedFields.includes(pagination.sort as T)
    ? pagination.sort
    : defaultField;

  return { [field]: pagination.order };
}

// ─── Search / Where ───────────────────────────────────────────────

/**
 * Configuration for a text search field mapping.
 * Maps user-facing search params to Prisma field conditions.
 */
export interface SearchFieldConfig {
  /** Field name in the model (e.g., "title", "name") */
  field: string;
  /** Mode for string matching (default: insensitive) */
  mode?: "insensitive" | "default" | "sensitive";
}

/**
 * Build a Prisma OR clause array for full-text search across multiple fields.
 *
 * Usage:
 *   const OR = buildSearchClause(search, [
 *     { field: "title" },
 *     { field: "description" },
 *   ]);
 *   // => [{ title: { contains: "query", mode: "insensitive" } }, ...]
 *
 * Returns `undefined` when no search query is provided (safely spreadable).
 */
export function buildSearchClause(
  search: string | undefined,
  fields: (string | SearchFieldConfig)[],
): Record<string, { contains: string; mode: string }>[] | undefined {
  if (!search || !search.trim()) return undefined;

  const q = search.trim();
  return fields.map((f) => {
    const fieldName = typeof f === "string" ? f : f.field;
    const mode = typeof f === "string" ? "insensitive" : (f.mode ?? "insensitive");
    return { [fieldName]: { contains: q, mode } };
  });
}

// ─── Pagination Meta ──────────────────────────────────────────────

/**
 * Calculate skip value from page and limit.
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

// ─── Composite Fetch Helper ───────────────────────────────────────

/**
 * Execute a findMany + count pair in parallel with shared where clause.
 * This is the most common pattern across all service layers.
 *
 * Usage:
 *   const { items, total } = await paginatedFetch({
 *     findMany: (args) => prisma.artwork.findMany(args),
 *     count: (args) => prisma.artwork.count(args),
 *     where: { isPublic: true },
 *     orderBy: { createdAt: "desc" },
 *     pagination,
 *     select: artworkListSelect,
 *   });
 */
export async function paginatedFetch<
  TSelect,
  TWhere extends Record<string, unknown>,
  TOrderBy extends Record<string, unknown>,
  TItem,
>(
  params: {
    findMany: (args: {
      where: TWhere;
      orderBy: TOrderBy;
      skip: number;
      take: number;
      select: TSelect;
    }) => Promise<TItem[]>;
    count: (args: { where: TWhere }) => Promise<number>;
    where: TWhere;
    orderBy: TOrderBy;
    pagination: PaginationParams;
    select: TSelect;
  },
): Promise<{ items: TItem[]; total: number }> {
  const [items, total] = await Promise.all([
    params.findMany({
      where: params.where,
      orderBy: params.orderBy,
      skip: params.pagination.skip,
      take: params.pagination.limit,
      select: params.select,
    }),
    params.count({ where: params.where }),
  ]);

  return { items, total };
}
