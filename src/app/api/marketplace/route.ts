import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  buildCursorPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
  resolveCursorMode,
} from "@/lib/api-helpers";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";
import {
  findMarketplaceProducts,
  findMarketplaceProductsCursor,
  getMarketplaceStats,
  resolveMarketplaceSort,
} from "@/lib/services/marketplace.service";

/**
 * GET /api/marketplace — Public marketplace listings.
 *
 * Lists ACTIVE products (digital art listings) across all creators with
 * pagination, text search, and price sorting, plus aggregate stats for the
 * marketplace stat bar (total listings, active creators, avg price, sales).
 *
 * All data is read live from the DB (Product / Order tables) — no hardcoded
 * listings. Checkout itself is pending Stripe integration, so "Add to Cart"
 * on the client is currently a coming-soon toast, but the catalog is real.
 *
 * Query params:
 *   page, limit
 *   search — free-text search on product name/description
 *   sort   — newest | price-asc | price-desc
 *   fields — comma-separated projection (e.g. fields=id,name,price)
 *
 * Cursor (keyset) pagination — scalable deep pages:
 *   cursor  — opaque token returned as `pagination.nextCursor`. Both
 *             marketplace sorts are keyset-safe (createdAt DateTime / price
 *             Decimal accept range predicates), so a cursor always switches
 *             to an index range predicate instead of OFFSET — O(log n) per
 *             page at any depth. Page 1 (offset) already emits `nextCursor`
 *             so clients can switch to keyset mode for deep pages. Malformed
 *             cursors fall back to offset pagination.
 *
 * Scalability: the listing query lives in the marketplace service layer
 * (`src/lib/services/marketplace.service.ts`), and the four aggregate
 * stat-bar queries are TTL-cached in-memory (60s) — steady-state cost is
 * 2 DB queries per request instead of 6.
 */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "marketplace", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, {
      sort: "createdAt",
      order: "desc",
    });
    const fields = parseFields(searchParams);
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "newest";

    const filters = { search, sort };

    // Both marketplace sorts (createdAt / price) are keyset-safe, so a valid
    // cursor always enables the index-range path. Resolve the sort so the
    // nextCursor is built from the ACTIVE sort column (price vs createdAt).
    const { sortField } = resolveMarketplaceSort(sort);
    const { canCursor, cursor } = resolveCursorMode(
      searchParams,
      sortField,
      [sortField],
    );

    if (cursor) {
      const { products, total, hasNextPage } =
        await findMarketplaceProductsCursor(pagination, filters, cursor);

      return conditionalJsonResponse(
        request,
        {
          products: projectFields(
            products.map((p) => ({ ...p, price: Number(p.price) })),
            fields,
          ),
          pagination: buildCursorPaginationMeta(
            products as unknown as Record<string, unknown>[],
            total,
            pagination.limit,
            sortField,
            hasNextPage,
          ),
          stats: await getMarketplaceStats(),
        },
        { cache: "short" },
      );
    }

    const { products, total } = await findMarketplaceProducts(pagination, filters);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);

    // Emit the first cursor from the offset page so clients can switch to
    // keyset pagination for deep pages.
    const nextCursor =
      canCursor && meta.hasNextPage
        ? buildNextCursor(
            products as unknown as Record<string, unknown>[],
            sortField,
            meta.hasNextPage,
          )
        : null;

    const stats = await getMarketplaceStats();

    return conditionalJsonResponse(
      request,
      {
        products: projectFields(
          products.map((p) => ({ ...p, price: Number(p.price) })),
          fields,
        ),
        pagination: { ...meta, nextCursor },
        stats,
      },
      { cache: "short" },
    );
  } catch (error) {
    console.error("List marketplace products error:", error);
    return errorResponse("Failed to load marketplace", 500);
  }
}
