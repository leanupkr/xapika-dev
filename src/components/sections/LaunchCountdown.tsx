"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type LaunchCountdownProps = {
  overline: string;
  title: string;
  subtitle: string;
  launchDate: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  partnerNote: string;
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // ms remaining
};

function computeRemaining(launchDate: Date): Remaining {
  const now = Date.now();
  const diff = launchDate.getTime() - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: diff };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  return { days, hours, minutes, seconds, total: diff };
}

// Contract signed Q4 2024 — approximate anchor date for the progress bar
const CONTRACT_DATE = new Date("2024-10-01T00:00:00Z");

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

interface DigitUnitProps {
  value: string | null;
  label: string;
  isFirst?: boolean;
  index: number;
  inView: boolean;
}

function DigitUnit({ value, label, isFirst = false, index, inView }: DigitUnitProps) {
  return (
    <div className="relative flex items-start">
      {/* Vertical divider — only between columns */}
      {!isFirst && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 self-center mr-3 md:mr-5"
          style={{
            width: "1px",
            height: "60%",
            minHeight: "3rem",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
      )}
      <motion.div
        className="flex flex-col min-w-0"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.65,
          delay: 0.1 + index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Big digit */}
        <span
          className="font-heading font-semibold text-white leading-none tabular-nums"
          style={{
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            // Prevent layout shift while SSR displays "--"
            minWidth: index === 0 ? "3ch" : "2ch",
          }}
          aria-hidden="true"
        >
          {value ?? "--"}
        </span>

        {/* Unit label */}
        <span
          className="font-heading uppercase mt-2"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {label}
        </span>
      </motion.div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────

export default function LaunchCountdown({
  overline,
  title,
  subtitle,
  launchDate,
  labels,
  partnerNote,
}: LaunchCountdownProps): ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const targetDate = new Date(launchDate);
  const hasLaunched = targetDate.getTime() <= Date.now();

  // ── SSR mismatch guard ────────────────────────────────────────────────────
  // Server renders null → client hydrates with null → after mount starts tick.
  // This avoids any server/client mismatch on the counter digits.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  // Accessible announcement — updated only on minute boundary
  const [announceText, setAnnounceText] = useState("");
  const lastAnnouncedMinute = useRef<number>(-1);

  useEffect(() => {
    if (hasLaunched) {
      setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      return;
    }

    // Initial paint
    const initial = computeRemaining(targetDate);
    setRemaining(initial);

    const id = setInterval(() => {
      const r = computeRemaining(targetDate);
      setRemaining(r);

      if (r.total <= 0) {
        clearInterval(id);
        return;
      }

      // Update aria-live only when minute changes
      if (r.minutes !== lastAnnouncedMinute.current) {
        lastAnnouncedMinute.current = r.minutes;
        setAnnounceText(
          `${r.days} days, ${r.hours} hours, ${r.minutes} minutes remaining until Tashkent launch`
        );
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Progress bar ──────────────────────────────────────────────────────────
  const totalSpan = targetDate.getTime() - CONTRACT_DATE.getTime();
  const elapsed = Date.now() - CONTRACT_DATE.getTime();
  const progressPct = Math.min(1, Math.max(0, elapsed / totalSpan)) * 100;

  // ── Digit strings ─────────────────────────────────────────────────────────
  const dDays = remaining != null ? String(remaining.days).padStart(3, "0") : null;
  const dHours = remaining != null ? String(remaining.hours).padStart(2, "0") : null;
  const dMinutes = remaining != null ? String(remaining.minutes).padStart(2, "0") : null;
  const dSeconds = remaining != null ? String(remaining.seconds).padStart(2, "0") : null;

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="launch-countdown-title"
    >
      {/* Hairlines */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Ambient glow — right side */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[50%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 40%, rgba(246,163,23,0.07) 0%, transparent 60%)",
        }}
      />

      {/* Hidden accessible live region — updates on minute only */}
      <span
        aria-live="polite"
        className="sr-only"
      >
        {announceText}
      </span>

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 items-center"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* ── Left column (col-span-7) ──────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-0">
          {/* Overline */}
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase text-[rgb(var(--color-primary))] mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.22em" }}
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

          {/* Title */}
          <motion.h2
            id="launch-countdown-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-semibold text-white mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
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
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-body mb-10"
            style={{
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: "52ch",
            }}
          >
            {subtitle}
          </motion.p>

          {/* ── Countdown ──────────────────────────────────────────────── */}
          {hasLaunched || (remaining !== null && remaining.total <= 0) ? (
            /* Launched fallback */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 py-6"
              aria-label="Uzbekistan HSR operations launched"
            >
              <span
                aria-hidden="true"
                className="inline-block"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "rgb(var(--color-primary))",
                  boxShadow: "0 0 0 3px rgba(246,163,23,0.22)",
                }}
              />
              <span
                className="font-heading font-semibold text-white"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.02em" }}
              >
                Operations launched
              </span>
            </motion.div>
          ) : (
            /* Live counter */
            <div
              role="timer"
              aria-label="Days remaining until Tashkent launch"
              className="flex items-stretch gap-3 md:gap-5"
            >
              <DigitUnit
                value={dDays}
                label={labels.days}
                isFirst
                index={0}
                inView={inView}
              />
              <DigitUnit
                value={dHours}
                label={labels.hours}
                index={1}
                inView={inView}
              />
              <DigitUnit
                value={dMinutes}
                label={labels.minutes}
                index={2}
                inView={inView}
              />
              <DigitUnit
                value={dSeconds}
                label={labels.seconds}
                index={3}
                inView={inView}
              />
            </div>
          )}

          {/* Static date indicator — always visible, SR accessible */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            className="font-heading mt-6"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.38)",
              textTransform: "uppercase",
            }}
          >
            Launch · 31 May 2026 · Tashkent
          </motion.p>

          {/* ── Progress bar ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="mt-8"
            aria-hidden="true"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full"
                style={{ backgroundColor: "rgb(var(--color-primary))" }}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${progressPct}%` } : undefined}
                transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div
              className="flex justify-between mt-2 font-heading"
              style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}
            >
              <span>CONTRACT · Q4 2024</span>
              <span>LAUNCH · MAY 2026</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right column (col-span-5) ─────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-center gap-5">
          {/* GIF wrapper with corner ticks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              backgroundColor: "rgba(255,255,255,0.02)",
              padding: "12px",
            }}
          >
            <Image
              src="/vision-it/express-train.gif"
              alt="Vision IT express train motion"
              width={240}
              height={160}
              unoptimized
              className="block"
              style={{ display: "block" }}
            />

            {/* Corner ticks — PortfolioStory pattern */}
            {(
              [
                { top: 6, left: 6 },
                { top: 6, right: 6 },
                { bottom: 6, left: 6 },
                { bottom: 6, right: 6 },
              ] as Array<{ top?: number; right?: number; bottom?: number; left?: number }>
            ).map((pos, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute block pointer-events-none"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  width: "8px",
                  height: "8px",
                  borderTop:
                    pos.top !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderBottom:
                    pos.bottom !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderLeft:
                    pos.left !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                  borderRight:
                    pos.right !== undefined
                      ? "1.5px solid rgb(var(--color-primary))"
                      : undefined,
                }}
              />
            ))}
          </motion.div>

          {/* Partner caption */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <Image
              src="/partners/vision-it.png"
              alt="VISION IT"
              width={16}
              height={16}
              className="opacity-60"
              style={{ objectFit: "contain" }}
            />
            <span
              className="font-heading"
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.42)",
                textTransform: "uppercase",
              }}
            >
              {partnerNote}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
