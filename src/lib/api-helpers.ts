/**
 * AniVerse — Shared API Helpers
 *
 * DRY utilities for auth, pagination, caching, and error responses.
 * Every API route should use these instead of duplicating boilerplate.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, verifyToken, type TokenPayload } from "@/lib/auth";

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
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

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
  const skip = (page - 1) * limit;

  return { page, limit, skip, sort, order };
}

/**
 * Build pagination metadata object for API responses.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Cache-Control Helpers ───────────────────────────────────────

export type CacheDuration =
  | "no-store"
  | "short"    // 1 minute
  | "medium"   // 5 minutes
  | "long"     // 1 hour
  | "day";     // 24 hours

const CACHE_DURATIONS: Record<CacheDuration, string> = {
  "no-store": "no-store, no-cache, must-revalidate",
  short: "public, max-age=60, s-maxage=120",
  medium: "public, max-age=300, s-maxage=600",
  long: "public, max-age=3600, s-maxage=7200",
  day: "public, max-age=86400, s-maxage=172800",
};

/**
 * Create a JSON response with Cache-Control headers.
 * Use `cache` for GET endpoints that return public/non-sensitive data.
 */
export function cachedJsonResponse(
  data: unknown,
  init?: {
    status?: number;
    cache?: CacheDuration;
    headers?: Record<string, string>;
  },
): NextResponse {
  const status = init?.status ?? 200;
  const cacheControl = init?.cache
    ? CACHE_DURATIONS[init.cache]
    : CACHE_DURATIONS["no-store"];

  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": cacheControl,
      ...init?.headers,
    },
  });
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
