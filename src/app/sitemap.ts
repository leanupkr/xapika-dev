import type { MetadataRoute } from "next";
import { getRequestOrigin, PL_ORIGIN, KR_ORIGIN } from "@/lib/seo-host";

// Note: calling getRequestOrigin() (which calls headers()) makes this sitemap
// dynamic — each host receives its own <loc> origin, preventing canonical
// conflicts between xapika.pl and xapika.co.kr.
// Confirmed via Next.js 16 docs: "sitemap.js is cached by default unless it
// uses a Request-time API" — headers() is a Request-time API.

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: ReadonlyArray<RouteConfig> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/ceo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/vision", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/history", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/organization", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/clients", changeFrequency: "monthly", priority: 0.7 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/solutions/heavy-maintenance",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/solutions/light-maintenance",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/solutions/supply-chain",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/solutions/digital-asset-management",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/solutions/commercial-services",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { path: "/portfolios", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/portfolios/ukraine-emu",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/portfolios/warsaw-tram",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/portfolios/uzbekistan-rail",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { path: "/news", changeFrequency: "daily", priority: 0.7 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestOrigin();
  const lastModified = new Date();
  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((route) => {
    const cleanPath = route.path.replace(/^\/+/, "");
    const selfUrl = cleanPath ? `${origin}/${cleanPath}` : origin;
    const plUrl = cleanPath ? `${PL_ORIGIN}/${cleanPath}` : PL_ORIGIN;
    const krUrl = cleanPath ? `${KR_ORIGIN}/${cleanPath}` : KR_ORIGIN;
    return {
      url: selfUrl, // <loc> matches the request host — no canonical conflict
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          "en-PL": plUrl,
          "en-KR": krUrl,
          "x-default": plUrl, // HQ/Warsaw is the global default
        },
      },
    };
  });

  // News slugs are fetched dynamically and appended below (rather than
  // hardcoded in ROUTES) because they come from Sanity, not this file.
  // Wrapped in try/catch, with the Sanity modules loaded via dynamic
  // import(), so that a missing/unreachable Sanity project (see
  // src/sanity/env.ts — no project has been created yet) degrades to
  // "skip the dynamic entries" instead of failing sitemap generation, and
  // by extension `next build`, entirely. The 32 static pages above must
  // always ship regardless of Sanity's state.
  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const { sanityFetch } = await import("@/sanity/fetch");
    const { newsSlugsQuery } = await import("@/sanity/queries");
    const slugs = await sanityFetch<{ slug: string }[]>({
      query: newsSlugsQuery,
      tags: ["news"],
    });
    newsEntries = slugs.map((s) => {
      const cleanPath = `news/${s.slug}`;
      const selfUrl = `${origin}/${cleanPath}`;
      const plUrl = `${PL_ORIGIN}/${cleanPath}`;
      const krUrl = `${KR_ORIGIN}/${cleanPath}`;
      return {
        url: selfUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: { "en-PL": plUrl, "en-KR": krUrl, "x-default": plUrl },
        },
      };
    });
  } catch (err) {
    console.error("[sitemap] news slug fetch failed", err);
  }

  return [...staticEntries, ...newsEntries];
}
