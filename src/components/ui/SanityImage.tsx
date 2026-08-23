import type { NewsImage } from "@/sanity/types";
import { urlFor, srcSetFor } from "@/sanity/image";
import { cn } from "@/lib/cn";

const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920];

type SanityImageProps = {
  /** Sanity `image` field (hotspot-enabled). Renders a dashed placeholder when absent. */
  image?: NewsImage | null;
  /** Overrides `image.alt`. Falls back to `""` (decorative) when neither is set. */
  alt?: string;
  sizes?: string;
  className?: string;
  widths?: number[];
  /** Label shown inside the dashed placeholder when `image` has no asset. */
  placeholder?: string;
};

/**
 * Renders a Sanity image via a raw <img> (srcSet + sizes) rather than
 * next/image — deliberate (see src/sanity/image.ts): it keeps Vercel Image
 * Optimization out of the billing path since Sanity's own CDN already
 * handles resize / format conversion / hotspot crop.
 *
 * `image` is optional/nullable because News cards frequently have no cover
 * image yet — in that case this renders the same dashed-placeholder
 * language used by PortfoliosIndex / SolutionsIndex instead of crashing or
 * leaving a blank box.
 */
export default function SanityImage({
  image,
  alt,
  sizes = "100vw",
  className,
  widths = DEFAULT_WIDTHS,
  placeholder = "Photograph arriving",
}: SanityImageProps) {
  if (!image?.asset) {
    return (
      <div
        role="img"
        aria-label={`${placeholder} — image arriving`}
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden bg-ink/5",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-3 border border-dashed border-ink/20"
        />
        <span className="px-4 text-center font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
          {placeholder}
        </span>
      </div>
    );
  }

  const src = urlFor(image)
    .width(widths[widths.length - 1])
    .auto("format")
    .quality(75)
    .url();

  return (
    <img
      src={src}
      srcSet={srcSetFor(image, widths)}
      sizes={sizes}
      alt={alt ?? image.alt ?? ""}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
