"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type AboutHeaderProps = {
  overline: string;
  title: string;
  subtitle: string;
};

export default function AboutHeader({
  overline,
  title,
  subtitle,
}: AboutHeaderProps) {
  const containerRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();

      const targets = [
        overlineRef.current,
        titleRef.current,
        subRef.current,
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
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.2"
        );
      }

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "+=0.15"
      );

      // Rail motif: tick groups reveal sequentially
      if (railRef.current) {
        const ticks = railRef.current.querySelectorAll("[data-tick]");
        tl.fromTo(
          ticks,
          { opacity: 0, x: -8 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    },
    { scope: containerRef }
  );

  const words = title.split(" ").filter(Boolean);

  return (
    <section
      ref={containerRef}
      data-bg="dark"
      className="relative overflow-hidden flex items-end"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        minHeight: "clamp(420px, 52vh, 560px)",
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingBottom: "clamp(3rem, 6vh, 5rem)",
      }}
      aria-labelledby="about-header-title"
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Subtle rail-grid pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id="rail-grid-about"
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
        <rect width="100%" height="100%" fill="url(#rail-grid-about)" />
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

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full grid grid-cols-12 gap-x-8 gap-y-12 items-end"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* Text block */}
        <div className="col-span-12 md:col-span-7 lg:col-span-7 max-w-2xl">
          {/* Overline */}
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

          {/* H1 — word-by-word */}
          <h1
            id="about-header-title"
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

        {/* Right rail-tick motif */}
        <div className="hidden md:block md:col-span-5 lg:col-span-5">
          <div className="flex justify-end">
            <svg
              ref={railRef}
              width="220"
              height="240"
              viewBox="0 0 220 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="overflow-visible"
            >
              {/* Vertical axis */}
              <line
                x1="40"
                y1="10"
                x2="40"
                y2="230"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
              {/* Tick stations — one per country */}
              {[
                { y: 30, label: "TUR" },
                { y: 65, label: "UKR" },
                { y: 100, label: "BRA" },
                { y: 135, label: "POL" },
                { y: 170, label: "USA" },
                { y: 195, label: "EGY" },
                { y: 220, label: "KOR / UZB" },
              ].map((t, i) => {
                const accent = i === 6;
                return (
                  <g key={t.label} data-tick style={{ opacity: 0 }}>
                    <line
                      x1="40"
                      y1={t.y}
                      x2={accent ? "120" : "80"}
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
                      x={accent ? "128" : "88"}
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
              {/* Top label */}
              <text
                x="40"
                y="6"
                fill="rgba(255,255,255,0.4)"
                fontFamily="var(--font-heading)"
                fontSize="9"
                fontWeight="600"
                letterSpacing="0.22em"
                textAnchor="middle"
              >
                EST. 2016
              </text>
            </svg>
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
