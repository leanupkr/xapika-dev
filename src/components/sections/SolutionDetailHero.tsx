"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import PageHero from "@/components/ui/PageHero";

// Solution-specific SVG pattern defs — each solution gets a distinctive
// hero background motif so the 5 detail pages don't all look identical.
// The `index` prop is the same "01" / "02" / ... or "01 / 05" string used
// across the suite; we look at the leading number.
function leadingPhase(index: string): "01" | "02" | "03" | "04" | "05" {
  const match = index.match(/0([1-5])/);
  return (match ? (`0${match[1]}` as "01") : "01") as
    | "01"
    | "02"
    | "03"
    | "04"
    | "05";
}

function patternForIndex(index: string): ReactNode {
  switch (leadingPhase(index)) {
    case "01":
      // Heavy — engineering drawing grid (dense orthogonal + center marker)
      return (
        <>
          <line x1="0" y1="32" x2="64" y2="32" stroke="#fff" strokeWidth="0.6" />
          <line x1="32" y1="0" x2="32" y2="64" stroke="#fff" strokeWidth="0.6" />
          <circle cx="32" cy="32" r="1.4" fill="#fff" />
        </>
      );
    case "02":
      // Light — clock grid (small plus markers on a regular cadence)
      return (
        <>
          <line x1="30" y1="22" x2="34" y2="22" stroke="#fff" strokeWidth="0.9" />
          <line x1="32" y1="20" x2="32" y2="24" stroke="#fff" strokeWidth="0.9" />
          <circle cx="32" cy="32" r="0.9" fill="#fff" />
        </>
      );
    case "03":
      // Supply — flow lines + branch nodes (horizontal flow with junctions)
      return (
        <>
          <line x1="0" y1="32" x2="80" y2="32" stroke="#fff" strokeWidth="0.9" />
          <line x1="20" y1="32" x2="20" y2="14" stroke="#fff" strokeWidth="0.6" />
          <line x1="60" y1="32" x2="60" y2="50" stroke="#fff" strokeWidth="0.6" />
          <circle cx="20" cy="32" r="1.6" fill="#fff" />
          <circle cx="60" cy="32" r="1.6" fill="#fff" />
        </>
      );
    case "04":
      // Digital — data node graph (dots + diagonal connectors)
      return (
        <>
          <circle cx="16" cy="16" r="1.5" fill="#fff" />
          <circle cx="48" cy="48" r="1.5" fill="#fff" />
          <circle cx="48" cy="16" r="1.5" fill="#fff" />
          <circle cx="16" cy="48" r="1.5" fill="#fff" />
          <line x1="16" y1="16" x2="48" y2="48" stroke="#fff" strokeWidth="0.4" />
          <line x1="48" y1="16" x2="16" y2="48" stroke="#fff" strokeWidth="0.4" />
        </>
      );
    case "05":
    default:
      // Commercial — route diagram (twin diagonal rails)
      return (
        <>
          <line x1="0" y1="0" x2="64" y2="64" stroke="#fff" strokeWidth="0.8" />
          <line x1="14" y1="0" x2="64" y2="50" stroke="#fff" strokeWidth="0.8" />
        </>
      );
  }
}

function patternSizeForIndex(index: string): number {
  switch (leadingPhase(index)) {
    case "01":
      return 64;
    case "02":
      return 64;
    case "03":
      return 80;
    case "04":
      return 64;
    case "05":
    default:
      return 64;
  }
}

type SectionLabels = {
  whatWeDo: string;
  keyStats: string;
  relatedProjects: string;
  cta: string;
};

type SolutionDetailHeroProps = {
  overline: string;
  title: string;
  subtitle: string;
  metric: string;
  index: string;
  /**
   * When provided, replaces the default placeholder body (4 dashed sections + CTA).
   * Children are expected to be full <section> elements with their own padding/background.
   */
  children?: ReactNode;
  sectionLabels?: SectionLabels;
  placeholder?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function SolutionDetailHero({
  overline,
  title,
  subtitle,
  metric,
  index,
  children,
  sectionLabels,
  placeholder,
  ctaLabel,
  ctaHref,
}: SolutionDetailHeroProps) {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionsRef.current) return;

      const blocks = sectionsRef.current.querySelectorAll("[data-detail-block]");
      if (prefersReducedMotion()) {
        gsap.set(blocks, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          blocks,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => sectionsRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionsRef }
  );

  const metricCallout = (
    <div className="ml-auto" style={{ maxWidth: "260px" }}>
      <div
        className="font-heading font-medium uppercase mb-3"
        style={{
          fontSize: "11px",
          letterSpacing: "0.22em",
          color: "rgb(var(--color-primary))",
        }}
      >
        Operating Metric
      </div>
      <div
        className="font-heading font-semibold text-white tabular-nums leading-[1.05]"
        style={{
          fontSize: "clamp(1.5rem, 2vw, 1.875rem)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {metric}
      </div>
      <div
        aria-hidden="true"
        className="mt-4"
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.25)",
        }}
      />
    </div>
  );

  return (
    <>
      <PageHero
        patternId={`pattern-solution-detail-${index}`}
        overline={`${overline} ${index}`}
        title={title}
        subtitle={subtitle}
        rightSlot={metricCallout}
        patternDef={patternForIndex(index)}
        patternSize={patternSizeForIndex(index)}
      />

      {/* BODY — children if provided, otherwise 4 placeholder sections */}
      {children ?? (
        <section
          className="relative bg-[rgb(var(--color-bg))]"
          style={{
            paddingTop: "clamp(4rem, 10vh, 7rem)",
            paddingBottom: "clamp(4rem, 10vh, 7rem)",
          }}
        >
          <div
            ref={sectionsRef}
            className="mx-auto px-6 md:px-10 lg:px-16"
            style={{ maxWidth: "var(--max-width-content)" }}
          >
            {/* What We Do — full row */}
            <div data-detail-block className="opacity-0">
              <PlaceholderBlock
                kicker="01"
                label={sectionLabels?.whatWeDo ?? ""}
                placeholder={placeholder ?? ""}
                variant="paragraphs"
              />
            </div>

            {/* Key Stats + Related Projects — 12-col grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-14 md:mt-20">
              <div data-detail-block className="lg:col-span-5 opacity-0">
                <PlaceholderBlock
                  kicker="02"
                  label={sectionLabels?.keyStats ?? ""}
                  placeholder={placeholder ?? ""}
                  variant="stats"
                />
              </div>
              <div data-detail-block className="lg:col-span-7 opacity-0">
                <PlaceholderBlock
                  kicker="03"
                  label={sectionLabels?.relatedProjects ?? ""}
                  placeholder={placeholder ?? ""}
                  variant="cards"
                />
              </div>
            </div>

            {/* CTA */}
            <div
              data-detail-block
              className="mt-14 md:mt-24 opacity-0 relative"
              style={{
                borderTop: "1px solid rgb(var(--color-ink) / 0.08)",
                paddingTop: "clamp(3rem, 7vh, 4.5rem)",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
                <div className="lg:col-span-8">
                  <span
                    className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
                    style={{ fontSize: "12px", letterSpacing: "0.22em" }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block flex-shrink-0"
                      style={{
                        width: "20px",
                        height: "2px",
                        backgroundColor: "rgb(var(--color-primary))",
                      }}
                    />
                    04
                  </span>
                  <h2
                    className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                    style={{
                      fontSize: "clamp(1.625rem, 3.2vw, 2.5rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {sectionLabels?.cta}
                  </h2>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <Link
                    href={ctaHref ?? "#"}
                    className="group inline-flex items-center gap-3 px-6 py-4 bg-[rgb(var(--color-ink))] text-white font-heading font-semibold transition-colors duration-300 hover:bg-[rgb(var(--color-primary))]"
                    style={{
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {ctaLabel}
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

type PlaceholderBlockProps = {
  kicker: string;
  label: string;
  placeholder: string;
  variant: "paragraphs" | "stats" | "cards";
};

function PlaceholderBlock({
  kicker,
  label,
  placeholder,
  variant,
}: PlaceholderBlockProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-baseline gap-4 mb-6">
        <span
          className="font-heading font-medium tabular-nums text-[rgb(var(--color-primary))]"
          style={{
            fontSize: "12px",
            letterSpacing: "0.22em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {kicker}
        </span>
        <h2
          className="font-heading font-semibold text-[rgb(var(--color-ink))]"
          style={{
            fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.15,
          }}
        >
          {label}
        </h2>
      </div>

      {/* Placeholder body */}
      <div
        className="relative"
        style={{
          border: "1.5px dashed rgb(var(--color-ink-muted) / 0.35)",
          backgroundColor: "rgb(var(--color-surface))",
          padding: "clamp(1.75rem, 4vw, 2.75rem)",
          minHeight:
            variant === "paragraphs"
              ? "220px"
              : variant === "stats"
              ? "260px"
              : "260px",
        }}
        role="img"
        aria-label={`${label} placeholder — content arriving`}
      >
        {/* Awaiting microcopy */}
        <div
          className="flex items-center gap-2.5 mb-6"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgb(var(--color-ink-muted))",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "rgb(var(--color-primary))",
              boxShadow: "0 0 0 3px rgb(var(--color-primary) / 0.15)",
            }}
          />
          {placeholder}
        </div>

        {/* Variant content */}
        {variant === "paragraphs" && <ParagraphBars />}
        {variant === "stats" && <StatBars />}
        {variant === "cards" && <ProjectCards />}

        {/* Corner ticks */}
        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute block"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              width: "8px",
              height: "8px",
              borderTop:
                pos.top !== undefined
                  ? "1.5px solid rgb(var(--color-primary))"
                  : undefined,
              borderBottom:
                pos.bottom !== undefined
                  ? "1.5px solid rgb(var(--color-primary))"
                  : undefined,
              borderLeft:
                pos.left !== undefined
                  ? "1.5px solid rgb(var(--color-primary))"
                  : undefined,
              borderRight:
                pos.right !== undefined
                  ? "1.5px solid rgb(var(--color-primary))"
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ParagraphBars() {
  const bars: ReadonlyArray<ReadonlyArray<number>> = [
    [92, 86, 70],
    [88, 94, 60],
  ];
  return (
    <div className="space-y-7" style={{ maxWidth: "640px" }}>
      {bars.map((row, pi) => (
        <div key={pi} className="space-y-3">
          {row.map((width, bi) => (
            <div
              key={bi}
              style={{
                width: `${width}%`,
                height: bi === 0 && pi === 0 ? "12px" : "10px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.10)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function StatBars() {
  const items = [
    { value: 78, label: 92 },
    { value: 62, label: 84 },
    { value: 45, label: 70 },
  ];
  return (
    <div className="space-y-6">
      {items.map((s, i) => (
        <div key={i} className="flex items-center gap-4">
          <div
            className="font-heading font-semibold tabular-nums text-[rgb(var(--color-ink) / 0.18)]"
            style={{
              fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
              letterSpacing: "-0.02em",
              minWidth: "3.5ch",
            }}
          >
            ——
          </div>
          <div className="flex-1 space-y-2">
            <div
              style={{
                width: `${s.label}%`,
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.10)",
              }}
            />
            <div
              style={{
                width: `${s.value}%`,
                height: "6px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.06)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectCards() {
  const cards = [
    { title: 88, meta: 50 },
    { title: 76, meta: 64 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgb(var(--color-ink) / 0.08)",
            backgroundColor: "rgb(var(--color-bg))",
            padding: "1.25rem",
            minHeight: "140px",
          }}
          className="flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div
              style={{
                width: `${c.title}%`,
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.12)",
              }}
            />
            <div
              style={{
                width: `${c.meta}%`,
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.08)",
              }}
            />
          </div>
          <div
            className="font-heading font-medium uppercase mt-4"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "rgb(var(--color-ink-muted))",
            }}
          >
            CASE 0{i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
