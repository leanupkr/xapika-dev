import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import OverhaulProcess, {
  type OverhaulPhase,
} from "@/components/sections/OverhaulProcess";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";
import CtaSection from "@/components/sections/CtaSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tHero = await getTranslations({
    locale,
    namespace: "solutionsDetail.heavyMaintenance.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/solutions/heavy-maintenance",
    title: tHero("title"),
    description: tHero("subtitle"),
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/heavy-maintenance/related-ukraine.jpg",
  poland: "/solutions/heavy-maintenance/related-warsaw.jpg",
};

type SolutionMetric = { value: string; label: string };

function formatMetric(metrics: ReadonlyArray<SolutionMetric>): string {
  if (metrics.length === 0) return "";
  return metrics.map((m) => `${m.value} ${m.label}`).join(" · ");
}

export default async function HeavyMaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHero, tProcess, tWwd, tStats, tRelated, tCta, tSol, tNav] =
    await Promise.all([
      getTranslations("solutionsDetail.heavyMaintenance.hero"),
      getTranslations("solutionsDetail.heavyMaintenance.overhaulProcess"),
      getTranslations("solutionsDetail.heavyMaintenance.whatWeDo"),
      getTranslations("solutionsDetail.heavyMaintenance.keyStats"),
      getTranslations("solutionsDetail.heavyMaintenance.relatedProjects"),
      getTranslations("solutionsDetail.heavyMaintenance.cta"),
      getTranslations("solutions.items.heavy"),
      getTranslations("nav"),
    ]);

  const wwdItems = tWwd.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const phases = tProcess.raw("phases") as ReadonlyArray<OverhaulPhase>;
  const metrics = tSol.raw("metrics") as ReadonlyArray<SolutionMetric>;
  const rawRelated = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("solutions"), path: "solutions" },
            { name: tHero("title"), path: "solutions/heavy-maintenance" },
          ],
        })}
      />
      <JsonLd
        id="ld-service-heavy"
        data={serviceLd({
          locale,
          slug: "heavy-maintenance",
          name: tHero("title"),
          description: tHero("subtitle"),
        })}
      />
      <SolutionDetailHero
        overline={tHero("overline")}
        index="01 / 05"
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        metric={formatMetric(metrics)}
      >
        <OverhaulProcess
          overline={tProcess("overline")}
          title={tProcess("title")}
          subtitle={tProcess("subtitle")}
          phases={phases}
          heroImage="/solutions/heavy-maintenance/overhaul-hero.jpg"
          heroImageAlt="Heavy overhaul — traction motor disassembly under depot crane."
          traceabilityImage="/solutions/heavy-maintenance/traceability.jpg"
          traceabilityImageAlt="Gearbox component traceability label — serial, test record, and sign-off."
        />
        <WhatWeDo
          overline={tWwd("overline")}
          title={tWwd("title")}
          items={wwdItems}
        />
        <KeyStats
          overline={tStats("overline")}
          title={tStats("title")}
          stats={stats}
        />
        <RelatedProjects
          overline={tRelated("overline")}
          title={tRelated("title")}
          items={relatedItems}
        />
        <CtaSection
          titleId="solution-cta-title"
          title={tCta("title")}
          subtitle={tCta("subtitle")}
          button={tCta("button")}
        />
      </SolutionDetailHero>
    </>
  );
}
