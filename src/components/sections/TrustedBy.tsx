"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARTNERS = [
  "Ukrzaliznytsia",
  "Hyundai Rotem",
  "Tramwaje Warszawskie",
  "Uzbekistan Temir Yo'llari",
  "PKP Intercity",
  "TCDD Taşımacılık",
  "Hanwha Corp",
  "KORAIL",
] as const;

export default function TrustedBy({ overline }: { overline: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // duplicate once → marquee seamless loop (translateX -50%)
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

      {/* 헤더 — 중앙 정렬, 작은 overline */}
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

      {/* 마퀴 — 좌우 fade edge */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 120px, #000 calc(100% - 120px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 120px, #000 calc(100% - 120px), transparent 100%)",
        }}
        aria-hidden="true"
      >
        <div className="partners-marquee__track flex items-center w-max">
          {loop.map((name, i) => (
            <Fragment key={i}>
              <span
                className="marquee-item font-heading font-medium whitespace-nowrap transition-colors duration-300 text-white/40 hover:text-white/85"
                style={{
                  fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)",
                  letterSpacing: "-0.005em",
                }}
              >
                {name}
              </span>
              <span
                className="inline-block select-none text-white/20"
                style={{
                  fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)",
                  margin: "0 clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1,
                }}
              >
                ·
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      {/* 접근성: 정적 리스트 (스크린리더용) */}
      <ul className="sr-only">
        {PARTNERS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}
