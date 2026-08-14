import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  buildCursorPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
  validationErrorResponse,
  resolveCursorMode,
} from "@/lib/api-helpers";
import {
  createArtwork,
  findUserArtworks,
  findUserArtworksCursor,
} from "@/lib/services/artwork.service";
import { ARTWORK_SORT_FIELDS } from "@/lib/services/sort-config";
import { invalidateDashboardStats } from "@/lib/services/dashboard.service";
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

    // New artwork changes dashboard counts (totalArtworks, generationsUsed).
    invalidateDashboardStats(auth.userId);

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
    const fields = parseFields(searchParams);

    // Optional filters
    const style = (searchParams.get("style") || undefined) as import("@/generated/prisma/client").ArtworkStyle | undefined;
    const search = searchParams.get("search") || undefined;

    const filters = { style, search };

    // Cursor mode is only valid for keyset-safe sort fields (enum sorts like
    // `style` cannot drive a range predicate in Prisma) that are ALSO
    // whitelisted for the artwork entity — a sort the service would clamp
    // must not decode a cursor, or the keyset predicate would compare
    // against the wrong column.
    const { canCursor, cursor } = resolveCursorMode(
      searchParams,
      pagination.sort,
      ARTWORK_SORT_FIELDS,
    );

    if (cursor) {
      const { artworks, total, hasNextPage } = await findUserArtworksCursor(
        auth.userId,
        pagination,
        filters,
        cursor,
      );

      return conditionalJsonResponse(
        request,
        {
          artworks: projectFields(artworks, fields),
          pagination: buildCursorPaginationMeta(
            artworks as unknown as Record<string, unknown>[],
            total,
            pagination.limit,
            pagination.sort,
            hasNextPage,
          ),
        },
        { cache: "short", private: true },
      );
    }

    const { artworks, total } = await findUserArtworks(
      auth.userId,
      pagination,
      filters,
    );
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

    // Emit the first cursor from the offset page so clients can switch to
    // keyset pagination for deep pages (when the sort is keyset-safe).
    const nextCursor =
      canCursor && meta.hasNextPage
        ? buildNextCursor(
            artworks as unknown as Record<string, unknown>[],
            pagination.sort,
            meta.hasNextPage,
          )
        : null;

    return conditionalJsonResponse(request, {
      artworks: projectFields(artworks, fields),
      pagination: { ...meta, nextCursor },
    }, { cache: "short", private: true });
  } catch (error) {
    console.error("List artworks error:", error);
    return errorResponse("Failed to load artworks", 500);
  }
}
