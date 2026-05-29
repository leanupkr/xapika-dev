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
}: CeoMessageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();

      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll("[data-header-item]");
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
        const items = bodyRef.current.querySelectorAll("[data-paragraph]");
        if (prefersReduced) {
          gsap.set(items, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            items,
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
        style={{ maxWidth: "780px" }}
      >
        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-20" style={{ maxWidth: "640px" }}>
          <span
            data-header-item
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
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
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
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
            className="font-body text-[rgb(var(--color-ink-muted))] mt-6"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.65,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Letter body — fills inner container width */}
        <div ref={bodyRef} className="relative">
          {/* Big decorative quote mark */}
          <span
            aria-hidden="true"
            className="absolute font-heading select-none pointer-events-none"
            style={{
              top: "-0.5rem",
              left: "-0.5rem",
              fontSize: "clamp(8rem, 14vw, 12rem)",
              lineHeight: 0.85,
              fontWeight: 600,
              color: "rgb(var(--color-primary) / 0.12)",
              letterSpacing: "-0.05em",
            }}
          >
            &ldquo;
          </span>

          {/* Body paragraphs */}
          <div className="relative pt-16 pl-1">
            {bodyParagraphs.map((paragraph, i) => (
              <p
                key={i}
                data-paragraph
                className="font-body"
                style={{
                  fontSize:
                    i === 0
                      ? "clamp(1.0625rem, 1.3vw, 1.125rem)"
                      : "clamp(0.9375rem, 1.1vw, 1rem)",
                  lineHeight: 1.78,
                  color:
                    i === 0
                      ? "rgb(var(--color-ink))"
                      : "rgba(11,31,58,0.78)",
                  fontWeight: i === 0 ? 450 : 400,
                  marginBottom:
                    i < bodyParagraphs.length - 1
                      ? "clamp(1.125rem, 2.5vh, 1.625rem)"
                      : 0,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signature block — right-aligned letter close */}
          <div
            className="mt-12 pt-8 flex flex-col items-end text-right"
            style={{ borderTop: "1px solid rgba(11,31,58,0.08)" }}
          >
            {/* "Sincerely," closing */}
            <p
              data-paragraph
              className="font-heading font-medium"
              style={{
                fontSize: "13px",
                letterSpacing: "0.14em",
                color: "rgba(11,31,58,0.48)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              {closingLine}
            </p>

            {/* Name + Signature — same baseline row. w-fit + ml-auto forces the row to hug its content and stick to the right edge. */}
            <div
              data-paragraph
              className="flex items-center gap-2 sm:gap-3 mb-3 w-fit ml-auto"
            >
              <span
                className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                style={{
                  fontSize: "clamp(1.625rem, 3.2vw, 2.25rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1,
                }}
              >
                {name}
              </span>
              <Image
                src="/about/ceo-signature.png"
                alt={signatureAlt}
                width={142}
                height={50}
                sizes="(max-width: 640px) 100px, 142px"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="select-none"
                style={{
                  height: "clamp(30px, 3.2vw, 42px)",
                  width: "auto",
                  objectFit: "contain",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  WebkitUserDrag: "none",
                } as React.CSSProperties}
                priority={false}
              />
            </div>

            {/* Position */}
            <div
              data-paragraph
              className="font-heading"
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "rgba(11,31,58,0.48)",
                textTransform: "uppercase",
              }}
            >
              {position}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
