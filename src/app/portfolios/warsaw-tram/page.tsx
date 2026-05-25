import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioStory from "@/components/sections/PortfolioStory";
import WarsawSeasonTimeline, {
  type SeasonEntry,
} from "@/components/sections/WarsawSeasonTimeline";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/portfolios/warsaw-tram",
    title: "150 years of urban motion.",
    description:
      "Tram operations and maintenance for Warsaw — one of Europe's oldest continuously operating tram systems.",
  });
}

export default async function WarsawTramPage() {
  const storyParagraphs: ReadonlyArray<string> = [
    "Warsaw's tram network began carrying passengers in 1882 — first horse-drawn, electrified within a generation, and continuously operating across two world wars. By the time Xapika joined the maintenance partnership in October 2021, the system had logged nearly 140 unbroken years of public service.",
    "We service 123 units across the active fleet, working alongside Tramwaje Warszawskie's own depot teams. Every car is inspected before its first run of the day. Service intervals follow the city's published timetable, audited against it rather than internal targets.",
    "In the months following the 2022 invasion, the network adapted to a sharp rise in cross-border ridership. Refugee passengers travelled free, and operating frequency held to schedule under heavier loads. The work was kept routine — that was the point.",
    "Maintenance here is not a young system imported into an old one. It is a discipline matched to a network that has already proved itself for a century and a half. Our role is to keep that record intact.",
    "XAPIKA also serves clients in Türkiye, Brazil, and Egypt from its Warsaw headquarters — the same operational discipline now extended across three continents.",
  ];

  const galleryEntries: ReadonlyArray<SeasonEntry> = [
    {
      year: "2022",
      month: "09",
      season: "Autumn",
      caption: "First inspection routine on the Warsaw line.",
      src: "/portfolios/warsaw-tram/season-2022-01.jpg",
      alt: "Warsaw tram on mainline service, September 2022",
    },
    {
      year: "2022",
      month: "10",
      season: "Autumn",
      caption: "Tram passing the Old Town stop.",
      src: "/portfolios/warsaw-tram/season-2022-02.jpg",
      alt: "Warsaw tram entering Old Town stop, October 2022",
    },
    {
      year: "2023",
      month: "02",
      season: "Winter",
      caption: "Cold-weather depot return after morning service.",
      src: "/portfolios/warsaw-tram/season-2023-01.jpg",
      alt: "Winter depot operations — Warsaw tram, February 2023",
    },
    {
      year: "2023",
      month: "06",
      season: "Summer",
      caption: "Summer line inspection — wheel and brake check.",
      src: "/portfolios/warsaw-tram/season-2023-02.jpg",
      alt: "Summer line inspection — Warsaw tram fleet, June 2023",
    },
    {
      year: "2023",
      month: "10",
      season: "Autumn",
      caption: "Autumn evening operations on the central loop.",
      src: "/portfolios/warsaw-tram/season-2023-03.jpg",
      alt: "Warsaw tram on central loop — October 2023",
    },
    {
      year: "2024",
      month: "01",
      season: "Winter",
      caption: "Mid-winter shift change at the depot.",
      src: "/portfolios/warsaw-tram/season-2024-01.jpg",
      alt: "Winter depot shift change — January 2024",
    },
    {
      year: "2024",
      month: "04",
      season: "Spring",
      caption: "Spring overhaul cycle — bogie maintenance.",
      src: "/portfolios/warsaw-tram/season-2024-02.jpg",
      alt: "Spring bogie overhaul — Warsaw tram, April 2024",
    },
    {
      year: "2024",
      month: "07",
      season: "Summer",
      caption: "Mid-summer mainline run, peak ridership.",
      src: "/portfolios/warsaw-tram/season-2024-03.jpg",
      alt: "Mid-summer mainline run — Warsaw, July 2024",
    },
    {
      year: "2025",
      month: "01",
      season: "Winter",
      caption: "First cold-weather inspection of the new year.",
      src: "/portfolios/warsaw-tram/season-2025-01.jpg",
      alt: "First inspection of 2025 — Warsaw tram fleet",
    },
    {
      year: "2025",
      month: "02",
      season: "Winter",
      caption: "February component check, mid-shift.",
      src: "/portfolios/warsaw-tram/season-2025-02.jpg",
      alt: "Component check, Warsaw depot, February 2025",
    },
    {
      year: "2025",
      month: "02",
      season: "Winter",
      caption: "Latest field record — fleet in service.",
      src: "/portfolios/warsaw-tram/season-2025-03.jpg",
      alt: "Warsaw tram in service — latest field record, 2025",
    },
  ];

  const yearLabels = {
    "2022": "2022 · Program launch",
    "2023": "2023 · Network stabilisation",
    "2024": "2024 · Fleet expansion",
    "2025": "2025 · Current operations",
  };

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "123", label: "Tram units" },
    { value: "25", label: "Engineers, Warsaw" },
    { value: "1882", label: "Network founded" },
    { value: "140+ yrs", label: "Heritage of service" },
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
      key: "uzbekistan",
      country: "Uzbekistan",
      project: "Tashkent high-speed corridor",
      desc: "Mobilising for May 2026 launch — crew, parts pipeline and MMIS platform configured before day one.",
      imgAlt: "Uzbekistan high-speed program — launch frame",
      placeholderLabel: "Launching 31 May 2026 · Tashkent",
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "Portfolios", path: "portfolios" },
            { name: "150 years of urban motion.", path: "portfolios/warsaw-tram" },
          ],
        })}
      />
      <JsonLd
        id="ld-case-warsaw"
        data={caseStudyLd({
          slug: "warsaw-tram",
          name: "150 years of urban motion.",
          description:
            "Tram operations and maintenance for Warsaw — one of Europe's oldest continuously operating tram systems.",
          country: "Poland",
        })}
      />
      <PortfolioHero
        overline="Portfolios"
        title="150 years of urban motion."
        subtitle="Tram operations and maintenance for Warsaw — one of Europe's oldest continuously operating tram systems."
        index="02 / 03"
        placeholder="Site photograph arriving"
        placeholderKicker="Poland · 1882–"
        imageSrc="/portfolios/warsaw-tram/hero-main.jpg"
        imageAlt="Warsaw tram on mainline service — Tramwaje Warszawskie maintenance program, 2022–"
        imagePriority
      />
      <PortfolioStory
        overline="Program story"
        title="A network older than the country it now serves."
        paragraphs={storyParagraphs}
        photoCaption="Photo · Warsaw tram, mainline"
        photoKicker="Poland · 1882–"
        imageSrc="/portfolios/warsaw-tram/story-01.jpg"
        imageAlt="Warsaw tram summer maintenance on the line"
        highlights={[
          { label: "First service", value: "1882" },
          { label: "Active fleet", value: "123 units" },
          { label: "Xapika since", value: "Oct 2021" },
        ]}
      />
      <WarsawSeasonTimeline
        overline="Field log"
        title="Three years, four seasons."
        yearLabels={yearLabels}
        entries={galleryEntries}
      />
      <KeyStats
        overline="Operating record"
        title="Daily metrics. Public timetable."
        stats={stats}
      />
      <RelatedProjects
        overline="Related programs"
        title="Two more from the portfolio."
        items={relatedItems}
      />
    </>
  );
}
