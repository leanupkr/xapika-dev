"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/useMediaQuery";
import SectionContainer from "@/components/ui/SectionContainer";
import CornerTicks from "@/components/ui/CornerTicks";

export type GallerySlide = {
  overline: string;
  caption: string;
  metric: string;
  /** When set, renders an actual photograph in this slide instead of the dashed placeholder. */
  src?: string;
  alt?: string;
};

type PortfolioScrollGalleryProps = {
  sectionLabel: string;
  sectionTitle: string;
  slides: ReadonlyArray<GallerySlide>;
  /** Index of the slide that should render the "Since War" accent-line marker (Ukraine slide 3). */
  markerSlideIndex?: number;
  /** Microcopy beneath each photo placeholder ("Photo · HRCS2 depot, Ukraine"). */
  photoCaption: string;
};

// Sticky-scroll gallery: the section reserves slides.length * 100vh of outer
// page space so the user simply scrolls the page. A sticky inner panel pins
// the active slide to the viewport while the page scrolls; the active slide
// is computed from the section's offset within the viewport. No inner snap
// container, no wheel/touch hijacking — outer scroll always passes through.
export default function PortfolioScrollGallery({
  sectionLabel,
  sectionTitle,
  slides,
  markerSlideIndex,
  photoCaption,
}: PortfolioScrollGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Tailwind md: breakpoint is 768px. Use (max-width: 767.98px) to align without
  // the 1px overlap that "(max-width: 767px)" produces at exactly 768px.
  const isMobile = useMediaQuery("(max-width: 767.98px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    // Mobile branch renders a simple card list and doesn't use activeIndex;
    // skip registering scroll/resize listeners entirely.
    if (isMobile) return;

    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      // Progress (in slide units) since the section's top crossed the viewport top.
      // 0 → first slide, slides.length-1 → last slide.
      const progress = -rect.top / viewportHeight;
      const idx = Math.max(
        0,
        Math.min(slides.length - 1, Math.round(progress)),
      );
      setActiveIndex(idx);
    }

    function onResize() {
      requestAnimationFrame(onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, slides.length]);

  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    slides.length,
  ).padStart(2, "0")}`;

  // Mobile branch: simple vertical card list (avoids sticky-scroll layered absolute issues)
  if (isMobile) {
    return (
      <section
        data-bg="dark"
        className="relative"
        style={{ backgroundColor: "rgb(var(--color-ink))", paddingTop: "2.25rem", paddingBottom: "2.25rem" }}
      >
        <div className="px-6 mb-6">
          <span
            className="flex items-center gap-3 font-heading font-medium uppercase text-white/80"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            <span
              aria-hidden="true"
              className="inline-block flex-shrink-0"
              style={{ width: "24px", height: "2px", backgroundColor: "rgb(var(--color-primary))" }}
            />
            {sectionLabel}
          </span>
          <h2
            className="font-heading font-semibold text-white mt-4"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            {sectionTitle}
          </h2>
        </div>
        <ol className="px-6 space-y-4">
          {slides.map((slide, i) => (
            <li key={i} className="relative">
              <div className="w-full aspect-[16/10] bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden relative">
                {slide.src ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt ?? slide.caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm text-center overflow-hidden px-4">
                    {photoCaption}
                  </div>
                )}
                {markerSlideIndex === i && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] text-[10px] font-heading font-semibold uppercase tracking-wider rounded">
                    Since War
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p
                  className="font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
                  style={{ fontSize: "10px", letterSpacing: "0.22em" }}
                >
                  {slide.overline}
                </p>
                <p
                  className="font-body text-white/85 mt-2"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
                >
                  {slide.caption}
                </p>
                <p
                  className="font-heading text-white/55 mt-1"
                  style={{ fontSize: "0.8125rem", letterSpacing: "0.05em" }}
                >
                  {slide.metric}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="relative"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        height: `${slides.length * 100}vh`,
      }}
      aria-label={sectionTitle}
    >
      {/* Sticky inner panel — pinned to viewport while the section is scrolled through */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100vh",
          backgroundColor: "rgb(var(--color-ink))",
        }}
      >
        {/* Top hairline */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 z-10"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
        />
        {/* Bottom hairline */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
        />

        {/* Persistent header overlay */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{ paddingTop: "clamp(1.5rem, 4vh, 2.75rem)" }}
        >
          <SectionContainer className="flex items-center gap-4">
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase text-white/80"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
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
              {sectionLabel}
            </span>
            <span
              className="font-heading font-medium tabular-nums text-white/45"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                fontVariantNumeric: "tabular-nums",
                transition: "color 300ms",
              }}
              aria-live="polite"
            >
              {counter}
            </span>
          </SectionContainer>
        </div>

        {/* Right dot indicators */}
        <div
          aria-hidden="true"
          className="absolute z-20 flex flex-col gap-3"
          style={{
            right: "clamp(1.25rem, 3vw, 2.5rem)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {slides.map((_, i) => (
            <span
              key={i}
              className="block"
              style={{
                width: i === activeIndex ? "10px" : "6px",
                height: i === activeIndex ? "10px" : "6px",
                borderRadius: "50%",
                backgroundColor:
                  i === activeIndex
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.22)",
                boxShadow:
                  i === activeIndex
                    ? "0 0 0 4px rgb(246 163 23 / 0.18)"
                    : "none",
                transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>

        {/* Slides — stacked as absolute layers; only the active layer is visible */}
        <div className="relative w-full h-full">
          {slides.map((slide, i) => {
            const isActive = activeIndex === i;
            const showActive = reducedMotion || isActive;
            const isMarker = markerSlideIndex === i;
            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${slides.length} — ${slide.caption}`}
                aria-hidden={!isActive}
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  transition:
                    "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <SectionContainer className="w-full grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
                  {/* Photo */}
                  <div className="lg:col-span-7">
                    <div
                      className="relative w-full overflow-hidden"
                      role="img"
                      aria-label={
                        slide.src
                          ? slide.alt ?? slide.caption
                          : `${photoCaption} — image arriving`
                      }
                      style={{
                        aspectRatio: "16 / 10",
                        border: slide.src
                          ? "none"
                          : "1.5px dashed rgba(255,255,255,0.22)",
                        backgroundColor: "rgba(255,255,255,0.015)",
                        transform: showActive ? "scale(1)" : "scale(0.985)",
                        transition:
                          "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {slide.src ? (
                        <>
                          <Image
                            src={slide.src}
                            alt={slide.alt ?? slide.caption}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            quality={85}
                            priority={i === 0}
                            className="object-cover"
                          />
                          {/* Marker overlay — slightly darker for "Since War" emphasis */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: isMarker
                                ? "linear-gradient(180deg, rgba(11,31,58,0.10) 0%, rgba(11,31,58,0.35) 100%)"
                                : "linear-gradient(180deg, rgba(11,31,58,0) 0%, rgba(11,31,58,0.20) 100%)",
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {/* Inner glow */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                              background: isMarker
                                ? "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(246,163,23,0.14) 0%, transparent 55%)"
                                : "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.04) 0%, transparent 65%), radial-gradient(ellipse at 75% 85%, rgba(246,163,23,0.07) 0%, transparent 60%)",
                            }}
                          />
                          {/* Centered glyph */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                            <svg
                              aria-hidden="true"
                              width="48"
                              height="48"
                              viewBox="0 0 48 48"
                              fill="none"
                            >
                              <rect
                                x="6"
                                y="12"
                                width="36"
                                height="24"
                                rx="1.5"
                                stroke="rgba(255,255,255,0.42)"
                                strokeWidth="1.25"
                              />
                              <line
                                x1="6"
                                y1="22"
                                x2="42"
                                y2="22"
                                stroke="rgba(255,255,255,0.30)"
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
                            <span
                              className="font-heading font-medium uppercase tabular-nums text-white/45"
                              style={{
                                fontSize: "10px",
                                letterSpacing: "0.22em",
                              }}
                            >
                              {`Slide ${String(i + 1).padStart(2, "0")}`}
                            </span>
                            <span
                              className="font-heading font-medium uppercase text-white/55"
                              style={{
                                fontSize: "10px",
                                letterSpacing: "0.22em",
                              }}
                            >
                              {photoCaption}
                            </span>
                          </div>
                        </>
                      )}
                      {/* Corner ticks — always render */}
                      <CornerTicks size={10} />
                    </div>
                  </div>

                  {/* Caption */}
                  <div
                    className="lg:col-span-5 flex flex-col justify-center gap-5"
                    style={{
                      transform: showActive
                        ? "translateY(0)"
                        : "translateY(18px)",
                      transition:
                        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms",
                    }}
                  >
                    <span
                      className="flex items-center gap-3 font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
                      style={{ fontSize: "12px", letterSpacing: "0.22em" }}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block flex-shrink-0"
                        style={{
                          width: "20px",
                          height: "2px",
                          backgroundColor: "rgb(var(--color-primary))",
                        }}
                      />
                      {slide.overline}
                    </span>
                    <h3
                      className="font-heading font-semibold text-white"
                      style={{
                        fontSize: isMarker
                          ? "clamp(1.625rem, 3.4vw, 2.875rem)"
                          : "clamp(1.5rem, 2.9vw, 2.375rem)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.18,
                        maxWidth: "20ch",
                      }}
                    >
                      {slide.caption}
                    </h3>

                    {isMarker ? (
                      <div className="mt-2 flex items-center gap-4">
                        <span
                          aria-hidden="true"
                          className="block flex-shrink-0"
                          style={{
                            height: "2px",
                            width: showActive ? "140px" : "0px",
                            maxWidth: "40vw",
                            backgroundColor: "rgb(var(--color-primary))",
                            boxShadow: "0 0 12px rgb(246 163 23 / 0.45)",
                            transition:
                              "width 1100ms cubic-bezier(0.16, 1, 0.3, 1) 220ms",
                          }}
                        />
                        <span
                          className="font-heading font-medium uppercase tabular-nums whitespace-nowrap"
                          style={{
                            fontSize: "12px",
                            letterSpacing: "0.24em",
                            color: "rgb(var(--color-primary))",
                            opacity: showActive ? 1 : 0,
                            transition: "opacity 500ms ease-out 700ms",
                          }}
                        >
                          {slide.metric}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-baseline gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block"
                          style={{
                            width: "12px",
                            height: "1.5px",
                            backgroundColor: "rgb(var(--color-primary))",
                            transform: "translateY(-4px)",
                          }}
                        />
                        <span
                          className="font-heading font-medium tabular-nums text-[rgb(var(--color-primary))]"
                          style={{
                            fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                            letterSpacing: "-0.005em",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {slide.metric}
                        </span>
                      </div>
                    )}
                  </div>
                </SectionContainer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
