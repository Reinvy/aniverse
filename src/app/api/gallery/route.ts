import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  conditionalJsonResponse,
  errorResponse,
  decodeCursor,
  isKeysetSafeSort,
} from "@/lib/api-helpers";
import {
  findPublicArtworks,
  findPublicArtworksCursor,
} from "@/lib/services/artwork.service";
import { ARTWORK_SORT_FIELDS } from "@/lib/services/sort-config";
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
 *
 * Cursor (keyset) pagination — scalable deep pages:
 *   cursor  — opaque token returned as `pagination.nextCursor`. When present
 *             (and `sort` is keyset-safe: createdAt | updatedAt | title), the
 *             list is fetched with an index range predicate instead of OFFSET,
 *             which stays O(log n) no matter how deep the page. The response
 *             pagination object then carries `nextCursor` for the following
 *             page. Enum sorts (style) and malformed cursors transparently
 *             fall back to offset pagination.
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

    const filters = { style, search, creatorId };

    // Cursor mode is only valid for keyset-safe sort fields (enum sorts like
    // `style` cannot drive a range predicate in Prisma) that are ALSO
    // whitelisted for the artwork entity — a sort the service would clamp
    // (e.g. `publishedAt`) must not decode a cursor, or the keyset predicate
    // would compare against the wrong column. The style/search/creatorId
    // filters compose fine with the keyset predicate.
    const cursor =
      isKeysetSafeSort(pagination.sort) &&
      ARTWORK_SORT_FIELDS.includes(
        pagination.sort as (typeof ARTWORK_SORT_FIELDS)[number],
      )
        ? decodeCursor(searchParams.get("cursor"))
        : null;

    if (cursor) {
      const { artworks, total, hasNextPage } = await findPublicArtworksCursor(
        pagination,
        filters,
        cursor,
      );

      return conditionalJsonResponse(
        request,
        {
          artworks: projectFields(artworks, fields),
          pagination: {
            ...buildPaginationMeta(total, 1, pagination.limit),
            nextCursor: buildNextCursor(
              artworks as unknown as Record<string, unknown>[],
              pagination.sort,
              hasNextPage,
            ),
          },
        },
        { cache: "short" },
      );
    }

    const { artworks, total } = await findPublicArtworks(pagination, filters);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

    // Emit the first cursor from the offset page so clients can switch to
    // keyset pagination for deep pages (when the sort is keyset-safe).
    const nextCursor =
      isKeysetSafeSort(pagination.sort) &&
      ARTWORK_SORT_FIELDS.includes(
        pagination.sort as (typeof ARTWORK_SORT_FIELDS)[number],
      )
        ? buildNextCursor(
            artworks as unknown as Record<string, unknown>[],
            pagination.sort,
            meta.hasNextPage,
          )
        : null;

    return conditionalJsonResponse(
      request,
      {
        artworks: projectFields(artworks, fields),
        pagination: { ...meta, nextCursor },
      },
      { cache: "short" },
    );
  } catch (error) {
    console.error("List gallery artworks error:", error);
    return errorResponse("Failed to load gallery", 500);
  }
}
