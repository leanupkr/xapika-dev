"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type UzbekEvent = {
  year: string;
  month: string;
  label: string;
  isComing?: boolean;
};

type UzbekTimelineProps = {
  overline: string;
  title: string;
  comingBadge: string;
  events: ReadonlyArray<UzbekEvent>;
};

export default function UzbekTimeline({
  overline,
  title,
  comingBadge,
  events,
}: UzbekTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // ── Header stagger fade-in ──────────────────────────────────────────────
      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll("[data-header-item]");
        if (reduced) {
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
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // ── Per-node scroll reveal ──────────────────────────────────────────────
      if (listRef.current) {
        const nodes = listRef.current.querySelectorAll("[data-node]");
        nodes.forEach((node) => {
          if (reduced) {
            gsap.set(node, { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            node,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: node,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-bg="light"
      className="relative"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="uzbek-timeline-title"
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgb(var(--color-ink) / 0.06)" }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ── Left column — sticky header ───────────────────────────────── */}
          <div ref={headerRef} className="lg:col-span-4 lg:sticky lg:top-28">
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
              id="uzbek-timeline-title"
              data-header-item
              className="font-heading font-semibold text-[rgb(var(--color-ink))] opacity-0"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              {title}
            </h2>
          </div>

          {/* ── Right column — timeline ────────────────────────────────────── */}
          <div className="lg:col-span-8">
            <ol ref={listRef} className="relative">
              {/* Vertical axis line */}
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0"
                style={{
                  left: "3px",
                  width: "1px",
                  backgroundColor: "rgba(11,31,58,0.12)",
                }}
              />

              {events.map((event, i) => {
                const isLast = i === events.length - 1;
                const coming = !!event.isComing;

                return (
                  <li
                    key={`${event.year}-${event.month}-${i}`}
                    data-node
                    className={`relative pl-10 opacity-0 ${
                      isLast ? "pb-0" : "pb-12 md:pb-16"
                    }`}
                  >
                    {/* Axis fade-out gradient for last item */}
                    {isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-4 bottom-0"
                        style={{
                          width: "1px",
                          background:
                            "linear-gradient(to bottom, rgba(11,31,58,0.12) 0%, rgba(11,31,58,0) 100%)",
                        }}
                      />
                    )}

                    {/* Dot on axis */}
                    {coming ? (
                      /* Future dot — outline ring only + livepulse */
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 z-[1] block rounded-full"
                        style={{
                          left: "0px",
                          width: "8px",
                          height: "8px",
                          backgroundColor: "transparent",
                          border: "2px solid rgb(var(--color-primary))",
                          boxShadow:
                            "0 0 0 4px rgb(var(--color-bg)), 0 0 0 5px rgba(11,31,58,0.06)",
                          animation: "livepulse 1.8s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      /* Past dot — filled */
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 z-[1] block rounded-full bg-[rgb(var(--color-primary))]"
                        style={{
                          left: "0px",
                          width: "8px",
                          height: "8px",
                          boxShadow:
                            "0 0 0 4px rgb(var(--color-bg)), 0 0 0 5px rgba(11,31,58,0.06)",
                        }}
                      />
                    )}

                    {/* Year . Month — large date stamp */}
                    <div
                      className="font-heading font-semibold text-[rgb(var(--color-ink-muted))] leading-none mb-3 tabular-nums"
                      style={{
                        fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {event.year}
                      <span
                        style={{
                          marginLeft: "0.18em",
                          color: coming
                            ? "rgb(var(--color-primary))"
                            : "inherit",
                        }}
                      >
                        .{event.month}
                      </span>
                    </div>

                    {/* Event label */}
                    <div
                      className="font-body text-[rgb(var(--color-ink))]"
                      style={{
                        fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
                        lineHeight: 1.55,
                        maxWidth: "480px",
                      }}
                    >
                      {event.label}
                      {coming && (
                        <span
                          className="inline-flex items-center font-heading font-semibold uppercase ml-2 align-middle"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.18em",
                            padding: "3px 8px",
                            borderRadius: "999px",
                            backgroundColor: "rgb(var(--color-primary) / 0.12)",
                            color: "rgb(var(--color-primary))",
                            border: "1px solid rgb(var(--color-primary) / 0.35)",
                          }}
                        >
                          {comingBadge}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
