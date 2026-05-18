"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type BentoItem = {
  value: string;
  label: string;
};

type BentoQualitativeProps = {
  overline: string;
  title: string;
  items: ReadonlyArray<BentoItem>;
};

// Bento grid spans — 4 items: 1 large + 3 small to break the symmetric stat-grid feel
const BENTO_SPANS = [
  { colSpan: "md:col-span-7", rowSpan: "md:row-span-2", sizeClass: "large" },
  { colSpan: "md:col-span-5", rowSpan: "md:row-span-1", sizeClass: "small" },
  { colSpan: "md:col-span-5", rowSpan: "md:row-span-1", sizeClass: "small" },
  { colSpan: "md:col-span-12", rowSpan: "md:row-span-1", sizeClass: "wide" },
] as const;

export default function BentoQualitative({
  overline,
  title,
  items,
}: BentoQualitativeProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <section
      ref={ref}
      data-bg="surface"
      className="relative"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
        borderTop: "1px solid rgb(var(--color-ink) / 0.06)",
      }}
      aria-labelledby="bento-qual-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="max-w-2xl mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
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
            {overline}
          </motion.span>
          <motion.h2
            id="bento-qual-title"
            initial={{ opacity: 0, y: 14 }}
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

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
          style={{ gridAutoRows: "minmax(160px, auto)" }}
        >
          {items.map((item, i) => {
            const span = BENTO_SPANS[i] ?? BENTO_SPANS[BENTO_SPANS.length - 1];
            const isLarge = span.sizeClass === "large";
            const isWide = span.sizeClass === "wide";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={[
                  "relative group flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(11,31,58,0.08)]",
                  span.colSpan,
                  span.rowSpan,
                ].join(" ")}
                style={{
                  border: "1px solid rgb(var(--color-ink) / 0.10)",
                  backgroundColor: isLarge
                    ? "rgb(var(--color-ink))"
                    : "rgb(var(--color-bg))",
                  padding: isLarge
                    ? "clamp(2rem, 3vw, 2.75rem)"
                    : "clamp(1.5rem, 2.4vw, 2rem)",
                  minHeight: isLarge ? "320px" : isWide ? "160px" : "180px",
                  color: isLarge ? "#fff" : undefined,
                }}
              >
                {/* Top row: index */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-heading font-medium uppercase tabular-nums"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.22em",
                      color: isLarge
                        ? "rgba(255,255,255,0.5)"
                        : "rgb(var(--color-ink-muted))",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "rgb(var(--color-primary))",
                    }}
                  />
                </div>

                {/* Bottom: value + label */}
                <div className="mt-8">
                  <div
                    className="font-heading font-semibold leading-tight mb-2"
                    style={{
                      fontSize: isLarge
                        ? "clamp(2.25rem, 4vw, 3.25rem)"
                        : "clamp(1.375rem, 2.1vw, 1.75rem)",
                      letterSpacing: "-0.022em",
                      color: isLarge ? "#fff" : "rgb(var(--color-ink))",
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    className="font-heading font-medium"
                    style={{
                      fontSize: "11.5px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: isLarge
                        ? "rgba(255,255,255,0.65)"
                        : "rgb(var(--color-ink-muted))",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
