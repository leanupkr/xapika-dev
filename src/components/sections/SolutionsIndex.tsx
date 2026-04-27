"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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
  const heroRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<SVGSVGElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const heroTargets = [
        overlineRef.current,
        titleRef.current,
        subRef.current,
      ];

      if (prefersReduced) {
        gsap.set(heroTargets, { opacity: 1, x: 0, y: 0 });
        if (titleRef.current) {
          const words = titleRef.current.querySelectorAll("[data-word]");
          gsap.set(words, { opacity: 1, y: 0 });
        }
        if (railRef.current) {
          const ticks = railRef.current.querySelectorAll("[data-tick]");
          gsap.set(ticks, { opacity: 1, x: 0 });
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
        if (railRef.current) {
          const ticks = railRef.current.querySelectorAll("[data-tick]");
          tl.fromTo(
            ticks,
            { opacity: 0, x: -8 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 },
            "-=0.5"
          );
        }
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll("[data-solution-card]");
        if (prefersReduced) {
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
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => cardsRef.current?.contains(st.trigger as Node))
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
        aria-labelledby="solutions-index-title"
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
              id="rail-grid-solutions"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
              <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
              <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1" />
              <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rail-grid-solutions)" />
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
            </span>

            <h1
              id="solutions-index-title"
              ref={titleRef}
              className="font-heading font-semibold text-white mb-6"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
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

          {/* Right rail — 5 disciplines */}
          <div className="hidden md:block md:col-span-5 lg:col-span-5">
            <div className="flex justify-end">
              <svg
                ref={railRef}
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
                    <g key={t.label} data-tick style={{ opacity: 0 }}>
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
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
      </section>

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
          style={{ maxWidth: "1280px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {items.map((item) => (
              <SolutionLargeCard
                key={item.key}
                item={item}
                number={NUMBER_BY_KEY[item.key]}
                learnMore={learnMore}
                placeholder={placeholder}
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
}: {
  item: SolutionItem;
  number: string;
  learnMore: string;
  placeholder: string;
}) {
  return (
    <Link
      data-solution-card
      href={item.href}
      aria-label={`${item.title} — ${item.description}`}
      className="group relative block opacity-0 transition-colors duration-[320ms]"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        border: "1px solid rgb(var(--color-ink) / 0.10)",
      }}
    >
      {/* Photo placeholder */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          backgroundColor: "rgb(var(--color-bg))",
        }}
        role="img"
        aria-label={`${item.title} photograph placeholder — image arriving`}
      >
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
        className="px-6 md:px-8 py-7 md:py-9"
        style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.08)" }}
      >
        <h2
          className="font-heading font-semibold text-[rgb(var(--color-ink))] transition-colors duration-300 group-hover:text-[rgb(var(--color-primary))]"
          style={{
            fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.18,
          }}
        >
          {item.title}
        </h2>
        <p
          className="font-body text-[rgb(var(--color-ink-muted))] mt-3"
          style={{
            fontSize: "clamp(0.9375rem, 1vw, 1rem)",
            lineHeight: 1.6,
            maxWidth: "44ch",
          }}
        >
          {item.description}
        </p>

        {/* Footer row */}
        <div
          className="flex items-end justify-between gap-4 mt-7 pt-5"
          style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.06)" }}
        >
          <div
            className="font-heading font-medium tabular-nums"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "rgb(var(--color-ink-muted))",
              textTransform: "uppercase",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.metric}
          </div>
          <span
            className="inline-flex items-center gap-2 font-heading font-medium text-[rgb(var(--color-ink))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
            style={{ fontSize: "13px", letterSpacing: "0.02em" }}
          >
            {learnMore}
            <ArrowRight
              size={14}
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
