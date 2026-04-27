import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tSol = await getTranslations({ locale, namespace: "solutions.items.light" });
  return {
    title: `${tSol("title")} — Xapika Engineering`,
    description: tSol("description"),
  };
}

export default async function LightMaintenancePage() {
  const tHeader = await getTranslations("solutionsPage.header");
  const tDetail = await getTranslations("solutionsPage.detail");
  const tSections = await getTranslations("solutionsPage.detail.sections");
  const tSol = await getTranslations("solutions.items.light");
  const tHero = await getTranslations("hero");

  return (
    <SolutionDetailHero
      overline={tHeader("overline")}
      index="02 / 05"
      title={tSol("title")}
      subtitle={tSol("description")}
      metric={tSol("metric")}
      sectionLabels={{
        whatWeDo: tSections("whatWeDo"),
        keyStats: tSections("keyStats"),
        relatedProjects: tSections("relatedProjects"),
        cta: tSections("cta"),
      }}
      placeholder={tDetail("placeholder")}
      ctaLabel={tHero("cta_contact")}
      ctaHref="/contact"
    />
  );
}
