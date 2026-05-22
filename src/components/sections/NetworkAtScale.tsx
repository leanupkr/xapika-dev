"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/gsap";

export type NetworkAtScaleProps = {
  overline: string;
  title: string;
  subtitle: string;
  citiesValue: string;
  citiesLabel: string;
  citiesNote: string;
  countriesValue: string;
  countriesLabel: string;
  countriesNote: string;
  continentsValue: string;
  continentsLabel: string;
  continentsNote: string;
  yearsValue: string;
  yearsLabel: string;
  yearsNote: string;
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useCountUp(value: string, inView: boolean, delay: number) {
  const target = parseInt(value, 10);
  const [display, setDisplay] = useState(() =>
    isNaN(target) ? value : "0",
  );

  useEffect(() => {
    if (!inView) return;
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }
    if (prefersReducedMotion()) {
      setDisplay(String(target));
      return;
    }

    const duration = 1400;
    const tickMs = 40;
    const totalTicks = Math.max(8, Math.round(duration / tickMs));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let tick = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        tick += 1;
        const progress = Math.min(tick / totalTicks, 1);
        setDisplay(String(Math.round(target * easeOut(progress))));
        if (progress >= 1 && intervalId) clearInterval(intervalId);
      }, tickMs);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, value, target, delay]);

  return display;
}

type Cell = { value: string; label: string; note: string };

function ScaleCell({
  cell,
  index,
  inView,
}: {
  cell: Cell;
  index: number;
  inView: boolean;
}) {
  const display = useCountUp(cell.value, inView, index * 90);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.1, ease: EASE }}
      className="relative flex flex-col"
    >
      <span
        className="font-heading uppercase mb-4 text-[rgb(var(--color-ink-muted))] whitespace-normal sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
        style={{
          fontSize: "11px",
          letterSpacing: "0.22em",
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        {`0${index + 1}`.slice(-2)} — {cell.label}
      </span>
      <div className="flex items-baseline mb-4 overflow-hidden">
        <span
          className="font-heading font-medium text-[rgb(var(--color-ink))] tabular-nums leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(2.75rem, 4.5vw, 4.25rem)",
            letterSpacing: "-0.035em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {display}
        </span>
      </div>
      <div className="relative h-[2px] w-12 bg-[rgb(var(--color-ink)/0.08)] mb-4 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[rgb(var(--color-primary))]"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : undefined}
          transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: EASE }}
        />
      </div>
      <span
        className="font-body text-[rgb(var(--color-ink-muted))]"
        style={{ fontSize: "13px", lineHeight: 1.55 }}
      >
        {cell.note}
      </span>
    </motion.div>
  );
}

export default function NetworkAtScale(props: NetworkAtScaleProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const cells: Cell[] = [
    { value: props.citiesValue, label: props.citiesLabel, note: props.citiesNote },
    { value: props.countriesValue, label: props.countriesLabel, note: props.countriesNote },
    { value: props.continentsValue, label: props.continentsLabel, note: props.continentsNote },
    { value: props.yearsValue, label: props.yearsLabel, note: props.yearsNote },
  ];

  return (
    <section
      ref={ref}
      data-bg="light"
      aria-labelledby="network-at-scale-title"
      style={{
        backgroundColor: "#fafbfc",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
            style={{ fontSize: "13px", letterSpacing: "0.22em" }}
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
            {props.overline}
          </motion.span>

          <motion.h2
            id="network-at-scale-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {props.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="font-body text-[rgb(var(--color-ink-muted))] mt-6"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.65,
              maxWidth: "560px",
            }}
          >
            {props.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 md:gap-10 lg:gap-8">
          {cells.map((c, i) => (
            <ScaleCell key={c.label} cell={c} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
