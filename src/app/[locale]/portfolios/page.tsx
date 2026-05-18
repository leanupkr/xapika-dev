import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
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

export default async function PortfoliosIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHeader, tCard, tCases, tNav] = await Promise.all([
    getTranslations("portfoliosPage.header"),
    getTranslations("portfoliosPage.card"),
    getTranslations("portfoliosPage.cases"),
    getTranslations("nav"),
  ]);

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
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tNav("portfolios"), path: "portfolios" }],
        })}
      />
      <PortfoliosIndex
        overline={tHeader("overline")}
      title={tHeader("title")}
      subtitle={tHeader("subtitle")}
        readMore={tCard("readMore")}
        placeholder={tCard("placeholder")}
        items={items}
      />
    </>
  );
}
