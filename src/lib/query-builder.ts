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

// ─── Keyset (Cursor) Pagination Helpers ───────────────────────────

/**
 * Apply the keyset (cursor) range predicate to a Prisma `where` object.
 *
 * Mutates `where` by setting `where.AND` to the "strictly after the cursor in
 * sort order" predicate, using the row id as a unique tiebreaker (cuids are
 * lexicographically ordered):
 *
 *   AND: [{ OR: [
 *     { [sortField]: { lt: cursor.sortValue } },          // desc
 *     { [sortField]: cursor.sortValue, id: { lt: cursor.id } },
 *   ] }]
 *
 * `cmp` is `lt` for descending order and `gt` for ascending. This is the
 * exact block every cursor service used to inline — extracting it keeps the
 * keyset semantics in ONE place (see `decodeCursor`/`encodeCursor`).
 *
 * No-op when `cursor` is null/undefined (offset page-1 path).
 *
 * Usage (cursor service):
 *   const baseWhere = { ...where };          // snapshot BEFORE mutation
 *   applyKeysetWhere(where, cursor, sortField, pagination.order);
 *   const [rows, total] = await Promise.all([
 *     prisma.x.findMany({ where, orderBy, take: limit + 1, select }),
 *     prisma.x.count({ where: baseWhere }),  // count without keyset predicate
 *   ]);
 */
export function applyKeysetWhere(
  where: { AND?: unknown },
  cursor: { sortValue: string; id: string } | null | undefined,
  sortField: string,
  order: "asc" | "desc",
): void {
  if (!cursor) return;
  const cmp = order === "desc" ? "lt" : "gt";
  where.AND = [
    {
      OR: [
        { [sortField]: { [cmp]: cursor.sortValue } },
        { [sortField]: cursor.sortValue, id: { [cmp]: cursor.id } },
      ],
    },
  ];
}

/**
 * Build the multi-field `orderBy` array required by Prisma 7 for keyset
 * pagination: `[{ [sortField]: order }, { id: order }]`.
 *
 * Prisma 7 requires ARRAY form for multi-field orderBy (a two-key object
 * passes typecheck but fails runtime validation). The cast is intentional:
 * the generated types accept the single-object form that Prisma rejects at
 * runtime — the array form is the only shape that actually works.
 *
 * Usage:
 *   const orderBy = buildKeysetOrderBy<Prisma.ArtworkOrderByWithRelationInput>(
 *     sortField,
 *     pagination.order,
 *   );
 */
export function buildKeysetOrderBy<T extends object>(
  sortField: string,
  order: "asc" | "desc",
): T[] {
  return [
    { [sortField]: order },
    { id: order },
  ] as unknown as T[];
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
