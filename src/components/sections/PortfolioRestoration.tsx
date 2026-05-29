"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type RestorationPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type RestorationStat = {
  value: string;
  valueSuffix?: string;
  description: string;
};

type PortfolioRestorationProps = {
  overline: string;
  title: string;
  intro: string;
  establishing: RestorationPhoto;
  establishingMeta?: string;
  grid: ReadonlyArray<RestorationPhoto>;
  stat: RestorationStat;
  footnote?: string;
};

const CORNER_POSITIONS = [
  { top: 8, left: 8 },
  { top: 8, right: 8 },
  { bottom: 8, left: 8 },
  { bottom: 8, right: 8 },
] as const;

function CornerTicks({ size = 10 }: { size?: number }) {
  return (
    <>
      {CORNER_POSITIONS.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute block pointer-events-none"
          style={{
            top: "top" in pos ? pos.top : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            width: size,
            height: size,
            borderTop:
              "top" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderBottom:
              "bottom" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderLeft:
              "left" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderRight:
              "right" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
          }}
        />
      ))}
    </>
  );
}

export default function PortfolioRestoration({
  overline,
  title,
  intro,
  establishing,
  establishingMeta,
  grid,
  stat,
  footnote,
}: PortfolioRestorationProps) {
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
          stagger: 0.06,
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

  const totalShots = grid.length + 1;

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(3.5rem, 10vh, 8rem)",
        paddingBottom: "clamp(3.5rem, 10vh, 8rem)",
      }}
      aria-labelledby="portfolio-restoration-title"
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
        className="absolute top-0 left-0 w-[45%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 30%, rgba(200,16,46,0.05) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-start mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <span
              data-fade
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
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
              id="portfolio-restoration-title"
              data-fade
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p
              data-fade
              className="font-body"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
                maxWidth: "52ch",
              }}
            >
              {intro}
            </p>
          </div>
        </div>

        {/* Establishing photo */}
        <div
          data-fade
          className="relative overflow-hidden mb-3 md:mb-4"
          style={{
            aspectRatio: "16 / 9",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <Image
            src={establishing.src}
            alt={establishing.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            quality={85}
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "45%",
              background:
                "linear-gradient(180deg, rgba(11,31,58,0) 0%, rgba(11,31,58,0.65) 100%)",
            }}
          />
          <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4 pointer-events-none">
            <div className="flex flex-col gap-1">
              <span
                className="font-heading font-medium uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.28em",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                01 / {String(totalShots).padStart(2, "0")}
              </span>
              <span
                className="font-heading font-medium uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {establishing.caption ?? "Establishing shot"}
              </span>
            </div>
            {establishingMeta ? (
              <span
                className="font-heading font-medium uppercase hidden sm:inline"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {establishingMeta}
              </span>
            ) : null}
          </div>
          <CornerTicks size={12} />
        </div>

        {/* Grid */}
        <ul
          role="list"
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-14 md:mb-20"
        >
          {grid.map((photo, i) => {
            const stampIndex = String(i + 2).padStart(2, "0");
            const total = String(totalShots).padStart(2, "0");
            return (
              <li
                key={photo.src}
                data-fade
                className="relative overflow-hidden group"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={80}
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                  style={{
                    transformOrigin: "center",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    height: "55%",
                    background:
                      "linear-gradient(180deg, rgba(11,31,58,0) 0%, rgba(11,31,58,0.7) 100%)",
                  }}
                />
                <div className="absolute left-3 bottom-3 right-3 flex flex-col gap-0.5 pointer-events-none">
                  <span
                    className="font-heading font-medium uppercase"
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.28em",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {stampIndex} / {total}
                  </span>
                  {photo.caption ? (
                    <span
                      className="font-heading font-medium uppercase"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.22em",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {photo.caption}
                    </span>
                  ) : null}
                </div>
                <CornerTicks size={7} />
              </li>
            );
          })}
        </ul>

        {/* Stat strip */}
        <div
          data-fade
          className="relative"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "clamp(1.5rem, 3vh, 2.5rem)",
            paddingBottom: "clamp(1.5rem, 3vh, 2.5rem)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
            <div className="flex items-baseline gap-3">
              <span
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(2.75rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: "rgb(var(--color-primary))",
                }}
              >
                {stat.value}
              </span>
              {stat.valueSuffix ? (
                <span
                  className="font-heading font-medium uppercase"
                  style={{
                    fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {stat.valueSuffix}
                </span>
              ) : null}
            </div>
            <div
              aria-hidden="true"
              className="hidden md:block flex-shrink-0"
              style={{
                width: "1px",
                height: "56px",
                backgroundColor: "rgba(255,255,255,0.18)",
              }}
            />
            <p
              className="font-heading font-medium uppercase"
              style={{
                fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.55,
                maxWidth: "44ch",
              }}
            >
              {stat.description}
            </p>
          </div>
        </div>

        {footnote ? (
          <p
            className="font-body italic mt-6 text-right"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
