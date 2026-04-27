"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type HistoryEvent = {
  year: string;
  month: string;
  country: string;
  event: string;
};

type HistoryTimelineProps = {
  overline: string;
  title: string;
  subtitle: string;
  sinceWar: string;
  comingBadge: string;
  events: ReadonlyArray<HistoryEvent>;
};

function isEmphasized(e: HistoryEvent) {
  return e.year === "2026";
}

function isComing(e: HistoryEvent) {
  return e.year === "2026" && e.month === "05";
}

function isSinceWarAnchor(e: HistoryEvent) {
  return e.year === "2017" && e.month === "06";
}

type NodeContentProps = {
  event: HistoryEvent;
  emphasized: boolean;
  coming: boolean;
  comingBadge: string;
  sinceWar: boolean;
  sinceWarText: string;
  align: "left" | "right";
};

function NodeContent({
  event,
  emphasized,
  coming,
  comingBadge,
  sinceWar,
  sinceWarText,
  align,
}: NodeContentProps) {
  const isRight = align === "right";
  return (
    <div className={isRight ? "text-right" : "text-left"}>
      {/* Year + Month — large numeric */}
      <div
        className="font-heading font-medium text-[rgb(var(--color-ink))] tabular-nums leading-none mb-2.5"
        style={{
          fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {event.year}
        <span
          className={
            emphasized
              ? "text-[rgb(var(--color-primary))]"
              : "text-[rgb(var(--color-ink-muted))]"
          }
          style={{ marginLeft: "0.25em" }}
        >
          .{event.month}
        </span>
      </div>

      {/* Country — overline style */}
      <div
        className="font-heading font-semibold uppercase mb-2 text-[rgb(var(--color-ink-muted))]"
        style={{
          fontSize: "11px",
          letterSpacing: "0.22em",
        }}
      >
        {event.country}
      </div>

      {/* Event description */}
      <div
        className={`font-body text-[rgb(var(--color-ink))] ${
          isRight ? "ml-auto" : ""
        }`}
        style={{
          fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
          lineHeight: 1.55,
          maxWidth: "320px",
        }}
      >
        {event.event}
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

      {/* Since-War marker */}
      {sinceWar && (
        <div
          className={`mt-5 flex items-center gap-3 ${
            isRight ? "justify-end" : "justify-start"
          }`}
        >
          {!isRight && (
            <span
              data-since-war-line
              className="block bg-[rgb(var(--color-primary))]"
              style={{
                height: "1.5px",
                width: "0%",
                maxWidth: "56px",
                flex: "0 0 56px",
              }}
            />
          )}
          <span
            className="font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
            style={{
              fontSize: "11px",
              letterSpacing: "0.16em",
              lineHeight: 1.4,
            }}
          >
            {sinceWarText}
          </span>
          {isRight && (
            <span
              data-since-war-line
              className="block bg-[rgb(var(--color-primary))]"
              style={{
                height: "1.5px",
                width: "0%",
                maxWidth: "56px",
                flex: "0 0 56px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryTimeline({
  overline,
  title,
  subtitle,
  sinceWar,
  comingBadge,
  events,
}: HistoryTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Header reveal
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
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // Per-node reveal
      if (listRef.current) {
        const nodes = listRef.current.querySelectorAll("[data-node]");
        nodes.forEach((node) => {
          if (prefersReduced) {
            gsap.set(node, { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            node,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: node,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Since-war line draw
        const sinceWarLines = listRef.current.querySelectorAll(
          "[data-since-war-line]"
        );
        sinceWarLines.forEach((line) => {
          if (prefersReduced) {
            gsap.set(line, { width: "100%" });
            return;
          }
          gsap.fromTo(
            line,
            { width: "0%" },
            {
              width: "100%",
              duration: 0.9,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: line,
                start: "top 85%",
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
      className="relative bg-[rgb(var(--color-surface))]"
      style={{
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="history-title"
    >
      {/* Top hairline — soft transition from dark hero (AboutHeader) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgb(var(--color-ink) / 0.06)" }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1100px" }}
      >
        {/* Header */}
        <div ref={headerRef} className="max-w-[580px] mb-14 md:mb-20">
          <span
            data-header-item
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))] opacity-0"
            style={{ fontSize: "13px", letterSpacing: "0.22em" }}
          >
            <span
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
            id="history-title"
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

        {/* Timeline */}
        <ol ref={listRef} className="relative">
          {/* Continuous central axis */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px bg-[rgb(var(--color-ink)/0.12)] left-6 md:left-1/2 md:-translate-x-1/2"
          />

          {events.map((event, i) => {
            const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
            const emphasized = isEmphasized(event);
            const coming = isComing(event);
            const sinceWarFlag = isSinceWarAnchor(event);

            return (
              <li
                key={`${event.year}-${event.month}-${i}`}
                data-node
                className="relative pb-12 md:pb-20 last:pb-0 opacity-0"
              >
                {/* Dot on axis */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 z-[1] block rounded-full left-6 -translate-x-1/2 md:left-1/2 ${
                    emphasized
                      ? "bg-[rgb(var(--color-primary))]"
                      : "bg-[rgb(var(--color-ink-muted))]"
                  }`}
                  style={{
                    width: "8px",
                    height: "8px",
                    boxShadow:
                      "0 0 0 4px rgb(var(--color-surface)), 0 0 0 5px rgb(var(--color-ink) / 0.08)",
                  }}
                />

                {/* Mobile content (single column, left of axis) */}
                <div className="md:hidden pl-14">
                  <NodeContent
                    event={event}
                    emphasized={emphasized}
                    coming={coming}
                    comingBadge={comingBadge}
                    sinceWar={sinceWarFlag}
                    sinceWarText={sinceWar}
                    align="left"
                  />
                </div>

                {/* Desktop alternating columns */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-x-16">
                  <div className={side === "left" ? "" : ""}>
                    {side === "left" && (
                      <div className="flex justify-end">
                        <div className="pr-2" style={{ maxWidth: "360px" }}>
                          <NodeContent
                            event={event}
                            emphasized={emphasized}
                            coming={coming}
                            comingBadge={comingBadge}
                            sinceWar={sinceWarFlag}
                            sinceWarText={sinceWar}
                            align="right"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {side === "right" && (
                      <div className="flex justify-start">
                        <div className="pl-2" style={{ maxWidth: "360px" }}>
                          <NodeContent
                            event={event}
                            emphasized={emphasized}
                            coming={coming}
                            comingBadge={comingBadge}
                            sinceWar={sinceWarFlag}
                            sinceWarText={sinceWar}
                            align="left"
                          />
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
    </section>
  );
}
