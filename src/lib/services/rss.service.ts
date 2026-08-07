/**
 * AniVerse — RSS Feed Service
 *
 * Generates an RSS 2.0 feed from published BlogArticle content.
 * Used by the `/feed.xml` route for content distribution & SEO.
 */

import { prisma } from "@/lib/prisma";
import { APP_URL } from "@/lib/constants";

const RSS_FEED_LIMIT = 20;
const SITE_URL = APP_URL;
const SITE_TITLE = "AniVerse Blog";
const SITE_DESCRIPTION =
  "Tutorials, guides, and updates from the AniVerse team — AI anime art creation tips and platform news.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Fetch the most recent published articles for the feed.
 */
async function findRssArticles() {
  return prisma.blogArticle.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    take: RSS_FEED_LIMIT,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
      author: {
        select: { name: true },
      },
    },
  });
}

/**
 * Build the complete RSS 2.0 XML document.
 */
export async function generateBlogRss(): Promise<string> {
  const articles = await findRssArticles();

  const items = articles
    .map((article) => {
      const pubDate = article.publishedAt
        ? article.publishedAt.toUTCString()
        : article.updatedAt.toUTCString();
      const description = escapeXml(article.excerpt || article.title);
      const categories = article.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${SITE_URL}/blog/${article.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
${categories}
    <author>${escapeXml(article.author?.name || "AniVerse")}</author>
  </item>`;
    })
    .join("\n");

  const lastBuild = articles[0]?.publishedAt?.toUTCString() || new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
