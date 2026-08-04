import { NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  parsePagination,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";
import { buildSearchClause } from "@/lib/query-builder";

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

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search) {
      const searchClause = buildSearchClause(search, ["name", "description"]);
      if (searchClause) {
        where.OR = searchClause;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: "desc",
    };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          artwork: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              style: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Aggregate stats — global (unfiltered) so the stat bar reflects the
    // whole marketplace, not just the current search/page.
    const [totalListings, creatorGroups, priceAgg, salesAgg] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.groupBy({
          by: ["creatorId"],
          where: { isActive: true },
          _count: { _all: true },
        }),
        prisma.product.aggregate({
          where: { isActive: true },
          _avg: { price: true },
        }),
        prisma.order.aggregate({
          where: { status: { in: ["PAID", "COMPLETED"] } },
          _sum: { total: true },
        }),
      ]);

    const stats = {
      totalListings,
      activeCreators: creatorGroups.length,
      avgPrice: priceAgg._avg.price ? Number(priceAgg._avg.price) : 0,
      totalSales: salesAgg._sum.total ? Number(salesAgg._sum.total) : 0,
    };

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
