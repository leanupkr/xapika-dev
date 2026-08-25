/**
 * Company history timeline SSOT — previously duplicated verbatim in
 * src/app/about/history/page.tsx and src/app/locations/page.tsx.
 *
 * Verified identical across both sources before extraction.
 *
 * "2018.11 Kyiv Office Opened" was removed in 2026-08 along with the Kyiv
 * entry in src/data/offices.ts — the Ukrainian entity has since been merged
 * into the Polish one, so listing its opening reads as a corporate presence
 * that no longer exists. The 2017.06 Ukraine HSR O&M line stays: that is the
 * start of the programme, which is still running and still documented at
 * /portfolios/ukraine-emu.
 */

export type CompanyHistoryEvent = {
  readonly year: string;
  readonly month: string;
  readonly country: string;
  readonly event: string;
};

export const HISTORY_EVENTS: ReadonlyArray<CompanyHistoryEvent> = [
  { year: "2016", month: "10", country: "Turkiye",     event: "Istanbul Office Established" },
  { year: "2017", month: "06", country: "Ukraine",     event: "HSR O&M Operations Begin" },
  { year: "2021", month: "07", country: "Poland",      event: "Poland Office Established" },
  { year: "2021", month: "10", country: "Poland",      event: "Warsaw Tram O&M Operations Begin" },
  { year: "2022", month: "03", country: "Poland",      event: "Warsaw HQ Relocated to New Facility" },
  { year: "2022", month: "05", country: "Poland",      event: "Poland Warehouse Opened" },
  { year: "2023", month: "06", country: "USA",         event: "Virginia Office Established" },
  { year: "2026", month: "03", country: "South Korea", event: "Seoul Office Established" },
  { year: "2026", month: "04", country: "Uzbekistan",  event: "Tashkent Office Established" },
  { year: "2026", month: "05", country: "Uzbekistan",  event: "Uzbekistan HSR O&M Begin" },
];
