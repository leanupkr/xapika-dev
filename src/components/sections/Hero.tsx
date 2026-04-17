"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import "@/styles/hero.css";

const SLIDES = [
  {
    src: "/hero/hero-01-wide.jpg",
    alt: "Xapika Engineering maintenance depot",
  },
  {
    src: "/hero/hero-02-work.jpg",
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
};

export default function Hero({
  headline,
  headlineAccent,
  subheadline,
  overline,
  ctaSolutions,
  ctaContact,
  ctaSolutionsHref,
  ctaContactHref,
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        // 정적 상태로 바로 표시
        gsap.set(
          [
            overlineRef.current,
            headlineRef.current,
            subRef.current,
            ctaRef.current,
          ],
          { opacity: 1, x: 0, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Overline: x -20 → 0
      tl.fromTo(
        overlineRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 }
      );

      // H1 단어별 fade-up
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll("[data-word]");
        tl.fromTo(
          words,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.2"
        );
      }

      // Subheadline
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "+=0.3"
      );

      // CTA 버튼들
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("a");
        tl.fromTo(
          btns,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
          "-=0.2"
        );
      }

      // 스크롤 인디케이터: 스크롤하면 fade out
      if (scrollIndicatorRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(scrollIndicatorRef.current, {
              opacity: 1 - self.progress * 3,
            });
          },
        });

        // Rail SVG stroke animation
        if (railRef.current) {
          const length = railRef.current.getTotalLength?.() ?? 40;
          gsap.set(railRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          tl.fromTo(
            railRef.current,
            { strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
            1.5
          );
        }
      }
    },
    { scope: containerRef }
  );

  // headline을 단어 단위로 분리 (공백 기준, 액센트 부분 제외)
  function renderHeadline(text: string, accent: string) {
    const fullText = text;
    const accentIndex = fullText.indexOf(accent);

    if (accentIndex === -1) {
      // accent 미발견 시 단어별 span
      return fullText.split(" ").map((word, i) => (
        <span
          key={i}
          data-word
          className="inline-block opacity-0"
          style={{ marginRight: i < fullText.split(" ").length - 1 ? "0.25em" : 0 }}
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
            className="inline-block opacity-0"
            style={{ marginRight: "0.25em" }}
          >
            {word}
          </span>
        ))}
        {/* 줄바꿈: "Perfect Work." 뒤에서 강제 줄바꿈 */}
        <br />
        {accentWords.map((word, i) => (
          <span
            key={`a-${i}`}
            data-word
            className="inline-block opacity-0"
            style={{
              color: "rgb(var(--color-primary))",
              marginRight:
                i < accentWords.length - 1 || after.trim() ? "0.25em" : 0,
            }}
          >
            {word}
          </span>
        ))}
        {after.trim().split(" ").filter(Boolean).map((word, i, arr) => (
          <span
            key={`e-${i}`}
            data-word
            className="inline-block opacity-0"
            style={{ marginRight: i < arr.length - 1 ? "0.25em" : 0 }}
          >
            {word}
          </span>
        ))}
      </>
    );
  }

  return (
    <section
      ref={containerRef}
      className="hero-slideshow"
      style={{ height: "100vh", minHeight: "600px" }}
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
          />
        </div>
      ))}

      {/* 콘텐츠 */}
      <div className="hero-content">
        <div
          className="w-full pb-[180px] md:pb-[clamp(3rem,6vw,5rem)]"
          style={{
            maxWidth: "56rem",
          }}
        >
          {/* Overline */}
          <span
            ref={overlineRef}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 opacity-0"
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

          {/* H1 */}
          <h1
            ref={headlineRef}
            className="font-heading font-bold text-white mb-8 max-w-[90vw] md:max-w-none"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 7.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 0.97,
            }}
          >
            {renderHeadline(headline, headlineAccent)}
          </h1>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="font-body opacity-0 mb-10"
            style={{
              fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "520px",
              lineHeight: 1.65,
            }}
          >
            {subheadline}
          </p>

          {/* CTA 버튼 */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            {/* Primary CTA */}
            <Link
              href={ctaSolutionsHref}
              aria-label={ctaSolutions}
              className="inline-flex items-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 opacity-0"
              style={{
                fontSize: "15px",
                padding: "14px 28px",
                backgroundColor: "rgb(var(--color-primary))",
                color: "#fff",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(246,163,23,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgb(var(--color-primary-hover))";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 24px rgba(246,163,23,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgb(var(--color-primary))";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(246,163,23,0.35)";
              }}
            >
              {ctaSolutions}
              <ArrowRight size={16} strokeWidth={2} />
            </Link>

            {/* Ghost CTA */}
            <Link
              href={ctaContactHref}
              aria-label={ctaContact}
              className="inline-flex items-center gap-2 font-heading font-medium rounded-lg transition-all duration-200 backdrop-blur-sm opacity-0"
              style={{
                fontSize: "15px",
                padding: "14px 28px",
                border: "1px solid rgba(255,255,255,0.35)",
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.35)";
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

      {/* 스크롤 인디케이터 — 철도 레일 모티프 */}
      <div
        ref={scrollIndicatorRef}
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
          {/* 레일 두 줄 */}
          <line
            x1="6"
            y1="0"
            x2="6"
            y2="40"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="0"
            x2="18"
            y2="40"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* 침목 패턴 */}
          <line x1="3" y1="8" x2="21" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="18" x2="21" y2="18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="28" x2="21" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* 진행 표시 경로 */}
          <path
            ref={railRef}
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
  );
}
