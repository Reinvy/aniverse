import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuthenticatedRequest,
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "auth-me",
    });
    if (!auth.ok) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        premiumTier: true,
        username: true,
        bio: true,
        avatar: true,
        coinBalance: true,
        createdAt: true,
      },
    });

    if (!user) {
      return notFoundResponse("User not found");
    }

    return cachedJsonResponse({ user }, { cache: "no-store" });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("An unexpected error occurred", 500);
  }
}
