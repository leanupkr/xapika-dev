"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionOverline from "@/components/ui/SectionOverline";

export type CtaSecondaryButton = {
  label: string;
  href: string;
  external?: boolean;
};

export type CtaSectionProps = {
  overline?: string;
  title: string;
  subtitle: string;
  button: string;
  href?: string;
  titleId?: string;
  secondaryButton?: CtaSecondaryButton;
};

export default function CtaSection({
  overline = "Ready",
  title,
  subtitle,
  button,
  href = "/contact",
  titleId = "cta-title",
  secondaryButton,
}: CtaSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby={titleId}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 40%, rgba(246,163,23,0.08) 0%, transparent 65%)",
        }}
      />

      <SectionContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-12 items-end">
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionOverline>{overline}</SectionOverline>
            <h2
              id={titleId}
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(1.875rem, 3.8vw, 2.875rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "22ch",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body mt-5"
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              {subtitle}
            </p>
          </motion.div>
          <motion.div
            className={
              secondaryButton
                ? "lg:col-span-4 flex flex-col gap-3 lg:items-end"
                : "lg:col-span-4 lg:flex lg:justify-end"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <Link
              href={href}
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
              style={{ fontSize: "14px", letterSpacing: "0.05em" }}
            >
              {button}
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            {secondaryButton ? (
              secondaryButton.external ? (
                <a
                  href={secondaryButton.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-heading font-medium transition-colors duration-300 hover:bg-white/10 hover:border-white/40"
                  style={{ fontSize: "13px", letterSpacing: "0.05em" }}
                >
                  {secondaryButton.label}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ) : (
                <Link
                  href={secondaryButton.href}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-heading font-medium transition-colors duration-300 hover:bg-white/10 hover:border-white/40"
                  style={{ fontSize: "13px", letterSpacing: "0.05em" }}
                >
                  {secondaryButton.label}
                  <ArrowRight
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )
            ) : null}
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}
