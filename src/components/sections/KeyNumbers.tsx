"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

type Stat = {
  value: string;
  label: string;
  note: string;
  unit?: string;
};

type KeyNumbersProps = {
  overline: string;
  title: string;
  subtitle: string;
  stats: [Stat, Stat, Stat, Stat];
};

function parseNumeric(value: string): { target: number; suffix: string; format: "int" | "compact" } {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^(\d+)(\+?)$/);
  if (!match) return { target: 0, suffix: value, format: "int" };
  const target = parseInt(match[1], 10);
  const suffix = match[2];
  const format = target >= 1000 ? "compact" : "int";
  return { target, suffix, format };
}

function formatNumber(n: number, format: "int" | "compact"): string {
  const int = Math.round(n);
  if (format === "compact") return int.toLocaleString("en-US");
  return String(int);
}

function StatBlock({
  stat,
  index,
  inView,
}: {
  stat: Stat;
  index: number;
  inView: boolean;
}) {
  const { target, suffix, format } = parseNumeric(stat.value);
  const [display, setDisplay] = useState("0");
  const [blurring, setBlurring] = useState(true);

  useEffect(() => {
    if (!inView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(formatNumber(target, format));
      setBlurring(false);
      return;
    }

    const delay = index * 120;
    const duration = 1800;

    const startTimer = setTimeout(() => {
      const controls = animate(0, target, {
        duration: duration / 1000,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplay(formatNumber(latest, format));
        },
        onComplete: () => {
          setBlurring(false);
        },
      });
      return () => controls.stop();
    }, delay);

    return () => clearTimeout(startTimer);
  }, [inView, target, format, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.6,
        delay: 0.05 + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex flex-col min-w-0"
    >
      {/* 라벨 (overline) */}
      <span
        className="font-heading uppercase mb-5 text-[rgb(var(--color-ink-muted))]"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          fontWeight: 600,
        }}
      >
        {`0${index + 1}`.slice(-2)} — {stat.label}
      </span>

      {/* 숫자 */}
      <div className="flex items-baseline gap-2 mb-4 overflow-hidden">
        <span
          className="font-heading font-medium text-[rgb(var(--color-ink))] leading-none tabular-nums whitespace-nowrap"
          style={{
            fontSize: "clamp(3.5rem, 5.5vw, 5.25rem)",
            letterSpacing: "-0.035em",
            filter: blurring ? "blur(2px)" : "blur(0)",
            transition: "filter 240ms cubic-bezier(0.16, 1, 0.3, 1)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {display}
        </span>
        {suffix && (
          <span
            className="font-heading font-medium text-[rgb(var(--color-primary))] leading-none"
            style={{
              fontSize: "clamp(1.25rem, 2vw, 2rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {suffix}
          </span>
        )}
        {stat.unit && (
          <span
            className="font-heading font-medium text-[rgb(var(--color-primary))] leading-[1.1]"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.375rem)",
              letterSpacing: "-0.005em",
            }}
          >
            {stat.unit}
          </span>
        )}
      </div>

      {/* 주황 언더라인 — 진행바 */}
      <div className="relative h-[2px] w-full bg-[rgb(var(--color-ink)/0.08)] mb-4 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[rgb(var(--color-primary))]"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : undefined}
          transition={{
            duration: 1.6,
            delay: 0.15 + index * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {/* 보조 노트 */}
      <span
        className="font-body text-[rgb(var(--color-ink-muted))]"
        style={{ fontSize: "13px", lineHeight: 1.5 }}
      >
        {stat.note}
      </span>
    </motion.div>
  );
}

export default function KeyNumbers({
  overline,
  title,
  subtitle,
  stats,
}: KeyNumbersProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section
      ref={ref}
      className="relative bg-[rgb(var(--color-surface))] py-20 md:py-32"
      aria-labelledby="key-numbers-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1280px" }}
      >
        {/* 헤더 */}
        <div className="max-w-3xl mb-16 md:mb-24">
          {/* Overline */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
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

          {/* Title */}
          <motion.h2
            id="key-numbers-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-[rgb(var(--color-ink-muted))] mt-6"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
              lineHeight: 1.65,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 스탯 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <StatBlock key={i} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
