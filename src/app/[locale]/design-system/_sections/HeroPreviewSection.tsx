import Image from "next/image";

export function HeroPreviewSection() {
  return (
    <section data-section="hero-preview">
      {/* 섹션 라벨 */}
      <div className="mb-6 flex items-baseline gap-3 border-b border-[rgb(var(--color-ink)/0.08)] pb-4">
        <span className="font-mono text-xs font-semibold text-[rgb(var(--color-primary))]">10</span>
        <h2 className="text-xl font-bold text-[rgb(var(--color-ink))]">Hero Preview</h2>
      </div>
      <p className="mb-6 text-sm text-[rgb(var(--color-ink-muted))]">
        B+A 하이브리드 톤 — 전문성과 신뢰(Ink)에 활력(Primary)을 더한 실제 Hero 섹션 프리뷰.
      </p>

      {/* Hero 다크 프리뷰 */}
      <div className="relative min-h-[80vh] overflow-hidden rounded-2xl">
        {/* 배경 이미지 */}
        <Image
          src="/hero/hero-01-wide.jpg"
          alt="Xapika Engineering — 격납고 광각"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* 오버레이 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(11,31,58,0.88) 0%, rgba(11,31,58,0.65) 50%, rgba(11,31,58,0.40) 100%)",
          }}
        />

        {/* 콘텐츠 */}
        <div className="relative flex h-full min-h-[80vh] flex-col justify-between px-8 py-12 sm:px-14 sm:py-16 lg:px-20 lg:py-20">
          {/* 상단 오버라인 */}
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "rgb(var(--color-primary))" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "rgb(var(--color-primary))" }}
            >
              Rail Maintenance Excellence
            </span>
          </div>

          {/* 메인 콘텐츠 — 중앙 정렬 */}
          <div className="flex flex-1 flex-col justify-center py-8">
            {/* Hero H1 */}
            <h1
              className="max-w-4xl text-white"
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Perfect Work.{" "}
              <span style={{ color: "rgb(var(--color-primary))" }}>
                Safe Operations.
              </span>
            </h1>

            {/* 서브헤드 */}
            <p
              className="mt-6 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Delivering precision maintenance with uncompromised safety.
              Trusted by rail operators across 12 countries.
            </p>

            {/* CTA 버튼 2개 */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 ease-out"
                style={{
                  background: "rgb(var(--color-primary))",
                  boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(246,163,23,0.3)",
                }}
              >
                Explore Solutions
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Ghost white border CTA */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 ease-out"
                style={{
                  borderColor: "rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* 하단 스크롤 인디케이터 */}
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-[rgba(255,255,255,0.4)]">
              Scroll
            </span>
            <svg
              className="h-4 w-4 text-[rgba(255,255,255,0.35)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 하단 주황 그라데이션 액센트 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, rgb(var(--color-primary)) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 스펙 메모 */}
      <div className="mt-4 flex flex-wrap gap-4">
        {[
          { label: "Background", value: "hero-01-wide.jpg + overlay gradient" },
          { label: "Hero H1", value: "clamp(3rem, 7vw, 6rem) / 700 / -0.02em" },
          { label: "Subhead", value: "clamp(1rem, 2vw, 1.25rem) / white/80%" },
          { label: "Min Height", value: "80vh" },
        ].map((spec) => (
          <div key={spec.label} className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[rgb(var(--color-ink-muted))]">{spec.label}:</span>
            <span className="font-mono text-xs text-[rgb(var(--color-ink-muted)/0.7)]">{spec.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
