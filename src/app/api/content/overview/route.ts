import { NextRequest } from "next/server";
import {
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { findFeaturedArticle } from "@/lib/services/blog.service";
import { findCurrentChallenge } from "@/lib/services/challenge.service";
import { findPublicCharacters } from "@/lib/services/character.service";
import { prisma } from "@/lib/prisma";
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
 * All data is DB-driven (Prisma) — no hardcoded content. Responses are
 * cached medium-term (60s) so the landing page can poll cheaply.
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "content-overview", readLimiter);
    if (rateCheck) return rateCheck;

    const [counts, featuredArticle, currentChallenge, recentResult] =
      await Promise.all([
        Promise.all([
          prisma.blogArticle.count({ where: { isPublished: true } }),
          prisma.challenge.count({ where: { status: "ACTIVE" } }),
          prisma.character.count({ where: { isPublic: true } }),
        ]),
        findFeaturedArticle(),
        findCurrentChallenge(),
        findPublicCharacters({ page: 1, limit: 4, skip: 0, sort: "createdAt", order: "desc" }),
      ]);

    return conditionalJsonResponse(
      request,
      {
        counts: {
          articles: counts[0],
          challenges: counts[1],
          characters: counts[2],
        },
        featuredArticle,
        currentChallenge,
        recentCharacters: recentResult.characters,
      },
      { cache: "medium" },
    );
  } catch (error) {
    console.error("Content overview error:", error);
    return errorResponse("Failed to load content overview", 500);
  }
}
