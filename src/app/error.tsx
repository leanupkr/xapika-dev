"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (typeof console !== "undefined") {
      console.error(error);
    }
  }, [error]);

  return (
    <main
      className="relative overflow-hidden flex items-center"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        minHeight: "100vh",
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingBottom: "clamp(5rem, 10vh, 8rem)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id="rail-grid-500"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rail-grid-500)" />
      </svg>

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(200,16,46,0.10) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-7 lg:col-span-7">
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6"
              style={{
                fontSize: "13px",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-accent))",
                }}
              />
              Signal disrupted / 신호 장애
            </span>

            <h1
              className="font-heading font-semibold text-white mb-6"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Something derailed.
            </h1>

            <p
              className="font-body mb-3"
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.1875rem)",
                color: "rgba(255,255,255,0.72)",
                maxWidth: "560px",
                lineHeight: 1.65,
              }}
            >
              We&apos;ve logged the issue. Try again, or return home and we&apos;ll get you back on track.
            </p>

            <p
              className="font-body mb-10"
              style={{
                fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                color: "rgba(255,255,255,0.55)",
                maxWidth: "560px",
                lineHeight: 1.65,
              }}
            >
              오류를 기록했습니다. 다시 시도하시거나 홈으로 돌아가 주세요.
            </p>

            {error?.digest ? (
              <p
                className="font-mono mb-8"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                ref · {error.digest}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-2 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
                style={{ fontSize: "14px", letterSpacing: "0.05em" }}
              >
                Try again / 다시 시도
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-4 font-heading font-medium transition-colors duration-200"
                style={{
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:col-span-5 lg:col-span-5">
            <div className="flex justify-end">
              <div
                aria-hidden="true"
                className="font-heading font-semibold leading-none"
                style={{
                  fontSize: "clamp(8rem, 18vw, 14rem)",
                  letterSpacing: "-0.04em",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(200,16,46,0.55)",
                }}
              >
                500
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
    </main>
  );
}
