import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import SupplyChainGallery, {
  type GallerySlide,
} from "@/components/sections/SupplyChainGallery";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions/supply-chain",
    title: "Global Sourcing. Local Support. Reliable Delivery.",
    description:
      "Integrated sourcing, spare parts supply, logistics coordination, and inventory support solutions tailored for railway maintenance and operational continuity.",
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/supply-chain/related-ukraine.jpg",
  poland: "/solutions/supply-chain/related-warsaw.jpg",
};

export default async function SupplyChainPage() {
  const wwdItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Sourcing",
      desc: "OEM and approved-aftermarket parts procured across European and Asian supplier networks under a single accountable contract.",
    },
    {
      index: "02",
      title: "Warehousing",
      desc: "Climate-controlled facilities in Poland and Korea hold critical inventory close to the depots that consume it.",
    },
    {
      index: "03",
      title: "Inventory orchestration",
      desc: "Real-time stock visibility across depots, with reorder thresholds tuned to fleet maintenance cycles.",
    },
    {
      index: "04",
      title: "Logistics",
      desc: "Just-in-time delivery routed straight to maintenance crews — measured against the work order, not the warehouse.",
    },
    {
      index: "05",
      title: "Quality assurance",
      desc: "Incoming inspection and serialized traceability on every part — origin to installation, recorded.",
    },
  ];

  const gallerySlides: ReadonlyArray<GallerySlide> = [
    {
      src: "/solutions/supply-chain/racking-wall-hero-01.jpg",
      alt: "Multi-tier rack walls stacked with rail-grade components across the full warehouse floor",
      caption: "Inventory at scale",
    },
    {
      src: "/solutions/supply-chain/warehouse-exterior-01.jpg",
      alt: "Xapika partner facility exterior — large-format warehouse serving European depot networks",
      caption: "Operations center",
    },
    {
      src: "/solutions/supply-chain/warehouse-exterior-02.jpg",
      alt: "Secondary warehouse exterior with loading access for outbound rail-part shipments",
      caption: "Dispatch hub",
    },
    {
      src: "/solutions/supply-chain/blue-rack-corridor-01.jpg",
      alt: "Blue industrial racking corridor with labeled bins organised by part family",
      caption: "Part family aisles",
    },
    {
      src: "/solutions/supply-chain/warehouse-hall-wide-01.jpg",
      alt: "Wide-angle view of warehouse hall showing full racking depth and clearance for equipment",
      caption: "Full-depth clearance",
    },
    {
      src: "/solutions/supply-chain/blue-rack-parts-01.jpg",
      alt: "Close-up of blue shelving holding boxed and wrapped rail components ready for dispatch",
      caption: "Dispatch-ready stock",
    },
    {
      src: "/solutions/supply-chain/pallet-jack-ops-01.jpg",
      alt: "Operator moving palletised rail parts with an electric pallet jack between rack rows",
      caption: "Internal logistics",
    },
    {
      src: "/solutions/supply-chain/rail-parts-wrapped-01.jpg",
      alt: "Wrapped and banded rail components on pallets awaiting cross-border shipment",
      caption: "Cross-border ready",
    },
    {
      src: "/solutions/supply-chain/forklift-ops-01.jpg",
      alt: "Forklift positioning a heavy pallet of rail components in a high-bay racking system",
      caption: "High-bay placement",
    },
    {
      src: "/solutions/supply-chain/red-rack-corridor-01.jpg",
      alt: "Red-painted racking corridor holding large-format rail components sorted by SKU",
      caption: "SKU-sorted storage",
    },
    {
      src: "/solutions/supply-chain/warehouse-corner-01.jpg",
      alt: "Corner section of the warehouse showing multiple racking rows and clear floor lanes",
      caption: "Clear floor lanes",
    },
    {
      src: "/solutions/supply-chain/scissor-lift-ops-01.jpg",
      alt: "Technician on a scissor lift accessing upper rack tiers to verify component inventory",
      caption: "Upper-tier access",
    },
    {
      src: "/solutions/supply-chain/pallet-staging-01.jpg",
      alt: "Pallets staged in the outbound bay, labelled and shrink-wrapped for overnight dispatch",
      caption: "Outbound staging",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "50+", label: "Global partners" },
    { value: "8,000+", label: "Parts managed" },
    { value: "3", label: "Continental warehouses" },
    { value: "22,000+", label: "Maintenance cases supported / year" },
  ];

  const rawRelated: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 Fleet — Ukrzaliznytsia",
      desc: "Cross-border parts pipeline sustaining 100 high-speed units through wartime logistics constraints since 2022.",
      imgAlt: "Ukraine HRCS2 parts supply",
    },
    {
      key: "poland",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      desc: "Warsaw depot inventory orchestration covering the 123-tram fleet — reorder cycles tuned to municipal service windows.",
      imgAlt: "Warsaw depot inventory",
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
              name: "Global Sourcing. Local Support. Reliable Delivery.",
              path: "solutions/supply-chain",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-service-supply"
        data={serviceLd({
          slug: "supply-chain",
          name: "Global Sourcing. Local Support. Reliable Delivery.",
          description:
            "Integrated sourcing, spare parts supply, logistics coordination, and inventory support solutions tailored for railway maintenance and operational continuity.",
        })}
      />
      <SolutionDetailHero
        overline="Solutions"
        index="03 / 05"
        title="Global Sourcing. Local Support. Reliable Delivery."
        subtitle="Integrated sourcing, spare parts supply, logistics coordination, and inventory support solutions tailored for railway maintenance and operational continuity."
        metric="50+ Global Partners · 8,000+ Parts Managed"
      >
        <WhatWeDo
          overline="What We Do"
          title="Five disciplines that keep parts flowing."
          items={wwdItems}
        />
        <SupplyChainGallery
          overline="Inside Our Operations"
          title="Where rail parts are kept ready."
          slides={gallerySlides}
        />
        <KeyStats
          overline="Key Stats"
          title="A supply network built for distance."
          stats={stats}
        />
        <RelatedProjects
          overline="Related Projects"
          title="Programs running this discipline."
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title="Need a supply chain that survives geography?"
          subtitle="We design parts pipelines that hold up across borders, sanctions, and weather — engineered for the depots that depend on them."
          button="Contact our supply team"
        />
      </SolutionDetailHero>
    </>
  );
}
