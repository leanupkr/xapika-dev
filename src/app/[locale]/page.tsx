import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import KeyNumbers from "@/components/sections/KeyNumbers";
import SolutionsGrid from "@/components/sections/SolutionsGrid";
import PortfoliosPreview from "@/components/sections/PortfoliosPreview";
import TrustedBy from "@/components/sections/TrustedBy";
import GlobalPresence from "@/components/sections/GlobalPresence";
import MidCta from "@/components/sections/MidCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: "hero" });
  return buildPageMetadata({
    locale,
    path: "",
    title: "Xapika Engineering",
    description: tHero("subheadline"),
  });
}

export default async function HomePage() {
  const [tHero, tKN, tSol, tPf, tPartners, tGlobal, tMidCta] = await Promise.all([
    getTranslations("hero"),
    getTranslations("keyNumbers"),
    getTranslations("solutions"),
    getTranslations("portfolios"),
    getTranslations("partners"),
    getTranslations("globalPresence"),
    getTranslations("midCta"),
  ]);

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
        pauseAriaLabel={tHero("pauseAriaLabel")}
        playAriaLabel={tHero("playAriaLabel")}
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
      <PortfoliosPreview
        overline={tPf("overline")}
        title={tPf("title")}
        subtitle={tPf("subtitle")}
        viewAll={tPf("viewAll")}
        items={{
          ukraine: {
            number: tPf("ukraine.number"),
            country: tPf("ukraine.country"),
            project: tPf("ukraine.project"),
            since: tPf("ukraine.since"),
            badge: tPf("ukraine.badge"),
            m1_value: tPf("ukraine.m1_value"),
            m1_label: tPf("ukraine.m1_label"),
            m2_value: tPf("ukraine.m2_value"),
            m2_label: tPf("ukraine.m2_label"),
            m3_value: tPf("ukraine.m3_value"),
            m3_label: tPf("ukraine.m3_label"),
            cta: tPf("ukraine.cta"),
          },
          poland: {
            number: tPf("poland.number"),
            country: tPf("poland.country"),
            project: tPf("poland.project"),
            since: tPf("poland.since"),
            m1_value: tPf("poland.m1_value"),
            m1_label: tPf("poland.m1_label"),
            m2_value: tPf("poland.m2_value"),
            m2_label: tPf("poland.m2_label"),
            cta: tPf("poland.cta"),
          },
          uzbekistan: {
            number: tPf("uzbekistan.number"),
            country: tPf("uzbekistan.country"),
            project: tPf("uzbekistan.project"),
            since: tPf("uzbekistan.since"),
            badge: tPf("uzbekistan.badge"),
            m1_value: tPf("uzbekistan.m1_value"),
            m1_label: tPf("uzbekistan.m1_label"),
            m2_value: tPf("uzbekistan.m2_value"),
            m2_label: tPf("uzbekistan.m2_label"),
            cta: tPf("uzbekistan.cta"),
          },
        }}
      />
      <TrustedBy overline={tPartners("overline")} />
      <GlobalPresence
        overline={tGlobal("overline")}
        title={tGlobal("title")}
        subtitle={tGlobal("subtitle")}
      />
      <MidCta
        overline={tMidCta("overline")}
        title={tMidCta("title")}
        subtitle={tMidCta("subtitle")}
        ctaPrimary={tMidCta("ctaPrimary")}
        ctaSecondary={tMidCta("ctaSecondary")}
      />
    </>
  );
}
