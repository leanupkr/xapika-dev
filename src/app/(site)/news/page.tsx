import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import NewsIndex from "@/components/sections/NewsIndex";
import { newsCollectionLd } from "@/lib/newsLd";
import { sanityFetch } from "@/sanity/fetch";
import { newsListQuery } from "@/sanity/queries";
import type { NewsCardData } from "@/sanity/types";

// Webhook-driven revalidation (see src/app/api/revalidate) is the primary
// path; this is only the safety net if a webhook delivery is ever missed.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/news",
    title: "News & Press",
    description:
      "Company announcements, project milestones, and press coverage from Xapika Engineering's rail maintenance programs.",
  });
}

async function getPosts(): Promise<NewsCardData[]> {
  try {
    return await sanityFetch<NewsCardData[]>({
      query: newsListQuery,
      tags: ["news"],
    });
  } catch (err) {
    // sanityFetch() always throws on failure (missing project id, network
    // error, malformed query — see src/sanity/fetch.ts's documented
    // contract) and never returns a fallback itself. This is expected right
    // now since the Sanity project doesn't exist yet: fall back to an empty
    // list so the page still builds and renders its empty state instead of
    // crashing the route.
    console.error("[news] list fetch failed", err);
    return [];
  }
}

export default async function NewsIndexPage() {
  const [origin, posts] = await Promise.all([getRequestOrigin(), getPosts()]);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, { trail: [{ name: "News", path: "news" }] })}
      />
      <JsonLd
        id="ld-news-collection"
        data={newsCollectionLd(origin, { posts })}
      />
      <PageHero
        patternId="pattern-news-index"
        overline="News"
        title="From the depots to the newsroom."
        subtitle="Company announcements, project milestones, and press coverage — in one place."
      />
      <NewsIndex posts={posts} />
    </>
  );
}
