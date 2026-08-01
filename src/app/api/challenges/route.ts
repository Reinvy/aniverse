import { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import {
  findActiveChallenges,
  findChallengeById,
  findAllChallenges,
} from "@/lib/services/challenge.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/challenges — List challenges */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "challenges", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "endsAt", order: "asc" });

    const scope = searchParams.get("scope") || "active";
    const id = searchParams.get("id") || undefined;

    // Single challenge by ID
    if (id) {
      const challenge = await findChallengeById(id);
      if (!challenge) {
        return notFoundResponse("Challenge not found");
      }
      return conditionalJsonResponse(request, { challenge }, { cache: "short" });
    }

    // All or active challenges
    if (scope === "all") {
      const { challenges, total } = await findAllChallenges(pagination);
      return conditionalJsonResponse(request, {
        challenges,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      }, { cache: "short" });
    }

    const { challenges, total } = await findActiveChallenges(pagination);
    return conditionalJsonResponse(request, {
      challenges,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "short" });
  } catch (error) {
    console.error("List challenges error:", error);
    return errorResponse("Failed to load challenges", 500);
  }
}
