/**
 * AniVerse — Rate Limiter
 *
 * Simple in-memory sliding-window rate limiter for API routes.
 * Uses a Map with configurable window duration and max requests.
 *
 * Usage:
 *   const limiter = rateLimiter({ windowMs: 60_000, max: 30 });
 *   const result = limiter.check("user-id-or-ip");
 *   if (result.blocked) return rateLimitResponse();
 */

export interface RateLimiterOptions {
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number;
  /** Maximum requests per window (default: 30) */
  max?: number;
}

export interface RateLimitResult {
  blocked: boolean;
  remaining: number;
  resetInMs: number;
  total: number;
}

interface RateLimitEntry {
  timestamps: number[];
}

// ─── Store ─────────────────────────────────────────────────────────
// In production, replace this with Redis (upstash, ioredis, etc.)

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup every 60 seconds to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const entries = Array.from(store.entries());
    for (const [key, entry] of entries) {
      // Remove entries where all timestamps are older than 2 minutes
      const oldest = entry.timestamps[0];
      if (oldest && now - oldest > 120_000) {
        store.delete(key);
      }
    }
    // If store is empty, stop the timer
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL);
}

// ─── Limiter Factory ──────────────────────────────────────────────

export function rateLimiter(options?: RateLimiterOptions) {
  const windowMs = options?.windowMs ?? 60_000;
  const max = options?.max ?? 30;

  startCleanup();

  return {
    /**
     * Check if a request should be rate limited.
     * Returns the current state: blocked, remaining, reset time.
     */
    check(key: string): RateLimitResult {
      const now = Date.now();
      let entry = store.get(key);

      if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
      }

      // Prune timestamps outside the current window
      const cutoff = now - windowMs;
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

      const total = entry.timestamps.length;
      const blocked = total >= max;
      const remaining = Math.max(0, max - total);
      const oldestInWindow = entry.timestamps[0] ?? now;
      const resetInMs = Math.max(0, windowMs - (now - oldestInWindow));

      if (!blocked) {
        entry.timestamps.push(now);
      }

      return { blocked, remaining, resetInMs, total };
    },

    /**
     * Reset the rate limit counter for a specific key.
     */
    reset(key: string): void {
      store.delete(key);
    },

    /**
     * Clear all rate limit entries.
     */
    clear(): void {
      store.clear();
    },

    /**
     * Get the current number of entries in the store.
     */
    size(): number {
      return store.size;
    },
  };
}

// ─── Preset Limiters ──────────────────────────────────────────────

/** Instance type returned by {@link rateLimiter} (shared by api-helpers). */
export type RateLimiterInstance = ReturnType<typeof rateLimiter>;

/** Strict: 10 requests per minute — for auth endpoints (login, register) */
export const authLimiter = rateLimiter({ windowMs: 60_000, max: 10 });

/** Moderate: 30 requests per minute — for write endpoints (create, update) */
export const writeLimiter = rateLimiter({ windowMs: 60_000, max: 30 });

/** Generous: 100 requests per minute — for read endpoints (list, get) */
export const readLimiter = rateLimiter({ windowMs: 60_000, max: 100 });

// ─── Response Helpers ─────────────────────────────────────────────

import { NextResponse } from "next/server";

/**
 * Create a 429 Too Many Requests response with Retry-After header.
 */
export function rateLimitResponse(
  result: RateLimitResult,
): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. Please wait before retrying.",
      retryAfterMs: result.resetInMs,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(result.resetInMs / 1000)),
        "X-RateLimit-Limit": String(result.total + result.remaining),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil((Date.now() + result.resetInMs) / 1000)),
      },
    },
  );
}

/**
 * Apply rate limiting to a Next.js API route handler.
 * Returns the 429 response if blocked, or null to continue.
 *
 * Usage:
 *   const rateCheck = applyRateLimit(request, "artworks-create", authLimiter);
 *   if (rateCheck) return rateCheck;
 */
export function applyRateLimit(
  request: Request,
  keyPrefix: string,
  limiter: ReturnType<typeof rateLimiter>,
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  const key = `${keyPrefix}:${ip}`;
  const result = limiter.check(key);

  if (result.blocked) {
    return rateLimitResponse(result);
  }

  return null;
}
