import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  buildCursorPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
  decodeCursor,
  isKeysetSafeSort,
} from "@/lib/api-helpers";
import {
  findActiveChallenges,
  findActiveChallengesCursor,
  findChallengeById,
  findAllChallenges,
  findAllChallengesCursor,
} from "@/lib/services/challenge.service";
import { CHALLENGE_SORT_FIELDS } from "@/lib/services/sort-config";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/**
 * GET /api/challenges — List challenges (active by default, or all).
 *
 * Query params:
 *   page, limit, sort (createdAt|startsAt|endsAt|title|rewardCoins), order
 *   scope — "active" (default) | "all"
 *   type  — DAILY | WEEKLY
 *   id    — fetch a single challenge by id (returns detail shape)
 *   fields — comma-separated projection
 *   cursor — opaque keyset token returned as `pagination.nextCursor`. When
 *            present (and `sort` is keyset-safe: createdAt|startsAt|endsAt|
 *            title), the list is fetched with an index range predicate
 *            instead of OFFSET — O(log n) per page at any depth. Page 1
 *            (offset) already emits `nextCursor` so clients can switch to
 *            keyset mode for deep pages. Enum/Int sorts (rewardCoins, type,
 *            status) and malformed cursors fall back to offset pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "challenges", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "endsAt", order: "asc" });
    const fields = parseFields(searchParams);

    const scope = searchParams.get("scope") || "active";
    const id = searchParams.get("id") || undefined;
    const rawType = searchParams.get("type")?.toUpperCase();
    const type =
      rawType === "DAILY" || rawType === "WEEKLY" ? rawType : undefined;

    // Single challenge by ID
    if (id) {
      const challenge = await findChallengeById(id);
      if (!challenge) {
        return notFoundResponse("Challenge not found");
      }
      return conditionalJsonResponse(
        request,
        { challenge: projectFields(challenge, fields) },
        { cache: "short" },
      );
    }

    // Whether the active sort can drive a keyset cursor for this entity.
    // rewardCoins (Int) is deliberately excluded — Int filters reject string
    // cursor values — and enum sorts never enter cursor mode.
    const canCursor =
      isKeysetSafeSort(pagination.sort) &&
      CHALLENGE_SORT_FIELDS.includes(
        pagination.sort as (typeof CHALLENGE_SORT_FIELDS)[number],
      );

    const cursor = canCursor ? decodeCursor(searchParams.get("cursor")) : null;

    if (cursor) {
      const result =
        scope === "all"
          ? await findAllChallengesCursor(pagination, type, cursor)
          : await findActiveChallengesCursor(pagination, type, cursor);

      return conditionalJsonResponse(
        request,
        {
          challenges: projectFields(result.challenges, fields),
          pagination: buildCursorPaginationMeta(
            result.challenges as unknown as Record<string, unknown>[],
            result.total,
            pagination.limit,
            pagination.sort,
            result.hasNextPage,
          ),
        },
        { cache: "short" },
      );
    }

    // Offset paths (with first-cursor emission for keyset-safe sorts).
    if (scope === "all") {
      const { challenges, total } = await findAllChallenges(pagination, type);
      const meta = buildPaginationMeta(total, pagination.page, pagination.limit);
      return conditionalJsonResponse(request, {
        challenges: projectFields(challenges, fields),
        pagination: {
          ...meta,
          nextCursor:
            canCursor && meta.hasNextPage
              ? buildNextCursor(
                  challenges as unknown as Record<string, unknown>[],
                  pagination.sort,
                  meta.hasNextPage,
                )
              : null,
        },
      }, { cache: "short" });
    }

    const { challenges, total } = await findActiveChallenges(pagination, type);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);
    return conditionalJsonResponse(request, {
      challenges: projectFields(challenges, fields),
      pagination: {
        ...meta,
        nextCursor:
          canCursor && meta.hasNextPage
            ? buildNextCursor(
                challenges as unknown as Record<string, unknown>[],
                pagination.sort,
                meta.hasNextPage,
              )
            : null,
      },
    }, { cache: "short" });
  } catch (error) {
    console.error("List challenges error:", error);
    return errorResponse("Failed to load challenges", 500);
  }
}
