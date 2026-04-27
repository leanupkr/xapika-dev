"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type PortfolioHeroProps = {
  overline: string;
  title: string;
  subtitle: string;
  index: string;
  /** When set, renders a small accent badge in the top-right (e.g., "Uninterrupted Since War", "Coming 2026.05"). */
  accentBadge?: string;
  /** Photo placeholder microcopy (e.g., "Site photograph arriving"). */
  placeholder: string;
  /** Visual hint shown above placeholder (country / year). */
  placeholderKicker?: string;
};

export default function PortfolioHero({
  overline,
  title,
  subtitle,
  index,
  accentBadge,
  placeholder,
  placeholderKicker,
}: PortfolioHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const targets = [
        overlineRef.current,
        titleRef.current,
        subRef.current,
        photoRef.current,
        badgeRef.current,
      ];

      if (prefersReduced) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0 });
        if (titleRef.current) {
          const words = titleRef.current.querySelectorAll("[data-word]");
          gsap.set(words, { opacity: 1, y: 0 });
        }
        return;
      }

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

      tl.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8 },
        "-=0.5"
      );

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, x: 12 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.3"
        );
      }
    },
    { scope: heroRef }
  );

  const words = title.split(" ").filter(Boolean);

  return (
    <section
      ref={heroRef}
      data-bg="dark"
      className="relative overflow-hidden flex items-end"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        minHeight: "clamp(460px, 60vh, 640px)",
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingBottom: "clamp(3rem, 6vh, 5rem)",
      }}
      aria-labelledby="portfolio-detail-title"
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Rail-grid pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id={`rail-grid-portfolio-${index.replace(/[^a-z0-9]/gi, "")}`}
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
        <rect
          width="100%"
          height="100%"
          fill={`url(#rail-grid-portfolio-${index.replace(/[^a-z0-9]/gi, "")})`}
        />
      </svg>

      {/* Left primary glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 60%, rgba(246,163,23,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Accent badge — top-right (per-program: war record, coming-soon, etc.) */}
      {accentBadge ? (
        <div
          ref={badgeRef}
          className="absolute opacity-0 hidden md:flex items-center gap-3"
          style={{
            top: "clamp(5.5rem, 11vh, 7.5rem)",
            right: "clamp(1.5rem, 4vw, 4rem)",
            zIndex: 20,
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block"
            style={{
              width: "32px",
              height: "1.5px",
              backgroundColor: "rgb(var(--color-primary))",
            }}
          />
          <span
            className="font-heading font-medium uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "rgb(var(--color-primary))",
            }}
          >
            {accentBadge}
          </span>
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "rgb(var(--color-primary))",
              boxShadow: "0 0 0 4px rgb(246 163 23 / 0.18)",
            }}
          />
        </div>
      ) : null}

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full grid grid-cols-12 gap-x-8 gap-y-12 items-end"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* Text block */}
        <div className="col-span-12 md:col-span-7 lg:col-span-7 max-w-2xl">
          {/* Overline + index */}
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
            <span
              className="text-[rgb(var(--color-primary))] tabular-nums"
              style={{ marginLeft: "0.5rem" }}
            >
              {index}
            </span>
          </span>

          {/* Title */}
          <h1
            id="portfolio-detail-title"
            ref={titleRef}
            className="font-heading font-semibold text-white mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
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

          {/* Subtitle */}
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

        {/* Right photo placeholder */}
        <div className="hidden md:block md:col-span-5 lg:col-span-5">
          <div
            ref={photoRef}
            className="relative ml-auto opacity-0"
            style={{
              aspectRatio: "4 / 3",
              width: "100%",
              maxWidth: "420px",
              border: "1.5px dashed rgba(255,255,255,0.22)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
            role="img"
            aria-label={`${placeholder} — image arriving`}
          >
            {/* Inner gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.04) 0%, transparent 65%), radial-gradient(ellipse at 75% 90%, rgba(246,163,23,0.08) 0%, transparent 60%)",
              }}
            />

            {/* Centered glyph + microcopy */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <svg
                aria-hidden="true"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
              >
                <rect
                  x="6"
                  y="12"
                  width="32"
                  height="22"
                  rx="1.5"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.25"
                />
                <line
                  x1="6"
                  y1="20"
                  x2="38"
                  y2="20"
                  stroke="rgba(255,255,255,0.32)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <circle
                  cx="14"
                  cy="27"
                  r="2.25"
                  fill="rgb(var(--color-primary))"
                  fillOpacity="0.85"
                />
              </svg>
              {placeholderKicker ? (
                <span
                  className="font-heading font-medium uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {placeholderKicker}
                </span>
              ) : null}
              <span
                className="font-heading font-medium uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {placeholder}
              </span>
            </div>

            {/* Corner ticks */}
            {[
              { top: 8, left: 8 },
              { top: 8, right: 8 },
              { bottom: 8, left: 8 },
              { bottom: 8, right: 8 },
            ].map((pos, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute block"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  width: "8px",
                  height: "8px",
                  borderTop:
                    pos.top !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderBottom:
                    pos.bottom !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderLeft:
                    pos.left !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderRight:
                    pos.right !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>
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
