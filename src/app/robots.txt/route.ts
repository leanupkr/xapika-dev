import type { NextRequest } from "next/server";
import { PL_ORIGIN, KR_ORIGIN } from "@/lib/seo-host";

export async function GET(request: NextRequest): Promise<Response> {
  const host = request.headers.get("host") ?? "";
  const bare = host.split(":")[0];
  const origin =
    bare === "xapika.co.kr" || bare.endsWith(".xapika.co.kr")
      ? KR_ORIGIN
      : PL_ORIGIN;

  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /design-system",
    "Disallow: /contact/thank-you",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Vary": "Host",
    },
  });
}
