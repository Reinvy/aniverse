import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { findUserProfileById } from "@/lib/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "auth-me",
    });
    if (!auth.ok) return auth.response;

    const user = await findUserProfileById(auth.userId);

    if (!user) {
      return notFoundResponse("User not found");
    }

    return cachedJsonResponse({ user }, { cache: "no-store" });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
}
