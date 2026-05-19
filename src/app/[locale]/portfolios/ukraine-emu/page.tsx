import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd, breadcrumbLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioStory from "@/components/sections/PortfolioStory";
import PortfolioScrollGallery, {
  type GallerySlide,
} from "@/components/sections/PortfolioScrollGallery";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import TrackRecordCards, {
  type TrackRecordClient,
} from "@/components/sections/TrackRecordCards";
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
    namespace: "portfoliosDetail.ukraine.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/portfolios/ukraine-emu",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function UkraineEmuPage({
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
    tTrack,
    tRelated,
    tCommonRelated,
    tCommon,
    tNav,
  ] = await Promise.all([
    getTranslations("portfoliosDetail.ukraine.hero"),
    getTranslations("portfoliosDetail.ukraine.story"),
    getTranslations("portfoliosDetail.ukraine.gallery"),
    getTranslations("portfoliosDetail.ukraine.stats"),
    getTranslations("portfoliosDetail.ukraine.trackRecord"),
    getTranslations("portfoliosDetail.ukraine.related"),
    getTranslations("portfoliosDetail.common.related"),
    getTranslations("portfoliosDetail.common"),
    getTranslations("nav"),
  ]);

  const storyParagraphs = tStory.raw("paragraphs") as ReadonlyArray<string>;
  const gallerySlides = tGallery.raw("slides") as ReadonlyArray<GallerySlide>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const trackClients = tTrack.raw("clients") as ReadonlyArray<TrackRecordClient>;
  const relatedItems = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("portfolios"), path: "portfolios" },
            { name: tHero("title"), path: "portfolios/ukraine-emu" },
          ],
        })}
      />
      <JsonLd
        id="ld-case-ukraine"
        data={caseStudyLd({
          locale,
          slug: "ukraine-emu",
          name: tHero("title"),
          description: tHero("subtitle"),
          country: "Ukraine",
        })}
      />
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="01 / 03"
        accentBadge={tHero("warBadge")}
        placeholder={tCommon("photoPlaceholder")}
        placeholderKicker={tHero("placeholderKicker")}
        imageSrc="/portfolios/ukraine-emu/hero-main.jpg"
        imageAlt="HRCS2 high-speed unit at Kyiv depot — Xapika maintenance program, 2017–"
        imagePriority
      />
      <PortfolioStory
        overline={tStory("overline")}
        title={tStory("title")}
        paragraphs={storyParagraphs}
        photoCaption={tStory("photoCaption")}
        photoKicker={tStory("photoKicker")}
        imageSrc="/portfolios/ukraine-emu/story-01.jpg"
        imageAlt="Depot crew on shift — HRCS2 maintenance program"
      />
      <TrackRecordCards
        overline={tTrack("overline")}
        title={tTrack("title")}
        subtitle={tTrack("subtitle")}
        statusLabel={tTrack("statusLabel")}
        statusActive={tTrack("statusActive")}
        cta={tTrack("cta")}
        clients={trackClients}
      />
      <PortfolioScrollGallery
        sectionLabel={tGallery("sectionLabel")}
        sectionTitle={tGallery("sectionTitle")}
        slides={gallerySlides}
        markerSlideIndex={2}
        photoCaption={tGallery("photoCaption")}
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
