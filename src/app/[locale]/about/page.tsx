import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { aboutPageLd, breadcrumbLd } from "@/components/seo/JsonLd";
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
  return buildPageMetadata({
    locale,
    path: "/about",
    title: "About",
    description: tMeta("description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHeader, tHist, tCeo, tVision, tOrg, tClients, tMeta, tNav] = await Promise.all([
    getTranslations("about.header"),
    getTranslations("about.history"),
    getTranslations("about.ceo"),
    getTranslations("about.vision"),
    getTranslations("about.org"),
    getTranslations("about.clients"),
    getTranslations("about.meta"),
    getTranslations("nav"),
  ]);

  const events = tHist.raw("events") as ReadonlyArray<HistoryEvent>;
  const visionItems = tVision.raw("items") as ReadonlyArray<VisionItem>;

  return (
    <>
      <JsonLd id="ld-about" data={aboutPageLd(locale, tMeta("description"))} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tNav("about"), path: "about" }],
        })}
      />
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
        portraitPlaceholder={tCeo("portraitPlaceholder")}
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
