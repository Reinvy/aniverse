import { NextRequest } from "next/server";
import {
  authenticateRequest,
  parsePagination,
  buildPaginationMeta,
  cachedJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { findUsers } from "@/lib/services/user.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";
import type { Role, PremiumTier } from "@/generated/prisma/client";

/** GET /api/users — List users with pagination, search, and filtering */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "users-list", readLimiter);
    if (rateCheck) return rateCheck;

    const auth = await authenticateRequest(request);
    if (!auth.authenticated) return auth.response;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, {
      sort: "createdAt",
      order: "desc",
    });

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

    return cachedJsonResponse(
      {
        users,
        pagination: buildPaginationMeta(
          total,
          pagination.page,
          pagination.limit,
        ),
      },
      { cache: "short" },
    );
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("Failed to load users", 500);
  }
}
