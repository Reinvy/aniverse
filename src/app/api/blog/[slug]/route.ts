import { NextRequest } from "next/server";
import {
  cachedJsonResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { findArticleBySlug } from "@/lib/services/blog.service";

/** GET /api/blog/[slug] — Get a single published article by slug */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const article = await findArticleBySlug(slug);

    if (!article) {
      return notFoundResponse("Article not found");
    }

    return cachedJsonResponse({ article }, { cache: "medium" });
  } catch (error) {
    console.error("Get blog article error:", error);
    return errorResponse("Failed to load article", 500);
  }
}
