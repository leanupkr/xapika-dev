"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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
  const heroRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const heroTargets = [
        overlineRef.current,
        titleRef.current,
        subRef.current,
        metricRef.current,
      ];

      if (prefersReduced) {
        gsap.set(heroTargets, { opacity: 1, x: 0, y: 0 });
        if (titleRef.current) {
          const words = titleRef.current.querySelectorAll("[data-word]");
          gsap.set(words, { opacity: 1, y: 0 });
        }
      } else {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          overlineRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 }
        );
        if (titleRef.current) {
          const words = titleRef.current.querySelectorAll("[data-word]");
          tl.fromTo(
            words,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
            "-=0.2"
          );
        }
        tl.fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "+=0.1"
        );
        tl.fromTo(
          metricRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
      }

      if (sectionsRef.current) {
        const blocks = sectionsRef.current.querySelectorAll(
          "[data-detail-block]"
        );
        if (prefersReduced) {
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
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => sectionsRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: heroRef }
  );

  const words = title.split(" ").filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        data-bg="dark"
        className="relative overflow-hidden flex items-end"
        style={{
          backgroundColor: "rgb(var(--color-ink))",
          minHeight: "clamp(440px, 56vh, 600px)",
          paddingTop: "clamp(7rem, 14vh, 10rem)",
          paddingBottom: "clamp(3rem, 6vh, 5rem)",
        }}
        aria-labelledby="solution-detail-title"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
        />

        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.05 }}
        >
          <defs>
            <pattern
              id={`rail-grid-detail-${index}`}
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="80"
                stroke="#fff"
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="0"
                x2="60"
                y2="80"
                stroke="#fff"
                strokeWidth="1"
              />
              <line
                x1="10"
                y1="20"
                x2="70"
                y2="20"
                stroke="#fff"
                strokeWidth="1"
              />
              <line
                x1="10"
                y1="50"
                x2="70"
                y2="50"
                stroke="#fff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#rail-grid-detail-${index})`}
          />
        </svg>

        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 60%, rgba(246,163,23,0.07) 0%, transparent 65%)",
          }}
        />

        <div
          className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full grid grid-cols-12 gap-x-8 gap-y-12 items-end"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <div className="col-span-12 md:col-span-7 lg:col-span-7 max-w-2xl">
            <span
              ref={overlineRef}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 opacity-0"
              style={{
                fontSize: "13px",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span
                className="inline-block flex-shrink-0"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
              <span
                className="text-[rgb(var(--color-primary))] tabular-nums"
                style={{ marginLeft: "0.5rem" }}
              >
                {index}
              </span>
            </span>

            <h1
              id="solution-detail-title"
              ref={titleRef}
              className="font-heading font-semibold text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  data-word
                  className="inline-block opacity-0"
                  style={{ marginRight: i < words.length - 1 ? "0.25em" : 0 }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              ref={subRef}
              className="font-body opacity-0"
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.1875rem)",
                color: "rgba(255,255,255,0.72)",
                maxWidth: "560px",
                lineHeight: 1.65,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Right metric callout */}
          <div className="hidden md:block md:col-span-5 lg:col-span-5">
            <div
              ref={metricRef}
              className="opacity-0 ml-auto"
              style={{ maxWidth: "260px" }}
            >
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
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
      </section>

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
            style={{ maxWidth: "1280px" }}
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
