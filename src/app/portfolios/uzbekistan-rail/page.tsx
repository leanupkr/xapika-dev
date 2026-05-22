import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import UzbekRouteMap from "@/components/sections/UzbekRouteMap";
import LaunchCountdown from "@/components/sections/LaunchCountdown";
import UzbekTimeline, {
  type UzbekEvent,
} from "@/components/sections/UzbekTimeline";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/portfolios/uzbekistan-rail",
    title: "A new high-speed program. Opening this year.",
    description:
      "O&M operations launching May 2026 — content arriving as we go live.",
  });
}

export default async function UzbekistanRailPage() {
  const mapPins = {
    tashkent: "Tashkent · O&M Hub",
    seoul: "Seoul · Tech Partner",
    warsaw: "Warsaw · Engineering HQ",
  };

  const countdownLabels = {
    days: "Days",
    hours: "Hrs",
    minutes: "Min",
    seconds: "Sec",
  };

  const timelineEvents: ReadonlyArray<UzbekEvent> = [
    {
      year: "2026",
      month: "03",
      label:
        "South Korea office opens — MMIS platform engineering with our technology partner.",
    },
    {
      year: "2026",
      month: "04",
      label: "Tashkent office opens. Crew on-site, parts pipeline operational.",
    },
    {
      year: "2026",
      month: "05",
      label: "High-speed rail O&M commences — Tashkent.",
      isComing: true,
    },
  ];

  const plannedItems: ReadonlyArray<WhatWeDoItem> = [
    {
      index: "01",
      title: "Daily inspection",
      desc: "Pre-departure and functional checks aligned to operator and regulator standards — running from the first revenue day.",
    },
    {
      index: "02",
      title: "Heavy maintenance program",
      desc: "Scheduled overhauls and component recertification under written warranty, scoped to the high-speed fleet from launch.",
    },
    {
      index: "03",
      title: "Component supply chain",
      desc: "OEM and approved-aftermarket parts pipeline designed before service begins, not improvised after the first stockout.",
    },
    {
      index: "04",
      title: "Digital asset platform (MMIS)",
      desc: "Through our affiliate VISION IT, the MMIS platform is configured for the program — work orders, parts, and audit reports tracked from day one.",
    },
    {
      index: "05",
      title: "Local crew training",
      desc: "Tashkent-based technicians and engineers trained to Xapika operating standard, with knowledge transfer engineered into the contract.",
    },
  ];

  const relatedItems: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "ukraine",
      country: "Ukraine",
      project: "HRCS2 EMU — 100 high-speed units",
      desc: "Nine years uninterrupted. 82,000+ audited maintenance actions, including through wartime conditions.",
      image: "/portfolios/ukraine-emu/hero-main.jpg",
      imgAlt: "HRCS2 unit at Kyiv depot — Xapika maintenance program",
    },
    {
      key: "warsaw",
      country: "Poland",
      project: "Tramwaje Warszawskie — 123 trams",
      desc: "Daily inspection on a tram network in continuous service since 1882. 123 units, audited against the city's published timetable.",
      image: "/portfolios/warsaw-tram/hero-main.jpg",
      imgAlt: "Warsaw tram on the mainline — Tramwaje Warszawskie program",
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "Portfolios", path: "portfolios" },
            {
              name: "A new high-speed program. Opening this year.",
              path: "portfolios/uzbekistan-rail",
            },
          ],
        })}
      />
      <JsonLd
        id="ld-case-uzbekistan"
        data={caseStudyLd({
          slug: "uzbekistan-rail",
          name: "A new high-speed program. Opening this year.",
          description:
            "O&M operations launching May 2026 — content arriving as we go live.",
          country: "Uzbekistan",
        })}
      />
      <PortfolioHero
        overline="Portfolios"
        title="A new high-speed program. Opening this year."
        subtitle="O&M operations launching May 2026 — content arriving as we go live."
        index="03 / 03"
        accentBadge="Coming 2026.05"
        placeholder="Site photograph arriving"
        placeholderKicker="Uzbekistan · Coming 2026"
      />
      <UzbekRouteMap
        overline="Network"
        title="Three countries. One corridor."
        subtitle="Three Xapika offices are aligned for the Tashkent high-speed program: O&M anchored in Uzbekistan (2026.04), MMIS platform engineered with our Korean partner (2026.03), and program governance from the Polish HQ in Warsaw (2022.03)."
        pins={mapPins}
      />
      <LaunchCountdown
        overline="Launch"
        title="Days to Tashkent operations."
        subtitle="Revenue service begins in May 2026 — Xapika's Tashkent office opened in April 2026, the program is mobilised, and the team is in final preparation."
        launchDate="2026-05-31T00:00:00+05:00"
        labels={countdownLabels}
        partnerNote="In partnership with VISION IT — MMIS platform configured before day one."
      />
      <UzbekTimeline
        overline="Mobilisation schedule"
        title="From contract to day one."
        comingBadge="Coming"
        events={timelineEvents}
      />
      <WhatWeDo
        overline="What's Planned"
        title="Five disciplines, deployed from day one."
        items={plannedItems}
      />
      <RelatedProjects
        overline="Related programs"
        title="Two more from the portfolio."
        items={relatedItems}
      />
    </>
  );
}
