import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
  decodeCursor,
  isKeysetSafeSort,
} from "@/lib/api-helpers";
import {
  findPublicCharacters,
  findPublicCharactersCursor,
  findCharacterById,
} from "@/lib/services/character.service";
import { CHARACTER_SORT_FIELDS } from "@/lib/services/sort-config";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/**
 * GET /api/characters — List public characters (or fetch one by id).
 *
 * Query params:
 *   page, limit, sort (createdAt|name|updatedAt), order (asc|desc)
 *   search — free-text search on name/personality
 *   id     — fetch a single character by id (returns detail shape)
 *   fields — comma-separated projection (e.g. fields=id,name,referenceImages)
 *
 * Cursor (keyset) pagination — scalable deep pages:
 *   cursor — opaque token returned as `pagination.nextCursor`. When present
 *            (and `sort` is keyset-safe: createdAt | updatedAt), the list is
 *            fetched with an index range predicate instead of OFFSET, which
 *            stays O(log n) no matter how deep the page. The response
 *            pagination object then carries `nextCursor` for the following
 *            page. Enum sorts and malformed cursors transparently fall back
 *            to offset pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "characters", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "createdAt", order: "desc" });
    const fields = parseFields(searchParams);

    const search = searchParams.get("search") || undefined;
    const id = searchParams.get("id") || undefined;

    // Single character by ID
    if (id) {
      const character = await findCharacterById(id);
      if (!character) {
        return notFoundResponse("Character not found");
      }
      return conditionalJsonResponse(
        request,
        { character: projectFields(character, fields) },
        { cache: "medium" },
      );
    }

    const filters = { search };

    // Cursor mode is only valid for keyset-safe sort fields (enum sorts like
    // `style` cannot drive a range predicate in Prisma) that are ALSO
    // whitelisted for the character entity — a sort the service would clamp
    // must not decode a cursor, or the keyset predicate would compare against
    // the wrong column. The search filter composes fine with the keyset
    // predicate.
    const canCursor =
      isKeysetSafeSort(pagination.sort) &&
      CHARACTER_SORT_FIELDS.includes(
        pagination.sort as (typeof CHARACTER_SORT_FIELDS)[number],
      );

    const cursor = canCursor ? decodeCursor(searchParams.get("cursor")) : null;

    if (cursor) {
      const { characters, total, hasNextPage } =
        await findPublicCharactersCursor(pagination, filters, cursor);

      return conditionalJsonResponse(
        request,
        {
          characters: projectFields(characters, fields),
          pagination: {
            ...buildPaginationMeta(total, 1, pagination.limit),
            nextCursor: buildNextCursor(
              characters as unknown as Record<string, unknown>[],
              pagination.sort,
              hasNextPage,
            ),
          },
        },
        { cache: "medium" },
      );
    }

    const { characters, total } = await findPublicCharacters(pagination, filters);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

    // Emit the first cursor from the offset page so clients can switch to
    // keyset pagination for deep pages (when the sort is keyset-safe).
    const nextCursor = canCursor
      ? buildNextCursor(
          characters as unknown as Record<string, unknown>[],
          pagination.sort,
          meta.hasNextPage,
        )
      : null;

    return conditionalJsonResponse(request, {
      characters: projectFields(characters, fields),
      pagination: { ...meta, nextCursor },
    }, { cache: "medium" });
  } catch (error) {
    console.error("List characters error:", error);
    return errorResponse("Failed to load characters", 500);
  }
}
