import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroClient from "./HeroClient";
import "@/styles/hero.css";

const SLIDES = [
  {
    src: "/hero/hero-02-work.jpg",
    alt: "Xapika Engineering maintenance depot",
  },
  {
    src: "/hero/hero-01-wide.jpg",
    alt: "Xapika Engineering maintenance depot",
  },
  {
    src: "/hero/hero-03-detail.jpg",
    alt: "Xapika Engineering maintenance depot",
  },
] as const;

type HeroProps = {
  headline: string;
  headlineAccent: string;
  subheadline: string;
  overline: string;
  ctaSolutions: string;
  ctaContact: string;
  ctaSolutionsHref: string;
  ctaContactHref: string;
  pauseAriaLabel: string;
  playAriaLabel: string;
};

function renderHeadline(text: string, accent: string) {
  const fullText = text;
  const accentIndex = fullText.indexOf(accent);

  if (accentIndex === -1) {
    return fullText.split(" ").map((word, i, arr) => (
      <span
        key={i}
        data-word
        className="inline-block"
        style={{ marginRight: i < arr.length - 1 ? "0.25em" : 0 }}
      >
        {word}
      </span>
    ));
  }

  const before = fullText.slice(0, accentIndex);
  const after = fullText.slice(accentIndex + accent.length);
  const beforeWords = before.trim().split(" ").filter(Boolean);
  const accentWords = accent.trim().split(" ").filter(Boolean);

  return (
    <>
      {beforeWords.map((word, i) => (
        <span
          key={`b-${i}`}
          data-word
          className="inline-block"
          style={{ marginRight: "0.25em" }}
        >
          {word}
        </span>
      ))}
      <br />
      {accentWords.map((word, i) => (
        <span
          key={`a-${i}`}
          data-word
          className="inline-block"
          style={{
            color: "rgb(var(--color-primary))",
            marginRight:
              i < accentWords.length - 1 || after.trim() ? "0.25em" : 0,
          }}
        >
          {word}
        </span>
      ))}
      {after
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word, i, arr) => (
          <span
            key={`e-${i}`}
            data-word
            className="inline-block"
            style={{ marginRight: i < arr.length - 1 ? "0.25em" : 0 }}
          >
            {word}
          </span>
        ))}
    </>
  );
}

export default function Hero({
  headline,
  headlineAccent,
  subheadline,
  overline,
  ctaSolutions,
  ctaContact,
  ctaSolutionsHref,
  ctaContactHref,
  pauseAriaLabel,
  playAriaLabel,
}: HeroProps) {
  return (
    <>
    {/* dvh fallback: hero.css sets 100vh/100svh; this block overrides with
        100vh (fallback) then 100dvh (modern — iOS 15.4+, excludes browser UI bars).
        Specificity [0,2,0] beats .hero-slideshow [0,1,0] regardless of source order. */}
    <style>{`
      .hero-slideshow[data-hero-section] {
        height: min(100vh, 880px);
        height: min(100dvh, 880px);
        min-height: 560px;
      }
    `}</style>
    <section
      data-hero-section
      className="hero-slideshow"
      aria-label="Hero section"
    >
      {/* 배경 슬라이드쇼 */}
      {SLIDES.map((slide, i) => (
        <div key={i} className="hero-slide">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="hero-slide__img"
            priority={i === 0}
            sizes="100vw"
            quality={i === 0 ? 75 : 65}
          />
        </div>
      ))}

      {/* 콘텐츠 — SSR로 즉시 visible (opacity-0 없음 → LCP element 즉시 paint) */}
      <div className="hero-content">
        <div
          className="w-full pb-[clamp(5rem,16vh,11rem)] md:pb-[clamp(3rem,6vw,5rem)]"
          style={{ maxWidth: "56rem" }}
        >
          <span
            data-hero-overline
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6"
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.90)",
            }}
          >
            <span
              className="inline-block flex-shrink-0"
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "rgb(var(--color-primary))",
              }}
            />
            {overline}
          </span>

          <h1
            data-hero-headline
            aria-label={headline}
            className="font-heading font-bold text-white mb-8 max-w-full"
            style={{
              fontSize: "clamp(1.75rem, 7.5vw, 7.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 0.97,
            }}
          >
            {renderHeadline(headline, headlineAccent)}
          </h1>

          <p
            data-hero-sub
            className="font-body mb-10"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "min(520px, calc(100vw - 3rem))",
              lineHeight: 1.6,
            }}
          >
            {subheadline}
          </p>

          <div data-hero-cta className="flex flex-wrap gap-4">
            <Link
              href={ctaSolutionsHref}
              aria-label={ctaSolutions}
              className="inline-flex items-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 hero-cta-primary"
              style={{
                fontSize: "15px",
                padding: "14px 28px",
                backgroundColor: "rgb(var(--color-primary))",
                color: "#fff",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(246,163,23,0.35)",
              }}
            >
              {ctaSolutions}
              <ArrowRight size={16} strokeWidth={2} />
            </Link>

            <Link
              href={ctaContactHref}
              aria-label={ctaContact}
              className="inline-flex items-center gap-2 font-heading font-medium rounded-lg transition-all duration-200 backdrop-blur-sm hero-cta-ghost"
              style={{
                fontSize: "15px",
                padding: "14px 28px",
                border: "1px solid rgba(255,255,255,0.35)",
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "#fff",
              }}
            >
              {ctaContact}
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 그라데이션 — 다음 섹션과 자연스러운 전환 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none h-[80px] md:h-[160px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(11,31,58,0.70) 50%, #0b1f3a 100%)",
        }}
      />

      {/* Client island — pause 버튼 + GSAP 진입 */}
      <HeroClient pauseAriaLabel={pauseAriaLabel} playAriaLabel={playAriaLabel} />

      {/* 스크롤 인디케이터 — 철도 레일 모티프 (SSR, GSAP가 fade) */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        aria-hidden="true"
      >
        <svg
          width="24"
          height="40"
          viewBox="0 0 24 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="6" y1="0" x2="6" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="0" x2="18" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="8" x2="21" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="18" x2="21" y2="18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="28" x2="21" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path
            data-hero-rail
            d="M12 34 L12 40"
            stroke="rgb(var(--color-primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="font-heading font-medium uppercase tracking-[0.15em]"
          style={{ fontSize: "10px", color: "rgba(255,255,255,0.40)" }}
        >
          Scroll
        </span>
      </div>
    </section>
    </>
  );
}
