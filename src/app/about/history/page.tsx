import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import HistoryTimeline, {
  type HistoryEvent,
} from "@/components/sections/HistoryTimeline";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about/history",
    title: "Our History",
    description:
      "A decade of rail maintenance precision from Istanbul to Tashkent — milestone by milestone.",
  });
}

const HISTORY_EVENTS: ReadonlyArray<HistoryEvent> = [
  { year: "2016", month: "10", country: "Turkiye", event: "Istanbul Office Established" },
  { year: "2017", month: "06", country: "Ukraine", event: "HSR O&M Operations Begin" },
  { year: "2018", month: "11", country: "Ukraine", event: "Ukraine HQ Opened" },
  { year: "2021", month: "07", country: "Poland", event: "Poland Office Established" },
  { year: "2021", month: "10", country: "Poland", event: "Warsaw Tram O&M Operations Begin" },
  { year: "2022", month: "03", country: "Poland", event: "Warsaw HQ Relocated to New Facility" },
  { year: "2022", month: "05", country: "Poland", event: "Poland Warehouse Opened" },
  { year: "2023", month: "06", country: "USA", event: "Virginia Office Established" },
  { year: "2026", month: "03", country: "South Korea", event: "Seoul Office Established" },
  { year: "2026", month: "04", country: "Uzbekistan", event: "Tashkent Office Established" },
  { year: "2026", month: "05", country: "Uzbekistan", event: "Uzbekistan HSR O&M Begin" },
];

export default async function HistoryPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "About Us", path: "about" },
            { name: "Our History", path: "about/history" },
          ],
        })}
      />
      <AboutHeader
        overline="History"
        title="A decade of precision across five countries."
        subtitle="Each milestone is verified by client records, regulator logs, and our internal incident-free index."
      />
      <HistoryTimeline
        overline="History"
        title="A decade of precision across five countries."
        subtitle="Each milestone is verified by client records, regulator logs, and our internal incident-free index."
        sinceWar="Operating uninterrupted since 2022 invasion."
        comingBadge="Coming"
        events={HISTORY_EVENTS}
      />
    </>
  );
}
