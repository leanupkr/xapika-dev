import Link from "next/link";

export default function NotFound() {
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
            id="rail-grid-404"
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
        <rect width="100%" height="100%" fill="url(#rail-grid-404)" />
      </svg>

      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(246,163,23,0.10) 0%, transparent 65%)",
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
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              Off track / 경로 이탈
            </span>

            <h1
              className="font-heading font-semibold text-white mb-6"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              This stop isn&apos;t on our network.
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
              The page you requested doesn&apos;t exist — or has been moved to another route.
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
              요청하신 페이지를 찾을 수 없습니다. 다른 경로로 이동했거나 더 이상 제공되지 않는 페이지일 수 있습니다.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/en"
                className="inline-flex items-center gap-2 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
                style={{ fontSize: "14px", letterSpacing: "0.05em" }}
              >
                Back to home
              </Link>
              <Link
                href="/ko"
                className="inline-flex items-center gap-2 px-7 py-4 font-heading font-medium transition-colors duration-200"
                style={{
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                홈으로 돌아가기
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
                  WebkitTextStroke: "1px rgba(246,163,23,0.45)",
                }}
              >
                404
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
