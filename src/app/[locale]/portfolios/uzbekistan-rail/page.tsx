import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import PortfolioHero from "@/components/sections/PortfolioHero";
import WhatWeDo, { type WhatWeDoItem } from "@/components/sections/WhatWeDo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "portfoliosDetail.uzbekistan.hero",
  });
  return {
    title: `${t("title")} — Xapika Engineering`,
    description: t("subtitle"),
  };
}

export default async function UzbekistanRailPage() {
  const tHero = await getTranslations("portfoliosDetail.uzbekistan.hero");
  const tNotice = await getTranslations("portfoliosDetail.uzbekistan.notice");
  const tPlanned = await getTranslations("portfoliosDetail.uzbekistan.planned");
  const tCta = await getTranslations("portfoliosDetail.uzbekistan.cta");
  const tCommon = await getTranslations("portfoliosDetail.common");

  const noticeParagraphs = tNotice.raw("paragraphs") as ReadonlyArray<string>;
  const plannedItems = tPlanned.raw("items") as ReadonlyArray<WhatWeDoItem>;

  return (
    <>
      <PortfolioHero
        overline={tHero("overline")}
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        index="03 / 03"
        accentBadge={tHero("comingBadge")}
        placeholder={tCommon("photoPlaceholder")}
        placeholderKicker={tHero("placeholderKicker")}
      />
      <NoticeSection
        overline={tNotice("overline")}
        kicker={tNotice("kicker")}
        title={tNotice("title")}
        paragraphs={noticeParagraphs}
      />
      <WhatWeDo
        overline={tPlanned("overline")}
        title={tPlanned("title")}
        items={plannedItems}
      />
      <CtaSection
        overline={tCta("overline")}
        title={tCta("title")}
        subtitle={tCta("subtitle")}
        button={tCta("button")}
      />
    </>
  );
}

function NoticeSection({
  overline,
  kicker,
  title,
  paragraphs,
}: {
  overline: string;
  kicker: string;
  title: string;
  paragraphs: ReadonlyArray<string>;
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
      aria-labelledby="uz-notice-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 35%, rgba(246,163,23,0.07) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1280px" }}
      >
        <span
          className="flex items-center gap-3 font-heading font-medium uppercase mb-8 text-[rgb(var(--color-primary))]"
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
          {overline}
        </span>

        <div
          className="font-heading font-semibold tabular-nums text-white mb-10"
          style={{
            fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)",
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            fontVariantNumeric: "tabular-nums",
            paddingBottom: "clamp(1.25rem, 3vh, 2rem)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {kicker}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-y-0 lg:gap-x-12 items-start">
          <div className="lg:col-span-6">
            <h2
              id="uz-notice-title"
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(1.625rem, 3vw, 2.375rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                maxWidth: "22ch",
              }}
            >
              {title}
            </h2>
          </div>
          <div className="lg:col-span-6 space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-body"
                style={{
                  fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.75,
                  maxWidth: "60ch",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection({
  overline,
  title,
  subtitle,
  button,
}: {
  overline: string;
  title: string;
  subtitle: string;
  button: string;
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
      aria-labelledby="uzbekistan-cta-title"
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
          <div className="lg:col-span-8">
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
              {overline}
            </span>
            <h2
              id="uzbekistan-cta-title"
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
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
              style={{ fontSize: "14px", letterSpacing: "0.05em" }}
            >
              {button}
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
