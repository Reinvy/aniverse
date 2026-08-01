import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { getDashboardStats } from "@/lib/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "dashboard-stats",
    });
    if (!auth.ok) return auth.response;

    const userId = auth.userId;

    const result = await getDashboardStats(userId);

    return conditionalJsonResponse(request, result, {
      cache: "short",
      private: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return notFoundResponse("User not found");
    }
    console.error("Dashboard stats error:", error);
    return errorResponse("Failed to load dashboard stats", 500);
  }
}
