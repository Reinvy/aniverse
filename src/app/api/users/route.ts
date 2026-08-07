import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
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
import { findUsers, findUsersCursor } from "@/lib/services/user.service";
import { USER_SORT_FIELDS } from "@/lib/services/sort-config";
import type { Role, PremiumTier } from "@/generated/prisma/client";

/**
 * GET /api/users — List users with pagination, search, and filtering.
 *
 * Query params:
 *   page, limit, sort (createdAt|name|email|role|premiumTier), order
 *   search — free-text search on name/username/email
 *   role — USER | CREATOR | ADMIN
 *   premiumTier — FREE | PRO | ULTIMATE
 *   fields — comma-separated projection
 *   cursor — opaque keyset token returned as `pagination.nextCursor`. When
 *            present (and `sort` is keyset-safe: createdAt), the list is
 *            fetched with an index range predicate instead of OFFSET —
 *            O(log n) per page at any depth. Page 1 (offset) already emits
 *            `nextCursor` so clients can switch to keyset mode for deep
 *            pages. Malformed cursors fall back to offset pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "users-list",
    });
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, {
      sort: "createdAt",
      order: "desc",
    });
    const fields = parseFields(searchParams);

    const search = searchParams.get("search") || undefined;
    const roleRaw = searchParams.get("role") || undefined;
    const premiumTierRaw = searchParams.get("premiumTier") || undefined;

    // Validate enum params
    const validRoles: Role[] = ["USER", "CREATOR", "ADMIN"];
    const validTiers: PremiumTier[] = ["FREE", "PRO", "ULTIMATE"];
    const role = roleRaw && validRoles.includes(roleRaw as Role) ? (roleRaw as Role) : undefined;
    const premiumTier =
      premiumTierRaw && validTiers.includes(premiumTierRaw as PremiumTier)
        ? (premiumTierRaw as PremiumTier)
        : undefined;

    const filters = { search, role, premiumTier };

    // Whether the active sort can drive a keyset cursor for this entity.
    const canCursor =
      isKeysetSafeSort(pagination.sort) &&
      USER_SORT_FIELDS.includes(
        pagination.sort as (typeof USER_SORT_FIELDS)[number],
      );

    const cursor = canCursor ? decodeCursor(searchParams.get("cursor")) : null;

    if (cursor) {
      const { users, total, hasNextPage } = await findUsersCursor(
        pagination,
        filters,
        cursor,
      );

      return conditionalJsonResponse(
        request,
        {
          users: projectFields(users, fields),
          pagination: {
            ...buildPaginationMeta(total, 1, pagination.limit),
            nextCursor: buildNextCursor(
              users as unknown as Record<string, unknown>[],
              pagination.sort,
              hasNextPage,
            ),
          },
        },
        { cache: "short", private: true },
      );
    }

    const { users, total } = await findUsers(pagination, filters);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

    return conditionalJsonResponse(
      request,
      {
        users: projectFields(users, fields),
        pagination: {
          ...meta,
          nextCursor: canCursor
            ? buildNextCursor(
                users as unknown as Record<string, unknown>[],
                pagination.sort,
                meta.hasNextPage,
              )
            : null,
        },
      },
      { cache: "short", private: true },
    );
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("Failed to load users", 500);
  }
}
