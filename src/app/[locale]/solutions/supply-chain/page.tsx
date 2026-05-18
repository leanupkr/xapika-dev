import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd, breadcrumbLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import PartnerLogoGrid from "@/components/sections/PartnerLogoGrid";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import GearPhotoBreak from "@/components/sections/GearPhotoBreak";
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
  const [tHero, tPartners, tGear, tWwd, tStats, tRelated, tCta, tSol, tNav] =
    await Promise.all([
      getTranslations("solutionsDetail.supplyChain.hero"),
      getTranslations("solutionsDetail.supplyChain.partnerLogoGrid"),
      getTranslations("solutionsDetail.supplyChain.gearPhoto"),
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
  const rawRelated = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;
  const relatedItems = rawRelated.map((item) => ({
    ...item,
    image: RELATED_IMAGES[item.key],
  }));
  const metricSummary = metrics.map((m) => `${m.value} ${m.label}`).join(" · ");

  const partners = [
    {
      src: "/solutions/supply-chain/partner-huawei.png",
      alt: "Huawei — supply chain partner.",
      name: "Huawei",
      mode: "logo" as const,
    },
    {
      src: "/solutions/supply-chain/partner-huber.png",
      alt: "Huber+Suhner — supply chain partner.",
      name: "Huber+Suhner",
      mode: "logo" as const,
    },
    {
      src: "/solutions/supply-chain/partner-hyundai.png",
      alt: "Hyundai Corporation — supply chain partner.",
      name: "Hyundai Corp.",
      mode: "logo" as const,
    },
    {
      src: "/solutions/supply-chain/partner-knorr.jpg",
      alt: "Knorr-Bremse — rail components partner.",
      name: "Knorr-Bremse",
      mode: "photo" as const,
    },
    {
      src: "/solutions/supply-chain/partner-mrail.jpg",
      alt: "mRail — supply chain partner.",
      name: "mRail",
      mode: "logo" as const,
    },
    {
      src: "/solutions/supply-chain/partner-entecerma.png",
      alt: "Entecerma — supply chain partner.",
      name: "Entecerma",
      mode: "logo" as const,
    },
  ];

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
        <PartnerLogoGrid
          overline={tPartners("overline")}
          title={tPartners("title")}
          subtitle={tPartners("subtitle")}
          partners={partners}
        />
        <WhatWeDo
          overline={tWwd("overline")}
          title={tWwd("title")}
          items={wwdItems}
        />
        <GearPhotoBreak
          src="/solutions/supply-chain/gear-photo.webp"
          alt={tGear("alt")}
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
