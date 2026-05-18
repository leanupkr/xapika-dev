import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionsIndex, {
  type SolutionItem,
} from "@/components/sections/SolutionsIndex";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "solutionsPage.meta" });
  return buildPageMetadata({
    locale,
    path: "/solutions",
    title: "Solutions",
    description: tMeta("description"),
  });
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHeader, tCard, tDetail, tSol, tNav] = await Promise.all([
    getTranslations("solutionsPage.header"),
    getTranslations("solutionsPage.card"),
    getTranslations("solutionsPage.detail"),
    getTranslations("solutions.items"),
    getTranslations("nav"),
  ]);

  function metricSummary(key: string): string {
    const arr = tSol.raw(`${key}.metrics`) as ReadonlyArray<{
      value: string;
      label: string;
    }>;
    if (!arr || arr.length === 0) return "";
    return arr.map((m) => `${m.value} ${m.label}`).join(" · ");
  }

  const items: ReadonlyArray<SolutionItem> = [
    {
      key: "heavy",
      href: "/solutions/heavy-maintenance",
      title: tSol("heavy.title"),
      description: tSol("heavy.description"),
      metric: metricSummary("heavy"),
      image: "/solutions/index-heavy.jpg",
      imgAlt: tSol("heavy.imgAlt"),
    },
    {
      key: "light",
      href: "/solutions/light-maintenance",
      title: tSol("light.title"),
      description: tSol("light.description"),
      metric: metricSummary("light"),
      image: "/solutions/index-light.jpg",
      imgAlt: tSol("light.imgAlt"),
    },
    {
      key: "supply",
      href: "/solutions/supply-chain",
      title: tSol("supply.title"),
      description: tSol("supply.description"),
      metric: metricSummary("supply"),
      image: "/solutions/index-supply.webp",
      imgAlt: tSol("supply.imgAlt"),
    },
    {
      key: "digital",
      href: "/solutions/digital-asset-management",
      title: tSol("digital.title"),
      description: tSol("digital.description"),
      metric: metricSummary("digital"),
      image: "/solutions/index-digital.jpg",
      imgAlt: tSol("digital.imgAlt"),
    },
    {
      key: "commercial",
      href: "/solutions/commercial-services",
      title: tSol("commercial.title"),
      description: tSol("commercial.description"),
      metric: metricSummary("commercial"),
      image: "/solutions/index-commercial.jpg",
      imgAlt: tSol("commercial.imgAlt"),
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tNav("solutions"), path: "solutions" }],
        })}
      />
      <SolutionsIndex
        overline={tHeader("overline")}
      title={tHeader("title")}
      subtitle={tHeader("subtitle")}
        learnMore={tCard("learnMore")}
        placeholder={tDetail("placeholder")}
        items={items}
      />
    </>
  );
}
