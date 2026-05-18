"use client";

import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

type PortfolioHeroProps = {
  overline: string;
  title: string;
  subtitle: string;
  index: string;
  /** When set, renders a small accent badge in the top-right (e.g., "Uninterrupted Since War", "Coming 2026.05"). */
  accentBadge?: string;
  /** Photo placeholder microcopy (e.g., "Site photograph arriving"). */
  placeholder: string;
  /** Visual hint shown above placeholder (country / year). */
  placeholderKicker?: string;
  /** When set, renders an actual photograph in the right slot instead of the placeholder. */
  imageSrc?: string;
  imageAlt?: string;
  /** Mark the hero photo as LCP priority. Set true on the page-level hero image. */
  imagePriority?: boolean;
  /** Custom node for the right slot (e.g., Uzbekistan route map). Overrides photo/placeholder. */
  rightSlot?: React.ReactNode;
};

export default function PortfolioHero({
  overline,
  title,
  subtitle,
  index,
  accentBadge,
  placeholder,
  placeholderKicker,
  imageSrc,
  imageAlt,
  imagePriority,
  rightSlot,
}: PortfolioHeroProps) {
  /* Photo slot — actual image when provided, else dashed placeholder */
  const photoSlot = rightSlot ? (
    rightSlot
  ) : imageSrc ? (
    <div
      className="relative ml-auto overflow-hidden"
      style={{
        aspectRatio: "4 / 3",
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "rgba(255,255,255,0.02)",
      }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        priority={imagePriority ?? false}
        quality={85}
        className="object-cover"
      />
      {/* Subtle inner overlay to anchor with dark hero theme */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,31,58,0) 60%, rgba(11,31,58,0.32) 100%)",
        }}
      />
      {/* Corner ticks — preserve framing motif even with real photo */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute block pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: "10px",
            height: "10px",
            borderTop:
              pos.top !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderBottom:
              pos.bottom !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderLeft:
              pos.left !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderRight:
              pos.right !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
          }}
        />
      ))}
    </div>
  ) : (
    <div
      className="relative ml-auto"
      style={{
        aspectRatio: "4 / 3",
        width: "100%",
        maxWidth: "420px",
        border: "1.5px dashed rgba(255,255,255,0.22)",
        backgroundColor: "rgba(255,255,255,0.02)",
      }}
      role="img"
      aria-label={`${placeholder} — image arriving`}
    >
      {/* Inner gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.04) 0%, transparent 65%), radial-gradient(ellipse at 75% 90%, rgba(246,163,23,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Centered glyph + microcopy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <svg
          aria-hidden="true"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
        >
          <rect
            x="6"
            y="12"
            width="32"
            height="22"
            rx="1.5"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.25"
          />
          <line
            x1="6"
            y1="20"
            x2="38"
            y2="20"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <circle
            cx="14"
            cy="27"
            r="2.25"
            fill="rgb(var(--color-primary))"
            fillOpacity="0.85"
          />
        </svg>
        {placeholderKicker ? (
          <span
            className="font-heading font-medium uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {placeholderKicker}
          </span>
        ) : null}
        <span
          className="font-heading font-medium uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {placeholder}
        </span>
      </div>

      {/* Corner ticks */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: "8px",
            height: "8px",
            borderTop:
              pos.top !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderBottom:
              pos.bottom !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderLeft:
              pos.left !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderRight:
              pos.right !== undefined
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
          }}
        />
      ))}
    </div>
  );

  return (
    /* Wrapper div allows the accent badge to be absolutely positioned over the hero */
    <div className="relative">
      <PageHero
        patternId={`pattern-portfolio-${index.replace(/[^a-z0-9]/gi, "")}`}
        overline={`${overline} ${index}`}
        title={title}
        subtitle={subtitle}
        rightSlot={photoSlot}
        variant="tall"
      />

      {/* Accent badge — top-right overlay (per-program: war record, coming-soon, etc.) */}
      {accentBadge ? (
        <div
          className="absolute hidden md:flex items-center gap-3"
          style={{
            top: "clamp(5.5rem, 11vh, 7.5rem)",
            right: "clamp(1.5rem, 4vw, 4rem)",
            zIndex: 20,
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block"
            style={{
              width: "32px",
              height: "1.5px",
              backgroundColor: "rgb(var(--color-primary))",
            }}
          />
          <span
            className="font-heading font-medium uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "rgb(var(--color-primary))",
            }}
          >
            {accentBadge}
          </span>
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "rgb(var(--color-primary))",
              boxShadow: "0 0 0 4px rgb(246 163 23 / 0.18)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
