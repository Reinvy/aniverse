import { NextRequest } from "next/server";
import {
  parseFields,
  projectFields,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { findCurrentChallenge } from "@/lib/services/challenge.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/challenges/current — Get the currently-active challenge (DAILY preferred, WEEKLY fallback) */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "challenges-current", readLimiter);
    if (rateCheck) return rateCheck;

    const fields = parseFields(new URL(request.url).searchParams);
    const challenge = await findCurrentChallenge();

    if (!challenge) {
      return notFoundResponse("No active challenge right now");
    }

    return conditionalJsonResponse(
      request,
      { challenge: projectFields(challenge, fields) },
      { cache: "short" },
    );
  } catch (error) {
    console.error("Get current challenge error:", error);
    return errorResponse("Failed to load current challenge", 500);
  }
}
