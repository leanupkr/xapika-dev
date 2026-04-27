import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { caseStudyLd } from "@/components/seo/JsonLd";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioStory from "@/components/sections/PortfolioStory";
import PortfolioScrollGallery, {
  type GallerySlide,
} from "@/components/sections/PortfolioScrollGallery";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";

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
  const tHero = await getTranslations("portfoliosDetail.ukraine.hero");
  const tStory = await getTranslations("portfoliosDetail.ukraine.story");
  const tGallery = await getTranslations("portfoliosDetail.ukraine.gallery");
  const tStats = await getTranslations("portfoliosDetail.ukraine.stats");
  const tCta = await getTranslations("portfoliosDetail.ukraine.cta");
  const tCommon = await getTranslations("portfoliosDetail.common");

  const storyParagraphs = tStory.raw("paragraphs") as ReadonlyArray<string>;
  const gallerySlides = tGallery.raw("slides") as ReadonlyArray<GallerySlide>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;

  return (
    <>
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
      />
      <PortfolioStory
        overline={tStory("overline")}
        title={tStory("title")}
        paragraphs={storyParagraphs}
        photoCaption={tStory("photoCaption")}
        photoKicker={tStory("photoKicker")}
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
      <CtaSection
        overline={tCta("overline")}
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        button={tCta("button")}
      />
    </>
  );
}

function CtaSection({
  overline,
  title,
  subtitle,
  button,
}: {
  overline: string;
  title: string;
  subtitle: string;
  button: string;
}) {
  return (
    <section
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="ukraine-cta-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 40%, rgba(246,163,23,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1280px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-12 items-end">
          <div className="lg:col-span-8">
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "12px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </span>
            <h2
              id="ukraine-cta-title"
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(1.875rem, 3.8vw, 2.875rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "22ch",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body mt-5"
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              {subtitle}
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
              style={{ fontSize: "14px", letterSpacing: "0.05em" }}
            >
              {button}
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
