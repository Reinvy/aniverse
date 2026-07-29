import { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import {
  findPublicCharacters,
  findCharacterById,
} from "@/lib/services/character.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/characters — List public characters */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "characters", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "createdAt", order: "desc" });

    const search = searchParams.get("search") || undefined;
    const id = searchParams.get("id") || undefined;

    // Single character by ID
    if (id) {
      const character = await findCharacterById(id);
      if (!character) {
        return notFoundResponse("Character not found");
      }
      return cachedJsonResponse({ character }, { cache: "medium" });
    }

    const { characters, total } = await findPublicCharacters(pagination, { search });

    return cachedJsonResponse({
      characters,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "medium" });
  } catch (error) {
    console.error("List characters error:", error);
    return errorResponse("Failed to load characters", 500);
  }
}
