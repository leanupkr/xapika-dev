"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Client = {
  name: string;
  fullName: string;
  country: string;
  logo?: { src: string; aspect: "wide" | "square" };
};

const CLIENTS: ReadonlyArray<Client> = [
  {
    name: "Hyundai Rotem",
    fullName: "Hyundai Rotem Company",
    country: "Republic of Korea",
    logo: { src: "/partners/hyundai-rotem.svg", aspect: "wide" },
  },
  {
    name: "Rotem SRS",
    fullName: "Rotem SRS",
    country: "Republic of Korea",
    logo: { src: "/partners/rotem-srs.png", aspect: "wide" },
  },
  {
    name: "Tramwaje Warszawskie",
    fullName: "Tramwaje Warszawskie Sp. z o.o.",
    country: "Poland",
    logo: { src: "/partners/tramwaje-warszawskie.svg", aspect: "wide" },
  },
  {
    name: "National Authority for Tunnels",
    fullName: "National Authority for Tunnels",
    country: "Egypt",
    logo: { src: "/partners/nat-egypt.png", aspect: "square" },
  },
  {
    name: "UZ Railways",
    fullName: "UZ Railways (Ukrzaliznytsia)",
    country: "Ukraine",
    logo: { src: "/partners/ukrzaliznytsia.svg", aspect: "wide" },
  },
  {
    name: "Kiev Metro",
    fullName: "Kyiv Metro (Toshiba / Tokyo Car Corp.)",
    country: "Ukraine",
  },
  {
    name: "KRCBW",
    fullName: "Kryukovsky Railway Car Building Works",
    country: "Ukraine",
  },
  {
    name: "TCDD Taşımacılık A.Ş.",
    fullName: "TCDD Taşımacılık A.Ş.",
    country: "Türkiye",
    logo: { src: "/partners/tcdd-tasimacilik.png", aspect: "wide" },
  },
];

type OurClientsProps = {
  overline: string;
  title: string;
  subtitle: string;
  logoArrivingNote: string;
};

export default function OurClients({
  overline,
  title,
  subtitle,
  logoArrivingNote,
}: OurClientsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();
      // M5: capture ref before cleanup so it's stable in closure
      const section = sectionRef.current;

      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll(
          "[data-header-item]"
        );
        if (prefersReduced) {
          gsap.set(headerTargets, { opacity: 1, x: 0, y: 0 });
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-client-card]");
        if (prefersReduced) {
          gsap.set(cards, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.07,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => section?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-bg="light"
      className="relative bg-[rgb(var(--color-surface))]"
      style={{
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="clients-title"
    >
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
            id="clients-title"
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
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Grid — 1 col mobile / 2 col tablet / 3 col desktop */}
        <ul
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {CLIENTS.map((c) => (
            <li
              key={c.name}
              data-client-card
              className="group relative flex flex-col justify-between bg-white opacity-0 transition-colors duration-[320ms] ease-out hover:border-[rgb(var(--color-primary)/0.5)] min-w-0 aspect-[5/4] sm:aspect-[16/9]"
              style={{
                minHeight: "160px",
                border: "1px solid rgb(var(--color-ink) / 0.10)",
                padding: "16px 18px",
              }}
              aria-label={c.fullName}
            >
              {/* Country tag — top-left */}
              <span
                className="font-heading font-semibold uppercase text-[rgb(var(--color-ink-muted))]"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                }}
              >
                {c.country}
              </span>

              {/* Logo OR text */}
              <div
                className="flex flex-1 items-center justify-center px-2"
                style={{ minHeight: "120px" }}
              >
                {c.logo ? (
                  <div
                    className="relative"
                    style={{
                      width: c.logo.aspect === "square" ? "110px" : "180px",
                      height: c.logo.aspect === "square" ? "110px" : "70px",
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      src={c.logo.src}
                      alt={c.fullName}
                      fill
                      sizes={c.logo.aspect === "square" ? "110px" : "180px"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <h4
                      className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                      style={{
                        fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.25,
                      }}
                    >
                      {c.fullName}
                    </h4>
                  </div>
                )}
              </div>

              {/* Bottom row: hairline + (placeholder note OR empty spacer) */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <span
                  aria-hidden="true"
                  className="block flex-1 transition-colors duration-[320ms] ease-out group-hover:bg-[rgb(var(--color-primary))]"
                  style={{
                    height: "1px",
                    backgroundColor: "rgb(var(--color-ink) / 0.10)",
                  }}
                />
                {!c.logo && (
                  <span
                    className="font-heading font-medium uppercase text-[rgb(var(--color-ink-muted))] whitespace-nowrap"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {logoArrivingNote}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
