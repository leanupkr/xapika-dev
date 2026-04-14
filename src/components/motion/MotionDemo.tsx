"use client";

import { motion, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

// --- Fade In Demo ---
export function FadeInDemo() {
  const controls = useAnimation();
  const [key, setKey] = useState(0);

  const replay = () => {
    controls.set({ opacity: 0, y: 20 });
    setKey((k) => k + 1);
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } });
  };

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.48, ease: easeOut } });
  }, [controls]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="w-full rounded-lg bg-[rgb(var(--color-ink))] px-6 py-4 text-center"
      >
        <p className="text-sm font-semibold tracking-wide text-white">Fade In Element</p>
        <p className="mt-1 text-xs text-[rgb(var(--color-ink-muted)/0.6)] text-white/50">
          opacity 0→1, y 20→0
        </p>
      </motion.div>
      <button
        onClick={replay}
        className="rounded-md border border-[rgb(var(--color-ink)/0.2)] px-4 py-1.5 text-xs font-medium text-[rgb(var(--color-ink-muted))] transition-colors duration-200 hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
      >
        Replay
      </button>
    </div>
  );
}

// --- Slide Up Demo ---
export function SlideUpDemo() {
  const [key, setKey] = useState(0);

  const replay = () => setKey((k) => k + 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-lg">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: easeOut }}
          className="w-full rounded-lg border border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.06)] px-6 py-4 text-center"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-primary))]">Slide Up Element</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-ink-muted))]">y 40→0, opacity 0→1</p>
        </motion.div>
      </div>
      <button
        onClick={replay}
        className="rounded-md border border-[rgb(var(--color-ink)/0.2)] px-4 py-1.5 text-xs font-medium text-[rgb(var(--color-ink-muted))] transition-colors duration-200 hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
      >
        Replay
      </button>
    </div>
  );
}

// --- Count Up Demo ---
export function CountUpDemo() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [started, setStarted] = useState(false);
  const controlRef = useRef<ReturnType<typeof animate> | null>(null);

  const start = () => {
    if (controlRef.current) controlRef.current.stop();
    count.set(0);
    setStarted(true);
    controlRef.current = animate(count, 22000, {
      duration: 2,
      ease: easeOut,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-accent)/0.05)] px-6 py-4 text-center">
        <motion.span className="block text-3xl font-bold tabular-nums text-[rgb(var(--color-accent))]">
          {started ? rounded : "0"}
        </motion.span>
        <p className="mt-1 text-xs text-[rgb(var(--color-ink-muted))]">
          Maintenance Hours (count up)
        </p>
      </div>
      <button
        onClick={start}
        className="rounded-md border border-[rgb(var(--color-ink)/0.2)] px-4 py-1.5 text-xs font-medium text-[rgb(var(--color-ink-muted))] transition-colors duration-200 hover:border-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent))]"
      >
        {started ? "Replay" : "Start"}
      </button>
    </div>
  );
}
