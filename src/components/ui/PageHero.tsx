"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export interface PageHeroProps {
  /** Unique id for the SVG <pattern> element — must be distinct per page to avoid SVG id collisions. */
  patternId: string;
  /** Small uppercase label rendered above the headline. */
  overline: string;
  /** Main headline — split into words for per-word GSAP stagger. */
  title: string;
  /** Supporting body copy beneath the headline. */
  subtitle: string;
  /** Optional right panel (metric callout / photo / SVG). Renders in 4/12 cols on md+. */
  rightSlot?: ReactNode;
  /** Height variant. "compact" ≈ 440–600 px, "tall" ≈ 460–640 px. Defaults to "compact". */
  variant?: "compact" | "tall";
  /**
   * Optional inner contents for the SVG `<pattern>` element — replaces the
   * default rail-grid lines so each page can have a distinctive background pattern.
   * When provided, you supply only the pattern's child elements (e.g. <line>, <circle>);
   * the wrapping <svg><defs><pattern> and the <rect fill> are managed by PageHero.
   */
  patternDef?: ReactNode;
  /** SVG pattern tile size in user-space units. Defaults to 80. */
  patternSize?: number;
}

/**
 * PageHero — shared dark-background hero section.
 *
 * Extracts the duplicated markup from SolutionDetailHero, SolutionsIndex,
 * PortfoliosIndex, and PortfolioHero into a single composable component.
 * All visual details (hairlines, rail-grid, glow, typography, GSAP timing)
 * are preserved exactly as in the originals.
 */
export default function PageHero({
  patternId,
  overline,
  title,
  subtitle,
  rightSlot,
  variant = "compact",
  patternDef,
  patternSize = 80,
}: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const titleWords = titleRef.current?.querySelectorAll("[data-word]");

      if (reduced) {
        gsap.set(
          [overlineRef.current, titleRef.current, subRef.current],
          { opacity: 1, x: 0, y: 0 }
        );
        if (titleWords?.length) {
          gsap.set(titleWords, { opacity: 1, y: 0 });
        }
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        overlineRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 }
      );

      if (titleWords?.length) {
        tl.fromTo(
          titleWords,
          { opacity: 0, y: 24 },
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
    },
    { scope: heroRef }
  );

  const words = title.split(" ").filter(Boolean);

  const minHeight =
    variant === "tall"
      ? "clamp(460px, 60vh, 640px)"
      : "clamp(440px, 56vh, 600px)";

  return (
    <section
      ref={heroRef}
      data-bg="dark"
      className="relative overflow-hidden flex items-end"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        minHeight,
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingBottom: "clamp(3rem, 6vh, 5rem)",
      }}
      aria-labelledby={`${patternId}-title`}
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />

      {/* SVG background pattern — caller can swap `patternDef` for solution-specific motifs */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id={patternId}
            width={patternSize}
            height={patternSize}
            patternUnits="userSpaceOnUse"
          >
            {patternDef ?? (
              <>
                <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
                <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
                <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1" />
                <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1" />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Left primary glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 60%, rgba(246,163,23,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Content wrapper */}
      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div
          className={
            rightSlot
              ? "grid grid-cols-12 gap-x-8 gap-y-12 items-end"
              : undefined
          }
        >
          {/* Left text block — 8/12 cols when rightSlot present, full-width otherwise */}
          <div
            className={
              rightSlot
                ? "col-span-12 md:col-span-8 lg:col-span-8 max-w-2xl"
                : "max-w-2xl"
            }
          >
            {/* Overline */}
            <span
              ref={overlineRef}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 opacity-0"
              style={{
                fontSize: "13px",
                letterSpacing: "var(--tracking-overline, 0.22em)",
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
            </span>

            {/* Title with per-word stagger */}
            <h1
              id={`${patternId}-title`}
              ref={titleRef}
              className="font-heading font-semibold text-white mb-6"
              style={{
                fontSize: "clamp(1.625rem, 6.5vw, 3.75rem)",
                letterSpacing: "var(--tracking-tight, -0.02em)",
                lineHeight: 1.08,
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

            {/* Subtitle */}
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

          {/* Right slot — mobile: stacks below text; desktop: 4/12 cols */}
          {rightSlot ? (
            <>
              <div className="md:hidden mt-10">{rightSlot}</div>
              <div className="hidden md:block md:col-span-4 lg:col-span-4">
                {rightSlot}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}
