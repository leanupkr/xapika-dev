import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import PortfoliosIndex, {
  type PortfolioCardItem,
} from "@/components/sections/PortfoliosIndex";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({
    locale,
    namespace: "portfoliosPage.meta",
  });
  return buildPageMetadata({
    locale,
    path: "/portfolios",
    title: "Portfolios",
    description: tMeta("description"),
  });
}

export default async function PortfoliosIndexPage() {
  const tHeader = await getTranslations("portfoliosPage.header");
  const tCard = await getTranslations("portfoliosPage.card");
  const tCases = await getTranslations("portfoliosPage.cases");

  const items: ReadonlyArray<PortfolioCardItem> = [
    {
      key: "ukraine",
      href: "/portfolios/ukraine-emu",
      country: tCases("ukraine.country"),
      project: tCases("ukraine.project"),
      metric: tCases("ukraine.metric"),
      summary: tCases("ukraine.summary"),
    },
    {
      key: "warsaw",
      href: "/portfolios/warsaw-tram",
      country: tCases("warsaw.country"),
      project: tCases("warsaw.project"),
      metric: tCases("warsaw.metric"),
      summary: tCases("warsaw.summary"),
    },
    {
      key: "uzbekistan",
      href: "/portfolios/uzbekistan-rail",
      country: tCases("uzbekistan.country"),
      project: tCases("uzbekistan.project"),
      metric: tCases("uzbekistan.metric"),
      summary: tCases("uzbekistan.summary"),
      comingBadge: tCases("uzbekistan.comingBadge"),
    },
  ];

  return (
    <PortfoliosIndex
      overline={tHeader("overline")}
      title={tHeader("title")}
      subtitle={tHeader("subtitle")}
      readMore={tCard("readMore")}
      placeholder={tCard("placeholder")}
      items={items}
    />
  );
}
