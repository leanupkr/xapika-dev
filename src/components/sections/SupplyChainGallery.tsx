import Image from "next/image";

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
  const hero = slides[0];
  const facility = slides.slice(1, 3);
  const inventory = slides.slice(3, 7);
  const operations = slides.slice(7, 9);
  const behind = slides.slice(9, 13);

  return (
    <section
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
      <div
        className="mx-auto px-6 md:px-10 lg:px-16 mb-10 md:mb-14"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <span
          className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
          style={{ fontSize: "13px", letterSpacing: "0.2em" }}
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
          id="sc-gallery-title"
          className="font-heading font-semibold text-[rgb(var(--color-ink))]"
          style={{
            fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxWidth: "28ch",
          }}
        >
          {title}
        </h2>
      </div>

      {/* Gallery grid */}
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="flex flex-col gap-3">
          {/* Row 1: Hero — full width */}
          {hero && (
            <GalleryCell
              slide={hero}
              aspectRatio="21 / 8"
              sizes="(max-width: 1280px) 100vw, var(--max-width-content)"
              preload
            />
          )}

          {/* Row 2: Facility — 2 col */}
          {facility.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facility.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="16 / 10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              ))}
            </div>
          )}

          {/* Row 3: Inventory — 4 col */}
          {inventory.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {inventory.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="4 / 3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          )}

          {/* Row 4: Operations — 2 col */}
          {operations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {operations.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="16 / 10"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
              ))}
            </div>
          )}

          {/* Row 5: Behind the scenes — 4 col */}
          {behind.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {behind.map((slide) => (
                <GalleryCell
                  key={slide.src}
                  slide={slide}
                  aspectRatio="4 / 3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
