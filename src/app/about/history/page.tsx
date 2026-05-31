import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import HistoryTimeline from "@/components/sections/HistoryTimeline";
import { HISTORY_EVENTS } from "@/data/companyHistory";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about/history",
    title: "Our History",
    description:
      "A decade of rail maintenance precision from Istanbul to Tashkent — milestone by milestone.",
  });
}

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
        title="A decade of precision across six countries."
        subtitle="Each milestone is verified by client records, regulator logs, and our internal incident-free index."
      />
      <HistoryTimeline
        overline="History"
        title="A decade of precision across six countries."
        subtitle="Each milestone is verified by client records, regulator logs, and our internal incident-free index."
        sinceWar="Operating uninterrupted since 2022 invasion."
        comingBadge="Coming"
        events={HISTORY_EVENTS}
      />
    </>
  );
}
