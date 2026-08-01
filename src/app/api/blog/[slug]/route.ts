import { NextRequest } from "next/server";
import {
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import {
  findArticleBySlug,
  findRelatedArticles,
} from "@/lib/services/blog.service";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/** GET /api/blog/[slug] — Get a single published article by slug (with related articles) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const rateCheck = applyRateLimit(_request, "blog-article", readLimiter);
    if (rateCheck) return rateCheck;

    const { slug } = await params;
    const article = await findArticleBySlug(slug);

    if (!article) {
      return notFoundResponse("Article not found");
    }

    const related = await findRelatedArticles(slug, article.tags, 3);

    return conditionalJsonResponse(_request, { article, related }, { cache: "medium" });
  } catch (error) {
    console.error("Get blog article error:", error);
    return errorResponse("Failed to load article", 500);
  }
}
