import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system", "/*/design-system", "/contact/thank-you", "/*/contact/thank-you"],
      },
    ],
  };
}
