"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARTNERS = [
  { name: "Ukrzaliznytsia", src: "/partners/ukrzaliznytsia.svg" },
  { name: "Hyundai Rotem", src: "/partners/hyundai-rotem.svg" },
  { name: "Tramwaje Warszawskie", src: "/partners/tramwaje-warszawskie.svg" },
  { name: "Uzbekistan Temir Yo'llari", src: "/partners/uzbekistan-railways.svg" },
  { name: "PKP Intercity", src: "/partners/pkp-intercity.svg" },
  { name: "TCDD Taşımacılık", src: "/partners/tcdd-tasimacilik.png" },
  { name: "Hanwha Corp", src: "/partners/hanwha.svg" },
  { name: "KORAIL", src: "/partners/korail.svg" },
] as const;

export default function TrustedBy({ overline }: { overline: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

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

      {/* 마퀴 — 좌우 fade edge */}
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_60px,#000_calc(100%_-_60px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,#000_120px,#000_calc(100%_-_120px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_60px,#000_calc(100%_-_60px),transparent)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_120px,#000_calc(100%_-_120px),transparent)]"
        aria-hidden="true"
      >
        <div className="partners-marquee__track flex items-center w-max">
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.name}
                  className="partner-logo"
                  style={{
                    maxHeight: "44px",
                    maxWidth: "160px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
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
