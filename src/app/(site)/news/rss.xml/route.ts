// src/app/news/rss.xml/route.ts
//
// RSS 2.0 feed for /news. Sanity is not provisioned yet (no project id) —
// sanityFetch() always throws in that state (see src/sanity/fetch.ts), so
// this route must catch that and still return a valid, empty feed rather
// than fail the request or (worse) the build.
import { sanityFetch } from "@/sanity/fetch";
import { newsListQuery } from "@/sanity/queries";
import type { NewsCardData } from "@/sanity/types";
import { PL_ORIGIN } from "@/lib/seo-host";

export const revalidate = 3600; // webhook-driven revalidatePath("/news/rss.xml") is the primary path; this is the failure-mode safety net

/** Escapes the three characters that are ever illegal in XML text content. Used for plain URLs only. */
function escapeXmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Wraps free-form editorial text (titles, excerpts) in a CDATA section so
 * arbitrary characters from Sanity content — quotes, ampersands, stray
 * angle brackets — never need per-character entity escaping. The one thing
 * CDATA itself cannot contain is its own terminator, so any literal `]]>`
 * inside the source text is split across two adjacent CDATA sections.
 */
function cdata(value: string): string {
  const safe = value.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

export async function GET(): Promise<Response> {
  let posts: NewsCardData[] = [];
  try {
    posts = await sanityFetch<NewsCardData[]>({ query: newsListQuery, tags: ["news"] });
  } catch (err) {
    // Sanity unset/unreachable — fall back to an empty (but valid) feed
    // rather than a 500. A parked <rss> shell is a better experience for
    // feed readers than a broken response, and it means this route can
    // never fail `next build`'s route enumeration either.
    console.error("[news] rss fetch failed", err);
  }

  const items = posts
    .slice(0, 30)
    .map((post) => {
      const url = `${PL_ORIGIN}/news/${post.slug}`;
      const safeUrl = escapeXmlText(url);
      return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${safeUrl}</link>
      <guid isPermaLink="true">${safeUrl}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${cdata(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Xapika Engineering — News</title>
    <link>${PL_ORIGIN}/news</link>
    <description>Company announcements, project milestones, and press coverage.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
