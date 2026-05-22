import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions/light-maintenance",
    title: "Reliable Light Maintenance for Daily Operations",
    description:
      "Routine inspection, preventive maintenance, troubleshooting, and rapid-response support services designed to maximize fleet availability and ensure safe daily railway operations.",
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/light-maintenance/related-ukraine.jpg",
  poland: "/solutions/light-maintenance/related-warsaw.jpg",
};

export default async function LightMaintenancePage() {
  const wwdItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Daily inspection",
      desc: "Pre-departure visual and functional checks against a regulator-aligned checklist — signed before release.",
    },
    {
      index: "02",
      title: "Functional check",
      desc: "Brake, door, HVAC, and pantograph response tests verified against threshold values, not gut feel.",
    },
    {
      index: "03",
      title: "Minor repair",
      desc: "In-depot fixes that don't require shop time — closed within the same operating window.",
    },
    {
      index: "04",
      title: "Cleaning & sanitation",
      desc: "Interior and exterior cleaning to regulator-grade specification, scheduled around revenue service.",
    },
    {
      index: "05",
      title: "Trip-back diagnostics",
      desc: "Quick fault triage on returning units — escalates to heavy maintenance only when warranted.",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "5,900+", label: "Activities Annually" },
    { value: "213", label: "HRCS2 Units/Cars Served" },
    { value: "2017", label: "Operations Since" },
    { value: "45,000+", label: "Maintenance Delivered" },
  ];

  const rawRelated: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 Fleet — Ukrzaliznytsia",
      desc: "Daily inspection and functional checks across 100 high-speed units, sustained through wartime conditions since 2022.",
      imgAlt: "HRCS2 inspection at Ukrzaliznytsia depot",
    },
    {
      key: "poland",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      desc: "Round-the-clock light maintenance for 123 trams from the Warsaw depot, scheduled around municipal service windows.",
      imgAlt: "Warsaw tram depot",
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
              name: "Reliable Light Maintenance for Daily Operations",
              path: "solutions/light-maintenance",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-service-light"
        data={serviceLd({
          slug: "light-maintenance",
          name: "Reliable Light Maintenance for Daily Operations",
          description:
            "Routine inspection, preventive maintenance, troubleshooting, and rapid-response support services designed to maximize fleet availability and ensure safe daily railway operations.",
        })}
      />
      <SolutionDetailHero
        overline="Solutions"
        index="02 / 05"
        title="Reliable Light Maintenance for Daily Operations"
        subtitle="Routine inspection, preventive maintenance, troubleshooting, and rapid-response support services designed to maximize fleet availability and ensure safe daily railway operations."
        metric="5,900+ Activities Annually"
      >
        <WhatWeDo
          overline="What We Do"
          title="Five routines that protect daily uptime."
          items={wwdItems}
        />
        <KeyStats
          overline="Key Stats"
          title="Quiet output. Loud accountability."
          stats={stats}
        />
        <RelatedProjects
          overline="Related Projects"
          title="Programs running this discipline."
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title="Need round-the-clock fleet readiness?"
          subtitle="We deploy depot crews on rolling shifts so your trains depart on time, every day, with no surprises."
          button="Contact our maintenance team"
        />
      </SolutionDetailHero>
    </>
  );
}
