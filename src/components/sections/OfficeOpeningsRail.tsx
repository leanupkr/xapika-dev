"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export type MilestoneEvent = {
  year: string;
  month: string;
  country: string;
  event: string;
  isComing: boolean;
};

export type OfficeOpeningsRailProps = {
  overline: string;
  title: string;
  subtitle: string;
  sinceLabel: string;
  comingBadge: string;
  events: ReadonlyArray<MilestoneEvent>;
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Locale-agnostic flag lookup — accepts English and Korean country names from PDF source.
const FLAG_BY_COUNTRY: Record<string, string> = {
  Turkiye: "🇹🇷",
  Türkiye: "🇹🇷",
  튀르키예: "🇹🇷",
  Ukraine: "🇺🇦",
  우크라이나: "🇺🇦",
  Poland: "🇵🇱",
  폴란드: "🇵🇱",
  USA: "🇺🇸",
  미국: "🇺🇸",
  "South Korea": "🇰🇷",
  Korea: "🇰🇷",
  한국: "🇰🇷",
  Uzbekistan: "🇺🇿",
  우즈베키스탄: "🇺🇿",
};

function flagFor(country: string): string {
  return FLAG_BY_COUNTRY[country] ?? "";
}

function ComingBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center font-heading font-semibold uppercase ml-2"
      style={{
        fontSize: "9px",
        letterSpacing: "0.18em",
        padding: "2px 6px",
        borderRadius: "999px",
        backgroundColor: "rgb(var(--color-primary) / 0.18)",
        color: "rgb(var(--color-primary))",
        border: "1px solid rgb(var(--color-primary) / 0.40)",
      }}
    >
      {label}
    </span>
  );
}

function Node({
  event,
  index,
  total,
  inView,
  comingBadge,
  orientation,
}: {
  event: MilestoneEvent;
  index: number;
  total: number;
  inView: boolean;
  comingBadge: string;
  orientation: "horizontal" | "vertical";
}) {
  const accent = event.isComing;
  const flag = flagFor(event.country);

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.55,
        delay: 0.1 + index * 0.05,
        ease: EASE,
      }}
      className={
        orientation === "horizontal"
          ? "relative flex flex-col items-start flex-shrink-0"
          : "relative pl-10"
      }
      style={
        orientation === "horizontal"
          ? {
              width: "236px",
              scrollSnapAlign: "start",
              paddingLeft: "0",
              paddingRight: "24px",
            }
          : { paddingBottom: index === total - 1 ? 0 : "32px" }
      }
      aria-label={`${event.year}.${event.month} · ${event.country} · ${event.event}`}
    >
      {/* dot on axis */}
      <span
        aria-hidden="true"
        className={`absolute rounded-full ${
          accent
            ? "bg-[rgb(var(--color-primary))]"
            : "bg-[rgba(255,255,255,0.55)]"
        }`}
        style={{
          width: "10px",
          height: "10px",
          top: orientation === "horizontal" ? "0" : "6px",
          left: orientation === "horizontal" ? "0" : "12px",
          transform:
            orientation === "horizontal"
              ? "translateY(-4px)"
              : "translateX(-50%)",
          boxShadow: accent
            ? "0 0 0 4px rgba(246,163,23,0.18)"
            : "0 0 0 4px rgba(255,255,255,0.06)",
        }}
      />

      <div className={orientation === "horizontal" ? "mt-8" : "ml-0"}>
        <div
          className="font-heading font-medium text-white tabular-nums leading-none mb-2"
          style={{
            fontSize: orientation === "vertical"
              ? "clamp(1.125rem, 5.5vw, 1.75rem)"
              : "clamp(1.5rem, 2.4vw, 2rem)",
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {event.year}
          <span
            className={
              accent
                ? "text-[rgb(var(--color-primary))]"
                : "text-white/55"
            }
            style={{ marginLeft: "0.2em" }}
          >
            .{event.month}
          </span>
        </div>

        <div
          className="font-heading font-semibold uppercase text-white/65 mb-2 inline-flex items-center gap-1.5"
          style={{ fontSize: "11px", letterSpacing: "0.22em" }}
        >
          {flag && (
            <span aria-hidden="true" style={{ fontSize: "13px", lineHeight: 1 }}>
              {flag}
            </span>
          )}
          {event.country}
        </div>

        <div
          className="font-body text-white"
          style={{
            fontSize: "clamp(0.875rem, 1vw, 0.9375rem)",
            lineHeight: 1.4,
            maxWidth: orientation === "vertical" ? "100%" : "210px",
          }}
        >
          {event.event}
          {accent && <ComingBadge label={comingBadge} />}
        </div>
      </div>
    </motion.li>
  );
}

function HorizontalRail({
  events,
  sinceLabel,
  comingBadge,
  inView,
}: {
  events: ReadonlyArray<MilestoneEvent>;
  sinceLabel: string;
  comingBadge: string;
  inView: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function evaluate() {
      if (!el) return;
      const overflows = el.scrollWidth - el.clientWidth > 8;
      setCanScroll(overflows);
    }
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [events.length]);

  useEffect(() => {
    if (!inView || hasScrolled || !canScroll || reducedMotion) return;
    const el = scrollRef.current;
    if (!el) return;

    const nudgeDelay = 1200;
    const nudgeAmount = 96;
    const settleDelay = 700;

    const nudgeTimer = setTimeout(() => {
      el.scrollTo({ left: nudgeAmount, behavior: "smooth" });
      const settleTimer = setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, settleDelay);
      (el as HTMLDivElement & { _settleTimer?: ReturnType<typeof setTimeout> })._settleTimer = settleTimer;
    }, nudgeDelay);

    return () => {
      clearTimeout(nudgeTimer);
      const settle = (el as HTMLDivElement & { _settleTimer?: ReturnType<typeof setTimeout> })._settleTimer;
      if (settle) clearTimeout(settle);
    };
  }, [inView, hasScrolled, canScroll, reducedMotion]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      if (el.scrollLeft > 24) setHasScrolled(true);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const hintVisible = canScroll && !hasScrolled;

  return (
    <div className="relative">
      <div
        className="flex items-stretch"
        style={{ gap: "0" }}
      >
        <div
          className="flex-shrink-0 pr-8 pt-8 hidden md:flex flex-col justify-start"
          style={{ minWidth: "140px" }}
        >
          <span
            className="font-heading font-semibold uppercase text-white/55"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              writingMode: "horizontal-tb",
            }}
          >
            {sinceLabel}
          </span>
        </div>

        <div className="relative flex-1 min-w-0">
          <div
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label={sinceLabel}
            className="relative overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] focus-visible:outline-offset-4"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(246,163,23,0.4) rgba(255,255,255,0.06)",
            }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 bg-white/16"
              style={{ height: "1px", top: "12px" }}
              initial={{ scaleX: 0, transformOrigin: "left center" }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.4, delay: 0.25, ease: EASE }}
            />

            <ol
              className="flex items-start pt-2"
              style={{ minWidth: "max-content", paddingBottom: "12px" }}
            >
              {events.map((e, i) => (
                <Node
                  key={`${e.year}-${e.month}-${i}`}
                  event={e}
                  index={i}
                  total={events.length}
                  inView={inView}
                  comingBadge={comingBadge}
                  orientation="horizontal"
                />
              ))}
            </ol>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 right-0 transition-opacity duration-500"
            style={{
              width: "112px",
              background:
                "linear-gradient(to right, rgba(11,31,58,0) 0%, rgba(11,31,58,0.95) 75%, rgb(var(--color-ink)) 100%)",
              opacity: hintVisible ? 1 : 0,
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full"
            style={{
              top: "68px",
              backgroundColor: "rgb(var(--color-primary) / 0.18)",
              border: "1px solid rgb(var(--color-primary) / 0.45)",
              boxShadow: "0 8px 24px rgba(11,31,58,0.45)",
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0, x: 8 }}
            animate={
              hintVisible
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 8 }
            }
            transition={{ duration: 0.45, delay: 1.0, ease: EASE }}
          >
            <span
              className="font-heading font-semibold uppercase text-[rgb(var(--color-primary))]"
              style={{ fontSize: "10.5px", letterSpacing: "0.22em" }}
            >
              Scroll
            </span>
            <motion.span
              className="inline-flex text-[rgb(var(--color-primary))]"
              animate={
                reducedMotion
                  ? undefined
                  : { x: [0, 6, 0] }
              }
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function OfficeOpeningsRail({
  overline,
  title,
  subtitle,
  sinceLabel,
  comingBadge,
  events,
}: OfficeOpeningsRailProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      data-bg="dark"
      aria-labelledby="office-openings-title"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="max-w-2xl mb-12 md:mb-16">
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
            id="office-openings-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-heading font-semibold text-white"
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
            className="font-body mt-6"
            style={{
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)",
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        <HorizontalRail
          events={events}
          sinceLabel={sinceLabel}
          comingBadge={comingBadge}
          inView={inView}
        />
      </div>
    </section>
  );
}
