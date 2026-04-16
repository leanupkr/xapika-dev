import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import KeyNumbers from "@/components/sections/KeyNumbers";
import SolutionsGrid from "@/components/sections/SolutionsGrid";

export default async function HomePage() {
  const tHero = await getTranslations("hero");
  const tKN = await getTranslations("keyNumbers");
  const tSol = await getTranslations("solutions");

  // headline에서 accent 부분 ("Safe Operations." / "안전한 운영.")을 분리
  const headline = tHero("headline");
  const headlineAccent = headline.includes("Safe Operations.")
    ? "Safe Operations."
    : headline.includes("안전한 운영.")
    ? "안전한 운영."
    : "";

  return (
    <>
      <Hero
        headline={headline}
        headlineAccent={headlineAccent}
        subheadline={tHero("subheadline")}
        overline={tHero("overline")}
        ctaSolutions={tHero("cta_solutions")}
        ctaContact={tHero("cta_contact")}
        ctaSolutionsHref="/solutions"
        ctaContactHref="/contact"
      />
      <KeyNumbers
        overline={tKN("overline")}
        title={tKN("title")}
        subtitle={tKN("subtitle")}
        stats={[
          {
            value: tKN("fleet_value"),
            label: tKN("fleet_label"),
            note: tKN("fleet_note"),
          },
          {
            value: tKN("cases_value"),
            label: tKN("cases_label"),
            note: tKN("cases_note"),
          },
          {
            value: tKN("countries_value"),
            unit: tKN("countries_unit"),
            label: tKN("countries_label"),
            note: tKN("countries_note"),
          },
          {
            value: tKN("workforce_value"),
            label: tKN("workforce_label"),
            note: tKN("workforce_note"),
          },
        ]}
      />
      <SolutionsGrid
        overline={tSol("overline")}
        title={tSol("title")}
        subtitle={tSol("subtitle")}
        items={{
          light: {
            title: tSol("items.light.title"),
            description: tSol("items.light.description"),
            metric: tSol("items.light.metric"),
          },
          heavy: {
            title: tSol("items.heavy.title"),
            description: tSol("items.heavy.description"),
            metric: tSol("items.heavy.metric"),
          },
          supply: {
            title: tSol("items.supply.title"),
            description: tSol("items.supply.description"),
            metric: tSol("items.supply.metric"),
          },
          digital: {
            title: tSol("items.digital.title"),
            description: tSol("items.digital.description"),
            metric: tSol("items.digital.metric"),
          },
          commercial: {
            title: tSol("items.commercial.title"),
            description: tSol("items.commercial.description"),
            metric: tSol("items.commercial.metric"),
          },
        }}
      />
    </>
  );
}
