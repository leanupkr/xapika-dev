import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeader from "@/components/sections/AboutHeader";
import HistoryTimeline, {
  type HistoryEvent,
} from "@/components/sections/HistoryTimeline";
import CeoMessage from "@/components/sections/CeoMessage";
import Vision, { type VisionItem } from "@/components/sections/Vision";
import OrgChart from "@/components/sections/OrgChart";
import OurClients from "@/components/sections/OurClients";

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
  const tCeo = await getTranslations("about.ceo");
  const tVision = await getTranslations("about.vision");
  const tOrg = await getTranslations("about.org");
  const tClients = await getTranslations("about.clients");

  const events = tHist.raw("events") as ReadonlyArray<HistoryEvent>;
  const visionItems = tVision.raw("items") as ReadonlyArray<VisionItem>;

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
      <CeoMessage
        overline={tCeo("overline")}
        title={tCeo("title")}
        subtitle={tCeo("subtitle")}
        placeholderName={tCeo("placeholderName")}
        awaitingNote={tCeo("awaitingNote")}
      />
      <Vision
        overline={tVision("overline")}
        title={tVision("title")}
        subtitle={tVision("subtitle")}
        items={visionItems}
      />
      <OrgChart
        overline={tOrg("overline")}
        title={tOrg("title")}
        subtitle={tOrg("subtitle")}
        placeholderText={tOrg("placeholderText")}
        awaitingNote={tOrg("awaitingNote")}
      />
      <OurClients
        overline={tClients("overline")}
        title={tClients("title")}
        subtitle={tClients("subtitle")}
        logoArrivingNote={tClients("logoArrivingNote")}
      />
    </>
  );
}
