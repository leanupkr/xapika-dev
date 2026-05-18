"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type PortfolioStoryProps = {
  overline: string;
  title: string;
  paragraphs: ReadonlyArray<string>;
  photoCaption: string;
  photoKicker?: string;
  /** When set, renders an actual photograph instead of the dashed placeholder. */
  imageSrc?: string;
  imageAlt?: string;
};

export default function PortfolioStory({
  overline,
  title,
  paragraphs,
  photoCaption,
  photoKicker,
  imageSrc,
  imageAlt,
}: PortfolioStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();
      if (!sectionRef.current) return;
      const blocks = sectionRef.current.querySelectorAll("[data-fade]");
      if (prefersReduced) {
        gsap.set(blocks, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        blocks,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
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
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="portfolio-story-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 30%, rgba(246,163,23,0.05) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-start"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Text */}
        <div className="lg:col-span-6">
          <span
            data-fade
            className="opacity-0 flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "12px", letterSpacing: "0.22em" }}
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
            id="portfolio-story-title"
            data-fade
            className="opacity-0 font-heading font-semibold text-white mb-8"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.875rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>
          <div className="space-y-5" style={{ maxWidth: "60ch" }}>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-fade
                className="opacity-0 font-body"
                style={{
                  fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.75,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="lg:col-span-6 lg:pl-8">
          {imageSrc ? (
            <div
              data-fade
              className="relative opacity-0 overflow-hidden"
              style={{
                aspectRatio: "16 / 9",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt ?? photoCaption}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
                className="object-cover"
              />
              {/* Caption overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: "40%",
                  background:
                    "linear-gradient(180deg, rgba(11,31,58,0) 0%, rgba(11,31,58,0.55) 100%)",
                }}
              />
              <div className="absolute left-5 bottom-5 flex flex-col gap-1 pointer-events-none">
                {photoKicker ? (
                  <span
                    className="font-heading font-medium uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {photoKicker}
                  </span>
                ) : null}
                <span
                  className="font-heading font-medium uppercase"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {photoCaption}
                </span>
              </div>
              {/* Corner ticks — preserve framing motif */}
              {[
                { top: 8, left: 8 },
                { top: 8, right: 8 },
                { bottom: 8, left: 8 },
                { bottom: 8, right: 8 },
              ].map((pos, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute block pointer-events-none"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    bottom: pos.bottom,
                    width: "10px",
                    height: "10px",
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
          ) : (
            <div
              data-fade
              className="relative opacity-0"
              style={{
                aspectRatio: "16 / 9",
                border: "1.5px dashed rgba(255,255,255,0.22)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
              role="img"
              aria-label={`${photoCaption} — image arriving`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.04) 0%, transparent 65%), radial-gradient(ellipse at 80% 90%, rgba(246,163,23,0.08) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                <svg aria-hidden="true" width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect
                    x="6"
                    y="12"
                    width="36"
                    height="24"
                    rx="1.5"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1.25"
                  />
                  <line
                    x1="6"
                    y1="22"
                    x2="42"
                    y2="22"
                    stroke="rgba(255,255,255,0.32)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle
                    cx="14"
                    cy="29"
                    r="2.25"
                    fill="rgb(var(--color-primary))"
                    fillOpacity="0.85"
                  />
                </svg>
                {photoKicker ? (
                  <span
                    className="font-heading font-medium uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {photoKicker}
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
                  {photoCaption}
                </span>
              </div>
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
          )}
        </div>
      </div>
    </section>
  );
}
