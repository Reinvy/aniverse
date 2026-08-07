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
interface SearchFieldConfig {
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

// ─── Composite Fetch Helper ───────────────────────────────────────

/**
 * NOTE: The generic `paginatedFetch` helper was removed in the 08-07
 * maintenance pass — every service layer now inlines its own
 * `Promise.all([findMany, count])` pair (which is identical to what the
 * helper did, but keeps per-entity selects/where clauses co-located with
 * their entity). Keeping a single generic wrapper here added indirection
 * with zero call sites.
 */
