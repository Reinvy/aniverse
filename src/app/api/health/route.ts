import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";
import { cachedJsonResponse } from "@/lib/api-helpers";

const STARTED_AT = Date.now();

/**
 * GET /api/health — Liveness + readiness probe.
 *
 * Public endpoint for uptime monitors (Vercel Cron, external ping services,
 * load balancers). Performs a cheap PostgreSQL round-trip (`SELECT 1`) so a
 * 200 here means both the server AND the database are reachable. Returns 503
 * with `status: "degraded"` when the DB is unreachable.
 *
 * Response shape:
 *   {
 *     status: "ok" | "degraded",
 *     uptimeSec: 1234.56,
 *     timestamp: "2026-08-02T03:00:00.000Z",
 *     environment: "production",
 *   }
 */
export async function GET(request: NextRequest) {
  const rateCheck = applyRateLimit(request, "health", readLimiter);
  if (rateCheck) return rateCheck;

  const payload = {
    status: "ok" as const,
    uptimeSec: Number(((Date.now() - STARTED_AT) / 1000).toFixed(2)),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  };

  try {
    // Cheap connectivity check — never grows with data size.
    await prisma.$queryRaw`SELECT 1`;
    return cachedJsonResponse(payload, { cache: "no-store" });
  } catch (error) {
    console.error("Health check DB ping failed:", error);
    return cachedJsonResponse(
      { ...payload, status: "degraded" as const },
      { status: 503, cache: "no-store" },
    );
  }
}

// Health checks must never be statically prerendered.
export const dynamic = "force-dynamic";
