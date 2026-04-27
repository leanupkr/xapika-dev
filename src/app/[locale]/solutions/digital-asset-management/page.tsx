import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { serviceLd } from "@/components/seo/JsonLd";
import SolutionDetailHero from "@/components/sections/SolutionDetailHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";
import KeyStats, { type KeyStatItem } from "@/components/sections/KeyStats";
import RelatedProjects, {
  type RelatedProjectItem,
} from "@/components/sections/RelatedProjects";

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

export default async function DigitalAssetManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHero = await getTranslations(
    "solutionsDetail.digitalAssetManagement.hero"
  );
  const tWwd = await getTranslations(
    "solutionsDetail.digitalAssetManagement.whatWeDo"
  );
  const tStats = await getTranslations(
    "solutionsDetail.digitalAssetManagement.keyStats"
  );
  const tRelated = await getTranslations(
    "solutionsDetail.digitalAssetManagement.relatedProjects"
  );
  const tCta = await getTranslations("solutionsDetail.digitalAssetManagement.cta");
  const tSol = await getTranslations("solutions.items.digital");

  const wwdItems = tWwd.raw("items") as ReadonlyArray<WhatWeDoItem>;
  const stats = tStats.raw("stats") as ReadonlyArray<KeyStatItem>;
  const relatedItems = tRelated.raw("items") as ReadonlyArray<RelatedProjectItem>;

  return (
    <>
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
      metric={tSol("metric")}
    >
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
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        button={tCta("button")}
        secondaryButton={tCta("secondaryButton")}
        visitVisionIt={tCta("visitVisionIt")}
      />
    </SolutionDetailHero>
    </>
  );
}

function CtaSection({
  title,
  subtitle,
  button,
  secondaryButton,
  visitVisionIt,
}: {
  title: string;
  subtitle: string;
  button: string;
  secondaryButton: string;
  visitVisionIt: string;
}) {
  return (
    <section
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="solution-cta-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 40%, rgba(246,163,23,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1280px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-12 items-end">
          <div className="lg:col-span-7">
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "12px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              Ready
            </span>
            <h2
              id="solution-cta-title"
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(1.875rem, 3.8vw, 2.875rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "22ch",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body mt-5"
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              {subtitle}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
              style={{
                fontSize: "14px",
                letterSpacing: "0.05em",
              }}
            >
              {button}
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={visitVisionIt}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-7 py-4 font-heading font-semibold text-white border border-white/20 bg-transparent transition-colors duration-300 hover:border-white/60 hover:bg-white/[0.04]"
              style={{
                fontSize: "14px",
                letterSpacing: "0.05em",
              }}
            >
              {secondaryButton}
              <ArrowUpRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
