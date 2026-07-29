import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  authenticateRequest,
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "auth-me", readLimiter);
    if (rateCheck) return rateCheck;

    const auth = await authenticateRequest(request);
    if (!auth.authenticated) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.payload.userId },
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
