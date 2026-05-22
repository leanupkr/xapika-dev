"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, MessageSquare, Clock, Compass, Network, Handshake } from "lucide-react";
import Link from "next/link";

type CardData = {
  title: string;
  description: string;
};

export type AboutCardGridProps = {
  overline: string;
  title: string;
  cards: {
    ceo: CardData;
    history: CardData;
    vision: CardData;
    organization: CardData;
    clients: CardData;
  };
};

type CardDef = {
  key: keyof AboutCardGridProps["cards"];
  href: string;
  icon: React.ReactNode;
  index: string;
};

const CARD_DEFS: CardDef[] = [
  {
    key: "ceo",
    href: "/about/ceo",
    icon: <MessageSquare size={22} strokeWidth={1.75} aria-hidden="true" />,
    index: "01",
  },
  {
    key: "history",
    href: "/about/history",
    icon: <Clock size={22} strokeWidth={1.75} aria-hidden="true" />,
    index: "02",
  },
  {
    key: "vision",
    href: "/about/vision",
    icon: <Compass size={22} strokeWidth={1.75} aria-hidden="true" />,
    index: "03",
  },
  {
    key: "organization",
    href: "/about/organization",
    icon: <Network size={22} strokeWidth={1.75} aria-hidden="true" />,
    index: "04",
  },
  {
    key: "clients",
    href: "/about/clients",
    icon: <Handshake size={22} strokeWidth={1.75} aria-hidden="true" />,
    index: "05",
  },
];

export default function AboutCardGrid({ overline, title, cards }: AboutCardGridProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section
      ref={ref}
      data-bg="light"
      aria-labelledby="about-card-grid-title"
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
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            id="about-card-grid-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-semibold text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </motion.h2>
        </div>

        {/* Card grid: 3-col desktop / 2-col tablet / 2-col mobile (last card spans 2) */}
        <ul
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
          role="list"
        >
          {CARD_DEFS.map((def, i) => {
            const card = cards[def.key];
            const isLastOdd = i === CARD_DEFS.length - 1 && CARD_DEFS.length % 2 === 1;
            return (
              <motion.li
                key={def.key}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + 0.08 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group ${isLastOdd ? "col-span-2 sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <Link
                  href={def.href}
                  className="relative flex flex-col h-full bg-white transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(11,31,58,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] p-4 sm:p-7 sm:pb-6 min-h-[180px] sm:min-h-[200px]"
                  style={{
                    border: "1px solid rgb(var(--color-ink) / 0.10)",
                  }}
                  aria-label={card.title}
                >
                  {/* Left accent bar — revealed on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[rgb(var(--color-primary))] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Top row: icon + index */}
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <span
                      className="text-[rgb(var(--color-primary))]"
                    >
                      {def.icon}
                    </span>
                    <span
                      className="font-heading font-semibold text-[rgb(var(--color-ink-muted))] text-[10px] sm:text-[11px]"
                      style={{ letterSpacing: "0.22em" }}
                    >
                      {def.index}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-heading font-semibold text-[rgb(var(--color-ink))] mb-2 sm:mb-3 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
                    style={{
                      fontSize: "clamp(0.9375rem, 1.4vw, 1.25rem)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-body text-[rgb(var(--color-ink-muted))] flex-1 line-clamp-3 sm:line-clamp-none"
                    style={{
                      fontSize: "clamp(0.75rem, 1.05vw, 0.9375rem)",
                      lineHeight: 1.55,
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Bottom row: arrow */}
                  <div className="flex justify-end mt-3 sm:mt-6 pt-3 sm:pt-5" style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.07)" }}>
                    <span
                      className="inline-flex items-center gap-1.5 font-heading font-medium text-[rgb(var(--color-ink-muted))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
                      style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                    >
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
