import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import UzbekRouteMap from "@/components/sections/UzbekRouteMap";
import LaunchCountdown from "@/components/sections/LaunchCountdown";
import UzbekTimeline, {
  type UzbekEvent,
} from "@/components/sections/UzbekTimeline";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "portfoliosDetail.uzbekistan.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/portfolios/uzbekistan-rail",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function UzbekistanRailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [
    tHero,
    tMap,
    tCountdown,
    tTimeline,
    tPlanned,
    tRelated,
    tCommonRelated,
    tCommon,
    tNav,
  ] = await Promise.all([
    getTranslations("portfoliosDetail.uzbekistan.hero"),
    getTranslations("portfoliosDetail.uzbekistan.map"),
    getTranslations("portfoliosDetail.uzbekistan.countdown"),
    getTranslations("portfoliosDetail.uzbekistan.timeline"),
    getTranslations("portfoliosDetail.uzbekistan.planned"),
    getTranslations("portfoliosDetail.uzbekistan.related"),
    getTranslations("portfoliosDetail.common.related"),
    getTranslations("portfoliosDetail.common"),
    getTranslations("nav"),
  ]);

  const mapPins = tMap.raw("pins") as {
    tashkent: string;
    seoul: string;
    warsaw: string;
  };
  const countdownLabels = tCountdown.raw("labels") as {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  const timelineEvents = tTimeline.raw("events") as ReadonlyArray<UzbekEvent>;
  const plannedItems = tPlanned.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const relatedItems = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("portfolios"), path: "portfolios" },
            { name: tHero("title"), path: "portfolios/uzbekistan-rail" },
          ],
        })}
      />
      <JsonLd
        id="ld-case-uzbekistan"
        data={caseStudyLd({
          locale,
          slug: "uzbekistan-rail",
          name: tHero("title"),
          description: tHero("subtitle"),
          country: "Uzbekistan",
        })}
      />
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="03 / 03"
        accentBadge={tHero("comingBadge")}
        placeholder={tCommon("photoPlaceholder")}
        placeholderKicker={tHero("placeholderKicker")}
      />
      <UzbekRouteMap
        overline={tMap("overline")}
        title={tMap("title")}
        subtitle={tMap("subtitle")}
        pins={mapPins}
      />
      <LaunchCountdown
        overline={tCountdown("overline")}
        title={tCountdown("title")}
        subtitle={tCountdown("subtitle")}
        launchDate={tCountdown("launchDate")}
        labels={countdownLabels}
        partnerNote={tCountdown("partnerNote")}
      />
      <UzbekTimeline
        overline={tTimeline("overline")}
        title={tTimeline("title")}
        comingBadge={tTimeline("comingBadge")}
        events={timelineEvents}
      />
      <WhatWeDo
        overline={tPlanned("overline")}
        title={tPlanned("title")}
        items={plannedItems}
      />
      <RelatedProjects
        overline={tCommonRelated("overline")}
        title={tCommonRelated("title")}
        items={relatedItems}
      />
    </>
  );
}
