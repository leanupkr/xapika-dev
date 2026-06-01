import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system", "/*/design-system", "/contact/thank-you", "/*/contact/thank-you"],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
