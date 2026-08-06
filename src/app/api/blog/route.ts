import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  conditionalJsonResponse,
  errorResponse,
} from "@/lib/api-helpers";
import {
  findPublishedArticles,
  findArticleTags,
  findFeaturedArticle,
} from "@/lib/services/blog.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/blog — List published articles (with optional featured hero) */
export async function GET(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "blog-list", readLimiter);
    if (rateCheck) return rateCheck;

    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, { sort: "publishedAt", order: "desc" });
    const fields = parseFields(searchParams);

    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const { articles, total } = await findPublishedArticles(pagination, {
      search,
      tag,
      featured: featuredOnly || undefined,
    });
    const tags = await findArticleTags();

    // Curated hero article — only on unfiltered list views (cheap indexed query)
    const featured =
      !featuredOnly && !search && !tag
        ? await findFeaturedArticle()
        : null;

    return conditionalJsonResponse(request, {
      articles: projectFields(articles, fields),
      tags,
      featured: featured ? projectFields(featured, fields) : null,
      pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
    }, { cache: "medium" });
  } catch (error) {
    console.error("List blog articles error:", error);
    return errorResponse("Failed to load articles", 500);
  }
}
