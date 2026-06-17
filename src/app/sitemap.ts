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
  { path: "/locations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestOrigin();
  const lastModified = new Date();
  return ROUTES.map((route) => {
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
}
