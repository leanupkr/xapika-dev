"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type OverhaulPhase = {
  label: string;
  desc: string;
};

type OverhaulProcessProps = {
  overline: string;
  title: string;
  subtitle?: string;
  phases: ReadonlyArray<OverhaulPhase>;
  heroImage?: string;
  heroImageAlt?: string;
  traceabilityImage?: string;
  traceabilityImageAlt?: string;
};

export default function OverhaulProcess({
  overline,
  title,
  subtitle,
  phases,
  heroImage,
  heroImageAlt,
  traceabilityImage,
  traceabilityImageAlt,
}: OverhaulProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!stripRef.current) return;
      const items = stripRef.current.querySelectorAll("[data-phase]");
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, x: 0 });
      } else {
        gsap.fromTo(
          items,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stripRef.current,
              start: "top 78%",
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
      aria-labelledby="overhaul-process-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header */}
        <div className="max-w-2xl mb-12 md:mb-16">
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
            id="overhaul-process-title"
            className="font-heading font-semibold text-white mb-5"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "22ch",
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className="font-body"
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.0625rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.62)",
                maxWidth: "52ch",
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* 2-column layout: photo + phases strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-12">
          {/* Left — overhaul hero photo + traceability badge */}
          <div className="lg:col-span-5">
            {heroImage ? (
              <div className="relative flex flex-col gap-4">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "4 / 5",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <Image
                    src={heroImage}
                    alt={heroImageAlt ?? ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(11,31,58,0) 55%, rgba(11,31,58,0.55) 100%)",
                    }}
                  />
                  <span
                    className="absolute bottom-4 left-4 font-heading font-medium uppercase text-white"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.22em",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    Field — depot floor
                  </span>
                </div>
                {traceabilityImage ? (
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "16 / 9",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Image
                      src={traceabilityImage}
                      alt={traceabilityImageAlt ?? ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 540px"
                      className="object-cover"
                    />
                    <span
                      className="absolute bottom-3 left-4 font-heading font-medium uppercase text-white"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.22em",
                        textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                      }}
                    >
                      Traceability — sign-off record
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Right — phase vertical strip */}
          <ol
            ref={stripRef}
            className="lg:col-span-7 list-none m-0 p-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {phases.map((phase, i) => (
              <li
                key={phase.label}
                data-phase
                className="relative opacity-0 group"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="grid grid-cols-12 gap-4 md:gap-6 items-start py-6 md:py-7">
                  {/* Index */}
                  <div className="col-span-2 md:col-span-1">
                    <span
                      className="font-heading font-medium tabular-nums"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.22em",
                        color: "rgba(255,255,255,0.45)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="col-span-10 md:col-span-4">
                    <h3
                      className="font-heading font-semibold text-white"
                      style={{
                        fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.2,
                      }}
                    >
                      {phase.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="col-span-12 md:col-span-7">
                    <p
                      className="font-body"
                      style={{
                        fontSize: "clamp(0.9375rem, 1vw, 1rem)",
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {phase.desc}
                    </p>
                  </div>
                </div>

                {/* Left primary accent — slides in on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 origin-top scale-y-0 transition-transform duration-[320ms] ease-out group-hover:scale-y-100"
                  style={{
                    width: "2px",
                    backgroundColor: "rgb(var(--color-primary))",
                  }}
                />
              </li>
            ))}
          </ol>
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
