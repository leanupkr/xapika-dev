import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: ReadonlyArray<RouteConfig> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/heavy-maintenance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/light-maintenance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/supply-chain", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/digital-asset-management", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/commercial-services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portfolios", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portfolios/ukraine-emu", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portfolios/warsaw-tram", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portfolios/uzbekistan-rail", changeFrequency: "monthly", priority: 0.8 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => {
    const url = siteUrl(route.path);
    return {
      url,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: url,
          "x-default": url,
        },
      },
    };
  });
}
