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
  const [tHeader, tCard, tCases, tNav, tDownload] = await Promise.all([
    getTranslations("portfoliosPage.header"),
    getTranslations("portfoliosPage.card"),
    getTranslations("portfoliosPage.cases"),
    getTranslations("nav"),
    getTranslations("portfoliosPage.downloadPdf"),
  ]);

  const items: ReadonlyArray<PortfolioCardItem> = [
    {
      key: "ukraine",
      href: "/portfolios/ukraine-emu",
      country: tCases("ukraine.country"),
      project: tCases("ukraine.project"),
      metric: tCases("ukraine.metric"),
      summary: tCases("ukraine.summary"),
      image: "/portfolios/ukraine-emu/hero-main.jpg",
      imgAlt:
        "HRCS2 high-speed unit at Kyiv depot — Xapika maintenance program, 2017–",
    },
    {
      key: "warsaw",
      href: "/portfolios/warsaw-tram",
      country: tCases("warsaw.country"),
      project: tCases("warsaw.project"),
      metric: tCases("warsaw.metric"),
      summary: tCases("warsaw.summary"),
      image: "/portfolios/warsaw-tram/hero-main.jpg",
      imgAlt:
        "Warsaw tram on mainline service — Tramwaje Warszawskie maintenance program, 2022–",
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
        downloadPdf={{
          label: tDownload("label"),
          meta: tDownload("meta"),
          ariaLabel: tDownload("ariaLabel"),
        }}
      />
    </>
  );
}
