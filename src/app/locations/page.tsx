import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { placesLd, breadcrumbLd } from "@/components/seo/JsonLd";
import LocationsHero from "@/components/sections/LocationsHero";
import NetworkAtScale from "@/components/sections/NetworkAtScale";
import LocationsWorldMap, {
  type WorldMapOffice,
} from "@/components/sections/LocationsWorldMap";
import OfficeGrid, {
  type OfficeGridItem,
} from "@/components/sections/OfficeGrid";
import OfficeOpeningsRail, {
  type MilestoneEvent,
} from "@/components/sections/OfficeOpeningsRail";
import OperationsContext from "@/components/sections/OperationsContext";
import { isOfficeComing } from "@/lib/officeStatus";

type HistoryEventRaw = {
  year: string;
  month: string;
  country: string;
  event: string;
};

type OfficeRow = {
  id: string;
  city: string;
  country: string;
  flag: string;
  role: "headquarters" | "office" | "warehouse";
  since: string;
  lat: number;
  lng: number;
  showOnMap: boolean;
  blurb: string;
  address?: string;
  mapsUrl?: string;
};

// Internal portfolio links — kept in code so translations can't redirect users.
const OPS_HREFS = {
  ukraine: "/portfolios/ukraine-emu",
  poland: "/portfolios/warsaw-tram",
  uzbekistan: "/portfolios/uzbekistan-rail",
} as const;

const OFFICES: ReadonlyArray<OfficeRow> = [
  {
    id: "warsaw-hq",
    city: "Warsaw",
    country: "Poland",
    flag: "🇵🇱",
    role: "headquarters",
    since: "2022.03",
    lat: 52.2297,
    lng: 21.0118,
    showOnMap: true,
    blurb: "Headquarters · group operations, finance, fleet program management.",
    address: "Kolejowa 234, 05-092 Dziekanów Leśny, Poland",
    mapsUrl: "https://maps.app.goo.gl/rLqMLkcSUbWgM13y5",
  },
  {
    id: "warsaw-office",
    city: "Warsaw",
    country: "Poland",
    flag: "🇵🇱",
    role: "office",
    since: "2021.07",
    lat: 52.2297,
    lng: 21.0118,
    showOnMap: false,
    blurb: "Tram & metro maintenance program — Tramwaje Warszawskie partnership.",
  },
  {
    id: "kyiv",
    city: "Kyiv",
    country: "Ukraine",
    flag: "🇺🇦",
    role: "office",
    since: "2018.11",
    lat: 50.4501,
    lng: 30.5234,
    showOnMap: true,
    blurb: "EMU heavy-maintenance crew — operating through wartime conditions since 2022.",
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "Republic of Korea",
    flag: "🇰🇷",
    role: "office",
    since: "2026.03",
    lat: 37.5665,
    lng: 126.978,
    showOnMap: true,
    blurb: "APAC bridgehead · digital asset platform & supply-chain coordination.",
  },
  {
    id: "sao-paulo",
    city: "São Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    role: "office",
    since: "2019.06",
    lat: -23.5505,
    lng: -46.6333,
    showOnMap: true,
    blurb: "Latin America hub · component overhaul & technician training.",
  },
  {
    id: "virginia",
    city: "Virginia",
    country: "USA",
    flag: "🇺🇸",
    role: "office",
    since: "2023.06",
    lat: 37.5407,
    lng: -77.436,
    showOnMap: true,
    blurb: "North America operations · transit fleet & commercial services.",
  },
  {
    id: "istanbul",
    city: "Istanbul",
    country: "Türkiye",
    flag: "🇹🇷",
    role: "office",
    since: "2016.10",
    lat: 41.0082,
    lng: 28.9784,
    showOnMap: true,
    blurb: "Founding office · cross-border logistics & MENA program lead.",
  },
  {
    id: "tashkent",
    city: "Tashkent",
    country: "Uzbekistan",
    flag: "🇺🇿",
    role: "office",
    since: "2026.04",
    lat: 41.2995,
    lng: 69.2401,
    showOnMap: true,
    blurb: "Central Asia hub · high-speed corridor O&M and crew training.",
  },
  {
    id: "cairo",
    city: "Cairo",
    country: "Egypt",
    flag: "🇪🇬",
    role: "office",
    since: "2023.10",
    lat: 30.0444,
    lng: 31.2357,
    showOnMap: true,
    blurb: "MENA delivery node · parts pipeline & on-site engineering.",
  },
];

const HISTORY_EVENTS: ReadonlyArray<HistoryEventRaw> = [
  { year: "2016", month: "10", country: "Turkiye", event: "Istanbul Office Established" },
  { year: "2017", month: "06", country: "Ukraine", event: "HSR O&M Operations Begin" },
  { year: "2018", month: "11", country: "Ukraine", event: "Ukraine HQ Opened" },
  { year: "2019", month: "06", country: "Brazil", event: "São Paulo Office Established" },
  { year: "2021", month: "07", country: "Poland", event: "Poland Office Established" },
  { year: "2021", month: "10", country: "Poland", event: "Warsaw Tram O&M Operations Begin" },
  { year: "2022", month: "03", country: "Poland", event: "Warsaw HQ Relocated to New Facility" },
  { year: "2022", month: "05", country: "Poland", event: "Poland Warehouse Opened" },
  { year: "2023", month: "06", country: "USA", event: "Virginia Office Established" },
  { year: "2023", month: "10", country: "Egypt", event: "Cairo Office Established" },
  { year: "2026", month: "03", country: "Republic of Korea", event: "Seoul Office Established" },
  { year: "2026", month: "04", country: "Uzbekistan", event: "Tashkent Office Established" },
  { year: "2026", month: "05", country: "Uzbekistan", event: "Uzbekistan HSR O&M Begin" },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "/locations",
    title: "Locations",
    description:
      "Nine Xapika offices across Europe, the Americas, MENA, and Central Asia — local crews, regional warehouses, regulator-aligned operations.",
  });
}

export default function LocationsPage() {
  const mapOffices: ReadonlyArray<WorldMapOffice> = OFFICES
    .filter((o) => o.showOnMap)
    .map(({ id, city, country, role, since, lat, lng, blurb }) => ({
      id,
      city,
      country,
      role,
      since,
      lat,
      lng,
      blurb,
    }));

  const gridOffices: ReadonlyArray<OfficeGridItem> = OFFICES.map(
    ({ id, city, country, flag, role, since, lat, lng, blurb, address, mapsUrl }) => ({
      id,
      city,
      country,
      flag,
      role,
      since,
      lat,
      lng,
      blurb,
      ...(address ? { address } : {}),
      ...(mapsUrl ? { mapsUrl } : {}),
    })
  );

  const milestoneEvents: ReadonlyArray<MilestoneEvent> = HISTORY_EVENTS.map(
    (e) => ({
      year: e.year,
      month: e.month,
      country: e.country,
      event: e.event,
      isComing: isOfficeComing(`${e.year}.${e.month}`),
    })
  );

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "Locations", path: "locations" }],
        })}
      />
      <JsonLd
        id="ld-places"
        data={placesLd(
          OFFICES.map((o) => ({
            city: o.city,
            country: o.country,
            role: o.role,
            lat: o.lat,
            lng: o.lng,
          }))
        )}
      />

      <LocationsHero
        overline="Locations"
        title="Nine offices. One operating clock."
        subtitle="From Warsaw to Tashkent — local crews, regional warehouses, regulator-aligned operations."
        stats={[
          { value: "9", label: "Cities" },
          { value: "8", label: "Countries" },
          { value: "4", label: "Continents" },
        ]}
      />

      <NetworkAtScale
        overline="Global footprint"
        title="A network built over a decade."
        subtitle="Nine operating sites across eight countries — each one a full depot or engineering team, not a representative office."
        citiesValue="9"
        citiesLabel="Cities"
        citiesNote="From Warsaw to Tashkent"
        countriesValue="8"
        countriesLabel="Countries"
        countriesNote="Europe · Asia · Americas · Africa"
        continentsValue="4"
        continentsLabel="Continents"
        continentsNote="No single-timezone dependency"
        yearsValue="10"
        yearsLabel="Years"
        yearsNote="Istanbul 2016 — Seoul 2026"
      />

      <LocationsWorldMap
        overline="Where we operate"
        title="A live network across nine cities."
        subtitle="Hover any marker to read the office record. Warsaw is our headquarters; the rest are full operating sites — not sales outposts."
        hqLabel="Headquarters"
        officeLabel="Office"
        warehouseLabel="Warehouse"
        sinceLabel="Since"
        comingLabel="Coming"
        legendHq="HQ"
        legendOffice="Office"
        liveTag="9 Sites · Live"
        offices={mapOffices}
      />

      <OfficeGrid
        overline="Office directory"
        title="Where to find us."
        subtitle="Each office runs a depot, a parts pipeline, or a customer-facing engineering team."
        hqLabel="Headquarters"
        officeLabel="Office"
        warehouseLabel="Warehouse"
        sinceLabel="Since"
        comingLabel="Coming"
        googleMapsLink="View on Google Maps"
        offices={gridOffices}
      />

      <OfficeOpeningsRail
        overline="Company timeline"
        title="Ten years of expansion."
        subtitle="Every node — office opening, HQ relocation, depot start — recorded the moment the program demanded it."
        sinceLabel="Since 2016"
        comingBadge="Coming"
        events={milestoneEvents}
      />

      <OperationsContext
        overline="Operations in context"
        title="Where offices meet programs."
        subtitle="Each site exists because a specific program required it. Three examples of what that means in practice."
        cards={{
          ukraine: {
            office: "Kyiv",
            flag: "🇺🇦",
            project: "Ukraine HRCS2 — EMU heavy maintenance",
            blurb: "Ukraine high-speed intercity EMU — maintenance operations since 2017, sustained through wartime.",
            metric: "100 units · 82,000+ maintenance delivered",
            cta: "View program record",
            href: OPS_HREFS.ukraine,
          },
          poland: {
            office: "Warsaw",
            flag: "🇵🇱",
            project: "Warsaw Tram — Tramwaje Warszawskie",
            blurb: "Tramwaje Warszawskie partnership — Warsaw Tram maintenance operations since 2021.",
            metric: "123 units · since 2021",
            cta: "View program record",
            href: OPS_HREFS.poland,
          },
          uzbekistan: {
            office: "Tashkent",
            flag: "🇺🇿",
            project: "Uzbekistan HSR — O&M mobilization",
            blurb: "Uzbekistan high-speed rail O&M commences 2026.05.",
            metric: "Launch · 2026.05",
            cta: "Program preview",
            href: OPS_HREFS.uzbekistan,
            comingBadge: "Coming 2026.05",
          },
        }}
      />
    </>
  );
}
