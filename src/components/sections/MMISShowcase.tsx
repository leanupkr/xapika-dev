"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type MMISScreen = {
  src: string;
  alt: string;
  caption: string;
};

type MMISShowcaseProps = {
  overline: string;
  title: string;
  screens: ReadonlyArray<MMISScreen>;
};

export default function MMISShowcase({
  overline,
  title,
  screens,
}: MMISShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll("[data-mmis-card]");
      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
      aria-labelledby="mmis-showcase-title"
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
            "radial-gradient(ellipse at 50% 0%, rgba(246,163,23,0.06) 0%, transparent 55%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
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
            id="mmis-showcase-title"
            className="font-heading font-semibold text-white"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "22ch",
            }}
          >
            {title}
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7"
        >
          {screens.map((screen, i) => (
            <article
              key={screen.caption}
              data-mmis-card
              className="group relative opacity-0"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}
            >
              {/* Caption header */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
                  style={{ fontSize: "10.5px", letterSpacing: "0.22em" }}
                >
                  {String(i + 1).padStart(2, "0")} · {screen.caption}
                </span>
                <span
                  aria-hidden="true"
                  className="font-heading font-medium uppercase tabular-nums"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.35)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  MMIS
                </span>
              </div>

              {/* Screenshot */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16 / 10", backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  className="object-cover transition-transform duration-[640ms] ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(11,31,58,0.0) 60%, rgba(11,31,58,0.55) 100%)",
                  }}
                />
              </div>
            </article>
          ))}
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
