import { NextRequest } from "next/server";
import {
  authenticateRequest,
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { getDashboardStats } from "@/lib/services/dashboard.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) return auth.response;

    const userId = auth.payload.userId;

    const result = await getDashboardStats(userId);

    return cachedJsonResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return notFoundResponse("User not found");
    }
    console.error("Dashboard stats error:", error);
    return errorResponse("Failed to load dashboard stats", 500);
  }
}
