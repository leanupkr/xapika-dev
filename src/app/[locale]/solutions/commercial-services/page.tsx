import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import EditorialStatement from "@/components/sections/EditorialStatement";
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
    namespace: "solutionsDetail.commercialServices.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/solutions/commercial-services",
    title: tHero("title"),
    description: tHero("subtitle"),
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/commercial-services/related-ukraine.jpg",
  poland: "/solutions/commercial-services/related-warsaw.jpg",
};

export default async function CommercialServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHero, tEditorial, tWwd, tStats, tRelated, tCta, tSol, tNav] =
    await Promise.all([
      getTranslations("solutionsDetail.commercialServices.hero"),
      getTranslations("solutionsDetail.commercialServices.editorialStatement"),
      getTranslations("solutionsDetail.commercialServices.whatWeDo"),
      getTranslations("solutionsDetail.commercialServices.keyStats"),
      getTranslations("solutionsDetail.commercialServices.relatedProjects"),
      getTranslations("solutionsDetail.commercialServices.cta"),
      getTranslations("solutions.items.commercial"),
      getTranslations("nav"),
    ]);

  const wwdItems = tWwd.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const paragraphs = tEditorial.raw("paragraphs") as ReadonlyArray<string>;
  const metrics = tSol.raw("metrics") as ReadonlyArray<{ value: string; label: string }>;
  const rawRelated = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));
  const metricSummary =
    metrics.length === 0
      ? "Per-operator program"
      : metrics.map((m) => `${m.value} ${m.label}`).join(" · ");

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("solutions"), path: "solutions" },
            { name: tHero("title"), path: "solutions/commercial-services" },
          ],
        })}
      />
      <JsonLd
        id="ld-service-commercial"
        data={serviceLd({
          locale,
          slug: "commercial-services",
          name: tHero("title"),
          description: tHero("subtitle"),
        })}
      />
      <SolutionDetailHero
        overline={tHero("overline")}
        index="05 / 05"
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        metric={metricSummary}
      >
        <EditorialStatement
          overline={tEditorial("overline")}
          kicker={tEditorial("kicker")}
          paragraphs={paragraphs}
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
