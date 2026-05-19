"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type RelatedProjectItem = {
  key: string;
  country: string;
  project: string;
  desc: string;
  image?: string;
  imgAlt?: string;
  /** Optional explicit href. Falls back to the slug derived from `key`. */
  href?: string;
  /** Big label shown inside the placeholder when no image is provided (e.g. "Coming 2026.05 · Tashkent"). */
  placeholderLabel?: string;
};

// Map item.key → portfolio slug. The i18n copy uses short keys (ukraine, warsaw,
// uzbekistan) so the page itself doesn't have to know the route shape.
const HREF_BY_KEY: Record<string, string> = {
  ukraine: "/portfolios/ukraine-emu",
  warsaw: "/portfolios/warsaw-tram",
  poland: "/portfolios/warsaw-tram",
  uzbekistan: "/portfolios/uzbekistan-rail",
};

function hrefFor(item: RelatedProjectItem): string {
  return item.href ?? HREF_BY_KEY[item.key] ?? "/portfolios";
}

type RelatedProjectsProps = {
  overline: string;
  title: string;
  items: ReadonlyArray<RelatedProjectItem>;
};

export default function RelatedProjects({
  overline,
  title,
  items,
}: RelatedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();

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

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll("[data-related-card]");
        if (prefersReduced) {
          gsap.set(cards, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
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
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(3.5rem, 10vh, 8rem)",
        paddingBottom: "clamp(3.5rem, 10vh, 8rem)",
      }}
      aria-labelledby="related-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0 lg:gap-x-12">
          {/* Left — sticky header */}
          <div ref={headerRef} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
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
                id="related-title"
                data-header-item
                className="font-heading font-semibold text-[rgb(var(--color-ink))] opacity-0"
                style={{
                  fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  maxWidth: "18ch",
                }}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* Right — cards */}
          <div
            ref={cardsRef}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {items.map((item, i) => (
              <RelatedCard key={item.key} item={item} number={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedCard({
  item,
  number,
}: {
  item: RelatedProjectItem;
  number: number;
}) {
  return (
    <Link
      href={hrefFor(item)}
      aria-label={`${item.country} — ${item.project}`}
      data-related-card
      className="group relative block opacity-0 transition-colors duration-[320ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] focus-visible:ring-offset-2"
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
            ? item.imgAlt ?? `${item.project} photograph`
            : `${item.project} photograph placeholder`
        }
      >
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.imgAlt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
              className="object-cover transition-transform duration-[3200ms] ease-out group-hover:scale-[1.03]"
            />
            {/* Subtle warm overlay for hover tint */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none transition-opacity duration-[480ms] opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,31,58,0) 60%, rgba(11,31,58,0.45) 100%)",
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
                  "radial-gradient(ellipse at 25% 20%, rgb(var(--color-ink) / 0.05) 0%, transparent 65%), radial-gradient(ellipse at 80% 90%, rgb(var(--color-primary) / 0.06) 0%, transparent 60%)",
              }}
            />

            {/* Dashed inner frame */}
            <div
              aria-hidden="true"
              className="absolute inset-3"
              style={{
                border: "1.5px dashed rgb(var(--color-ink-muted) / 0.32)",
              }}
            />

            {/* Center — corridor miniature + label or default icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              {item.placeholderLabel ? (
                <>
                  {/* Three-stop corridor miniature — Kraków · Tashkent · Seoul */}
                  <svg
                    aria-hidden="true"
                    width="120"
                    height="20"
                    viewBox="0 0 120 20"
                    fill="none"
                  >
                    <line
                      x1="8"
                      y1="10"
                      x2="112"
                      y2="10"
                      stroke="rgb(var(--color-ink-muted))"
                      strokeOpacity="0.4"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      fill="rgb(var(--color-ink-muted))"
                      fillOpacity="0.55"
                    />
                    <circle
                      cx="60"
                      cy="10"
                      r="4.5"
                      fill="rgb(var(--color-primary))"
                    />
                    <circle
                      cx="60"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="rgb(var(--color-primary))"
                      strokeOpacity="0.35"
                      strokeWidth="1"
                    />
                    <circle
                      cx="110"
                      cy="10"
                      r="3"
                      fill="rgb(var(--color-ink-muted))"
                      fillOpacity="0.55"
                    />
                  </svg>
                  <span
                    className="font-heading font-semibold text-[rgb(var(--color-ink))] tabular-nums"
                    style={{
                      fontSize: "clamp(1.125rem, 1.7vw, 1.375rem)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                      maxWidth: "26ch",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.placeholderLabel}
                  </span>
                </>
              ) : (
                <svg
                  aria-hidden="true"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="9"
                    width="26"
                    height="18"
                    rx="1.25"
                    stroke="rgb(var(--color-ink-muted))"
                    strokeOpacity="0.5"
                    strokeWidth="1.25"
                  />
                  <line
                    x1="5"
                    y1="16"
                    x2="31"
                    y2="16"
                    stroke="rgb(var(--color-ink-muted))"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle
                    cx="11"
                    cy="22"
                    r="1.5"
                    fill="rgb(var(--color-primary))"
                    fillOpacity="0.7"
                  />
                </svg>
              )}
            </div>
          </>
        )}

        {/* Number — top left */}
        <span
          className="absolute top-3.5 left-3.5 font-heading font-medium tabular-nums"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.22em",
            color: "rgb(var(--color-primary))",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          CASE 0{number}
        </span>

        {/* Country — top right */}
        <span
          className="absolute top-3.5 right-3.5 font-heading font-medium uppercase"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.22em",
            color: "rgb(var(--color-ink-muted))",
          }}
        >
          {item.country}
        </span>

        {/* Hover arrow — bottom right */}
        <span
          aria-hidden="true"
          className="absolute bottom-3.5 right-3.5 flex items-center justify-center text-[rgb(var(--color-ink))] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "rgb(var(--color-primary))",
          }}
        >
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>

      {/* Content */}
      <div
        className="px-6 py-6 md:px-7 md:py-7"
        style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.08)" }}
      >
        <h3
          className="font-heading font-semibold text-[rgb(var(--color-ink))]"
          style={{
            fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)",
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
          }}
        >
          {item.project}
        </h3>
        <p
          className="font-body text-[rgb(var(--color-ink-muted))] mt-3"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.6,
          }}
        >
          {item.desc}
        </p>
      </div>

      {/* Bottom accent on hover */}
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
