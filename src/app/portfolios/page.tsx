import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import PortfoliosIndex, {
  type PortfolioCardItem,
} from "@/components/sections/PortfoliosIndex";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/portfolios",
    title: "Portfolios",
    description:
      "Operational portfolios verified by client records, regulator audits, and uninterrupted service hours — Xapika Engineering's three live programs.",
  });
}

export default async function PortfoliosIndexPage() {
  const items: ReadonlyArray<PortfolioCardItem> = [
    {
      key: "ukraine",
      href: "/portfolios/ukraine-emu",
      country: "Ukraine",
      project: "Ukraine HRCS2 EMU",
      metric: "90 cars · since 2017",
      summary: "Operating uninterrupted since the 2022 invasion.",
      image: "/portfolios/ukraine-emu/hero-main.jpg",
      imgAlt:
        "HRCS2 high-speed unit at Kyiv depot — Xapika maintenance program, 2017–",
    },
    {
      key: "warsaw",
      href: "/portfolios/warsaw-tram",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      metric: "123 units · since 2021",
      summary: "150-year-old transit lifeline, modern maintenance discipline.",
      image: "/portfolios/warsaw-tram/hero-main.jpg",
      imgAlt:
        "Warsaw tram on mainline service — Tramwaje Warszawskie maintenance program, 2022–",
    },
    {
      key: "uzbekistan",
      href: "/portfolios/uzbekistan-rail",
      country: "Uzbekistan",
      project: "Uzbekistan HSR O&M",
      metric: "Coming 2026.05",
      summary: "New high-speed program, opening this year.",
      comingBadge: "Coming",
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "Portfolios", path: "portfolios" }],
        })}
      />
      <PortfoliosIndex
        overline="Portfolios"
        title="Where the work proves itself."
        subtitle="Operational portfolios verified by client records, regulator audits, and uninterrupted service hours."
        readMore="Read case study"
        placeholder="Project photograph arriving"
        items={items}
        downloadPdf={{
          label: "Download Xapika Engineering Introduction",
          meta: "PDF · 20 pages · 11 MB",
          ariaLabel:
            "Download Xapika Engineering Introduction PDF (20 pages, 11 MB)",
        }}
      />
    </>
  );
}
