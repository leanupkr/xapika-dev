import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  return {
    title: "Solutions — Xapika Engineering",
    description: tMeta("description"),
  };
}

export default async function SolutionsPage() {
  const tHeader = await getTranslations("solutionsPage.header");
  const tCard = await getTranslations("solutionsPage.card");
  const tDetail = await getTranslations("solutionsPage.detail");
  const tSol = await getTranslations("solutions.items");

  const items: ReadonlyArray<SolutionItem> = [
    {
      key: "heavy",
      href: "/solutions/heavy-maintenance",
      title: tSol("heavy.title"),
      description: tSol("heavy.description"),
      metric: tSol("heavy.metric"),
    },
    {
      key: "light",
      href: "/solutions/light-maintenance",
      title: tSol("light.title"),
      description: tSol("light.description"),
      metric: tSol("light.metric"),
    },
    {
      key: "supply",
      href: "/solutions/supply-chain",
      title: tSol("supply.title"),
      description: tSol("supply.description"),
      metric: tSol("supply.metric"),
    },
    {
      key: "digital",
      href: "/solutions/digital-asset-management",
      title: tSol("digital.title"),
      description: tSol("digital.description"),
      metric: tSol("digital.metric"),
    },
    {
      key: "commercial",
      href: "/solutions/commercial-services",
      title: tSol("commercial.title"),
      description: tSol("commercial.description"),
      metric: tSol("commercial.metric"),
    },
  ];

  return (
    <SolutionsIndex
      overline={tHeader("overline")}
      title={tHeader("title")}
      subtitle={tHeader("subtitle")}
      learnMore={tCard("learnMore")}
      placeholder={tDetail("placeholder")}
      items={items}
    />
  );
}
