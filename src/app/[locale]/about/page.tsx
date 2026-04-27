import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeader from "@/components/sections/AboutHeader";
import HistoryTimeline, {
  type HistoryEvent,
} from "@/components/sections/HistoryTimeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: "About — Xapika Engineering",
    description: tMeta("description"),
  };
}

export default async function AboutPage() {
  const tHeader = await getTranslations("about.header");
  const tHist = await getTranslations("about.history");

  const events = tHist.raw("events") as ReadonlyArray<HistoryEvent>;

  return (
    <>
      <AboutHeader
        overline={tHeader("overline")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
      />
      <HistoryTimeline
        overline={tHist("overline")}
        title={tHist("title")}
        subtitle={tHist("subtitle")}
        sinceWar={tHist("sinceWar")}
        comingBadge={tHist("comingBadge")}
        events={events}
      />
    </>
  );
}
