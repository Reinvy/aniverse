import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { findUsers } from "@/lib/services/user.service";
import type { Role, PremiumTier } from "@/generated/prisma/client";

/** GET /api/users — List users with pagination, search, and filtering */
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

    const { users, total } = await findUsers(pagination, {
      search,
      role,
      premiumTier,
    });

    return conditionalJsonResponse(
      request,
      {
        users: projectFields(users, fields),
        pagination: buildPaginationMeta(
          total,
          pagination.page,
          pagination.limit,
        ),
      },
      { cache: "short", private: true },
    );
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("Failed to load users", 500);
  }
}
