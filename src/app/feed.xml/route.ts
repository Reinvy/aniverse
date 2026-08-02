import { generateBlogRss } from "@/lib/services/rss.service";

export const dynamic = "force-dynamic";

/** GET /feed.xml — RSS 2.0 feed of published blog articles */
export async function GET() {
  try {
    const xml = await generateBlogRss();

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Generate RSS feed error:", error);
    return new Response("Failed to generate feed", { status: 500 });
  }
}
