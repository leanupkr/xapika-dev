import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import EditorialStatement from "@/components/sections/EditorialStatement";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/solutions/commercial-services",
    title: "Creating Value Beyond Railway Maintenance",
    description:
      "Commercial development and business support solutions for railway environments, including retail operations, advertising, logistics coordination, and non-fare revenue services for railway operators and transit networks.",
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/commercial-services/related-ukraine.jpg",
  poland: "/solutions/commercial-services/related-warsaw.jpg",
};

export default async function CommercialServicesPage() {
  const paragraphs: ReadonlyArray<string> = [
    "Vending, advertising, and commercial facilities — engineered into the operating contract from day one, not bolted on after the first deficit year.",
    "Designed to enhance passenger experience and generate additional revenue across station retail and ancillary touchpoints.",
  ];

  const wwdItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Vending",
      desc: "Platform-side vending programs that turn dwell time into managed revenue, designed into the operating contract.",
    },
    {
      index: "02",
      title: "Advertising",
      desc: "Station and on-vehicle advertising integrated with the maintenance schedule — not bolted on after.",
    },
    {
      index: "03",
      title: "Commercial facilities",
      desc: "Retail and concession spaces engineered into the line from day one to enhance passenger experience and add revenue.",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [];

  const rawRelated: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "poland",
      country: "Poland",
      project: "Tramwaje Warszawskie",
      desc: "Commercial structuring layered onto the 123-tram maintenance contract — concession framework aligned to municipal policy.",
      imgAlt: "Warsaw tram commercial program",
    },
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 Fleet — Ukrzaliznytsia",
      desc: "Long-horizon commercial agreement on the 100 high-speed unit programme, structured to hold through wartime operations.",
      imgAlt: "HRCS2 long-horizon commercial agreement",
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
              name: "Creating Value Beyond Railway Maintenance",
              path: "solutions/commercial-services",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-service-commercial"
        data={serviceLd({
          slug: "commercial-services",
          name: "Creating Value Beyond Railway Maintenance",
          description:
            "Commercial development and business support solutions for railway environments, including retail operations, advertising, logistics coordination, and non-fare revenue services for railway operators and transit networks.",
        })}
      />
      <SolutionDetailHero
        overline="Solutions"
        index="05 / 05"
        title="Creating Value Beyond Railway Maintenance"
        subtitle="Commercial development and business support solutions for railway environments, including retail operations, advertising, logistics coordination, and non-fare revenue services for railway operators and transit networks."
        metric="Per-operator program"
      >
        <EditorialStatement
          overline="Commercial Design"
          kicker="Revenue, designed into operations."
          paragraphs={paragraphs}
        />
        <WhatWeDo
          overline="What We Do"
          title="Value-added services across three revenue surfaces."
          items={wwdItems}
        />
        <KeyStats
          overline="Programme Profile"
          title="Built per operator. Not per template."
          stats={stats}
        />
        <RelatedProjects
          overline="Related Projects"
          title="Programs running this discipline."
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title="Designing a new line? Let's structure the revenue side together."
          subtitle="We bring commercial design into the engineering conversation early — before the construction tender, not after the first operating year."
          button="Contact our commercial team"
        />
      </SolutionDetailHero>
    </>
  );
}
