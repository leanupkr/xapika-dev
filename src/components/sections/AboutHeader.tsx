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
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-12 md:items-end"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* Text block — grid 12-col only on md+ (mobile uses block flow so the
            ~32px×11 gap budget doesn't push the text 56px past the viewport). */}
        <div className="max-w-2xl md:col-span-12">
          {/* Overline */}
          <span
            ref={overlineRef}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6"
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

          {/* H1 — word-by-word. aria-label exposes the full title with spaces
              to screen readers; child spans are aria-hidden (their textContent
              would otherwise concatenate without spaces). */}
          <h1
            id="about-header-title"
            ref={titleRef}
            aria-label={title}
            className="font-heading font-semibold text-white mb-6"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 4.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                data-word
                aria-hidden="true"
                className="inline-block"
                style={{ marginRight: i < words.length - 1 ? "0.25em" : 0 }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="font-body"
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
