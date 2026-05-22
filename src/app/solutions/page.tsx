import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionsIndex, {
  type SolutionItem,
} from "@/components/sections/SolutionsIndex";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions",
    title: "Solutions",
    description:
      "Five maintenance disciplines under one operating standard — Xapika Engineering's solutions for rail operators.",
  });
}

export default async function SolutionsPage() {
  const items: ReadonlyArray<SolutionItem> = [
    {
      key: "heavy",
      href: "/solutions/heavy-maintenance",
      title: "Heavy Maintenance",
      description:
        "Comprehensive overhaul, refurbishment, and lifecycle extension services for rolling stock systems, ensuring long-term reliability, safety, and operational performance.",
      metric: "320+ Activities Annually",
      image: "/solutions/index-heavy.jpg",
      imgAlt: "heavy overhaul bay",
    },
    {
      key: "light",
      href: "/solutions/light-maintenance",
      title: "Light Maintenance",
      description:
        "Routine inspection, preventive maintenance, troubleshooting, and rapid-response support services designed to maximize fleet availability and ensure safe daily railway operations.",
      metric: "5,900+ Activities Annually",
      image: "/solutions/index-light.jpg",
      imgAlt: "HRCS2 daily inspection at depot",
    },
    {
      key: "supply",
      href: "/solutions/supply-chain",
      title: "Rolling Stock SCM",
      description:
        "Integrated sourcing, spare parts supply, logistics coordination, and inventory support solutions tailored for railway maintenance and operational continuity.",
      metric: "50+ Global Partners · 8,000+ Parts Managed",
      image: "/solutions/index-supply.webp",
      imgAlt: "supply chain component photo",
    },
    {
      key: "digital",
      href: "/solutions/digital-asset-management",
      title: "Digital Solutions & Asset Management",
      description:
        "Data-driven maintenance and asset lifecycle management solutions powered by VISION IT technologies, including MMIS, work order management, inventory tracking, and operational analytics for modern railway systems.",
      metric: "30% Faster Response · 97% Inventory Accuracy",
      image: "/solutions/index-digital.jpg",
      imgAlt: "VISION IT MMIS dashboard preview",
    },
    {
      key: "commercial",
      href: "/solutions/commercial-services",
      title: "Integrated Commercial & Ancillary Services",
      description:
        "Commercial development and business support solutions for railway environments, including retail operations, advertising, logistics coordination, and non-fare revenue services for railway operators and transit networks.",
      metric: "",
      image: "/solutions/index-commercial.jpg",
      imgAlt: "Warsaw tram interior",
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "Solutions", path: "solutions" }],
        })}
      />
      <SolutionsIndex
        overline="Solutions"
        title="Five disciplines. One operating discipline."
        subtitle="From daily inspection to heavy overhaul, every workstream meets the same audit standard."
        learnMore="Learn more"
        placeholder="Detail content arriving"
        items={items}
      />
    </>
  );
}
