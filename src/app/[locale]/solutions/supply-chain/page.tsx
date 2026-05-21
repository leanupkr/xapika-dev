import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import SupplyChainGallery, {
  type GallerySlide,
} from "@/components/sections/SupplyChainGallery";
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
    namespace: "solutionsDetail.supplyChain.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/solutions/supply-chain",
    title: tHero("title"),
    description: tHero("subtitle"),
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/supply-chain/related-ukraine.jpg",
  poland: "/solutions/supply-chain/related-warsaw.jpg",
};

export default async function SupplyChainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHero, tGallery, tWwd, tStats, tRelated, tCta, tSol, tNav] =
    await Promise.all([
      getTranslations("solutionsDetail.supplyChain.hero"),
      getTranslations("solutionsDetail.supplyChain.gallery"),
      getTranslations("solutionsDetail.supplyChain.whatWeDo"),
      getTranslations("solutionsDetail.supplyChain.keyStats"),
      getTranslations("solutionsDetail.supplyChain.relatedProjects"),
      getTranslations("solutionsDetail.supplyChain.cta"),
      getTranslations("solutions.items.supply"),
      getTranslations("nav"),
    ]);

  const wwdItems = tWwd.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const metrics = tSol.raw("metrics") as ReadonlyArray<{ value: string; label: string }>;
  const rawGallerySlides = tGallery.raw("slides") as ReadonlyArray<{
    src: string;
    alt: string;
    caption: string;
  }>;
  const gallerySlides: ReadonlyArray<GallerySlide> = rawGallerySlides.map(
    (s) => ({
      ...s,
      src: `/solutions/supply-chain/${s.src}`,
    })
  );
  const rawRelated = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));
  const metricSummary = metrics.map((m) => `${m.value} ${m.label}`).join(" · ");

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("solutions"), path: "solutions" },
            { name: tHero("title"), path: "solutions/supply-chain" },
          ],
        })}
      />
      <JsonLd
        id="ld-service-supply"
        data={serviceLd({
          locale,
          slug: "supply-chain",
          name: tHero("title"),
          description: tHero("subtitle"),
        })}
      />
      <SolutionDetailHero
        overline={tHero("overline")}
        index="03 / 05"
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        metric={metricSummary}
      >
        <WhatWeDo
          overline={tWwd("overline")}
          title={tWwd("title")}
          items={wwdItems}
        />
        <SupplyChainGallery
          overline={tGallery("overline")}
          title={tGallery("title")}
          slides={gallerySlides}
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
