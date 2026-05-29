"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import PageHero from "@/components/ui/PageHero";

export type SolutionKey =
  | "heavy"
  | "light"
  | "supply"
  | "digital"
  | "commercial";

export type SolutionItem = {
  key: SolutionKey;
  href: string;
  title: string;
  description: string;
  metric: string;
  image?: string;
  imgAlt?: string;
};

type SolutionsIndexProps = {
  overline: string;
  title: string;
  subtitle: string;
  learnMore: string;
  placeholder: string;
  items: ReadonlyArray<SolutionItem>;
};

const NUMBER_BY_KEY: Record<SolutionKey, string> = {
  heavy: "01",
  light: "02",
  supply: "03",
  digital: "04",
  commercial: "05",
};

export default function SolutionsIndex({
  overline,
  title,
  subtitle,
  learnMore,
  placeholder,
  items,
}: SolutionsIndexProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;

      const cards = cardsRef.current.querySelectorAll("[data-solution-card]");
      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => cardsRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: cardsRef }
  );

  /* Rail diagram — ticks start visible (hero entry animation handled by PageHero) */
  const railDiagram = (
    <div className="flex justify-end">
      <svg
        width="240"
        height="220"
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="overflow-visible"
      >
        <line
          x1="40"
          y1="14"
          x2="40"
          y2="206"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        {[
          { y: 28, label: "01 · HEAVY" },
          { y: 68, label: "02 · LIGHT" },
          { y: 108, label: "03 · SUPPLY" },
          { y: 148, label: "04 · DIGITAL" },
          { y: 188, label: "05 · COMMERCIAL" },
        ].map((t, i) => {
          const accent = i === 3;
          return (
            <g key={t.label}>
              <line
                x1="40"
                y1={t.y}
                x2={accent ? "120" : "78"}
                y2={t.y}
                stroke={
                  accent
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.45)"
                }
                strokeWidth={accent ? "1.75" : "1"}
              />
              <circle
                cx="40"
                cy={t.y}
                r="2.5"
                fill={
                  accent
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.7)"
                }
              />
              <text
                x={accent ? "128" : "86"}
                y={t.y + 3.5}
                fill={
                  accent
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.55)"
                }
                fontFamily="var(--font-heading)"
                fontSize="9"
                fontWeight="600"
                letterSpacing="0.18em"
              >
                {t.label}
              </text>
            </g>
          );
        })}
        <text
          x="40"
          y="9"
          fill="rgba(255,255,255,0.4)"
          fontFamily="var(--font-heading)"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.22em"
          textAnchor="middle"
        >
          DISCIPLINES
        </text>
      </svg>
    </div>
  );

  return (
    <>
      <PageHero
        patternId="pattern-solutions-index"
        overline={overline}
        title={title}
        subtitle={subtitle}
        rightSlot={railDiagram}
      />

      {/* CARDS */}
      <section
        className="relative bg-[rgb(var(--color-bg))]"
        style={{
          paddingTop: "clamp(4rem, 10vh, 7rem)",
          paddingBottom: "clamp(5rem, 12vh, 8rem)",
        }}
      >
        <div
          ref={cardsRef}
          className="mx-auto px-6 md:px-10 lg:px-16"
          style={{ maxWidth: "var(--max-width-content)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-8">
            {items.map((item, idx) => (
              <SolutionLargeCard
                key={item.key}
                item={item}
                number={NUMBER_BY_KEY[item.key]}
                learnMore={learnMore}
                placeholder={placeholder}
                isFeatured={idx === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SolutionLargeCard({
  item,
  number,
  learnMore,
  placeholder,
  isFeatured = false,
}: {
  item: SolutionItem;
  number: string;
  learnMore: string;
  placeholder: string;
  isFeatured?: boolean;
}) {
  return (
    <Link
      data-solution-card
      href={item.href}
      aria-label={`${item.title} — ${item.description}`}
      className={`group relative block transition-colors duration-[320ms] ${
        isFeatured ? "col-span-2 md:col-span-2" : ""
      }`}
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        border: "1px solid rgb(var(--color-ink) / 0.10)",
      }}
    >
      {/* Photo or placeholder */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          backgroundColor: "rgb(var(--color-bg))",
        }}
        role="img"
        aria-label={
          item.image
            ? item.imgAlt ?? `${item.title} photograph`
            : `${item.title} photograph placeholder — image arriving`
        }
      >
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.imgAlt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px"
              className="object-cover transition-transform duration-[3200ms] ease-out group-hover:scale-[1.03]"
            />
            {/* Bottom gradient overlay for number badge legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,31,58,0.45) 0%, rgba(11,31,58,0) 35%, rgba(11,31,58,0) 70%, rgba(11,31,58,0.55) 100%)",
              }}
            />
          </>
        ) : (
          <>
            {/* Subtle inner gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-transform duration-[3200ms] ease-out group-hover:scale-[1.03]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgb(var(--color-ink) / 0.05) 0%, transparent 65%), radial-gradient(ellipse at 75% 90%, rgb(var(--color-primary) / 0.06) 0%, transparent 60%)",
              }}
            />

            {/* Dashed inner frame */}
            <div
              aria-hidden="true"
              className="absolute inset-3"
              style={{
                border: "1.5px dashed rgb(var(--color-ink-muted) / 0.35)",
              }}
            />

            {/* Centered glyph */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <svg
                aria-hidden="true"
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
              >
                <rect
                  x="6"
                  y="12"
                  width="30"
                  height="20"
                  rx="1.5"
                  stroke="rgb(var(--color-ink-muted))"
                  strokeOpacity="0.5"
                  strokeWidth="1.25"
                />
                <line
                  x1="6"
                  y1="20"
                  x2="36"
                  y2="20"
                  stroke="rgb(var(--color-ink-muted))"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <circle
                  cx="14"
                  cy="26"
                  r="2"
                  fill="rgb(var(--color-primary))"
                  fillOpacity="0.7"
                />
              </svg>
              <span
                className="font-heading font-medium uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgb(var(--color-ink-muted))",
                }}
              >
                {placeholder}
              </span>
            </div>
          </>
        )}

        {/* Number — top left overlay */}
        <span
          className="absolute top-4 left-4 font-heading font-medium tabular-nums"
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            color: "rgb(var(--color-primary))",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number} / 05
        </span>

        {/* Top hairline transitions to primary on hover */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 transition-colors duration-[320ms]"
          style={{
            height: "1px",
            backgroundColor: "rgb(var(--color-ink) / 0.08)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="px-3.5 sm:px-6 md:px-8 py-4 sm:py-7 md:py-9"
        style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.08)" }}
      >
        <h2
          className="font-heading font-semibold text-[rgb(var(--color-ink))] transition-colors duration-300 group-hover:text-[rgb(var(--color-primary))]"
          style={{
            fontSize: isFeatured
              ? "clamp(1.375rem, 2.4vw, 1.75rem)"
              : "clamp(1rem, 2.4vw, 1.75rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.18,
          }}
        >
          {item.title}
        </h2>
        <p
          className="font-body text-[rgb(var(--color-ink-muted))] mt-2 sm:mt-3 line-clamp-3 sm:line-clamp-none"
          style={{
            fontSize: "clamp(0.8125rem, 1vw, 1rem)",
            lineHeight: 1.55,
            maxWidth: "44ch",
          }}
        >
          {item.description}
        </p>

        {/* Footer row — stack vertically on very narrow viewports so the
            whitespace-nowrap "Learn more" link doesn't push past the card edge
            when paired with a long metric string at 320w. */}
        <div
          className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4 mt-4 sm:mt-7 pt-3 sm:pt-5"
          style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.06)" }}
        >
          <div
            className="font-heading font-medium tabular-nums text-[10px] sm:text-[12px]"
            style={{
              letterSpacing: "0.16em",
              color: "rgb(var(--color-ink-muted))",
              textTransform: "uppercase",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.metric}
          </div>
          <span
            className="inline-flex items-center gap-1.5 sm:gap-2 font-heading font-medium text-[rgb(var(--color-ink))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300 text-[11px] sm:text-[13px] whitespace-nowrap"
            style={{ letterSpacing: "0.02em" }}
          >
            {learnMore}
            <ArrowRight
              size={12}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      {/* Bottom accent — primary on hover */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 origin-left scale-x-0 transition-transform duration-[320ms] group-hover:scale-x-100"
        style={{
          height: "2px",
          backgroundColor: "rgb(var(--color-primary))",
        }}
      />
    </Link>
  );
}
