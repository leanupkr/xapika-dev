"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionOverline from "@/components/ui/SectionOverline";

export type GallerySlide = {
  src: string;
  alt: string;
  caption: string;
};

type SupplyChainGalleryProps = {
  overline: string;
  title: string;
  /**
   * Exactly 13 slides in order:
   * [0]       hero (full-width)
   * [1–2]     facility (2-col)
   * [3–6]     inventory (4-col)
   * [7–8]     operations (2-col)
   * [9–12]    behind the scenes (4-col)
   */
  slides: ReadonlyArray<GallerySlide>;
};

// ─── Sub-component ────────────────────────────────────────────────────────────

function GalleryCell({
  slide,
  aspectRatio,
  sizes,
  preload = false,
}: {
  slide: GallerySlide;
  aspectRatio: string;
  sizes: string;
  preload?: boolean;
}) {
  return (
    <figure
      className="relative overflow-hidden m-0 group"
      style={{
        aspectRatio,
        backgroundColor: "rgb(var(--color-bg))",
      }}
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover transition-transform duration-[2400ms] ease-out group-hover:scale-[1.03]"
      />
      {slide.caption && (
        <figcaption
          className="absolute bottom-0 left-0 right-0 px-4 py-3 font-heading font-medium uppercase text-white select-none"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.18em",
            background:
              "linear-gradient(0deg, rgba(11,31,58,0.72) 0%, rgba(11,31,58,0) 100%)",
          }}
        >
          {slide.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function SupplyChainGallery({
  overline,
  title,
  slides,
}: SupplyChainGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Gate header reveal on section entry (top 80% of viewport)
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  // Gate gallery rows on gallery container entry
  const galleryInView = useInView(galleryRef, { once: true, amount: 0.05 });

  const reduced = prefersReducedMotion();

  const hero = slides[0];
  const facility = slides.slice(1, 3);
  const inventory = slides.slice(3, 7);
  const operations = slides.slice(7, 9);
  const behind = slides.slice(9, 13);

  // Shared stagger row variant — translate-up + fade, respects reduced-motion
  const rowVariants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: reduced ? 0 : i * 0.08,
        ease: EASE,
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      data-bg="light"
      aria-labelledby="sc-gallery-title"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        paddingTop: "clamp(3.5rem, 10vh, 8rem)",
        paddingBottom: "clamp(3.5rem, 10vh, 8rem)",
        borderTop: "1px solid rgb(var(--color-ink) / 0.06)",
      }}
    >
      {/* Header */}
      <SectionContainer className="mb-10 md:mb-14">
        <div ref={headerRef}>
          <SectionOverline
            as={motion.span}
            initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -16 }}
            animate={headerInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {overline}
          </SectionOverline>

          <motion.h2
            id="sc-gallery-title"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: reduced ? 0 : 0.1, ease: EASE }}
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "28ch",
            }}
          >
            {title}
          </motion.h2>
        </div>
      </SectionContainer>

      {/* Gallery grid */}
      <SectionContainer>
        <div ref={galleryRef} className="flex flex-col gap-3">
          {/* Row 1: Hero — full width
              모바일에서 21/8(≈2.6:1)는 너무 얕아 사진 디테일이 묻힘. 모바일은 16/9, sm부터 21/8. */}
          {hero && (
            <motion.div
              custom={0}
              variants={rowVariants}
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
            >
              <figure
                className="relative overflow-hidden m-0 group aspect-[16/9] sm:aspect-[21/8]"
                style={{ backgroundColor: "rgb(var(--color-bg))" }}
              >
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  sizes="(max-width: 1280px) 100vw, var(--max-width-content)"
                  preload
                  className="object-cover transition-transform duration-[2400ms] ease-out group-hover:scale-[1.03]"
                />
                {hero.caption && (
                  <figcaption
                    className="absolute bottom-0 left-0 right-0 px-4 py-3 font-heading font-medium uppercase text-white select-none"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.18em",
                      background:
                        "linear-gradient(0deg, rgba(11,31,58,0.72) 0%, rgba(11,31,58,0) 100%)",
                    }}
                  >
                    {hero.caption}
                  </figcaption>
                )}
              </figure>
            </motion.div>
          )}

          {/* Row 2: Facility — 2 col */}
          {facility.length > 0 && (
            <motion.div
              custom={1}
              variants={rowVariants}
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {facility.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="16 / 10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              ))}
            </motion.div>
          )}

          {/* Row 3: Inventory — 4 col */}
          {inventory.length > 0 && (
            <motion.div
              custom={2}
              variants={rowVariants}
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {inventory.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="4 / 3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </motion.div>
          )}

          {/* Row 4: Operations — 2 col */}
          {operations.length > 0 && (
            <motion.div
              custom={3}
              variants={rowVariants}
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {operations.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="16 / 10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              ))}
            </motion.div>
          )}

          {/* Row 5: Behind the scenes — 4 col */}
          {behind.length > 0 && (
            <motion.div
              custom={4}
              variants={rowVariants}
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {behind.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="4 / 3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </motion.div>
          )}
        </div>
      </SectionContainer>
    </section>
  );
}
