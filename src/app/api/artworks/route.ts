import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  parsePagination,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import {
  createArtwork,
  findUserArtworks,
} from "@/lib/services/artwork.service";
import { writeLimiter } from "@/lib/rate-limiter";
import {
  collectValidationErrors,
  validateRequiredString,
} from "@/lib/validation";

/** POST /api/artworks — Save a new artwork after generation */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "artworks-create",
      limiter: writeLimiter,
    });
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { title, prompt, style, imageUrl, width, height } = body;

    // ── Validation ──
    const errors = collectValidationErrors([
      ["title", validateRequiredString(title, "Title")],
      ["imageUrl", validateRequiredString(imageUrl, "Image URL")],
    ]);

    if (errors) {
      return validationErrorResponse(errors);
    }

    const artwork = await createArtwork(
      { title, prompt, style, imageUrl, width, height },
      auth.userId,
    );

    return conditionalJsonResponse(request, { artwork }, { status: 201 });
  } catch (error) {
    console.error("Create artwork error:", error);
    return errorResponse("Failed to save artwork", 500);
  }
}

/** GET /api/artworks — List user's artworks with pagination, sorting, and filtering */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "artworks-list",
    });
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams);

    // Optional filters
    const style = (searchParams.get("style") || undefined) as import("@/generated/prisma/client").ArtworkStyle | undefined;
    const search = searchParams.get("search") || undefined;

    const { artworks, total } = await findUserArtworks(
      auth.userId,
      pagination,
      { style, search },
    );

    return conditionalJsonResponse(request, {
      artworks,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "short", private: true });
  } catch (error) {
    console.error("List artworks error:", error);
    return errorResponse("Failed to load artworks", 500);
  }
}
