import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const APP_URL = "https://aniverse-one-khaki.vercel.app";

/**
 * sitemap.xml — publicly indexable pages only.
 * Auth-gated (/dashboard/*) and auth pages (/login, /register) are
 * intentionally excluded to stay consistent with robots.txt disallow rules.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${APP_URL}/characters`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/challenges`, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const articles = await prisma.blogArticle.findMany({
      where: { isPublished: true, publishedAt: { lte: new Date() } },
      select: { slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    const blogRoutes: MetadataRoute.Sitemap = articles
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${APP_URL}/blog/${a.slug}`,
        lastModified: a.publishedAt ?? undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    // Never fail the sitemap (or the build) when the DB is unreachable —
    // fall back to the static public route set.
    console.error("sitemap generation error, falling back to static routes:", error);
    return staticRoutes;
  }
}
