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
    namespace: "portfoliosDetail.ukraine.hero",
  });
  return {
    title: `${t("title")} — Xapika Engineering`,
    description: t("subtitle"),
  };
}

export default async function UkraineEmuPage() {
  const tHero = await getTranslations("portfoliosDetail.ukraine.hero");
  const tBody = await getTranslations("portfoliosDetail.ukraine.body");
  const tCommon = await getTranslations("portfoliosDetail.common");

  return (
    <>
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="01 / 03"
        showWarBadge
        warBadgeLabel={tHero("warBadge")}
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
