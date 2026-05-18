"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Partner = {
  src: string;
  alt: string;
  name: string;
  /** "logo" applies white-monotone filter; "photo" renders the source unchanged. */
  mode?: "logo" | "photo";
};

type PartnerLogoGridProps = {
  overline: string;
  title: string;
  subtitle: string;
  partners: ReadonlyArray<Partner>;
};

export default function PartnerLogoGrid({
  overline,
  title,
  subtitle,
  partners,
}: PartnerLogoGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cells = gridRef.current.querySelectorAll("[data-partner]");
      if (prefersReducedMotion()) {
        gsap.set(cells, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cells,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
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
      aria-labelledby="partner-logo-grid-title"
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
            "radial-gradient(ellipse at 85% 20%, rgba(246,163,23,0.06) 0%, transparent 55%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0 lg:gap-x-12">
          {/* Left header */}
          <div className="lg:col-span-5">
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
            <h2
              id="partner-logo-grid-title"
              className="font-heading font-semibold text-white mb-5"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "16ch",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: "clamp(0.9375rem, 1.05vw, 1rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "44ch",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Right partner grid */}
          <ul
            ref={gridRef}
            className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 list-none m-0 p-0"
            role="list"
          >
            {partners.map((partner) => {
              const isPhoto = partner.mode === "photo";
              return (
                <li
                  key={partner.name}
                  data-partner
                  className="relative opacity-0 group overflow-hidden"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: isPhoto
                      ? "rgba(0,0,0,0.4)"
                      : "rgba(255,255,255,0.04)",
                    aspectRatio: "5 / 3",
                  }}
                  aria-label={partner.name}
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 220px"
                    className={
                      isPhoto
                        ? "object-cover opacity-70 transition-all duration-500 group-hover:opacity-90 group-hover:scale-[1.04]"
                        : "object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
                    }
                    style={
                      isPhoto
                        ? undefined
                        : { filter: "brightness(0) invert(1) opacity(0.85)" }
                    }
                  />
                  {isPhoto ? (
                    <span
                      className="absolute bottom-2 left-3 right-3 font-heading font-medium uppercase text-white"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.22em",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {partner.name}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
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
