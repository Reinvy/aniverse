import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const ISSUER = "aniverse";
const EXPIRATION = "7d";

/**
 * Resolve the JWT signing secret lazily.
 *
 * Fails CLOSED: a hardcoded fallback was previously used, which meant any
 * deployment without `JWT_SECRET` silently accepted tokens signed with a
 * publicly-known key. `JWT_SECRET` is now REQUIRED — if it is missing at
 * runtime, signing/verifying throws instead of falling back to a known
 * default. This is a deliberate security hardening (no known-default keys).
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not set — refusing to sign/verify tokens with a known default. Set JWT_SECRET (openssl rand -base64 48) and redeploy.",
    );
  }
  return new TextEncoder().encode(secret);
}

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
}

/**
 * Sign a JWT token for the given user.
 */
export async function signToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email } satisfies TokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(EXPIRATION)
    .sign(getJwtSecret());
}

/**
 * Verify and decode a JWT token. Returns the payload or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      issuer: ISSUER,
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extract the Bearer token from an Authorization header value.
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
