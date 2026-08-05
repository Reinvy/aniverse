import { NextRequest } from "next/server";
import {
  parseFields,
  projectFields,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { findCharacterById } from "@/lib/services/character.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/characters/[id] — Get a single public character by ID */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rateCheck = applyRateLimit(_request, "character-detail", readLimiter);
    if (rateCheck) return rateCheck;

    const { id } = await params;
    const fields = parseFields(new URL(_request.url).searchParams);
    const character = await findCharacterById(id);

    if (!character) {
      return notFoundResponse("Character not found");
    }

    return conditionalJsonResponse(
      _request,
      { character: projectFields(character, fields) },
      { cache: "medium" },
    );
  } catch (error) {
    console.error("Get character error:", error);
    return errorResponse("Failed to load character", 500);
  }
}
