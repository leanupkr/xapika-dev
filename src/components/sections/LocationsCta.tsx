"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type LocationsCtaProps = {
  overline: string;
  title: string;
  subtitle: string;
  button: string;
};

export default function LocationsCta({
  overline,
  title,
  subtitle,
  button,
}: LocationsCtaProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "rgb(var(--color-ink))" }}
      aria-labelledby="locations-cta-title"
    >
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[45%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(246,163,23,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-14 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-4 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "13px", letterSpacing: "0.2em" }}
          >
            <span
              aria-hidden
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
            id="locations-cta-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-heading font-bold text-white mb-4"
            style={{
              fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="font-body text-white/60"
            style={{
              fontSize: "clamp(0.9375rem, 1.05vw, 1.0625rem)",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        >
          <Link
            href="/contact"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200"
            style={{
              fontSize: "15px",
              padding: "14px 28px",
              backgroundColor: hovered
                ? "rgb(var(--color-primary-hover))"
                : "rgb(var(--color-primary))",
              color: "#fff",
              boxShadow: hovered
                ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 24px rgba(246,163,23,0.55)"
                : "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px rgba(246,163,23,0.35)",
            }}
          >
            {button}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
