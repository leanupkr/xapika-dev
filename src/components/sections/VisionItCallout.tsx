"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type VisionItCalloutProps = {
  overline: string;
  title: string;
  body: string;
  visitLabel: string;
  visitHref: string;
  logoSrc: string;
  logoAlt: string;
  gifSrc: string;
  gifAlt: string;
};

export default function VisionItCallout({
  overline,
  title,
  body,
  visitLabel,
  visitHref,
  logoSrc,
  logoAlt,
  gifSrc,
  gifAlt,
}: VisionItCalloutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const blocks = sectionRef.current.querySelectorAll("[data-vit-block]");
      if (prefersReducedMotion()) {
        gsap.set(blocks, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          blocks,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
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
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="vision-it-callout-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 50%, rgba(246,163,23,0.10) 0%, transparent 55%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0 lg:gap-x-12 items-center">
          {/* Left: text */}
          <div className="lg:col-span-6" data-vit-block>
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "13px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </span>

            {/* Logo */}
            <div
              className="relative mb-6"
              style={{
                width: "clamp(160px, 24vw, 220px)",
                height: "clamp(40px, 5vw, 56px)",
              }}
            >
              <Image
                src={logoSrc}
                alt={logoAlt}
                fill
                sizes="220px"
                className="object-contain object-left"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>

            <h2
              id="vision-it-callout-title"
              className="font-heading font-semibold text-white mb-5"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "20ch",
              }}
            >
              {title}
            </h2>

            <p
              className="font-body mb-7"
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.0625rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.72)",
                maxWidth: "48ch",
              }}
            >
              {body}
            </p>

            <a
              href={visitHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-2 px-6 py-3.5 border border-white/25 text-white font-heading font-medium transition-colors duration-300 hover:bg-white/10 hover:border-white/40"
              style={{ fontSize: "13px", letterSpacing: "0.05em" }}
            >
              {visitLabel}
              <ArrowUpRight
                size={14}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          {/* Right: GIF with reduced-motion fallback */}
          <div className="lg:col-span-6" data-vit-block>
            <div
              className="relative w-full overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                aspectRatio: "16 / 10",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <picture>
                <source
                  media="(prefers-reduced-motion: no-preference)"
                  srcSet={gifSrc}
                />
                <img
                  src={logoSrc}
                  alt={gifAlt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "12%",
                    filter: "brightness(0) invert(1) opacity(0.85)",
                  }}
                />
              </picture>
              <div
                aria-hidden="true"
                className="absolute top-3.5 left-3.5 font-heading font-medium uppercase"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                LIVE PLATFORM
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}
