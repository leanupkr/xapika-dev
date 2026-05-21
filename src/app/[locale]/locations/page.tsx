import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

// Internal portfolio links — kept in code (not i18n) so translations can't redirect users.
const OPS_HREFS = {
  ukraine: "/portfolios/ukraine-emu",
  poland: "/portfolios/warsaw-tram",
  uzbekistan: "/portfolios/uzbekistan-rail",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({
    locale,
    namespace: "locationsPage.meta",
  });
  return buildPageMetadata({
    locale,
    path: "/locations",
    title: "Locations",
    description: tMeta("description"),
  });
}

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHero, tScale, tMap, tGrid, tOpenings, tOps, tPage, tNav, tHist] =
    await Promise.all([
      getTranslations({ locale, namespace: "locationsPage.hero" }),
      getTranslations({ locale, namespace: "locationsPage.scale" }),
      getTranslations({ locale, namespace: "locationsPage.map" }),
      getTranslations({ locale, namespace: "locationsPage.grid" }),
      getTranslations({ locale, namespace: "locationsPage.openings" }),
      getTranslations({ locale, namespace: "locationsPage.opsContext" }),
      getTranslations({ locale, namespace: "locationsPage" }),
      getTranslations({ locale, namespace: "nav" }),
      getTranslations({ locale, namespace: "about.history" }),
    ]);

  const offices = tPage.raw("offices") as ReadonlyArray<OfficeRow>;

  const mapOffices: ReadonlyArray<WorldMapOffice> = offices
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

  const gridOffices: ReadonlyArray<OfficeGridItem> = offices.map(
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

  const historyEvents = tHist.raw("events") as ReadonlyArray<HistoryEventRaw>;
  const milestoneEvents: ReadonlyArray<MilestoneEvent> = historyEvents.map(
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
          locale,
          trail: [{ name: tNav("locations"), path: "locations" }],
        })}
      />
      <JsonLd
        id="ld-places"
        data={placesLd(
          offices.map((o) => ({
            city: o.city,
            country: o.country,
            role: o.role,
            lat: o.lat,
            lng: o.lng,
          }))
        )}
      />

      <LocationsHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        stats={[
          {
            value: tHero("statCitiesValue"),
            label: tHero("statCitiesLabel"),
          },
          {
            value: tHero("statCountriesValue"),
            label: tHero("statCountriesLabel"),
          },
          {
            value: tHero("statContinentsValue"),
            label: tHero("statContinentsLabel"),
          },
        ]}
      />

      <NetworkAtScale
        overline={tScale("overline")}
        title={tScale("title")}
        subtitle={tScale("subtitle")}
        citiesValue={tScale("citiesValue")}
        citiesLabel={tScale("citiesLabel")}
        citiesNote={tScale("citiesNote")}
        countriesValue={tScale("countriesValue")}
        countriesLabel={tScale("countriesLabel")}
        countriesNote={tScale("countriesNote")}
        continentsValue={tScale("continentsValue")}
        continentsLabel={tScale("continentsLabel")}
        continentsNote={tScale("continentsNote")}
        yearsValue={tScale("yearsValue")}
        yearsLabel={tScale("yearsLabel")}
        yearsNote={tScale("yearsNote")}
      />

      <LocationsWorldMap
        overline={tMap("overline")}
        title={tMap("title")}
        subtitle={tMap("subtitle")}
        hqLabel={tMap("hqLabel")}
        officeLabel={tMap("officeLabel")}
        warehouseLabel={tMap("warehouseLabel")}
        sinceLabel={tMap("sinceLabel")}
        comingLabel={tMap("comingLabel")}
        legendHq={tMap("legendHq")}
        legendOffice={tMap("legendOffice")}
        liveTag={tMap("liveTag")}
        offices={mapOffices}
      />

      <OfficeGrid
        overline={tGrid("overline")}
        title={tGrid("title")}
        subtitle={tGrid("subtitle")}
        hqLabel={tMap("hqLabel")}
        officeLabel={tMap("officeLabel")}
        warehouseLabel={tMap("warehouseLabel")}
        sinceLabel={tMap("sinceLabel")}
        comingLabel={tMap("comingLabel")}
        googleMapsLink={tGrid("googleMapsLink")}
        offices={gridOffices}
      />

      <OfficeOpeningsRail
        overline={tOpenings("overline")}
        title={tOpenings("title")}
        subtitle={tOpenings("subtitle")}
        sinceLabel={tOpenings("sinceLabel")}
        comingBadge={tOpenings("comingBadge")}
        events={milestoneEvents}
      />

      <OperationsContext
        overline={tOps("overline")}
        title={tOps("title")}
        subtitle={tOps("subtitle")}
        cards={{
          ukraine: {
            office: tOps("cards.ukraine.office"),
            flag: tOps("cards.ukraine.flag"),
            project: tOps("cards.ukraine.project"),
            blurb: tOps("cards.ukraine.blurb"),
            metric: tOps("cards.ukraine.metric"),
            cta: tOps("cards.ukraine.cta"),
            href: OPS_HREFS.ukraine,
          },
          poland: {
            office: tOps("cards.poland.office"),
            flag: tOps("cards.poland.flag"),
            project: tOps("cards.poland.project"),
            blurb: tOps("cards.poland.blurb"),
            metric: tOps("cards.poland.metric"),
            cta: tOps("cards.poland.cta"),
            href: OPS_HREFS.poland,
          },
          uzbekistan: {
            office: tOps("cards.uzbekistan.office"),
            flag: tOps("cards.uzbekistan.flag"),
            project: tOps("cards.uzbekistan.project"),
            blurb: tOps("cards.uzbekistan.blurb"),
            metric: tOps("cards.uzbekistan.metric"),
            cta: tOps("cards.uzbekistan.cta"),
            href: OPS_HREFS.uzbekistan,
            comingBadge: tOps("cards.uzbekistan.comingBadge"),
          },
        }}
      />

    </>
  );
}
