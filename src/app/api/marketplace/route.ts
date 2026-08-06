import { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";
import {
  findMarketplaceProducts,
  getMarketplaceStats,
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
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "newest";

    const { products, total } = await findMarketplaceProducts(pagination, {
      search,
      sort,
    });
    const stats = await getMarketplaceStats();

    return conditionalJsonResponse(
      request,
      {
        products: products.map((p) => ({
          ...p,
          price: Number(p.price),
        })),
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
        stats,
      },
      { cache: "short" },
    );
  } catch (error) {
    console.error("List marketplace products error:", error);
    return errorResponse("Failed to load marketplace", 500);
  }
}
