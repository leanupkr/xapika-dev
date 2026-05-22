"use client";

import { useRef } from "react";
import { Train, TrainFront, Factory } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type TrackRecordClient = {
  name: string;
  fullName: string;
  accent: "blue" | "orange" | "yellow" | "teal";
  since?: string;
  models?: string;
  icon?: "train" | "trainFront" | "factory";
  statusOverride?: string;
  items: ReadonlyArray<string>;
};

type TrackRecordCardsProps = {
  overline: string;
  title: string;
  subtitle: string;
  statusLabel?: string;
  statusActive?: string;
  cta?: string;
  clients: ReadonlyArray<TrackRecordClient>;
};

const ACCENT_PALETTE: Record<
  TrackRecordClient["accent"],
  { color: string; soft: string }
> = {
  blue:   { color: "#1E4D7B",                       soft: "rgb(30 77 123 / 0.04)"   },
  orange: { color: "rgb(var(--color-primary))",      soft: "rgb(246 163 23 / 0.04)"  },
  yellow: { color: "#B8821F",                        soft: "rgb(184 130 31 / 0.04)"  },
  teal:   { color: "#3B7E8C",                        soft: "rgb(59 126 140 / 0.04)"  },
};

const ICON_MAP: Record<string, LucideIcon> = {
  train:      Train,
  trainFront: TrainFront,
  factory:    Factory,
};

function resolveIcon(client: TrackRecordClient): LucideIcon {
  if (client.icon && ICON_MAP[client.icon]) return ICON_MAP[client.icon];
  // Fallback heuristic
  const n = client.name.toLowerCase();
  if (n.includes("metro")) return TrainFront;
  if (n.includes("krcbw") || n.includes("kryukov")) return Factory;
  return Train;
}

export default function TrackRecordCards({
  overline,
  title,
  subtitle,
  statusLabel = "STATUS",
  statusActive = "ACTIVE",
  cta,
  clients,
}: TrackRecordCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();
      // M5: capture ref before cleanup
      const section = sectionRef.current;

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
              stagger: 0.1,
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-track-card]");
        if (prefersReduced) {
          gsap.set(cards, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.09,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => section?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-bg="light"
      className="relative bg-[rgb(var(--color-surface))]"
      style={{
        paddingTop: "clamp(3rem, 10vh, 8rem)",
        paddingBottom: "clamp(3rem, 10vh, 8rem)",
      }}
      aria-labelledby="track-record-title"
    >
      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-[640px] mb-8 md:mb-14 lg:mb-20"
        >
          {/* C7: overline color fixed to #A86700 (~4.65:1 on white, WCAG AA) */}
          <span
            data-header-item
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 opacity-0"
            style={{ fontSize: "13px", letterSpacing: "0.22em", color: "#A86700" }}
          >
            <span
              aria-hidden="true"
              className="inline-block flex-shrink-0"
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "#A86700",
              }}
            />
            {overline}
          </span>

          <h2
            id="track-record-title"
            data-header-item
            className="font-heading font-semibold text-[rgb(var(--color-ink))] opacity-0"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
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
            }}
          >
            {subtitle}
          </p>

          {/* Rail-track motif — twin hairline */}
          <div
            data-header-item
            aria-hidden="true"
            className="mt-10 flex flex-col gap-[2px] opacity-0"
            style={{ maxWidth: "120px" }}
          >
            <span
              className="block"
              style={{
                height: "1px",
                backgroundColor: "rgb(var(--color-ink) / 0.22)",
              }}
            />
            <span
              className="block"
              style={{
                height: "1px",
                backgroundColor: "rgb(var(--color-ink) / 0.22)",
              }}
            />
          </div>
        </div>

        {/* Cards grid — 1 col mobile / sm:2 col / md:2x2 */}
        <ul
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 items-stretch"
        >
          {clients.map((client, idx) => {
            // C6: runtime-safe palette lookup
            const palette = ACCENT_PALETTE[client.accent] ?? ACCENT_PALETTE.blue;
            const Icon = resolveIcon(client);
            const index = String(idx + 1).padStart(2, "0");

            // C1: build status annotation
            const statusAnnotation = client.statusOverride
              ? client.statusOverride
              : client.since
              ? `${statusLabel} · ${statusActive} · EST. ${client.since}`
              : `${statusLabel} · ${statusActive}`;

            return (
              // C5: no hover translate/shadow; m6: aria-label removed (h3 provides name)
              <li
                key={client.name}
                data-track-card
                className="relative flex bg-white opacity-0"
                style={{
                  border: "1px solid rgb(var(--color-ink) / 0.10)",
                }}
              >
                {/* Left accent strip — fixed 4px, no hover-expand */}
                <span
                  aria-hidden="true"
                  className="block flex-shrink-0"
                  style={{
                    width: "4px",
                    backgroundColor: palette.color,
                  }}
                />

                {/* Body — M6: soft accent background at 0.04 opacity */}
                <div
                  className="relative flex flex-1 flex-col p-[22px_22px_24px_20px] sm:p-[28px_32px_30px_28px]"
                  style={{
                    backgroundColor: palette.soft,
                  }}
                >
                  {/* Index number — engineering blueprint mark */}
                  <span
                    aria-hidden="true"
                    className="absolute font-heading font-bold leading-none"
                    style={{
                      top: "22px",
                      right: "26px",
                      fontSize: "clamp(2.75rem, 5vw, 4rem)",
                      letterSpacing: "-0.04em",
                      color: "transparent",
                      WebkitTextStroke: "1px rgb(var(--color-ink) / 0.14)",
                    }}
                  >
                    {index}
                  </span>

                  {/* Icon — semantic per-client (m1: driven by icon field) */}
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="flex-shrink-0 mb-4"
                    style={{
                      width: "26px",
                      height: "26px",
                      color: palette.color,
                    }}
                  />

                  {/* Name + fullName + models (M1) */}
                  <h3
                    className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                    style={{
                      fontSize: "clamp(1.125rem, 1.7vw, 1.375rem)",
                      letterSpacing: "-0.018em",
                      lineHeight: 1.2,
                      maxWidth: "calc(100% - 64px)",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {client.name}
                  </h3>
                  <p
                    className="font-body text-[rgb(var(--color-ink-muted))] mt-1.5"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "0.005em",
                      lineHeight: 1.45,
                    }}
                  >
                    {client.fullName}
                  </p>
                  {/* M1: vehicle model tag line */}
                  {client.models && (
                    <p
                      className="font-body text-[rgb(var(--color-ink-muted))] mt-1 uppercase"
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        lineHeight: 1.4,
                        overflowWrap: "break-word",
                      }}
                    >
                      {client.models}
                    </p>
                  )}

                  {/* Twin hairline divider — railroad-track motif (m9: gap-[2px]) */}
                  <div
                    aria-hidden="true"
                    className="flex flex-col gap-[2px] my-5"
                  >
                    <span
                      className="block"
                      style={{
                        height: "1px",
                        backgroundColor: "rgb(var(--color-ink) / 0.10)",
                      }}
                    />
                    <span
                      className="block"
                      style={{
                        height: "1px",
                        backgroundColor: "rgb(var(--color-ink) / 0.10)",
                      }}
                    />
                  </div>

                  {/* Spec items — numbered (m7: role="list" removed) */}
                  <ul className="flex flex-col gap-3">
                    {client.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-baseline gap-3.5 font-body text-[rgb(var(--color-ink))]"
                        style={{
                          fontSize: "clamp(0.875rem, 1.05vw, 0.9375rem)",
                          lineHeight: 1.5,
                        }}
                      >
                        {/* C7: item index marker → ink-muted (not accent color) */}
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0 font-heading font-medium tabular-nums"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            color: "rgb(var(--color-ink-muted))",
                            minWidth: "18px",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ paddingTop: "1px" }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* M4: KRCBW single-line note when items are few */}
                  {client.items.length <= 2 && (
                    <p
                      className="mt-3 font-body text-[rgb(var(--color-ink-muted))]"
                      style={{ fontSize: "12px", letterSpacing: "0.01em", lineHeight: 1.5 }}
                    >
                      Specialized supply chain partner — see Story for detail.
                    </p>
                  )}

                  {/* C1: Static status annotation — no animation */}
                  <div className="mt-6 flex items-center gap-2 self-start">
                    {/* ■ filled square */}
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        flexShrink: 0,
                        backgroundColor: palette.color,
                      }}
                    />
                    <span
                      className="font-heading font-medium uppercase text-[rgb(var(--color-ink-muted))]"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.2em",
                      }}
                    >
                      {statusAnnotation}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* C5: Section CTA — touch target ≥ 44px */}
        {cta && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center font-heading font-semibold uppercase"
              style={{
                fontSize: "13px",
                letterSpacing: "0.12em",
                color: "#1E4D7B",
                padding: "12px 8px",
                borderBottom: "1px solid #1E4D7B",
                minHeight: "44px",
              }}
            >
              {cta} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
