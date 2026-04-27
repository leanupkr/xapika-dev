import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioDetailPlaceholder from "@/components/sections/PortfolioDetailPlaceholder";

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
  return {
    title: `${t("title")} — Xapika Engineering`,
    description: t("subtitle"),
  };
}

export default async function UzbekistanRailPage() {
  const tHero = await getTranslations("portfoliosDetail.uzbekistan.hero");
  const tBody = await getTranslations("portfoliosDetail.uzbekistan.body");
  const tCommon = await getTranslations("portfoliosDetail.common");

  return (
    <>
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="03 / 03"
        placeholder={tCommon("photoPlaceholder")}
        placeholderKicker={tHero("placeholderKicker")}
      />
      <PortfolioDetailPlaceholder
        sectionLabels={{
          story: tBody("story"),
          stats: tBody("stats"),
          photos: tBody("photos"),
          cta: tBody("cta"),
        }}
        placeholder={tCommon("placeholder")}
        ctaLabel={tCommon("ctaLabel")}
      />
    </>
  );
}
