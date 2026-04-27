"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type SectionLabels = {
  story: string;
  stats: string;
  photos: string;
  cta: string;
};

type PortfolioDetailPlaceholderProps = {
  sectionLabels: SectionLabels;
  placeholder: string;
  ctaLabel: string;
  ctaHref?: string;
};

export default function PortfolioDetailPlaceholder({
  sectionLabels,
  placeholder,
  ctaLabel,
  ctaHref = "/contact",
}: PortfolioDetailPlaceholderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!wrapRef.current) return;
      const blocks = wrapRef.current.querySelectorAll("[data-detail-block]");
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
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
      return () => {
        ScrollTrigger.getAll()
          .filter((st) => wrapRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: wrapRef }
  );

  return (
    <section
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(4rem, 10vh, 7rem)",
        paddingBottom: "clamp(4rem, 10vh, 7rem)",
      }}
    >
      <div
        ref={wrapRef}
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "1280px" }}
      >
        {/* 01 — Story (full row, paragraphs) */}
        <div data-detail-block className="opacity-0">
          <Block
            kicker="01"
            label={sectionLabels.story}
            placeholder={placeholder}
            variant="paragraphs"
          />
        </div>

        {/* 02 — Stats + 03 — Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-14 md:mt-20">
          <div data-detail-block className="lg:col-span-5 opacity-0">
            <Block
              kicker="02"
              label={sectionLabels.stats}
              placeholder={placeholder}
              variant="stats"
            />
          </div>
          <div data-detail-block className="lg:col-span-7 opacity-0">
            <Block
              kicker="03"
              label={sectionLabels.photos}
              placeholder={placeholder}
              variant="photos"
            />
          </div>
        </div>

        {/* 04 — CTA */}
        <div
          data-detail-block
          className="mt-14 md:mt-24 opacity-0"
          style={{
            borderTop: "1px solid rgb(var(--color-ink) / 0.08)",
            paddingTop: "clamp(3rem, 7vh, 4.5rem)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <span
                className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
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
                04
              </span>
              <h2
                className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                style={{
                  fontSize: "clamp(1.625rem, 3.2vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {sectionLabels.cta}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-3 px-6 py-4 bg-[rgb(var(--color-ink))] text-white font-heading font-semibold transition-colors duration-300 hover:bg-[rgb(var(--color-primary))]"
                style={{ fontSize: "14px", letterSpacing: "0.05em" }}
              >
                {ctaLabel}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type BlockProps = {
  kicker: string;
  label: string;
  placeholder: string;
  variant: "paragraphs" | "stats" | "photos";
};

function Block({ kicker, label, placeholder, variant }: BlockProps) {
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-6">
        <span
          className="font-heading font-medium tabular-nums text-[rgb(var(--color-primary))]"
          style={{
            fontSize: "12px",
            letterSpacing: "0.22em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {kicker}
        </span>
        <h2
          className="font-heading font-semibold text-[rgb(var(--color-ink))]"
          style={{
            fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.15,
          }}
        >
          {label}
        </h2>
      </div>

      <div
        className="relative"
        style={{
          border: "1.5px dashed rgb(var(--color-ink-muted) / 0.35)",
          backgroundColor: "rgb(var(--color-surface))",
          padding: "clamp(1.75rem, 4vw, 2.75rem)",
          minHeight:
            variant === "paragraphs" ? "240px" : variant === "stats" ? "260px" : "300px",
        }}
        role="img"
        aria-label={`${label} placeholder — content arriving`}
      >
        <div
          className="flex items-center gap-2.5 mb-6"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgb(var(--color-ink-muted))",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "rgb(var(--color-primary))",
              boxShadow: "0 0 0 3px rgb(var(--color-primary) / 0.15)",
            }}
          />
          {placeholder}
        </div>

        {variant === "paragraphs" && <ParagraphBars />}
        {variant === "stats" && <StatBars />}
        {variant === "photos" && <PhotoGrid />}

        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
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
    </div>
  );
}

function ParagraphBars() {
  const rows = [
    [94, 88, 76],
    [90, 82, 68],
  ];
  return (
    <div className="space-y-7" style={{ maxWidth: "640px" }}>
      {rows.map((row, pi) => (
        <div key={pi} className="space-y-3">
          {row.map((width, bi) => (
            <div
              key={bi}
              style={{
                width: `${width}%`,
                height: bi === 0 && pi === 0 ? "12px" : "10px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.10)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function StatBars() {
  const items = [
    { value: 86, label: 92 },
    { value: 70, label: 80 },
    { value: 52, label: 68 },
  ];
  return (
    <div className="space-y-6">
      {items.map((s, i) => (
        <div key={i} className="flex items-center gap-4">
          <div
            className="font-heading font-semibold tabular-nums text-[rgb(var(--color-ink)/0.18)]"
            style={{
              fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
              letterSpacing: "-0.02em",
              minWidth: "3.5ch",
            }}
          >
            ——
          </div>
          <div className="flex-1 space-y-2">
            <div
              style={{
                width: `${s.label}%`,
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.10)",
              }}
            />
            <div
              style={{
                width: `${s.value}%`,
                height: "6px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-ink) / 0.06)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotoGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { aspect: "4 / 3" },
        { aspect: "4 / 3" },
        { aspect: "16 / 9" },
        { aspect: "16 / 9" },
      ].map((p, i) => (
        <div
          key={i}
          className={`relative ${i >= 2 ? "col-span-1" : ""}`}
          style={{
            aspectRatio: p.aspect,
            border: "1px solid rgb(var(--color-ink) / 0.08)",
            backgroundColor: "rgb(var(--color-bg))",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgb(var(--color-ink) / 0.05) 0%, transparent 65%), radial-gradient(ellipse at 75% 90%, rgb(var(--color-primary) / 0.06) 0%, transparent 60%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-heading font-medium uppercase"
              style={{
                fontSize: "9px",
                letterSpacing: "0.22em",
                color: "rgb(var(--color-ink-muted))",
              }}
            >
              PHOTO 0{i + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
