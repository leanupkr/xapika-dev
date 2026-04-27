"use client";

// TODO(content): CEO Message — 하리카 측 W2 까지 제공 예정 (본문 + 사진 + 서명)

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type CeoMessageProps = {
  overline: string;
  title: string;
  subtitle: string;
  placeholderName: string;
  awaitingNote: string;
};

const PARAGRAPH_BARS: ReadonlyArray<ReadonlyArray<number>> = [
  [92, 88, 64],
  [85, 94, 78],
  [90, 72, 86, 48],
  [88, 80, 56],
];

export default function CeoMessage({
  overline,
  title,
  subtitle,
  placeholderName,
  awaitingNote,
}: CeoMessageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll(
          "[data-header-item]"
        );
        if (prefersReduced) {
          gsap.set(headerTargets, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            headerTargets,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      if (bodyRef.current) {
        const bars = bodyRef.current.querySelectorAll("[data-text-bar]");
        if (prefersReduced) {
          gsap.set(bars, { opacity: 1, scaleX: 1 });
        } else {
          gsap.fromTo(
            bars,
            { opacity: 0, scaleX: 0.6 },
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.6,
              stagger: 0.04,
              ease: "power3.out",
              transformOrigin: "left center",
              scrollTrigger: {
                trigger: bodyRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      if (portraitRef.current) {
        if (prefersReduced) {
          gsap.set(portraitRef.current, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            portraitRef.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: portraitRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

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
      data-bg="light"
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="ceo-title"
    >
      {/* Top hairline — soft section transition from white history to gray ceo */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgb(var(--color-ink) / 0.06)" }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1280px" }}
      >
        {/* Header */}
        <div ref={headerRef} className="max-w-[580px] mb-14 md:mb-20">
          <span
            data-header-item
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))] opacity-0"
            style={{ fontSize: "13px", letterSpacing: "0.22em" }}
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
            id="ceo-title"
            data-header-item
            className="font-heading font-semibold text-[rgb(var(--color-ink))] opacity-0"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>

          <p
            data-header-item
            className="font-body text-[rgb(var(--color-ink-muted))] mt-6 opacity-0"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.65,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Body — 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-y-0 lg:gap-x-12">
          {/* Left: quote + placeholder paragraphs */}
          <div ref={bodyRef} className="lg:col-span-7 relative">
            {/* Awaiting microcopy */}
            <div
              className="flex items-center gap-2.5 mb-8"
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
              {awaitingNote}
            </div>

            {/* Big quote mark — decorative */}
            <span
              aria-hidden="true"
              className="absolute font-heading select-none pointer-events-none"
              style={{
                top: "1.5rem",
                left: "-0.25rem",
                fontSize: "clamp(8rem, 14vw, 12rem)",
                lineHeight: 0.85,
                fontWeight: 600,
                color: "rgb(var(--color-primary) / 0.14)",
                letterSpacing: "-0.05em",
              }}
            >
              &ldquo;
            </span>

            {/* Placeholder paragraphs — designed bars */}
            <div
              className="relative pt-16 pl-1"
              style={{ maxWidth: "540px" }}
              role="img"
              aria-label="CEO message placeholder — content arriving from Harika"
            >
              {PARAGRAPH_BARS.map((bars, pi) => (
                <div
                  key={pi}
                  className="space-y-3"
                  style={{ marginBottom: pi < PARAGRAPH_BARS.length - 1 ? "1.75rem" : 0 }}
                >
                  {bars.map((width, bi) => (
                    <div
                      key={bi}
                      data-text-bar
                      className="rounded-full opacity-0"
                      style={{
                        width: `${width}%`,
                        height: bi === 0 && pi === 0 ? "12px" : "10px",
                        backgroundColor: "rgb(var(--color-ink) / 0.10)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right: portrait placeholder + signature */}
          <div ref={portraitRef} className="lg:col-span-5 opacity-0">
            <div className="lg:sticky lg:top-24">
              {/* Portrait placeholder — 4:5 aspect */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  maxWidth: "420px",
                  border: "1.5px dashed rgb(var(--color-ink-muted) / 0.4)",
                  backgroundColor: "rgb(var(--color-surface))",
                }}
                role="img"
                aria-label="CEO portrait placeholder — image awaiting from Harika"
              >
                {/* Subtle inner gradient for depth */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, rgb(var(--color-ink) / 0.04) 0%, transparent 70%)",
                  }}
                />

                {/* Centered glyph */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <svg
                    aria-hidden="true"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="24"
                      cy="18"
                      r="7"
                      stroke="rgb(var(--color-ink-muted))"
                      strokeOpacity="0.5"
                      strokeWidth="1.25"
                    />
                    <path
                      d="M10 40c2.5-7 8-10 14-10s11.5 3 14 10"
                      stroke="rgb(var(--color-ink-muted))"
                      strokeOpacity="0.5"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    className="font-heading font-medium uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.22em",
                      color: "rgb(var(--color-ink-muted))",
                    }}
                  >
                    Portrait · 추후 제공
                  </span>
                </div>

                {/* Corner ticks — micro detail */}
                {[
                  { top: 10, left: 10, side: "tl" },
                  { top: 10, right: 10, side: "tr" },
                  { bottom: 10, left: 10, side: "bl" },
                  { bottom: 10, right: 10, side: "br" },
                ].map((pos) => (
                  <span
                    key={pos.side}
                    aria-hidden="true"
                    className="absolute block"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      bottom: pos.bottom,
                      width: "10px",
                      height: "10px",
                      borderTop: pos.top !== undefined
                        ? "1.5px solid rgb(var(--color-primary))"
                        : undefined,
                      borderBottom: pos.bottom !== undefined
                        ? "1.5px solid rgb(var(--color-primary))"
                        : undefined,
                      borderLeft: pos.left !== undefined
                        ? "1.5px solid rgb(var(--color-primary))"
                        : undefined,
                      borderRight: pos.right !== undefined
                        ? "1.5px solid rgb(var(--color-primary))"
                        : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Signature block */}
              <div className="mt-8" style={{ maxWidth: "420px" }}>
                <div
                  className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                  style={{
                    fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.35,
                  }}
                >
                  {placeholderName}
                </div>

                {/* Decorative signature stroke */}
                <svg
                  aria-hidden="true"
                  width="120"
                  height="28"
                  viewBox="0 0 120 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-3"
                >
                  <path
                    d="M2 18 C 12 4, 20 22, 32 12 C 42 4, 50 22, 62 14 C 76 6, 88 22, 102 12 C 110 6, 116 14, 118 10"
                    stroke="rgb(var(--color-primary))"
                    strokeOpacity="0.55"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
