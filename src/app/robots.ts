import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

/**
 * robots.txt — allow public crawl, block auth/dashboard/API internals.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
