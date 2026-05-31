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
import { OFFICES } from "@/data/offices";
import { HISTORY_EVENTS } from "@/data/companyHistory";

// Internal portfolio links — kept in code so translations can't redirect users.
const OPS_HREFS = {
  ukraine: "/portfolios/ukraine-emu",
  poland: "/portfolios/warsaw-tram",
  uzbekistan: "/portfolios/uzbekistan-rail",
} as const;

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "/locations",
    title: "Locations",
    description:
      "Seven Xapika offices across Europe, North America, and Central Asia — local crews, regional warehouses, regulator-aligned operations.",
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
        title="Seven offices. One operating clock."
        subtitle="From Warsaw to Tashkent — local crews, regional warehouses, regulator-aligned operations."
        stats={[
          { value: "9", label: "Cities" },
          { value: "6", label: "Countries" },
          { value: "4", label: "Continents" },
        ]}
      />

      <NetworkAtScale
        overline="Global footprint"
        title="A network built over a decade."
        subtitle="Seven operating sites across six countries — each one a full depot or engineering team, not a representative office."
        citiesValue="9"
        citiesLabel="Cities"
        citiesNote="From Warsaw to Tashkent"
        countriesValue="6"
        countriesLabel="Countries"
        countriesNote="Europe · Asia · North America"
        continentsValue="4"
        continentsLabel="Continents"
        continentsNote="No single-timezone dependency"
        yearsValue="10"
        yearsLabel="Years"
        yearsNote="Istanbul 2016 — Seoul 2026"
      />

      <LocationsWorldMap
        overline="Where we operate"
        title="A live network across seven cities."
        subtitle="Hover any marker to read the office record. Warsaw is our headquarters; the rest are full operating sites — not sales outposts."
        hqLabel="Headquarters"
        officeLabel="Office"
        warehouseLabel="Warehouse"
        sinceLabel="Since"
        comingLabel="Coming"
        legendHq="HQ"
        legendOffice="Office"
        liveTag="7 Sites · Live"
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
            metric: "90 cars · 82,000+ maintenance delivered",
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
