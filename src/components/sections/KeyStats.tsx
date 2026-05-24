"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/gsap";

export type KeyStatItem = {
  value: string;
  label: string;
};

type KeyStatsProps = {
  overline: string;
  title: string;
  stats: ReadonlyArray<KeyStatItem>;
  /**
   * Render non-numeric stat values at a smaller, wrappable scale —
   * use when stats are qualitative phrases (e.g. "Operator-aligned") instead of numbers.
   */
  qualitative?: boolean;
};

type ParsedValue = {
  target: number;
  prefix: string;
  suffix: string;
  isNumeric: boolean;
};

function parseValue(value: string): ParsedValue {
  // Match: optional non-digit prefix, digits (with optional commas), optional non-digit suffix
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: value, isNumeric: false };
  const cleaned = match[2].replace(/,/g, "");
  const target = parseInt(cleaned, 10);
  if (Number.isNaN(target))
    return { target: 0, prefix: "", suffix: value, isNumeric: false };
  return {
    target,
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
    isNumeric: true,
  };
}

function formatNumber(n: number, withCommas: boolean): string {
  const int = Math.round(n);
  return withCommas ? int.toLocaleString("en-US") : String(int);
}

function StatBlock({
  stat,
  index,
  inView,
  qualitative,
}: {
  stat: KeyStatItem;
  index: number;
  inView: boolean;
  qualitative: boolean;
}) {
  const parsed = parseValue(stat.value);
  const useCommas = stat.value.includes(",");
  const [display, setDisplay] = useState(parsed.isNumeric ? "0" : stat.value);
  const [blurring, setBlurring] = useState(parsed.isNumeric);

  useEffect(() => {
    if (!inView || !parsed.isNumeric) {
      if (!parsed.isNumeric) setBlurring(false);
      return;
    }

    const prefersReduced = prefersReducedMotion();

    if (prefersReduced) {
      setDisplay(formatNumber(parsed.target, useCommas));
      setBlurring(false);
      return;
    }

    const delay = index * 110;
    const startTimer = setTimeout(() => {
      const controls = animate(0, parsed.target, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplay(formatNumber(latest, useCommas)),
        onComplete: () => setBlurring(false),
      });
      return () => controls.stop();
    }, delay);

    return () => clearTimeout(startTimer);
  }, [inView, parsed.isNumeric, parsed.target, useCommas, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.6,
        delay: 0.05 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex flex-col min-w-0"
    >
      {/* Index + label */}
      <span
        className="font-heading uppercase mb-4 text-[rgb(var(--color-ink-muted))]"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          fontWeight: 600,
        }}
      >
        {`0${index + 1}`.slice(-2)} — {stat.label}
      </span>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-3 overflow-hidden">
        {parsed.isNumeric ? (
          <>
            {parsed.prefix && (
              <span
                className="font-heading font-medium text-[rgb(var(--color-ink))] leading-none"
                style={{
                  fontSize: "clamp(2rem, 3.4vw, 2.5rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                {parsed.prefix}
              </span>
            )}
            <span
              className="font-heading font-medium text-[rgb(var(--color-ink))] leading-none tabular-nums"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                filter: blurring ? "blur(2px)" : "blur(0)",
                transition: "filter 240ms cubic-bezier(0.16, 1, 0.3, 1)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {display}
            </span>
            {parsed.suffix && (
              <span
                className="font-heading font-medium text-[rgb(var(--color-primary))] leading-none"
                style={{
                  fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                  letterSpacing: "-0.015em",
                }}
              >
                {parsed.suffix}
              </span>
            )}
          </>
        ) : (
          <span
            className={
              qualitative
                ? "font-heading font-medium text-[rgb(var(--color-ink))] leading-tight"
                : "font-heading font-medium text-[rgb(var(--color-ink))] leading-none"
            }
            style={{
              fontSize: qualitative
                ? "clamp(1.25rem, 1.9vw, 1.625rem)"
                : "clamp(2.25rem, 4vw, 3rem)",
              letterSpacing: qualitative ? "-0.018em" : "-0.03em",
            }}
          >
            {stat.value}
          </span>
        )}
      </div>

      {/* Progress underline */}
      <div className="relative h-[2px] w-full bg-[rgb(var(--color-ink)/0.08)] overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[rgb(var(--color-primary))]"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : undefined}
          transition={{
            duration: 1.3,
            delay: 0.15 + index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

export default function KeyStats({
  overline,
  title,
  stats,
  qualitative = false,
}: KeyStatsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      className="relative bg-[rgb(var(--color-surface))]"
      style={{
        paddingTop: "clamp(3.5rem, 10vh, 8rem)",
        paddingBottom: "clamp(3.5rem, 10vh, 8rem)",
        borderTop: "1px solid rgb(var(--color-ink) / 0.06)",
      }}
      aria-labelledby="keystats-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "13px", letterSpacing: "0.2em" }}
          >
            <span
              aria-hidden="true"
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
            id="keystats-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </motion.h2>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 gap-x-6 sm:gap-x-8 md:gap-x-10">
          {stats.map((stat, i) => (
            <StatBlock
              key={i}
              stat={stat}
              index={i}
              inView={inView}
              qualitative={qualitative}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
