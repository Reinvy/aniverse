import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aniverse-dev-secret-key",
);

const ISSUER = "aniverse";
const EXPIRATION = "7d";

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
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token. Returns the payload or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
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
