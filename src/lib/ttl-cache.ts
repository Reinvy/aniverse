/**
 * AniVerse — Tiny In-Memory TTL Cache
 *
 * Generic bounded cache with time-to-live expiry, used for expensive
 * aggregate queries that don't need second-level freshness (e.g. marketplace
 * stat bars, dashboard rollups). Keeps per-instance memory bounded via
 * lazy expiry + max-entry eviction (oldest inserted first).
 *
 * NOTE: This is a per-instance cache (not shared across serverless
 * instances). It is a cheap scalability win for read-heavy aggregate
 * endpoints — NOT a substitute for Redis when cross-instance consistency
 * or long-lived state is required.
 *
 * Usage:
 *   const cache = createTtlCache<MarketplaceStats>(60_000);
 *   const cached = cache.get("global");
 *   if (cached) return cached;
 *   const stats = await computeStats();
 *   cache.set("global", stats);
 *   return stats;
 */

export interface TtlCache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

export function createTtlCache<T>(
  ttlMs: number,
  maxEntries = 500,
): TtlCache<T> {
  const store = new Map<string, CacheEntry<T>>();

  /** Drop expired entries and evict oldest beyond maxEntries. */
  function prune(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(store.entries())) {
      if (entry.expiresAt <= now) {
        store.delete(key);
      }
    }
    // Map preserves insertion order — first key is the oldest set().
    while (store.size > maxEntries) {
      const oldestKey = store.keys().next().value;
      if (oldestKey === undefined) break;
      store.delete(oldestKey);
    }
  }

  function get(key: string): T | undefined {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function set(key: string, value: T): void {
    // Re-insert so recently-set keys are treated as newest on eviction.
    store.delete(key);
    store.set(key, { expiresAt: Date.now() + ttlMs, value });
    prune();
  }

  return {
    get,
    set,
    has: (key) => get(key) !== undefined,
    delete: (key) => store.delete(key),
    clear: () => store.clear(),
    size: () => store.size,
  };
}
