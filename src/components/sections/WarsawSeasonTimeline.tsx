"use client";

import { useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SeasonEntry = {
  year: "2022" | "2023" | "2024" | "2025";
  month: string;
  season: string;
  caption: string;
  src: string;
  alt: string;
};

type WarsawSeasonTimelineProps = {
  overline: string;
  title: string;
  yearLabels: {
    "2022": string;
    "2023": string;
    "2024": string;
    "2025": string;
  };
  entries: ReadonlyArray<SeasonEntry>;
};

// ---------------------------------------------------------------------------
// Corner ticks — identical to PortfolioStory framing motif
// ---------------------------------------------------------------------------

const TICK_POSITIONS = [
  { top: 8, left: 8 },
  { top: 8, right: 8 },
  { bottom: 8, left: 8 },
  { bottom: 8, right: 8 },
] as const;

function CornerTicks() {
  return (
    <>
      {TICK_POSITIONS.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute block pointer-events-none"
          style={{
            top: "top" in pos ? pos.top : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            width: "10px",
            height: "10px",
            borderTop:
              "top" in pos ? "1.5px solid rgb(var(--color-primary))" : undefined,
            borderBottom:
              "bottom" in pos ? "1.5px solid rgb(var(--color-primary))" : undefined,
            borderLeft:
              "left" in pos ? "1.5px solid rgb(var(--color-primary))" : undefined,
            borderRight:
              "right" in pos ? "1.5px solid rgb(var(--color-primary))" : undefined,
          }}
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// WarsawSeasonTimeline
// ---------------------------------------------------------------------------

export default function WarsawSeasonTimeline({
  overline,
  title,
  yearLabels,
  entries,
}: WarsawSeasonTimelineProps): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headingId = "warsaw-season-timeline-title";

  // Group entries by year, preserving insertion order
  const years = ["2022", "2023", "2024", "2025"] as const;
  type Year = (typeof years)[number];

  const byYear = years.reduce<Record<Year, SeasonEntry[]>>(
    (acc, y) => {
      acc[y] = entries.filter((e) => e.year === y);
      return acc;
    },
    { "2022": [], "2023": [], "2024": [], "2025": [] }
  );

  // Flat list with original index, used for alternating layout
  const flatEntries: { entry: SeasonEntry; globalIdx: number }[] = [];
  entries.forEach((entry, i) => {
    flatEntries.push({ entry, globalIdx: i });
  });

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const reduced = prefersReducedMotion();

      // --- Entry fade-in ---
      const nodes = sectionRef.current.querySelectorAll<HTMLElement>("[data-season-node]");

      if (reduced) {
        gsap.set(nodes, { opacity: 1, y: 0 });
      } else {
        nodes.forEach((node) => {
          gsap.fromTo(
            node,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: node,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }

      // --- Sticky year label scrub ---
      years.forEach((y) => {
        const yearLabel = sectionRef.current?.querySelector<HTMLElement>(
          `[data-year-label="${y}"]`
        );
        const firstEntry = sectionRef.current?.querySelector<HTMLElement>(
          `[data-year-first="${y}"]`
        );
        const lastEntry = sectionRef.current?.querySelector<HTMLElement>(
          `[data-year-last="${y}"]`
        );

        if (!yearLabel || !firstEntry || !lastEntry) return;

        if (reduced) {
          gsap.set(yearLabel, { opacity: 0.12 });
          return;
        }

        // Fade in as first entry enters viewport
        gsap.to(yearLabel, {
          opacity: 0.18,
          scrollTrigger: {
            trigger: firstEntry,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        });

        // Fade back out as last entry of year leaves viewport
        gsap.to(yearLabel, {
          opacity: 0.06,
          scrollTrigger: {
            trigger: lastEntry,
            start: "bottom 40%",
            end: "bottom 10%",
            scrub: true,
          },
        });
      });

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => sectionRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
    >
      {/* Hairlines */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
        style={{
          height: "320px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(246,163,23,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Container */}
      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Section header */}
        <header className="mb-8 md:mb-24">
          <span
            className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "12px", letterSpacing: "var(--tracking-overline)" }}
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
            id={headingId}
            className="font-heading font-semibold text-white"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.875rem)",
              letterSpacing: "var(--tracking-tight)",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>
        </header>

        {/* Per-year groups */}
        {years.map((year) => {
          const yearEntries = byYear[year];
          if (yearEntries.length === 0) return null;

          // Find the global flat index of the first entry in this year
          // so alternating side is consistent across year groups
          const firstGlobalIdx = flatEntries.findIndex(
            (fe) => fe.entry === yearEntries[0]
          );

          return (
            <div key={year} className="relative mb-10 md:mb-28 last:mb-0">
              {/* Sticky year label — desktop ghost number */}
              <div
                aria-hidden="true"
                data-year-label={year}
                className="hidden md:block absolute pointer-events-none select-none"
                style={{
                  // Sits in the central axis zone
                  left: "50%",
                  top: "-0.5rem",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.06)",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  willChange: "opacity",
                }}
              >
                {year}
              </div>

              {/* Mobile year chip */}
              <div
                aria-hidden="true"
                className="md:hidden flex items-center gap-2 mb-6"
              >
                <span
                  className="font-heading font-semibold text-white"
                  style={{
                    fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                    letterSpacing: "var(--tracking-tight)",
                    opacity: 0.55,
                  }}
                >
                  {year}
                </span>
                <span
                  className="font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
                  style={{ fontSize: "11px", letterSpacing: "0.18em", opacity: 0.8 }}
                >
                  {yearLabels[year]}
                </span>
              </div>

              {/* Entry list */}
              <ol className="relative">
                {/* Central axis — desktop */}
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
                />
                {/* Left dashed axis — mobile */}
                <span
                  aria-hidden="true"
                  className="md:hidden absolute top-0 bottom-0 pointer-events-none"
                  style={{
                    left: "0px",
                    width: "1px",
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 4px, transparent 4px, transparent 10px)",
                  }}
                />

                {yearEntries.map((entry, localIdx) => {
                  const globalIdx = firstGlobalIdx + localIdx;
                  const side: "left" | "right" = globalIdx % 2 === 0 ? "left" : "right";
                  const isFirst = localIdx === 0;
                  const isLast = localIdx === yearEntries.length - 1;

                  return (
                    <li
                      key={`${entry.year}-${entry.month}-${localIdx}`}
                      data-season-node
                      {...(isFirst ? { "data-year-first": year } : {})}
                      {...(isLast ? { "data-year-last": year } : {})}
                      className="relative pb-14 md:pb-20 last:pb-0"
                    >
                      {/* Axis dot */}
                      <span
                        aria-hidden="true"
                        className="absolute z-[2] block rounded-full"
                        style={{
                          top: "1.25rem",
                          left: "0px",
                          // desktop: centre
                          marginLeft: undefined,
                          width: "7px",
                          height: "7px",
                          backgroundColor: "rgb(var(--color-primary))",
                          boxShadow:
                            "0 0 0 4px rgb(var(--color-ink)), 0 0 0 5px rgba(246,163,23,0.22)",
                        }}
                      />
                      {/* Desktop axis dot override via className */}
                      <span
                        aria-hidden="true"
                        className="hidden md:block absolute z-[2] rounded-full"
                        style={{
                          top: "1.25rem",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "7px",
                          height: "7px",
                          backgroundColor: "rgb(var(--color-primary))",
                          boxShadow:
                            "0 0 0 4px rgb(var(--color-ink)), 0 0 0 5px rgba(246,163,23,0.22)",
                        }}
                      />

                      {/* Mobile layout — single column */}
                      <div className="md:hidden pl-8">
                        <EntryCard entry={entry} align="left" />
                      </div>

                      {/* Desktop alternating 2-col */}
                      <div className="hidden md:grid md:grid-cols-2 md:gap-x-16 relative z-[1]">
                        <div>
                          {side === "left" && (
                            <div className="flex justify-end">
                              <div className="pr-4 w-full" style={{ maxWidth: "420px" }}>
                                <EntryCard entry={entry} align="right" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          {side === "right" && (
                            <div className="flex justify-start">
                              <div className="pl-4 w-full" style={{ maxWidth: "420px" }}>
                                <EntryCard entry={entry} align="left" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// EntryCard — photo + meta
// ---------------------------------------------------------------------------

type EntryCardProps = {
  entry: SeasonEntry;
  align: "left" | "right";
};

function EntryCard({ entry, align }: EntryCardProps) {
  const isRight = align === "right";

  return (
    <div className={`flex flex-col gap-4 ${isRight ? "items-end" : "items-start"}`}>
      {/* Photo */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          backgroundColor: "rgba(255,255,255,0.03)",
        }}
      >
        <Image
          src={entry.src}
          alt={entry.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
          className="object-cover"
        />

        {/* Caption gradient scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "45%",
            background:
              "linear-gradient(to top, rgba(11,31,58,0.72) 0%, transparent 100%)",
          }}
        />

        {/* Month + season badge */}
        <div
          className={`absolute bottom-4 pointer-events-none flex flex-col gap-0.5 ${
            isRight ? "right-4 items-end" : "left-4 items-start"
          }`}
        >
          <span
            className="font-heading font-medium uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {entry.season}
          </span>
          <span
            className="font-heading font-semibold tabular-nums"
            style={{
              fontSize: "13px",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {entry.year}.{entry.month}
          </span>
        </div>

        {/* Corner ticks */}
        <CornerTicks />
      </div>

      {/* Caption text */}
      <p
        className={`font-body ${isRight ? "text-right" : "text-left"}`}
        style={{
          fontSize: "clamp(0.875rem, 1vw, 0.9375rem)",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.65,
          maxWidth: "36ch",
        }}
      >
        {entry.caption}
      </p>
    </div>
  );
}
