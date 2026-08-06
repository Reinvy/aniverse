/**
 * AniVerse — Shared API Helpers
 *
 * DRY utilities for auth, pagination, caching, and error responses.
 * Every API route should use these instead of duplicating boilerplate.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, verifyToken, type TokenPayload } from "@/lib/auth";
import {
  applyRateLimit,
  readLimiter,
  type RateLimiterInstance,
} from "@/lib/rate-limiter";

// ─── Auth ─────────────────────────────────────────────────────────

export type AuthResult =
  | { authenticated: true; payload: TokenPayload }
  | { authenticated: false; response: NextResponse };

/**
 * Authenticate a request by extracting and verifying the Bearer token.
 *
 * Usage:
 *   const auth = await authenticateRequest(request);
 *   if (!auth.authenticated) return auth.response;
 *   const { userId } = auth.payload;
 */
export async function authenticateRequest(
  request: NextRequest,
): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      ),
    };
  }

  return { authenticated: true, payload };
}

// ─── Pagination ───────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  /** True when a next page exists (client pager / load-more rendering). */
  hasNextPage: boolean;
  /** True when a previous page exists. */
  hasPrevPage: boolean;
  /** Page number of the next page, or null when on the last page. */
  nextPage: number | null;
  /** Page number of the previous page, or null when on the first page. */
  prevPage: number | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Maximum allowed OFFSET for offset-based pagination.
 *
 * Deep offset pagination degrades to O(n) in PostgreSQL: every page requires
 * scanning and discarding all preceding rows. Clamping the skip keeps
 * pathological inputs (`?page=999999999`) from triggering multi-million-row
 * scans. Clients that need to paginate deep into a dataset should use
 * cursor-based (keyset) pagination instead — see `encodeCursor`/`decodeCursor`.
 */
const MAX_SKIP = 10_000;

/**
 * Parse pagination, sorting, and filtering parameters from URL search params.
 */
export function parsePagination(
  searchParams: URLSearchParams,
  defaults?: Partial<PaginationParams>,
): PaginationParams {
  const page = Math.max(
    1,
    parseInt(searchParams.get("page") ?? String(defaults?.page ?? DEFAULT_PAGE), 10) || 1,
  );
  const limit = Math.min(
    Math.max(
      1,
      parseInt(searchParams.get("limit") ?? String(defaults?.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
    ),
    MAX_LIMIT,
  );
  const sort = searchParams.get("sort") ?? defaults?.sort ?? "createdAt";
  const orderRaw = searchParams.get("order") ?? defaults?.order ?? "desc";
  const order: "asc" | "desc" = orderRaw === "asc" ? "asc" : "desc";
  let skip = (page - 1) * limit;

  // Harden against pathological deep-page offsets (see MAX_SKIP docs above).
  // Recompute `page` so the pagination meta always reflects the effective
  // offset (idempotent when no clamp happened).
  if (skip > MAX_SKIP) {
    skip = MAX_SKIP;
  }
  const effectivePage = Math.floor(skip / limit) + 1;

  return { page: effectivePage, limit, skip, sort, order };
}

// ─── Cursor (Keyset) Pagination ───────────────────────────────────

/**
 * Fields that are safe to use as keyset-pagination sort keys.
 *
 * Keyset pagination requires range filters (`lt`/`gt`) plus a unique
 * tiebreaker (id). Prisma enum filters do NOT expose `lt`/`gt` (only
 * equals/in/notIn/not), so enum-typed sort fields (e.g. Artwork `style`)
 * cannot drive a keyset cursor — callers must fall back to offset
 * pagination for those sorts.
 */
const KEYSET_SAFE_SORT_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "title",
  "publishedAt",
]);

/**
 * True when `field` can be used as a keyset cursor sort key.
 */
export function isKeysetSafeSort(field: string): boolean {
  return KEYSET_SAFE_SORT_FIELDS.has(field);
}

/**
 * Encode an opaque, tamper-resistant cursor for keyset pagination.
 *
 * The cursor carries the last row's sort value + id, base64url-encoded so it
 * is URL-safe and opaque to clients. The payload is NOT signed — treat it as
 * a hint, not a security boundary: a forged cursor yields an empty page at
 * worst (range filters are validated against the whitelist on decode).
 *
 * DateTime values are normalized to ISO-8601 strings, which Prisma accepts
 * for DateTime range filters.
 */
export function encodeCursor(
  sortValue: string | number | Date,
  id: string,
): string {
  const v =
    sortValue instanceof Date
      ? sortValue.toISOString()
      : String(sortValue);
  return Buffer.from(JSON.stringify({ v, i: id })).toString("base64url");
}

/**
 * Decode a keyset cursor produced by {@link encodeCursor}.
 *
 * Returns null for missing/malformed/out-of-shape payloads so callers can
 * transparently fall back to offset pagination.
 */
export function decodeCursor(
  raw: string | null | undefined,
): { sortValue: string; id: string } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    ) as { v?: unknown; i?: unknown };
    if (
      parsed &&
      typeof parsed.v === "string" &&
      typeof parsed.i === "string" &&
      parsed.i.length > 0
    ) {
      return { sortValue: parsed.v, id: parsed.i };
    }
  } catch {
    // Malformed cursor — treat as absent.
  }
  return null;
}

/**
 * Compute the `nextCursor` token for a page of rows, or null when there is no
 * next page (or the row shape can't produce a cursor).
 *
 * DRY helper shared by list routes: given the fetched rows (already projected
 * to the list select), the active sort field, and whether a next page exists,
 * it encodes the last row's sort value + id. Returns null when the sort value
 * is absent from the row (caller's select doesn't include it) — the route
 * then simply omits the cursor.
 */
export function buildNextCursor(
  rows: ReadonlyArray<Record<string, unknown>>,
  sort: string,
  hasNextPage: boolean,
): string | null {
  if (!hasNextPage || rows.length === 0) return null;
  const last = rows[rows.length - 1];
  const sortValue = last[sort];
  if (sortValue === undefined || sortValue === null) return null;
  return encodeCursor(sortValue as string | number | Date, String(last.id));
}

/**
 * Build pagination metadata object for API responses.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}

// ─── Cache-Control Helpers ───────────────────────────────────────

export type CacheDuration =
  | "no-store"
  | "short"    // 1 minute
  | "medium"   // 5 minutes
  | "long"     // 1 hour
  | "day"      // 24 hours
  | "week";    // 7 days (for truly static content)

const CACHE_DURATIONS: Record<CacheDuration, string> = {
  "no-store": "no-store, no-cache, must-revalidate",
  short: "public, max-age=60, s-maxage=120, stale-while-revalidate=30",
  medium: "public, max-age=300, s-maxage=600, stale-while-revalidate=60",
  long: "public, max-age=3600, s-maxage=7200, stale-while-revalidate=300",
  day: "public, max-age=86400, s-maxage=172800, stale-while-revalidate=3600",
  week: "public, max-age=604800, s-maxage=1209600, stale-while-revalidate=86400",
};

/**
 * Resolve the Cache-Control header value for a cache duration.
 *
 * When `isPrivate` is true (authenticated / per-user payloads), the shared-cache
 * directives (`public`, `s-maxage`) are stripped so a CDN or proxy can never
 * serve one user's data to another — only the browser may cache it.
 */
function cacheControlValue(
  cache: CacheDuration | undefined,
  isPrivate = false,
): string {
  if (!cache || cache === "no-store") return CACHE_DURATIONS["no-store"];
  const base = CACHE_DURATIONS[cache];
  if (!isPrivate) return base;
  return base
    .replace(/^public, /, "private, ")
    .replace(/, s-maxage=\d+/, "");
}

/**
 * Create a JSON response with Cache-Control headers.
 * Use `cache` for GET endpoints that return public/non-sensitive data,
 * and pass `private: true` for authenticated/per-user payloads.
 */
export function cachedJsonResponse(
  data: unknown,
  init?: {
    status?: number;
    cache?: CacheDuration;
    private?: boolean;
    headers?: Record<string, string>;
  },
): NextResponse {
  const status = init?.status ?? 200;
  const cacheControl = cacheControlValue(init?.cache, init?.private);

  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": cacheControl,
      ...init?.headers,
    },
  });
}

// ─── ETag / Conditional Requests ─────────────────────────────────

/**
 * Compute a stable ETag for a JSON-serializable payload.
 * Uses a fast non-cryptographic hash (FNV-1a style) so we don't pay
 * crypto overhead on every response. Strong enough for cache
 * revalidation — not for security.
 */
export function computeEtag(data: unknown): string {
  const serialized = JSON.stringify(data) ?? "null";
  let hash = 0x811c9dc5;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `"${(hash >>> 0).toString(16)}"`;
}

/**
 * Respond with a JSON payload + ETag, or 304 Not Modified when the
 * client already has the current version (If-None-Match).
 *
 * Usage (GET endpoints):
 *   return conditionalJsonResponse(request, data, { cache: "medium" });
 *
 * Browser/HTTP-cache clients transparently revalidate; clients that
 * never send If-None-Match always receive the full 200 payload.
 */
export function conditionalJsonResponse(
  request: NextRequest,
  data: unknown,
  init?: {
    status?: number;
    cache?: CacheDuration;
    private?: boolean;
    headers?: Record<string, string>;
  },
): NextResponse {
  const etag = computeEtag(data);

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch) {
    const matches =
      ifNoneMatch.trim() === "*" ||
      ifNoneMatch
        .split(",")
        .map((v) => v.trim())
        .includes(etag);

    if (matches) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": cacheControlValue(init?.cache, init?.private),
        },
      });
    }
  }

  return cachedJsonResponse(data, {
    ...init,
    headers: { ...init?.headers, ETag: etag },
  });
}

// ─── Sparse Fieldsets ─────────────────────────────────────────────

const DEFAULT_MAX_FIELDS = 20;

/**
 * Parse a comma-separated `fields` query param into an array of field names.
 *
 * Usage (GET endpoints):
 *   const fields = parseFields(searchParams);
 *   return conditionalJsonResponse(request, {
 *     artworks: projectFields(artworks, fields),
 *     pagination: ...,
 *   }, { cache: "short", private: true });
 *
 * Returns `undefined` when absent/empty so callers can skip projection.
 * Each token must be a valid identifier (`/^[A-Za-z_][A-Za-z0-9_]*$/`),
 * and the list is bounded to `max` entries to prevent abuse.
 */
export function parseFields(
  searchParams: URLSearchParams,
  max: number = DEFAULT_MAX_FIELDS,
): string[] | undefined {
  const raw = searchParams.get("fields");
  if (!raw) return undefined;

  const fields = raw
    .split(",")
    .map((f) => f.trim())
    .filter((f) => f.length > 0 && /^[A-Za-z_][A-Za-z0-9_]*$/.test(f));

  if (fields.length === 0) return undefined;
  return fields.slice(0, max);
}

/**
 * Project a payload (object or array of objects) down to the requested fields.
 *
 * This is a *response* projection: the full optimized select is still fetched
 * from the DB, but only the requested keys are serialized to the client —
 * cutting bandwidth and client-side parsing cost for narrow consumers
 * (e.g. autocomplete dropdowns that only need `id` + `name`).
 *
 * Unknown / requested-but-absent fields are silently dropped, so callers can
 * pass user-controlled field lists without throwing on shape mismatch.
 * Returns the input unchanged when `fields` is undefined.
 */
export function projectFields(
  data: unknown,
  fields: string[] | undefined,
): unknown {
  if (!fields || fields.length === 0) return data;

  const project = (obj: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      if (f in obj) out[f] = obj[f];
    }
    return out;
  };

  if (Array.isArray(data)) {
    return data.map((item) => project(item as Record<string, unknown>));
  }
  return project(data as Record<string, unknown>);
}

// ─── Authenticated Request Helper (DRY) ───────────────────────────

export type AuthenticatedRequestResult =
  | { ok: true; userId: string; payload: TokenPayload }
  | { ok: false; response: NextResponse };

/**
 * Apply rate limiting + bearer-token auth in one step.
 *
 * Replaces the repeated preamble:
 *   const rateCheck = applyRateLimit(request, "key", readLimiter);
 *   if (rateCheck) return rateCheck;
 *   const auth = await authenticateRequest(request);
 *   if (!auth.authenticated) return auth.response;
 *
 * Rate limiting is identity-aware: once the token is verified, the quota is
 * keyed by userId (not IP) so each user gets a fair share and shared-NAT
 * clients cannot exhaust each other's quotas. Unauthenticated requests are
 * rejected with 401 before any quota is consumed.
 *
 * Usage:
 *   const auth = await requireAuthenticatedRequest(request, { rateLimitKey: "artworks-list" });
 *   if (!auth.ok) return auth.response;
 *   const { userId } = auth;
 */
export async function requireAuthenticatedRequest(
  request: NextRequest,
  options?: { rateLimitKey?: string; limiter?: RateLimiterInstance },
): Promise<AuthenticatedRequestResult> {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) return { ok: false, response: auth.response };

  if (options?.rateLimitKey) {
    const rateCheck = applyRateLimit(
      request,
      options.rateLimitKey,
      options.limiter ?? readLimiter,
      auth.payload.userId,
    );
    if (rateCheck) return { ok: false, response: rateCheck };
  }

  return { ok: true, userId: auth.payload.userId, payload: auth.payload };
}

// ─── Standardized Error / Success Responses ──────────────────────

/**
 * Standardized error response.
 */
export function errorResponse(
  error: string,
  status: number = 500,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { error, ...extras },
    { status },
  );
}

/**
 * Validation error response (400).
 */
export function validationErrorResponse(
  errors: Record<string, string>,
): NextResponse {
  return NextResponse.json({ errors }, { status: 400 });
}

/**
 * Not found response (404).
 */
export function notFoundResponse(
  message: string = "Resource not found",
): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}
