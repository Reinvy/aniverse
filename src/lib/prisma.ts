import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * PostgreSQL pool configuration for the PrismaPg adapter.
 *
 * This is the single most important scalability knob for a serverless
 * (Vercel) deployment talking to a dedicated Postgres: every cold lambda
 * instance constructs its own Prisma client AND its own pg connection pool.
 * With the driver's defaults (unbounded idle pool, no per-instance cap,
 * no connection timeout) a traffic spike that fans out to N concurrent
 * instances can open N × 10 connections against the database, exhausting
 * `max_connections` and taking down the whole app with "remaining connection
 * slots are reserved" errors.
 *
 * The values below trade a little per-instance concurrency for hard bounds:
 *
 *   max                      — hard cap of 4 connections per instance. Most
 *                              route handlers issue 1-3 queries (batched via
 *                              Promise.all), so 4 concurrent slots is ample;
 *                              the cap bounds worst-case connections to
 *                              4 × live instances instead of 10 × live
 *                              instances.
 *   idleTimeoutMillis        — return idle connections to the OS after 20s so
 *                              a quiet instance stops holding DB slots at all.
 *   connectionTimeoutMillis  — fail fast (5s) instead of hanging requests on
 *                              an exhausted pool; the route's error handler
 *                              turns this into a 503-style 500 quickly.
 *   maxUses                  — recycle a connection after 7,500 queries to
 *                              avoid long-lived-connection issues with
 *                              proxies/gateways (pg ≥ 8.5).
 *   allowExitOnIdle          — let the process exit naturally when nothing is
 *                              checked out (clean serverless shutdown).
 */
const POOL_CONFIG = {
  max: 4,
  idleTimeoutMillis: 20_000,
  connectionTimeoutMillis: 5_000,
  maxUses: 7_500,
  allowExitOnIdle: true,
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    ...POOL_CONFIG,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
