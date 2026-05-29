import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioStory from "@/components/sections/PortfolioStory";
import PortfolioRestoration, {
  type RestorationPhoto,
} from "@/components/sections/PortfolioRestoration";
import PortfolioScrollGallery, {
  type GallerySlide,
} from "@/components/sections/PortfolioScrollGallery";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import TrackRecordCards, {
  type TrackRecordClient,
} from "@/components/sections/TrackRecordCards";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/portfolios/ukraine-emu",
    title: "Ukraine HRCS2 EMU.",
    description:
      "Daily inspection, functional checks, and heavy overhauls across 90 high-speed cars — sustained through wartime conditions since 2022. Four operators, four programs — 136 engineers in Kyiv.",
  });
}

export default async function UkraineEmuPage() {
  const storyParagraphs: ReadonlyArray<string> = [
    "In 2017, Ukrainian Railways awarded the long-horizon contract for 90 high-speed HRCS2 cars. The depot teams have run the same operating routine every day since: pre-departure inspection at 04:30, functional checks before each journey, scheduled overhauls on a 90-day cadence.",
    "On the morning of February 24, 2022, the schedule did not change. Trains kept moving — for civilians evacuating, for press crews, for cargo headed to where the rail still ran. Ground staff worked under blackout conditions. Inventory adapted to disrupted supply lines. The maintenance log kept its same columns.",
    "Nine years on, the program has logged over 82,000 maintenance actions, and not a single contractual default has been recorded in the regulator's audit. We do not describe this as resilience. We describe it as the work.",
    "Continuity here is not a posture. It is the sum of an accountable team, an audited maintenance regime, and a partner who structured the contract to outlast the conditions around it.",
  ];

  const restorationEstablishing: RestorationPhoto = {
    src: "/portfolios/ukraine-emu/restoration/establishing-night-fire.jpg",
    alt:
      "HRCS2 trainset on fire at the trackside at night — Ukraine, February 2022",
    caption: "Night attack · Feb 2022",
  };

  const restorationGrid: ReadonlyArray<RestorationPhoto> = [
    {
      src: "/portfolios/ukraine-emu/restoration/damage-01-exterior.jpg",
      alt: "Exterior of a burnt HRCS2 carriage on the track, daytime",
      caption: "Exterior — daylight",
    },
    {
      src: "/portfolios/ukraine-emu/restoration/damage-02-windows.jpg",
      alt: "HRCS2 carriage with windows blown out, smoke still rising",
      caption: "Windows · aftermath",
    },
    {
      src: "/portfolios/ukraine-emu/restoration/damage-03-interior.jpg",
      alt: "Passenger cabin gutted by fire, seat frames reduced to ash",
      caption: "Cabin · gutted",
    },
    {
      src: "/portfolios/ukraine-emu/restoration/damage-04-cabin.jpg",
      alt: "Cabin interior with a single surviving seat cushion amid charred wreckage",
      caption: "Cabin · sole survivor",
    },
    {
      src: "/portfolios/ukraine-emu/restoration/damage-05-corridor.jpg",
      alt: "Charred vestibule corridor with glass shards on the floor",
      caption: "Vestibule",
    },
    {
      src: "/portfolios/ukraine-emu/restoration/damage-06-seats.jpg",
      alt: "Stripped aluminium seat shells, fire-damaged, removed for restoration",
      caption: "Seats · stripped",
    },
  ];

  const gallerySlides: ReadonlyArray<GallerySlide> = [
    {
      overline: "2017",
      caption: "First HRCS2 fleet enters service.",
      metric: "90 cars",
      src: "/portfolios/ukraine-emu/gallery-01.jpg",
      alt: "HRCS2 unit at depot — first fleet, 2017",
    },
    {
      overline: "Daily ops",
      caption: "Pre-departure inspection at 04:30.",
      metric: "365 days / year",
      src: "/portfolios/ukraine-emu/gallery-02.jpg",
      alt: "Pre-departure inspection routine, HRCS2 fleet",
    },
    {
      overline: "2022.02",
      caption: "War begins. Service does not stop.",
      metric: "Day 1",
      src: "/portfolios/ukraine-emu/gallery-03.jpg",
      alt: "HRCS2 mainline operations, sustained through wartime",
    },
    {
      overline: "Operations",
      caption: "1 million+ passengers transported since invasion.",
      metric: "1M+ passengers",
      src: "/portfolios/ukraine-emu/gallery-04.jpg",
      alt: "Night depot operations under blackout conditions",
    },
    {
      overline: "Depot",
      caption: "Heavy maintenance under continuous audit.",
      metric: "82,000+ actions",
      src: "/portfolios/ukraine-emu/gallery-05.jpg",
      alt: "Heavy maintenance bay — HRCS2 program",
    },
    {
      overline: "Detail",
      caption: "Components recertified on a 90-day cadence.",
      metric: "90-day cycle",
      src: "/portfolios/ukraine-emu/gallery-06.jpg",
      alt: "Component-level inspection, HRCS2 fleet",
    },
    {
      overline: "Crew",
      caption: "Ground teams kept the schedule intact.",
      metric: "0 contract default",
      src: "/portfolios/ukraine-emu/gallery-07.jpg",
      alt: "Depot crew on shift — HRCS2 maintenance program",
    },
    {
      overline: "Today",
      caption: "Nine years. Audited every quarter.",
      metric: "9 yrs · 0 default",
      src: "/portfolios/ukraine-emu/gallery-08.jpg",
      alt: "HRCS2 unit in revenue service, present day",
    },
  ];

  const stats: ReadonlyArray<KeyStatItem> = [
    { value: "136", label: "Engineers & Technicians, Kyiv" },
    { value: "9 yrs", label: "Continuous service" },
    { value: "82,000+", label: "Maintenance actions" },
    { value: "1M+", label: "Passengers since invasion" },
  ];

  const trackClients: ReadonlyArray<TrackRecordClient> = [
    {
      name: "UZ Railway",
      fullName: "Ukrzaliznytsia",
      accent: "blue",
      since: "2017",
      models: "PESA 610M · Škoda EJ675 · Tarpan",
      icon: "train",
      items: [
        "Brake caliper system overhaul",
        "PESA 610M full refurbishment & overhaul",
        "Škoda EJ675 CityElefant (160 km/h) — overhaul",
        "Škoda EJ675 bolster crack restoration",
        "Kryukov Tarpan (160 km/h) — supply chain",
      ],
    },
    {
      name: "Kyiv Metro",
      fullName: "Kyiv Metro — Toshiba / Tokyo Car Corp.",
      accent: "teal",
      since: "2017",
      models: "Toshiba / Tokyo Car Corp.",
      icon: "trainFront",
      items: [
        "Brake caliper system overhaul",
        "Traction motor overhaul",
        "Axle driving gear — whole fleet",
      ],
    },
    {
      name: "Hyundai Rotem HRCS2",
      fullName: "Hyundai Rotem HRCS2 — Intercity+",
      accent: "orange",
      since: "2017",
      models: "Intercity+ 90 cars",
      icon: "train",
      items: [
        "HRCS2 Intercity+ 160 km/h — 90 cars",
        "Full maintenance: PM, CM & overhaul",
        "Overhaul at 3M km & 4M km milestones",
        "Operations maintained during wartime",
      ],
    },
    {
      name: "KRCBW",
      fullName: "Kryukovsky Railway Car Building Works",
      accent: "yellow",
      since: "2022",
      models: "Journal box · Supply chain",
      icon: "factory",
      statusOverride: "SUPPLY PARTNER · SINCE 2022",
      items: [
        "Journal box services — special tools, boring & refurbishment",
        "Supply chain for parts disrupted by The War",
      ],
    },
  ];

  const relatedItems: ReadonlyArray<RelatedProjectItem> = [
    {
      key: "warsaw",
      country: "Poland",
      project: "Tramwaje Warszawskie — 123 trams",
      desc: "Daily inspection on a tram network in continuous service since 1882. 123 units, audited against the city's published timetable.",
      image: "/portfolios/warsaw-tram/hero-main.jpg",
      imgAlt: "Warsaw tram on the mainline — Tramwaje Warszawskie program",
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
            { name: "Ukraine HRCS2 EMU.", path: "portfolios/ukraine-emu" },
          ],
        })}
      />
      <JsonLd
        id="ld-case-ukraine"
        data={caseStudyLd({
          slug: "ukraine-emu",
          name: "Ukraine HRCS2 EMU.",
          description:
            "Daily inspection, functional checks, and heavy overhauls across 90 high-speed cars — sustained through wartime conditions since 2022. Four operators, four programs — 136 engineers in Kyiv.",
          country: "Ukraine",
        })}
      />
      <PortfolioHero
        overline="Portfolios"
        title="Ukraine HRCS2 EMU."
        subtitle="Daily inspection, functional checks, and heavy overhauls across 90 high-speed cars — sustained through wartime conditions since 2022. Four operators, four programs — 136 engineers in Kyiv."
        index="01 / 03"
        accentBadge="Uninterrupted Since War"
        placeholder="Site photograph arriving"
        placeholderKicker="Ukraine · 2017"
        imageSrc="/portfolios/ukraine-emu/hero-main.jpg"
        imageAlt="HRCS2 high-speed unit at Kyiv depot — Xapika maintenance program, 2017–"
        imagePriority
      />
      <PortfolioStory
        overline="Program story"
        title="Trains that don't stop, even when everything else does."
        paragraphs={storyParagraphs}
        photoCaption="Photo · HRCS2 fleet, in service"
        photoKicker="Ukraine · 2017–"
        imageSrc="/portfolios/ukraine-emu/story-01.jpg"
        imageAlt="Depot crew on shift — HRCS2 maintenance program"
        highlights={[
          { label: "Xapika since", value: "2017" },
          { label: "Fleet", value: "90 cars" },
          { label: "Service delivered", value: "82,000+" },
        ]}
      />
      <PortfolioRestoration
        overline="Restoration record"
        title="Six trainsets. Brought back."
        intro="Six HRCS2 trainsets were caught by The War — burned interiors, blown windows, charred vestibules. They went into the heavy maintenance bay, came out rebuilt, and returned to revenue service."
        establishing={restorationEstablishing}
        establishingMeta="Ukraine · 2022"
        grid={restorationGrid}
        stat={{
          value: "6",
          valueSuffix: "trainsets",
          description:
            "Damaged in The War. Restored. Back on the line.",
        }}
        footnote="Photos courtesy of Ukrzaliznytsia, 2022."
      />
      <TrackRecordCards
        overline="Track Record"
        title="Ukraine — 136 engineers across four operators"
        subtitle="Brake systems to high-speed overhauls — four programs, one operating standard"
        statusLabel="STATUS"
        statusActive="ACTIVE"
        cta="Contact our team"
        clients={trackClients}
      />
      <PortfolioScrollGallery
        sectionLabel="Field log"
        sectionTitle="Eight moments on the line."
        slides={gallerySlides}
        markerSlideIndex={2}
        photoCaption="Photo · HRCS2 depot, Ukraine"
      />
      <KeyStats
        overline="Operating record"
        title="Nine years. Audited every quarter."
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
