"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

const PARTNERS = [
  { name: "VISION IT", src: "/partners/vision-it.png" },
  { name: "MSB Housing", src: null },
  { name: "Intel", src: "/partners/intel.png" },
  { name: "Member of Cambridge University", src: null },
] as const;

export default function TrustedBy({ overline }: { overline: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section
      ref={ref}
      data-bg="dark"
      aria-labelledby="partners-title"
      className="relative py-14 md:py-16"
      style={{ backgroundColor: "rgb(var(--color-ink))" }}
    >
      {/* 상단 hairline */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center mb-10 md:mb-12 px-6"
      >
        <span
          id="partners-title"
          className="flex items-center gap-3 font-heading font-medium uppercase text-center text-white/55"
          style={{ fontSize: "12px", letterSpacing: "0.22em" }}
        >
          <span
            aria-hidden="true"
            className="inline-block flex-shrink-0"
            style={{
              width: "20px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
          {overline}
          <span
            aria-hidden="true"
            className="inline-block flex-shrink-0"
            style={{
              width: "20px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
        </span>
      </motion.div>

      {/* Pause / Play 토글 버튼 — reduced-motion 사용자에게는 숨김 (animation: none 이므로 불필요) */}
      {!prefersReducedMotion && (
        <div className="flex justify-center mb-4 px-6">
          <button
            type="button"
            aria-label={paused ? "Play partners marquee" : "Pause partners marquee"}
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: paused
                ? "rgba(246,163,23,0.18)"
                : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: paused ? "rgb(246,163,23)" : "rgba(255,255,255,0.55)",
            }}
          >
            {paused ? (
              /* Play icon */
              <svg
                aria-hidden="true"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                <path d="M2 1.5l7 3.5-7 3.5V1.5z" />
              </svg>
            ) : (
              /* Pause icon */
              <svg
                aria-hidden="true"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                <rect x="2" y="1.5" width="2.5" height="7" rx="0.5" />
                <rect x="5.5" y="1.5" width="2.5" height="7" rx="0.5" />
              </svg>
            )}
            <span className="sr-only">
              {paused ? "Play partners marquee" : "Pause partners marquee"}
            </span>
          </button>
        </div>
      )}

      {/* 마퀴 — 좌우 fade edge */}
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_60px,#000_calc(100%_-_60px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,#000_120px,#000_calc(100%_-_120px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_60px,#000_calc(100%_-_60px),transparent)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_120px,#000_calc(100%_-_120px),transparent)]"
        aria-hidden="true"
      >
        <div
          className="partners-marquee__track flex items-center w-max"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((p, i) => (
            <Fragment key={`${p.name}-${i}`}>
              <div
                className="partner-logo-wrap flex items-center justify-center flex-shrink-0 bg-[rgba(255,255,255,0.94)] hover:bg-white hover:-translate-y-0.5 transition-all duration-300"
                style={{
                  margin: "0 clamp(1rem, 2vw, 1.5rem)",
                  padding: "14px 28px",
                  height: "76px",
                  minWidth: "160px",
                  borderRadius: "10px",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.2)",
                }}
                title={p.name}
              >
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="partner-logo"
                    style={{
                      maxHeight: "44px",
                      maxWidth: "160px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span
                    className="font-heading font-semibold text-center leading-tight"
                    style={{
                      fontSize: "0.8125rem",
                      letterSpacing: "0.03em",
                      color: "rgb(var(--color-ink))",
                      maxWidth: "140px",
                    }}
                  >
                    {p.name}
                  </span>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* 접근성: 정적 리스트 (스크린리더용) */}
      <ul className="sr-only">
        {PARTNERS.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </section>
  );
}
