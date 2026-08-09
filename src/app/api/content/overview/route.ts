import { NextRequest } from "next/server";
import {
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { getContentOverview } from "@/lib/services/content.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/**
 * GET /api/content/overview — Dynamic content orchestration snapshot.
 *
 * Single-call "what's fresh on AniVerse" payload for landing/showcase
 * sections and dashboards:
 *   counts            — published articles, active challenges, public characters
 *   featuredArticle   — latest featured blog article (hero rotation)
 *   currentChallenge  — currently-active challenge (DAILY preferred)
 *   recentCharacters  — 4 most-recent public characters
 *
 * All data is DB-driven (Prisma) — no hardcoded content. The query work
 * lives in the content service layer (`src/lib/services/content.service.ts`):
 * the three counts + hero lookups are TTL-cached in-memory (60s), so a warm
 * request costs exactly ONE DB query (the recent-characters strip). Responses
 * are additionally cached medium-term (60s) at the HTTP layer so the landing
 * page can poll cheaply.
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "content-overview", readLimiter);
    if (rateCheck) return rateCheck;

    const overview = await getContentOverview();

    return conditionalJsonResponse(request, overview, { cache: "medium" });
  } catch (error) {
    console.error("Content overview error:", error);
    return errorResponse("Failed to load content overview", 500);
  }
}
