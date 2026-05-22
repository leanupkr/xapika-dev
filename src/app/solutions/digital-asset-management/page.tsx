import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import VisionItCallout from "@/components/sections/VisionItCallout";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions/digital-asset-management",
    title: "Connecting Maintenance, Data, and Operations",
    description:
      "Data-driven maintenance and asset lifecycle management solutions powered by VISION IT technologies, including MMIS, work order management, inventory tracking, and operational analytics for modern railway systems.",
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/digital-asset-management/related-ukraine.jpg",
  poland: "/solutions/digital-asset-management/related-warsaw.jpg",
};

export default async function DigitalAssetManagementPage() {
  const wwdItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Work order management",
      desc: "Predictive scheduling that sequences maintenance against fleet availability, parts lead time, and crew capacity.",
    },
    {
      index: "02",
      title: "Inventory tracking",
      desc: "Cross-depot visibility into every serialized part — consumption, location, and reorder threshold in one view.",
    },
    {
      index: "03",
      title: "Fleet observability",
      desc: "Real-time component health from onboard telemetry, surfaced before symptoms reach the operator's ear.",
    },
    {
      index: "04",
      title: "Regulator reporting",
      desc: "Auto-generated audit packages mapped to UIC, EBA, and operator-specific standards — submitted in days, not weeks.",
    },
    {
      index: "05",
      title: "Predictive maintenance",
      desc: "Failure-before-failure flagging from telemetry patterns, escalated to the work order before the incident lands.",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "30%", label: "Faster response time" },
    { value: "97%", label: "Inventory accuracy" },
    { value: "Affiliate", label: "VISION IT MMIS platform" },
  ];

  const rawRelated: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 Fleet — Ukrzaliznytsia",
      desc: "100 high-speed units fully tracked through MMIS — work orders, parts, and component health visible across borders.",
      imgAlt: "HRCS2 fleet on MMIS",
    },
    {
      key: "poland",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      desc: "Warsaw 123-tram fleet operated on MMIS — depot crews, inventory, and municipal audit reports flow through one system.",
      imgAlt: "Warsaw tram fleet on MMIS",
    },
  ];
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "Solutions", path: "solutions" },
            {
              name: "Connecting Maintenance, Data, and Operations",
              path: "solutions/digital-asset-management",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-service-digital"
        data={serviceLd({
          slug: "digital-asset-management",
          name: "Connecting Maintenance, Data, and Operations",
          description:
            "Data-driven maintenance and asset lifecycle management solutions powered by VISION IT technologies, including MMIS, work order management, inventory tracking, and operational analytics for modern railway systems.",
        })}
      />
      <SolutionDetailHero
        overline="Solutions"
        index="04 / 05"
        title="Connecting Maintenance, Data, and Operations"
        subtitle="Data-driven maintenance and asset lifecycle management solutions powered by VISION IT technologies, including MMIS, work order management, inventory tracking, and operational analytics for modern railway systems."
        metric="30% Faster Response · 97% Inventory Accuracy"
      >
        <VisionItCallout
          overline="Platform Partner"
          title="Powered by VISION IT."
          body="Through our affiliate VISION IT's MMIS platform, we optimize operations and asset management with data-driven insights — remote monitoring, fault analysis, condition-based maintenance, digital warehousing, and a digital workforce."
          visitLabel="Go to VISION IT"
          visitHref="https://visionit.kr"
          logoSrc="/solutions/digital-asset-management/visionit-logo.png"
          logoAlt="VISION IT logo"
          gifSrc="/solutions/digital-asset-management/visionit-metro.gif"
          gifAlt="VISION IT TTS metro train animation."
        />
        <WhatWeDo
          overline="What We Do"
          title="Five capabilities running on one platform."
          items={wwdItems}
        />
        <KeyStats
          overline="Key Stats"
          title="Observable fleets behave better."
          stats={stats}
        />
        <RelatedProjects
          overline="Related Projects"
          title="Programs running on this platform."
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title="See how the platform works."
          subtitle="VISION IT operates the MMIS platform that powers every Xapika maintenance program. Visit them directly for product detail and live demos."
          button="Contact our team"
          secondaryButton={{
            label: "Go to VISION IT",
            href: "https://visionit.kr",
            external: true,
          }}
        />
      </SolutionDetailHero>
    </>
  );
}
