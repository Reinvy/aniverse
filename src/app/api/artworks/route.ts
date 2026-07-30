import { NextRequest } from "next/server";
import {
  authenticateRequest,
  parsePagination,
  buildPaginationMeta,
  cachedJsonResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import {
  createArtwork,
  findUserArtworks,
} from "@/lib/services/artwork.service";
import { applyRateLimit, writeLimiter, readLimiter } from "@/lib/rate-limiter";

/** POST /api/artworks — Save a new artwork after generation */
export async function POST(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "artworks-create", writeLimiter);
    if (rateCheck) return rateCheck;

    const auth = await authenticateRequest(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();
    const { title, prompt, style, imageUrl, width, height } = body;

    // ── Validation ──
    const errors: Record<string, string> = {};

    if (!title || typeof title !== "string" || !title.trim()) {
      errors.title = "Title is required";
    }
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      errors.imageUrl = "Image URL is required";
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors);
    }

    const artwork = await createArtwork(
      { title, prompt, style, imageUrl, width, height },
      auth.payload.userId,
    );

    return cachedJsonResponse({ artwork }, { status: 201 });
  } catch (error) {
    console.error("Create artwork error:", error);
    return errorResponse("Failed to save artwork", 500);
  }
}

/** GET /api/artworks — List user's artworks with pagination, sorting, and filtering */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "artworks-list", readLimiter);
    if (rateCheck) return rateCheck;

    const auth = await authenticateRequest(request);
    if (!auth.authenticated) return auth.response;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams);

    // Optional filters
    const style = (searchParams.get("style") || undefined) as import("@/generated/prisma/client").ArtworkStyle | undefined;
    const search = searchParams.get("search") || undefined;

    const { artworks, total } = await findUserArtworks(
      auth.payload.userId,
      pagination,
      { style, search },
    );

    return cachedJsonResponse({
      artworks,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "short" });
  } catch (error) {
    console.error("List artworks error:", error);
    return errorResponse("Failed to load artworks", 500);
  }
}
