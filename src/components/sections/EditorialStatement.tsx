"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type EditorialStatementProps = {
  overline: string;
  kicker: string;
  paragraphs: ReadonlyArray<string>;
};

export default function EditorialStatement({
  overline,
  kicker,
  paragraphs,
}: EditorialStatementProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      data-bg="light"
      className="relative"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="editorial-statement-kicker"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-16">
          {/* Left — kicker column */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "13px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </motion.span>

            <motion.h2
              id="editorial-statement-kicker"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-semibold text-[rgb(var(--color-ink))]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              {kicker}
            </motion.h2>
          </div>

          {/* Right — body paragraphs column */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative"
              style={{
                borderLeft: "2px solid rgb(var(--color-primary))",
                paddingLeft: "clamp(1.5rem, 3vw, 2.25rem)",
              }}
            >
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-[rgb(var(--color-ink))] mb-8 last:mb-0"
                  style={{
                    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)",
                    lineHeight: 1.6,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
