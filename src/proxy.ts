/**
 * AniVerse — Proxy (Next.js 16 renamed `middleware` → `proxy`)
 *
 * Protects `/dashboard/*` routes by checking for the auth token cookie.
 * Actual token verification happens in the API routes (AuthGuard on the
 * client provides a second layer).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "aniverse_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Check for token in cookies (set by AuthProvider)
  const token =
    request.cookies.get(TOKEN_KEY)?.value ||
    // Check Authorization header as fallback
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Also check localStorage isn't possible in middleware (server-side),
  // but the client-side AuthGuard provides a second layer.
  // Middleware handles the cookie-based check for SSR.

  // If no token found, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token format (basic check - actual verification is in API routes)
  // Simple length check to avoid processing obviously invalid tokens
  if (token.length < 20) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
