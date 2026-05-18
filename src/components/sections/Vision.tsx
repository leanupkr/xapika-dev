"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type VisionItem = {
  index: string;
  title: string;
  body: string;
};

type VisionProps = {
  overline: string;
  title: string;
  subtitle: string;
  items: ReadonlyArray<VisionItem>;
};

export default function Vision({
  overline,
  title,
  subtitle,
  items,
}: VisionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();

      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll(
          "[data-header-item]"
        );
        if (prefersReduced) {
          gsap.set(headerTargets, { opacity: 1, x: 0, y: 0 });
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

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll("[data-vision-card]");
        if (prefersReduced) {
          gsap.set(cards, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
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
          .filter((st) => sectionRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="vision-title"
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Subtle grid pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="vision-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="80" y2="0" stroke="#fff" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="80" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vision-grid)" />
      </svg>

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header — left-aligned, max 580px */}
        <div ref={headerRef} className="max-w-[580px] mb-14 md:mb-20">
          <span
            data-header-item
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 opacity-0"
            style={{
              fontSize: "13px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.85)",
            }}
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
            id="vision-title"
            data-header-item
            className="font-heading font-semibold text-white opacity-0"
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
            className="font-body mt-6 opacity-0"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Cards — 3 columns desktop, 1 column tablet/mobile */}
        <ol
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-0"
        >
          {items.map((item) => (
            <li
              key={item.index}
              data-vision-card
              className="group relative opacity-0"
            >
              {/* Top hairline — animates to primary on hover */}
              <span
                aria-hidden="true"
                className="block transition-colors duration-500 ease-out group-hover:bg-[rgb(var(--color-primary))]"
                style={{
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  marginBottom: "28px",
                }}
              />

              <div className="flex items-start justify-between mb-10">
                {/* Index — primary accent, font-heading, small */}
                <span
                  className="font-heading font-medium tabular-nums leading-none"
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.22em",
                    color: "rgb(var(--color-primary))",
                  }}
                >
                  {item.index}
                </span>

                {/* Short accent rule (24px) — primary */}
                <span
                  aria-hidden="true"
                  className="inline-block"
                  style={{
                    width: "24px",
                    height: "2px",
                    backgroundColor: "rgb(var(--color-primary))",
                    marginTop: "6px",
                  }}
                />
              </div>

              {/* Title */}
              <h3
                className="font-heading font-semibold text-white mb-5"
                style={{
                  fontSize: "clamp(1.625rem, 2.4vw, 2.25rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {item.title}
              </h3>

              {/* Body */}
              <p
                className="font-body"
                style={{
                  fontSize: "clamp(0.9375rem, 1.05vw, 1.0625rem)",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: "32ch",
                }}
              >
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
    </section>
  );
}
