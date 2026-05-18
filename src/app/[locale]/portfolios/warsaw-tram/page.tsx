import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioStory from "@/components/sections/PortfolioStory";
import WarsawSeasonTimeline, {
  type SeasonEntry,
} from "@/components/sections/WarsawSeasonTimeline";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
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
    namespace: "portfoliosDetail.warsaw.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/portfolios/warsaw-tram",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function WarsawTramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [
    tHero,
    tStory,
    tGallery,
    tStats,
    tRelated,
    tCommonRelated,
    tCommon,
    tNav,
  ] = await Promise.all([
    getTranslations("portfoliosDetail.warsaw.hero"),
    getTranslations("portfoliosDetail.warsaw.story"),
    getTranslations("portfoliosDetail.warsaw.gallery"),
    getTranslations("portfoliosDetail.warsaw.stats"),
    getTranslations("portfoliosDetail.warsaw.related"),
    getTranslations("portfoliosDetail.common.related"),
    getTranslations("portfoliosDetail.common"),
    getTranslations("nav"),
  ]);

  const storyParagraphs = tStory.raw("paragraphs") as ReadonlyArray<string>;
  const galleryEntries = tGallery.raw("entries") as ReadonlyArray<SeasonEntry>;
  const yearLabels = tGallery.raw("yearLabels") as {
    "2022": string;
    "2023": string;
    "2024": string;
    "2025": string;
  };
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const relatedItems = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("portfolios"), path: "portfolios" },
            { name: tHero("title"), path: "portfolios/warsaw-tram" },
          ],
        })}
      />
      <JsonLd
        id="ld-case-warsaw"
        data={caseStudyLd({
          locale,
          slug: "warsaw-tram",
          name: tHero("title"),
          description: tHero("subtitle"),
          country: "Poland",
        })}
      />
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="02 / 03"
        placeholder={tCommon("photoPlaceholder")}
        placeholderKicker={tHero("placeholderKicker")}
        imageSrc="/portfolios/warsaw-tram/hero-main.jpg"
        imageAlt="Warsaw tram on mainline service — Tramwaje Warszawskie maintenance program, 2022–"
        imagePriority
      />
      <PortfolioStory
        overline={tStory("overline")}
        title={tStory("title")}
        paragraphs={storyParagraphs}
        photoCaption={tStory("photoCaption")}
        photoKicker={tStory("photoKicker")}
        imageSrc="/portfolios/warsaw-tram/story-01.jpg"
        imageAlt="Warsaw tram summer maintenance on the line"
      />
      <WarsawSeasonTimeline
        overline={tGallery("overline")}
        title={tGallery("title")}
        yearLabels={yearLabels}
        entries={galleryEntries}
      />
      <KeyStats
        overline={tStats("overline")}
        title={tStats("title")}
        stats={stats}
      />
      <RelatedProjects
        overline={tCommonRelated("overline")}
        title={tCommonRelated("title")}
        items={relatedItems}
      />
    </>
  );
}
