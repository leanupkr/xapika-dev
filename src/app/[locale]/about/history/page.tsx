import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
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
  const t = await getTranslations({ locale, namespace: "about.history.meta" });
  return buildPageMetadata({
    locale,
    path: "/about/history",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHist, tNav, tIndex] = await Promise.all([
    getTranslations("about.history"),
    getTranslations("nav"),
    getTranslations("about.index"),
  ]);

  const events = tHist.raw("events") as ReadonlyArray<HistoryEvent>;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("about"), path: "about" },
            { name: tIndex("cards.history.title"), path: "about/history" },
          ],
        })}
      />
      <AboutHeader
        overline={tHist("overline")}
        title={tHist("title")}
        subtitle={tHist("subtitle")}
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
