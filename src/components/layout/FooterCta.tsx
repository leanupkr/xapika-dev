"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type FooterCtaProps = {
  tagline: string;
  cta: string;
};

export default function FooterCta({ tagline, cta }: FooterCtaProps) {
  return (
    <div
      className="relative mb-16 overflow-hidden rounded-2xl border border-white/[0.06] min-h-[200px] md:min-h-[320px]"
    >
      {/* 미묘한 레일 패턴 배경 */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="rail-grid-footer" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="20" y1="0" x2="20" y2="60" stroke="white" strokeWidth="1" />
            <line x1="40" y1="0" x2="40" y2="60" stroke="white" strokeWidth="1" />
            <line x1="0" y1="15" x2="60" y2="15" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="45" x2="60" y2="45" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rail-grid-footer)" />
      </svg>
      {/* 상단 hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.08]" />
      {/* 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 px-6 md:px-10 py-10 md:py-0 h-full min-h-[200px] md:min-h-[320px]"
      >
        <div className="max-w-lg">
          <span
            className="flex items-center gap-3 font-heading font-medium uppercase mb-4"
            style={{ fontSize: "12px", letterSpacing: "0.15em", color: "rgb(var(--color-primary))" }}
          >
            <span className="inline-block w-5 h-0.5" style={{ backgroundColor: "rgb(var(--color-primary))" }} />
            Get in Touch
          </span>
          <p
            className="font-heading font-semibold text-white"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.2 }}
          >
            {tagline}
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold text-white transition-all duration-200 flex-shrink-0"
          style={{
            fontSize: "15px",
            padding: "16px 32px",
            backgroundColor: "rgb(var(--color-primary))",
            boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(246,163,23,0.3)",
          }}
        >
          {cta}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </motion.div>
      {/* 하단 hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.08]" />
    </div>
  );
}
