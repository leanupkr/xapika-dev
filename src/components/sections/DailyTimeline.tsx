"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type DailyTimelineStep = {
  time: string;
  label: string;
  desc: string;
};

type DailyTimelineProps = {
  overline: string;
  title: string;
  steps: ReadonlyArray<DailyTimelineStep>;
};

export default function DailyTimeline({
  overline,
  title,
  steps,
}: DailyTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!stepsRef.current) return;
      const items = stepsRef.current.querySelectorAll("[data-step]");
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          items,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => sectionRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

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
      aria-labelledby="daily-timeline-title"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(246,163,23,0.07) 0%, transparent 55%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <span
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
          </span>
          <h2
            id="daily-timeline-title"
            className="font-heading font-semibold text-white"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: "20ch",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Horizontal timeline */}
        <ol
          ref={stepsRef}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-y-0 md:gap-x-6 list-none m-0 p-0"
        >
          {/* Horizontal rail line (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 pointer-events-none"
            style={{
              top: "44px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />

          {steps.map((step, i) => (
            <li key={step.time} data-step className="relative opacity-0">
              {/* Time chip */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  aria-hidden="true"
                  className="inline-block flex-shrink-0 rounded-full"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "rgb(var(--color-primary))",
                    boxShadow: "0 0 0 4px rgb(var(--color-primary) / 0.15)",
                  }}
                />
                <span
                  className="font-heading font-medium tabular-nums text-white/45"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.22em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
              </div>

              {/* Time value */}
              <div
                className="font-heading font-semibold text-white tabular-nums leading-none mb-4"
                style={{
                  fontSize: "clamp(2rem, 3.4vw, 2.625rem)",
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {step.time}
              </div>

              {/* Label */}
              <div
                className="font-heading font-semibold text-white mb-2"
                style={{
                  fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.25,
                }}
              >
                {step.label}
              </div>

              {/* Description */}
              <p
                className="font-body"
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}
