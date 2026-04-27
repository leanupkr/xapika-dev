"use client";

// TODO(content): Org chart 이미지 — 하리카 제공 예정 (실제 SVG/PNG 자리)

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type OrgChartProps = {
  overline: string;
  title: string;
  subtitle: string;
  placeholderText: string;
  awaitingNote: string;
};

export default function OrgChart({
  overline,
  title,
  subtitle,
  placeholderText,
  awaitingNote,
}: OrgChartProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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

      if (canvasRef.current) {
        if (prefersReduced) {
          gsap.set(canvasRef.current, { opacity: 1, y: 0 });
          const nodes = canvasRef.current.querySelectorAll("[data-org-node]");
          gsap.set(nodes, { opacity: 1 });
        } else {
          gsap.fromTo(
            canvasRef.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: canvasRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );

          const nodes = canvasRef.current.querySelectorAll("[data-org-node]");
          gsap.fromTo(
            nodes,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.out",
              transformOrigin: "center center",
              scrollTrigger: {
                trigger: canvasRef.current,
                start: "top 78%",
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

  // Hint structure: 1 root → 3 mid → 6 leaves (illustrative only)
  const ROOT = { x: 400, y: 50, label: "HQ" };
  const MID = [
    { x: 180, y: 165, label: "OPS" },
    { x: 400, y: 165, label: "ENG" },
    { x: 620, y: 165, label: "ADMIN" },
  ];
  const LEAVES = [
    { x: 90, y: 280, label: "WAW" },
    { x: 270, y: 280, label: "KYI" },
    { x: 360, y: 280, label: "IST" },
    { x: 440, y: 280, label: "CAI" },
    { x: 530, y: 280, label: "SEL" },
    { x: 710, y: 280, label: "TAS" },
  ];

  return (
    <section
      ref={sectionRef}
      data-bg="light"
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="org-title"
    >
      {/* Top hairline — soft transition from dark vision */}
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
            id="org-title"
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

        {/* Canvas — 16:9 placeholder with hint structure */}
        <div
          ref={canvasRef}
          className="relative w-full overflow-hidden opacity-0"
          style={{
            aspectRatio: "16 / 9",
            border: "1.5px dashed rgb(var(--color-ink-muted) / 0.4)",
            backgroundColor: "rgb(var(--color-surface))",
          }}
          role="img"
          aria-label="Organization chart placeholder — diagram awaiting from Harika"
        >
          {/* Subtle dot grid background */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.5 }}
          >
            <defs>
              <pattern
                id="org-dots"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="1"
                  cy="1"
                  r="1"
                  fill="rgb(var(--color-ink) / 0.07)"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#org-dots)" />
          </svg>

          {/* Org structure hint (illustrative — not actual chart) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 800 360"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Connecting lines — root to mid */}
            {MID.map((m) => (
              <line
                key={`root-${m.label}`}
                x1={ROOT.x}
                y1={ROOT.y + 16}
                x2={m.x}
                y2={m.y - 16}
                stroke="rgb(var(--color-ink))"
                strokeOpacity="0.12"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            ))}

            {/* Connecting lines — mid to leaves (each mid has 2 children, alternating) */}
            {LEAVES.map((leaf, i) => {
              const parent = MID[Math.floor(i / 2)];
              return (
                <line
                  key={`mid-${leaf.label}`}
                  x1={parent.x}
                  y1={parent.y + 16}
                  x2={leaf.x}
                  y2={leaf.y - 12}
                  stroke="rgb(var(--color-ink))"
                  strokeOpacity="0.10"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              );
            })}

            {/* Root node — primary */}
            <g data-org-node opacity="0">
              <rect
                x={ROOT.x - 36}
                y={ROOT.y - 14}
                width="72"
                height="28"
                rx="4"
                fill="rgb(var(--color-primary) / 0.10)"
                stroke="rgb(var(--color-primary))"
                strokeOpacity="0.55"
                strokeWidth="1.25"
              />
              <text
                x={ROOT.x}
                y={ROOT.y + 4}
                textAnchor="middle"
                fontFamily="var(--font-heading)"
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.18em"
                fill="rgb(var(--color-primary))"
              >
                {ROOT.label}
              </text>
            </g>

            {/* Mid nodes */}
            {MID.map((m) => (
              <g key={m.label} data-org-node opacity="0">
                <rect
                  x={m.x - 32}
                  y={m.y - 14}
                  width="64"
                  height="28"
                  rx="4"
                  fill="rgb(var(--color-surface))"
                  stroke="rgb(var(--color-ink))"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <text
                  x={m.x}
                  y={m.y + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-heading)"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.18em"
                  fill="rgb(var(--color-ink-muted))"
                >
                  {m.label}
                </text>
              </g>
            ))}

            {/* Leaf nodes — small dots with labels */}
            {LEAVES.map((leaf) => (
              <g key={leaf.label} data-org-node opacity="0">
                <circle
                  cx={leaf.x}
                  cy={leaf.y}
                  r="4"
                  fill="rgb(var(--color-ink-muted))"
                  fillOpacity="0.55"
                />
                <text
                  x={leaf.x}
                  y={leaf.y + 22}
                  textAnchor="middle"
                  fontFamily="var(--font-heading)"
                  fontSize="9"
                  fontWeight="600"
                  letterSpacing="0.18em"
                  fill="rgb(var(--color-ink-muted))"
                  fillOpacity="0.7"
                >
                  {leaf.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Center overlay with microcopy */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-10 px-6">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-ink)/0.08)]">
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
              <span
                className="font-heading font-medium uppercase whitespace-nowrap text-[rgb(var(--color-ink-muted))]"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                }}
              >
                {placeholderText}
              </span>
            </div>
          </div>

          {/* Top-left corner microcopy */}
          <div
            className="absolute top-4 left-4 md:top-5 md:left-6 font-heading font-medium uppercase text-[rgb(var(--color-ink-muted))]"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              opacity: 0.7,
            }}
          >
            {awaitingNote}
          </div>
        </div>
      </div>
    </section>
  );
}
