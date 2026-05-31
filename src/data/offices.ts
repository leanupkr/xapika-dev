/**
 * Office locations SSOT — previously split between:
 *   - src/app/locations/page.tsx  (full schema, 7 entries)
 *   - src/components/layout/Footer.tsx  (partial schema, same 7 entries)
 *
 * Verified: all city/country pairs match between the two sources.
 * Display order follows the locations page (canonical). Footer order
 * changes slightly (virginia/istanbul/tashkent reordered) — cosmetic only.
 *
 * `footerName` and `footerDetail` carry the Footer-specific display strings.
 * All other fields are consumed by the locations page and its child components.
 */

export type OfficeRow = {
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
  /** Display name in Footer (e.g. "Warsaw HQ" vs city "Warsaw"). */
  footerName: string;
  /** Short role description in Footer (e.g. "Headquarters"). */
  footerDetail: string;
  address?: string;
  mapsUrl?: string;
};

export const OFFICES: ReadonlyArray<OfficeRow> = [
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
    footerName: "Warsaw HQ",
    footerDetail: "Headquarters",
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
    footerName: "Warsaw",
    footerDetail: "Tram & Metro Office",
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
    footerName: "Kyiv",
    footerDetail: "EMU Crew",
  },
  {
    id: "seoul",
    city: "Seoul",
    country: "South Korea",
    flag: "🇰🇷",
    role: "office",
    since: "2026.03",
    lat: 37.5665,
    lng: 126.978,
    showOnMap: true,
    blurb: "APAC bridgehead · digital asset platform & supply-chain coordination.",
    footerName: "Seoul",
    footerDetail: "Asia Pacific",
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
    footerName: "Virginia",
    footerDetail: "North America",
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
    footerName: "Istanbul",
    footerDetail: "Founding Office",
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
    footerName: "Tashkent",
    footerDetail: "Central Asia",
  },
];
