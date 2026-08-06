import { NextRequest } from "next/server";
import {
  parsePagination,
  parseFields,
  projectFields,
  buildPaginationMeta,
  buildNextCursor,
  conditionalJsonResponse,
  errorResponse,
  decodeCursor,
  isKeysetSafeSort,
} from "@/lib/api-helpers";
import {
  findPublishedArticles,
  findPublishedArticlesCursor,
  findArticleTags,
  findFeaturedArticle,
} from "@/lib/services/blog.service";
import { BLOG_ARTICLE_SORT_FIELDS } from "@/lib/services/sort-config";
import { applyRateLimit, readLimiter } from "@/lib/rate-limiter";

/**
 * GET /api/blog — List published articles (with optional featured hero)
 *
 * Query params:
 *   page, limit, sort (publishedAt|title|createdAt|updatedAt), order
 *   search — free-text search on title/excerpt
 *   tag    — filter by tag
 *   featured — "true" to narrow to featured articles only
 *   fields — comma-separated projection
 *   cursor — opaque keyset token returned as `pagination.nextCursor`. When
 *            present (and `sort` is keyset-safe), the list is fetched with an
 *            index range predicate instead of OFFSET — O(log n) per page at
 *            any depth. Page 1 (offset) already emits `nextCursor` so clients
 *            can switch to keyset mode for deep pages. Malformed cursors fall
 *            back to offset pagination.
 */
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
    const filters = {
      search,
      tag,
      featured: featuredOnly || undefined,
    };

    // Whether the active sort can drive a keyset cursor for this entity.
    const canCursor =
      isKeysetSafeSort(pagination.sort) &&
      BLOG_ARTICLE_SORT_FIELDS.includes(
        pagination.sort as (typeof BLOG_ARTICLE_SORT_FIELDS)[number],
      );

    // Cursor mode requires a keyset-safe sort that is ALSO whitelisted for the
    // blog entity (avoids decoding a cursor for a sort the service would clamp).
    const cursor = canCursor ? decodeCursor(searchParams.get("cursor")) : null;

    let articles;
    let paginationMeta;

    if (cursor) {
      const result = await findPublishedArticlesCursor(pagination, filters, cursor);
      articles = result.articles;
      paginationMeta = {
        ...buildPaginationMeta(result.total, 1, pagination.limit),
        nextCursor: buildNextCursor(
          articles as unknown as Record<string, unknown>[],
          pagination.sort,
          result.hasNextPage,
        ),
      };
    } else {
      const result = await findPublishedArticles(pagination, filters);
      articles = result.articles;
      const meta = buildPaginationMeta(
        result.total,
        pagination.page,
        pagination.limit,
      );
      paginationMeta = {
        ...meta,
        nextCursor: canCursor
          ? buildNextCursor(
              articles as unknown as Record<string, unknown>[],
              pagination.sort,
              meta.hasNextPage,
            )
          : null,
      };
    }

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
      pagination: paginationMeta,
    }, { cache: "medium" });
  } catch (error) {
    console.error("List blog articles error:", error);
    return errorResponse("Failed to load articles", 500);
  }
}
