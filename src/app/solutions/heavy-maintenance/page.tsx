import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import OverhaulProcess, {
  type OverhaulPhase,
} from "@/components/sections/OverhaulProcess";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions/heavy-maintenance",
    title: "Built for Reliability. Driven by Engineering.",
    description:
      "Comprehensive overhaul, refurbishment, and lifecycle extension services for rolling stock systems, ensuring long-term reliability, safety, and operational performance.",
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/heavy-maintenance/related-ukraine.jpg",
  poland: "/solutions/heavy-maintenance/related-warsaw.jpg",
};

export default async function HeavyMaintenancePage() {
  const phases: ReadonlyArray<OverhaulPhase> = [
    {
      label: "Overhaul",
      desc: "Full vehicle disassembly, inspection, and rebuild against OEM specification.",
    },
    {
      label: "Bogie maintenance",
      desc: "Frame inspection, suspension renewal, and traction motor recertification under controlled depot conditions.",
    },
    {
      label: "Brake system",
      desc: "Pneumatic and electric brake overhaul, valve replacement, and full system pressure verification.",
    },
    {
      label: "Wheelset turning",
      desc: "Profile re-machining, axle inspection, and reassembly to UIC tolerance — measured before release.",
    },
  ];

  const wwdItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Overhaul",
      desc: "Full vehicle disassembly, inspection, and rebuild against OEM specification — closed under warranty.",
    },
    {
      index: "02",
      title: "Bogie maintenance",
      desc: "Frame inspection, suspension renewal, and traction motor recertification under controlled depot conditions.",
    },
    {
      index: "03",
      title: "Brake system",
      desc: "Pneumatic and electric brake overhaul, valve replacement, and full system pressure verification.",
    },
    {
      index: "04",
      title: "Wheelset turning",
      desc: "Profile re-machining, axle inspection, and reassembly to UIC tolerance — measured before release.",
    },
    {
      index: "05",
      title: "Component refurbishment",
      desc: "Couplers, doors, HVAC, and electrical assemblies stripped, restored, and benchmarked before reinstallation.",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "320+", label: "Activities Annually" },
    { value: "213", label: "Units in Heavy Overhaul / Maintenance Cycle" },
    { value: "2017", label: "Operations Since" },
  ];

  const rawRelated: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 Fleet — Ukrzaliznytsia",
      desc: "100 high-speed units under continuous heavy overhaul cycle since 2017 — uninterrupted through wartime.",
      imgAlt: "HRCS2 heavy overhaul at Ukrzaliznytsia",
    },
    {
      key: "poland",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      desc: "123-unit tram fleet on a rolling overhaul schedule from the Warsaw depot, delivered to municipal audit standard.",
      imgAlt: "Warsaw tram overhaul",
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
              name: "Built for Reliability. Driven by Engineering.",
              path: "solutions/heavy-maintenance",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-service-heavy"
        data={serviceLd({
          slug: "heavy-maintenance",
          name: "Built for Reliability. Driven by Engineering.",
          description:
            "Comprehensive overhaul, refurbishment, and lifecycle extension services for rolling stock systems, ensuring long-term reliability, safety, and operational performance.",
        })}
      />
      <SolutionDetailHero
        overline="Solutions"
        index="01 / 05"
        title="Built for Reliability. Driven by Engineering."
        subtitle="Comprehensive overhaul, refurbishment, and lifecycle extension services for rolling stock systems, ensuring long-term reliability, safety, and operational performance."
        metric="320+ Activities Annually"
      >
        <OverhaulProcess
          overline="The Overhaul Sequence"
          title="Four disciplines under one safety warranty."
          subtitle="Comprehensive heavy maintenance to restore performance, enhance reliability, and ensure long-term operational safety — every action audited."
          phases={phases}
          heroImage="/solutions/heavy-maintenance/overhaul-hero.jpg"
          heroImageAlt="Heavy overhaul — traction motor disassembly under depot crane."
          traceabilityImage="/solutions/heavy-maintenance/traceability.jpg"
          traceabilityImageAlt="Gearbox component traceability label — serial, test record, and sign-off."
        />
        <WhatWeDo
          overline="What We Do"
          title="Five disciplines under one safety warranty."
          items={wwdItems}
        />
        <KeyStats
          overline="Key Stats"
          title="Measured by output, not promises."
          stats={stats}
        />
        <RelatedProjects
          overline="Related Projects"
          title="Programs running this discipline."
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title="Ready to schedule a heavy overhaul cycle?"
          subtitle="Our maintenance team can scope your fleet and deliver a written program within two weeks."
          button="Contact our maintenance team"
        />
      </SolutionDetailHero>
    </>
  );
}
