"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import PageHero from "@/components/ui/PageHero";

export type PortfolioKey = "ukraine" | "warsaw" | "uzbekistan";

export type PortfolioCardItem = {
  key: PortfolioKey;
  href: string;
  country: string;
  project: string;
  metric: string;
  summary: string;
  /** When set, renders a small "Coming" pill on the card. */
  comingBadge?: string;
  /** Optional real photograph. Falls back to dashed placeholder when omitted. */
  image?: string;
  imgAlt?: string;
};

type DownloadPdfProps = {
  label: string;
  meta: string;
  ariaLabel: string;
};

type PortfoliosIndexProps = {
  overline: string;
  title: string;
  subtitle: string;
  readMore: string;
  placeholder: string;
  items: ReadonlyArray<PortfolioCardItem>;
  downloadPdf?: DownloadPdfProps;
};

const NUMBER_BY_KEY: Record<PortfolioKey, string> = {
  ukraine: "01",
  warsaw: "02",
  uzbekistan: "03",
};

export default function PortfoliosIndex({
  overline,
  title,
  subtitle,
  readMore,
  placeholder,
  items,
  downloadPdf,
}: PortfoliosIndexProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;

      const cards = cardsRef.current.querySelectorAll("[data-portfolio-card]");
      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => cardsRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: cardsRef }
  );

  /* Active-programs counter passed as right slot */
  const activeCounter = (
    <div className="flex justify-end">
      <div className="text-right" style={{ color: "rgba(255,255,255,0.7)" }}>
        <div
          className="font-heading font-medium uppercase mb-3"
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            color: "rgb(var(--color-primary))",
          }}
        >
          Active programs
        </div>
        <div
          className="font-heading font-semibold tabular-nums leading-[1] text-white"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            letterSpacing: "-0.02em",
          }}
        >
          03
        </div>
        <div
          aria-hidden="true"
          className="ml-auto mt-4"
          style={{
            width: "60px",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.25)",
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <PageHero
        patternId="pattern-portfolios-index"
        overline={overline}
        title={title}
        subtitle={subtitle}
        rightSlot={activeCounter}
      />

      {/* CASE CARDS */}
      <section
        className="relative bg-[rgb(var(--color-bg))]"
        style={{
          paddingTop: "clamp(4rem, 10vh, 7rem)",
          paddingBottom: downloadPdf ? "clamp(2rem, 5vh, 3rem)" : "clamp(5rem, 12vh, 8rem)",
        }}
      >
        <div
          ref={cardsRef}
          className="mx-auto px-6 md:px-10 lg:px-16"
          style={{ maxWidth: "var(--max-width-content)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
            {items.map((item, i) => (
              <PortfolioLargeCard
                key={item.key}
                item={item}
                number={NUMBER_BY_KEY[item.key]}
                readMore={readMore}
                placeholder={placeholder}
                /* Make first card span full width on lg, mosaic */
                emphasized={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PDF DOWNLOAD */}
      {downloadPdf && (
        <section
          className="relative bg-[rgb(var(--color-bg))]"
          style={{
            paddingTop: "clamp(2rem, 5vh, 3rem)",
            paddingBottom: "clamp(5rem, 12vh, 8rem)",
          }}
        >
          <div
            className="mx-auto px-6 md:px-10 lg:px-16"
            style={{ maxWidth: "var(--max-width-content)" }}
          >
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6"
              style={{
                border: "1px solid rgb(var(--color-ink) / 0.10)",
                backgroundColor: "rgb(var(--color-surface))",
              }}
            >
              <div>
                <p
                  className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                  style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)", letterSpacing: "-0.01em" }}
                >
                  {downloadPdf.label}
                </p>
                <p
                  className="font-body mt-1"
                  style={{ fontSize: "0.8125rem", color: "rgb(var(--color-ink-muted))", letterSpacing: "0.02em" }}
                >
                  {downloadPdf.meta}
                </p>
              </div>
              <a
                href="/xapika-engineering-introduction.pdf"
                download
                aria-label={downloadPdf.ariaLabel}
                className="inline-flex items-center gap-2.5 px-5 py-3 font-heading font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                style={{
                  fontSize: "0.8125rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  backgroundColor: "rgb(var(--color-primary))",
                  color: "rgb(var(--color-ink))",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgb(var(--color-primary-hover, var(--color-primary)))";
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgb(var(--color-primary))";
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                <Download size={14} strokeWidth={2} aria-hidden="true" />
                Download
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function PortfolioLargeCard({
  item,
  number,
  readMore,
  placeholder,
  emphasized,
}: {
  item: PortfolioCardItem;
  number: string;
  readMore: string;
  placeholder: string;
  emphasized?: boolean;
}) {
  return (
    <Link
      data-portfolio-card
      href={item.href}
      aria-label={`${item.project} — ${item.summary}`}
      className={`group relative block opacity-0 transition-colors duration-[480ms] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-ink)/0.10)] hover:border-[rgb(var(--color-primary)/0.5)] ${
        emphasized ? "col-span-2 md:col-span-2" : ""
      }`}
    >
      {/* Photo or dashed placeholder */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: emphasized ? "21 / 9" : "16 / 10",
          backgroundColor: "rgb(var(--color-ink))",
        }}
        role="img"
        aria-label={
          item.image
            ? item.imgAlt ?? `${item.project} photograph`
            : `${item.project} photograph placeholder — image arriving`
        }
      >
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.imgAlt ?? ""}
              fill
              sizes={
                emphasized
                  ? "(max-width: 768px) 100vw, 1100px"
                  : "(max-width: 768px) 100vw, 560px"
              }
              quality={85}
              priority={emphasized}
              className="object-cover transition-transform duration-[480ms] ease-out group-hover:scale-[1.04]"
            />
            {/* Dark gradient overlay so the top/bottom overlays stay legible */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,31,58,0.45) 0%, rgba(11,31,58,0.10) 35%, rgba(11,31,58,0.10) 65%, rgba(11,31,58,0.55) 100%)",
              }}
            />
          </>
        ) : (
          <>
            {/* Background ink + subtle pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-transform duration-[480ms] ease-out group-hover:scale-[1.04]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 75% 90%, rgba(246,163,23,0.10) 0%, transparent 65%)",
              }}
            />

            {/* Rail grid micro-pattern inside photo */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-[480ms] ease-out group-hover:scale-[1.04]"
              style={{ opacity: 0.06 }}
            >
              <defs>
                <pattern
                  id={`rail-grid-card-${item.key}`}
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <line x1="15" y1="0" x2="15" y2="60" stroke="#fff" strokeWidth="1" />
                  <line x1="45" y1="0" x2="45" y2="60" stroke="#fff" strokeWidth="1" />
                  <line x1="0" y1="20" x2="60" y2="20" stroke="#fff" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="60" y2="40" stroke="#fff" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#rail-grid-card-${item.key})`} />
            </svg>

            {/* Dashed inner frame */}
            <div
              aria-hidden="true"
              className="absolute inset-3"
              style={{
                border: "1.5px dashed rgba(255,255,255,0.22)",
              }}
            />

            {/* Centered glyph + microcopy */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6 text-center">
              <svg
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <rect
                  x="7"
                  y="14"
                  width="34"
                  height="22"
                  rx="1.5"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.25"
                />
                <line
                  x1="7"
                  y1="22"
                  x2="41"
                  y2="22"
                  stroke="rgba(255,255,255,0.32)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <circle
                  cx="16"
                  cy="29"
                  r="2.5"
                  fill="rgb(var(--color-primary))"
                  fillOpacity="0.9"
                />
              </svg>
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
          </>
        )}

        {/* Number + country — top overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 z-10">
          <span
            className="font-heading font-medium tabular-nums"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "rgb(var(--color-primary))",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {number} / 03
          </span>
          <span
            className="font-heading font-medium uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {item.country}
          </span>
        </div>

        {/* Coming pill — bottom-left overlay */}
        {item.comingBadge ? (
          <div
            className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 px-2.5 py-1.5"
            style={{
              backgroundColor: "rgba(246,163,23,0.18)",
              border: "1px solid rgba(246,163,23,0.6)",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block rounded-full"
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "rgb(var(--color-primary))",
              }}
            />
            <span
              className="font-heading font-medium uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: "rgb(var(--color-primary))",
              }}
            >
              {item.comingBadge}
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div
        className={`${
          emphasized
            ? "px-4 md:px-8 py-4 md:py-9"
            : "px-3.5 md:px-8 py-4 md:py-9"
        }`}
        style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.08)" }}
      >
        <h2
          className="font-heading font-semibold text-[rgb(var(--color-ink))] transition-colors duration-300 group-hover:text-[rgb(var(--color-primary))]"
          style={{
            fontSize: emphasized
              ? "clamp(1.25rem, 2.4vw, 1.75rem)"
              : "clamp(1rem, 2.4vw, 1.75rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.18,
          }}
        >
          {item.project}
        </h2>
        <p
          className="font-body text-[rgb(var(--color-ink-muted))] mt-2 md:mt-3 line-clamp-3 md:line-clamp-none"
          style={{
            fontSize: "clamp(0.8125rem, 1vw, 1rem)",
            lineHeight: 1.55,
            maxWidth: "52ch",
          }}
        >
          {item.summary}
        </p>

        {/* Footer row */}
        <div
          className="flex items-end justify-between gap-2 md:gap-4 mt-3 md:mt-7 pt-3 md:pt-5"
          style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.06)" }}
        >
          <div
            className="font-heading font-medium tabular-nums text-[10px] md:text-[12px]"
            style={{
              letterSpacing: "0.16em",
              color: "rgb(var(--color-ink-muted))",
              textTransform: "uppercase",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.metric}
          </div>
          <span
            className="inline-flex items-center gap-1.5 md:gap-2 font-heading font-medium text-[rgb(var(--color-ink))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300 text-[11px] md:text-[13px] whitespace-nowrap"
            style={{ letterSpacing: "0.02em" }}
          >
            {readMore}
            <ArrowRight
              size={12}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      {/* Bottom accent — primary on hover */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 origin-left scale-x-0 transition-transform duration-[480ms] group-hover:scale-x-100"
        style={{
          height: "2px",
          backgroundColor: "rgb(var(--color-primary))",
        }}
      />
    </Link>
  );
}
