/**
 * AniVerse — Request ID Generator
 *
 * Tiny dependency-free helper for short, collision-resistant request IDs
 * used for observability at scale: every error/429 response carries an
 * `X-Request-Id` header (and a matching `requestId` body field) so a client
 * can quote the id when reporting a failure and ops can correlate it with
 * server logs.
 *
 * Format: `<base36-ms>-<8 hex chars>` — the timestamp prefix keeps ids
 * roughly sortable by time in log aggregators; the UUID suffix makes
 * collisions practically impossible. The id is for correlation, not
 * security, so a non-cryptographic suffix would also be acceptable.
 *
 * Kept in its own module so both `api-helpers.ts` and `rate-limiter.ts`
 * can use it without a circular import.
 */

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}
