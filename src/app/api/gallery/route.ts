import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { findPublicArtworks } from "@/lib/services/artwork.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/**
 * GET /api/gallery — Public community gallery.
 *
 * Lists PUBLIC artworks across all creators with pagination, sorting,
 * style/search filtering, and sparse fieldsets. This is the read path
 * for the community gallery page — no authentication required since
 * only `isPublic: true` artworks are ever returned.
 *
 * Query params:
 *   page, limit, sort (createdAt|title|updatedAt|style), order (asc|desc)
 *   style   — ArtworkStyle enum value (ANIME, MANGA, CHIBI, ...)
 *   search  — free-text search on title/prompt
 *   creatorId — narrow to one creator
 *   fields  — comma-separated projection (e.g. fields=id,title,imageUrl)
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "gallery", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, {
      sort: "createdAt",
      order: "desc",
    });
    const fields = parseFields(searchParams);

    const styleRaw = searchParams.get("style") || undefined;
    const validStyles = [
      "ANIME",
      "MANGA",
      "CHIBI",
      "REALISTIC",
      "SEMI_REALISTIC",
      "WATERCOLOR",
      "PIXEL_ART",
      "OTHER",
    ] as const;
    const style =
      styleRaw && validStyles.includes(styleRaw as (typeof validStyles)[number])
        ? (styleRaw as (typeof validStyles)[number])
        : undefined;
    const search = searchParams.get("search") || undefined;
    const creatorId = searchParams.get("creatorId") || undefined;

    const { artworks, total } = await findPublicArtworks(pagination, {
      style,
      search,
      creatorId,
    });

    return conditionalJsonResponse(
      request,
      {
        artworks: projectFields(artworks, fields),
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      },
      { cache: "short" },
    );
  } catch (error) {
    console.error("List gallery artworks error:", error);
    return errorResponse("Failed to load gallery", 500);
  }
}
