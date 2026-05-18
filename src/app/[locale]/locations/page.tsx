import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { placesLd, breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import LocationsWorldMap, {
  type WorldMapOffice,
} from "@/components/sections/LocationsWorldMap";
import OfficeGrid, {
  type OfficeGridItem,
} from "@/components/sections/OfficeGrid";
import LocationsCta from "@/components/sections/LocationsCta";

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
};

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
  const [tHeader, tMap, tGrid, tCta, tPage, tNav] = await Promise.all([
    getTranslations("locationsPage.header"),
    getTranslations("locationsPage.map"),
    getTranslations("locationsPage.grid"),
    getTranslations("locationsPage.cta"),
    getTranslations("locationsPage"),
    getTranslations("nav"),
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
    ({ id, city, country, flag, role, since, lat, lng, blurb }) => ({
      id,
      city,
      country,
      flag,
      role,
      since,
      lat,
      lng,
      blurb,
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
      <AboutHeader
        overline={tHeader("overline")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
      />
      <LocationsWorldMap
        overline={tMap("overline")}
        title={tMap("title")}
        subtitle={tMap("subtitle")}
        hqLabel={tMap("hqLabel")}
        officeLabel={tMap("officeLabel")}
        warehouseLabel={tMap("warehouseLabel")}
        sinceLabel={tMap("sinceLabel")}
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
        addressPlaceholder={tGrid("addressPlaceholder")}
        emailPlaceholder={tGrid("emailPlaceholder")}
        googleMapsLink={tGrid("googleMapsLink")}
        awaitingNote={tGrid("awaitingNote")}
        offices={gridOffices}
      />
      <LocationsCta
        overline={tCta("overline")}
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        button={tCta("button")}
      />
    </>
  );
}
