"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type CeoMessageProps = {
  overline: string;
  title: string;
  subtitle: string;
  bodyParagraphs: ReadonlyArray<string>;
  name: string;
  position: string;
  signatureAlt: string;
  closingLine: string;
  portraitPlaceholder?: string;
};

export default function CeoMessage({
  overline,
  title,
  subtitle,
  bodyParagraphs,
  name,
  position,
  signatureAlt,
  closingLine,
  portraitPlaceholder = "Portrait · coming soon",
}: CeoMessageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

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

      if (bodyRef.current) {
        const paragraphs = bodyRef.current.querySelectorAll("[data-paragraph]");
        if (prefersReduced) {
          gsap.set(paragraphs, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            paragraphs,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: "power3.out",
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
          {/* Left: quote mark + body paragraphs */}
          <div ref={bodyRef} className="lg:col-span-7 relative">
            {/* Big decorative quote mark */}
            <span
              aria-hidden="true"
              className="absolute font-heading select-none pointer-events-none"
              style={{
                top: "-0.5rem",
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

            {/* CEO body paragraphs */}
            <div
              className="relative pt-16 pl-1"
              style={{ maxWidth: "560px" }}
            >
              {bodyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  data-paragraph
                  className="font-body opacity-0"
                  style={{
                    fontSize: i === 0
                      ? "clamp(1.0625rem, 1.25vw, 1.125rem)"
                      : "clamp(0.9375rem, 1.1vw, 1rem)",
                    lineHeight: 1.75,
                    color: i === 0
                      ? "rgb(var(--color-ink))"
                      : "rgba(11,31,58,0.78)",
                    fontWeight: i === 0 ? 450 : 400,
                    marginBottom:
                      i < bodyParagraphs.length - 1
                        ? "clamp(1rem, 2vh, 1.5rem)"
                        : 0,
                  }}
                >
                  {paragraph}
                </p>
              ))}

              {/* Closing + signature block (below paragraphs, left column) */}
              <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(11,31,58,0.08)" }}>
                <p
                  data-paragraph
                  className="font-heading font-medium opacity-0"
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.12em",
                    color: "rgba(11,31,58,0.55)",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  {closingLine}
                </p>

                {/* signature.png */}
                <div className="mb-3">
                  <Image
                    src="/about/ceo-signature.png"
                    alt={signatureAlt}
                    width={160}
                    height={56}
                    style={{ height: "auto", maxHeight: "56px", width: "auto", objectFit: "contain" }}
                    priority={false}
                  />
                </div>

                <div
                  className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                  style={{
                    fontSize: "clamp(1rem, 1.2vw, 1.0625rem)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.3,
                  }}
                >
                  {name}
                </div>
                <div
                  className="font-heading mt-1"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    color: "rgba(11,31,58,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  {position}
                </div>
              </div>
            </div>
          </div>

          {/* Right: portrait placeholder */}
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
                aria-label="CEO portrait placeholder — image awaiting"
              >
                {/* Subtle inner gradient */}
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
                    {portraitPlaceholder}
                  </span>
                </div>

                {/* Corner ticks */}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
