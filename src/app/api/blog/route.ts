import { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import {
  findPublishedArticles,
  findArticleTags,
} from "@/lib/services/blog.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/blog — List published articles */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "blog-list", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "publishedAt", order: "desc" });

    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const { articles, total } = await findPublishedArticles(pagination, { search, tag });
    const tags = await findArticleTags();

    return conditionalJsonResponse(request, {
      articles,
      tags,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "medium" });
  } catch (error) {
    console.error("List blog articles error:", error);
    return errorResponse("Failed to load articles", 500);
  }
}
