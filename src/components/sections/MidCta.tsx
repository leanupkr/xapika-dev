"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type MidCtaProps = {
  overline: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export default function MidCta({
  overline,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: MidCtaProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
      }}
      aria-labelledby="mid-cta-title"
    >
      {/* 상단 hairline */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* 레일 그리드 SVG 패턴 */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="rail-grid-midcta"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <motion.g
              animate={{ x: [0, -80] }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            >
              {/* 수직 레일 2줄 */}
              <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
              <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
              {/* 수평 침목 */}
              <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1.5" />
              <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1.5" />
            </motion.g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rail-grid-midcta)" />
      </svg>

      {/* 좌측 주황 그라디언트 액센트 */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[40%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(246,163,23,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-14 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* 텍스트 */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-4 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "13px", letterSpacing: "0.2em" }}
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
          </motion.span>

          <motion.h2
            id="mid-cta-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-bold text-white mb-4"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-white/60"
            style={{
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200"
            style={{
              fontSize: "15px",
              padding: "14px 28px",
              backgroundColor:
                hoverIdx === 0
                  ? "rgb(var(--color-primary-hover))"
                  : "rgb(var(--color-primary))",
              color: "#fff",
              boxShadow:
                hoverIdx === 0
                  ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 24px rgba(246,163,23,0.55)"
                  : "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(246,163,23,0.35)",
            }}
            onMouseEnter={() => setHoverIdx(0)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {ctaPrimary}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 font-heading font-medium rounded-lg backdrop-blur-sm transition-all duration-200"
            style={{
              fontSize: "15px",
              padding: "14px 28px",
              border: `1px solid ${hoverIdx === 1 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)"}`,
              backgroundColor:
                hoverIdx === 1 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
              color: "#fff",
            }}
            onMouseEnter={() => setHoverIdx(1)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {ctaSecondary}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
