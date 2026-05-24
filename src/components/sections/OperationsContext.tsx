"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type OpsCard = {
  office: string;
  flag: string;
  project: string;
  blurb: string;
  metric: string;
  cta: string;
  href: string;
  comingBadge?: string;
};

export type OperationsContextProps = {
  overline: string;
  title: string;
  subtitle: string;
  cards: {
    ukraine: OpsCard;
    poland: OpsCard;
    uzbekistan: OpsCard;
  };
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function OpsCardItem({
  card,
  index,
  inView,
  isLastOdd,
}: {
  card: OpsCard;
  index: number;
  inView: boolean;
  isLastOdd: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        delay: 0.1 + 0.08 * index,
        ease: EASE,
      }}
      className={`group ${isLastOdd ? "sm:col-span-2 md:col-span-1" : ""}`}
    >
      <Link
        href={card.href}
        aria-label={`${card.project} — ${card.office}`}
        className="relative flex flex-col h-full bg-white transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(11,31,58,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] p-4 sm:p-7 sm:pb-6 min-h-[200px] sm:min-h-[280px]"
        style={{
          border: "1px solid rgb(var(--color-ink) / 0.10)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[rgb(var(--color-primary))] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div className="flex items-start justify-between mb-3 sm:mb-6 gap-2">
          <span
            className="font-heading font-semibold text-[rgb(var(--color-ink-muted))] inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]"
            style={{
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true" className="text-[14px] sm:text-[16px]" style={{ lineHeight: 1 }}>
              {card.flag}
            </span>
            {card.office}
          </span>
          {card.comingBadge && (
            <span
              className="inline-flex items-center font-heading font-semibold uppercase whitespace-nowrap"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                padding: "3px 8px",
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-primary) / 0.12)",
                color: "rgb(var(--color-primary))",
                border: "1px solid rgb(var(--color-primary) / 0.35)",
              }}
            >
              {card.comingBadge}
            </span>
          )}
        </div>

        <h3
          className="font-heading font-semibold text-[rgb(var(--color-ink))] mb-2 sm:mb-3 text-balance group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
          style={{
            fontSize: "clamp(0.9375rem, 1.4vw, 1.25rem)",
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
          }}
        >
          {card.project}
        </h3>

        <p
          className="font-body text-[rgb(var(--color-ink-muted))] flex-1 line-clamp-3 sm:line-clamp-none"
          style={{
            fontSize: "clamp(0.75rem, 1.05vw, 0.9375rem)",
            lineHeight: 1.55,
          }}
        >
          {card.blurb}
        </p>

        <div
          className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 mt-3 sm:mt-6 pt-3 sm:pt-5"
          style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.07)" }}
        >
          <span
            className="font-heading font-semibold text-[rgb(var(--color-ink))] tabular-nums text-[10px] sm:text-[12px]"
            style={{
              letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {card.metric}
          </span>
          <span
            className="inline-flex items-center gap-1 sm:gap-1.5 font-heading font-medium text-[rgb(var(--color-ink-muted))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300 whitespace-nowrap text-[10px] sm:text-[12px]"
            style={{ letterSpacing: "0.04em" }}
          >
            {card.cta}
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function OperationsContext({
  overline,
  title,
  subtitle,
  cards,
}: OperationsContextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  const items: OpsCard[] = [cards.ukraine, cards.poland, cards.uzbekistan];

  return (
    <section
      ref={ref}
      data-bg="light"
      aria-labelledby="ops-context-title"
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
            {overline}
          </motion.span>

          <motion.h2
            id="ops-context-title"
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
            {title}
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
            {subtitle}
          </motion.p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
          role="list"
        >
          {items.map((card, i) => (
            <OpsCardItem
              key={card.href}
              card={card}
              index={i}
              inView={inView}
              isLastOdd={i === items.length - 1 && items.length % 2 === 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
