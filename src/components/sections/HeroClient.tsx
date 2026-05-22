"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/gsap";

type Props = {
  pauseAriaLabel: string;
  playAriaLabel: string;
};

export default function HeroClient({ pauseAriaLabel, playAriaLabel }: Props) {
  const [paused, setPaused] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  // GSAP 진입 timeline + 스크롤 인디케이터 fade-out
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = scopeRef.current?.closest("[data-hero-section]");
      if (!section) return;

      const overline = section.querySelector("[data-hero-overline]");
      const headline = section.querySelector("[data-hero-headline]");
      const words = headline
        ? headline.querySelectorAll("[data-word]")
        : ([] as unknown as NodeListOf<Element>);
      const sub = section.querySelector("[data-hero-sub]");
      const ctaBtns = section.querySelectorAll("[data-hero-cta] a");
      const scrollIndicator = section.querySelector(
        "[data-hero-scroll]"
      ) as HTMLElement | null;
      const rail = section.querySelector(
        "[data-hero-rail]"
      ) as SVGPathElement | null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (overline) {
        tl.fromTo(
          overline,
          { x: -20 },
          { x: 0, duration: 0.4 }
        );
      }
      if (words.length > 0) {
        tl.fromTo(
          words,
          { y: 30 },
          { y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.2"
        );
      }
      if (sub) {
        tl.fromTo(sub, { y: 20 }, { y: 0, duration: 0.4 }, "+=0.1");
      }
      if (ctaBtns.length > 0) {
        tl.fromTo(
          ctaBtns,
          { y: 20 },
          { y: 0, duration: 0.35, stagger: 0.1 },
          "-=0.1"
        );
      }

      // 스크롤 인디케이터 fade-out — scrub은 스크롤마다 JS를 깨우므로 모바일에서는 비활성화.
      // 저사양 기기 jank 감소 목적.
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767.98px)").matches;

      if (scrollIndicator && !isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "20% top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(scrollIndicator, { opacity: 1 - self.progress * 3 });
          },
        });
      }

      if (rail) {
        const length = rail.getTotalLength?.() ?? 40;
        gsap.set(rail, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.fromTo(
          rail,
          { strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
          1.5
        );
      }
    },
    { scope: scopeRef }
  );

  function togglePause() {
    const section = scopeRef.current?.closest("[data-hero-section]");
    if (!section) return;
    setPaused((p) => {
      const next = !p;
      section.classList.toggle("hero-slideshow--paused", next);
      return next;
    });
  }

  return (
    <div ref={scopeRef} aria-hidden="false">
      <button
        type="button"
        onClick={togglePause}
        aria-label={paused ? playAriaLabel : pauseAriaLabel}
        aria-pressed={paused}
        className="hero-pause-btn"
      >
        {paused ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
            <path d="M0 0v12l10-6z" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
            <rect x="0" y="0" width="3" height="12" />
            <rect x="7" y="0" width="3" height="12" />
          </svg>
        )}
      </button>
    </div>
  );
}
