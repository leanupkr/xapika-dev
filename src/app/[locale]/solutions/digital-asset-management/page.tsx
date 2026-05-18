import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import MMISShowcase, {
  type MMISScreen,
} from "@/components/sections/MMISShowcase";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import VisionItCallout from "@/components/sections/VisionItCallout";
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
    namespace: "solutionsDetail.digitalAssetManagement.hero",
  });
  return buildPageMetadata({
    locale,
    path: "/solutions/digital-asset-management",
    title: tHero("title"),
    description: tHero("subtitle"),
  });
}

const RELATED_IMAGES: Record<string, string> = {
  ukraine: "/solutions/digital-asset-management/related-ukraine.jpg",
  poland: "/solutions/digital-asset-management/related-warsaw.jpg",
};

export default async function DigitalAssetManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [
    tHero,
    tMmis,
    tVision,
    tWwd,
    tStats,
    tRelated,
    tCta,
    tSol,
    tNav,
  ] = await Promise.all([
    getTranslations("solutionsDetail.digitalAssetManagement.hero"),
    getTranslations("solutionsDetail.digitalAssetManagement.mmisShowcase"),
    getTranslations("solutionsDetail.digitalAssetManagement.visionItCallout"),
    getTranslations("solutionsDetail.digitalAssetManagement.whatWeDo"),
    getTranslations("solutionsDetail.digitalAssetManagement.keyStats"),
    getTranslations("solutionsDetail.digitalAssetManagement.relatedProjects"),
    getTranslations("solutionsDetail.digitalAssetManagement.cta"),
    getTranslations("solutions.items.digital"),
    getTranslations("nav"),
  ]);

  const wwdItems = tWwd.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const metrics = tSol.raw("metrics") as ReadonlyArray<{ value: string; label: string }>;
  const rawRelated = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));
  const metricSummary = metrics.map((m) => `${m.value} ${m.label}`).join(" · ");

  const i18nScreens = tMmis.raw("screens") as ReadonlyArray<{
    caption: string;
    alt: string;
  }>;
  const mmisScreens: ReadonlyArray<MMISScreen> = i18nScreens.map((s, i) => ({
    src: `/solutions/digital-asset-management/mmis-0${i + 1}.jpg`,
    alt: s.alt,
    caption: s.caption,
  }));

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("solutions"), path: "solutions" },
            { name: tHero("title"), path: "solutions/digital-asset-management" },
          ],
        })}
      />
      <JsonLd
        id="ld-service-digital"
        data={serviceLd({
          locale,
          slug: "digital-asset-management",
          name: tHero("title"),
          description: tHero("subtitle"),
        })}
      />
      <SolutionDetailHero
        overline={tHero("overline")}
        index="04 / 05"
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        metric={metricSummary}
      >
        <MMISShowcase
          overline={tMmis("overline")}
          title={tMmis("title")}
          screens={mmisScreens}
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
        <VisionItCallout
          overline={tVision("overline")}
          title={tVision("title")}
          body={tVision("body")}
          visitLabel={tVision("visitLabel")}
          visitHref={tCta("visitVisionIt")}
          logoSrc="/solutions/digital-asset-management/visionit-logo.png"
          logoAlt="VISION IT logo"
          gifSrc="/solutions/digital-asset-management/visionit-metro.gif"
          gifAlt="VISION IT TTS metro train animation."
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
          secondaryButton={{
            label: tCta("secondaryButton"),
            href: tCta("visitVisionIt"),
            external: true,
          }}
        />
      </SolutionDetailHero>
    </>
  );
}
