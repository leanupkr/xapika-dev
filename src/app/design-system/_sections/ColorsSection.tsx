type Swatch = {
  label: string;
  hex: string;
  variable: string;
  bgStyle: string;
  textClass: string;
};

const swatches: Swatch[] = [
  {
    label: "Primary",
    hex: "#f6a317",
    variable: "--color-primary",
    bgStyle: "rgb(246 163 23)",
    textClass: "text-white",
  },
  {
    label: "Primary Hover",
    hex: "#d18608",
    variable: "--color-primary-hover",
    bgStyle: "rgb(209 134 8)",
    textClass: "text-white",
  },
  {
    label: "Primary Subtle",
    hex: "#fdefd7",
    variable: "--color-primary-subtle",
    bgStyle: "rgb(253 239 215)",
    textClass: "text-[rgb(11_31_58)]",
  },
  {
    label: "Accent",
    hex: "#C8102E",
    variable: "--color-accent",
    bgStyle: "rgb(200 16 46)",
    textClass: "text-white",
  },
  {
    label: "Ink",
    hex: "#0B1F3A",
    variable: "--color-ink",
    bgStyle: "rgb(11 31 58)",
    textClass: "text-white",
  },
  {
    label: "Ink Muted",
    hex: "#475569",
    variable: "--color-ink-muted",
    bgStyle: "rgb(71 85 105)",
    textClass: "text-white",
  },
  {
    label: "Background",
    hex: "#F7F8FA",
    variable: "--color-bg",
    bgStyle: "rgb(247 248 250)",
    textClass: "text-[rgb(11_31_58)]",
  },
  {
    label: "Surface",
    hex: "#FFFFFF",
    variable: "--color-surface",
    bgStyle: "rgb(255 255 255)",
    textClass: "text-[rgb(11_31_58)]",
  },
];

type OrangeVariant = {
  label: string;
  hex: string;
  rgb: string;
  note: string;
  isCurrent?: boolean;
};

const orangeVariants: OrangeVariant[] = [
  {
    label: "공식 로고 주황",
    hex: "#f6a317",
    rgb: "246 163 23",
    note: "현재 적용 — PDF 벡터 추출, 최빈 223회",
    isCurrent: true,
  },
  {
    label: "이전 임시값",
    hex: "#F57C00",
    rgb: "245 124 0",
    note: "구 버전 — Material Orange 700",
  },
  {
    label: "더 깊은 주황",
    hex: "#EA580C",
    rgb: "234 88 12",
    note: "대안 — Tailwind Orange 600",
  },
];

export function ColorsSection() {
  return (
    <section>
      <SectionHeader label="01" title="Colors" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {swatches.map((s) => (
          <div key={s.variable} className="group">
            <div
              className="h-20 w-full rounded-lg border border-[rgb(var(--color-ink)/0.08)] shadow-sm transition-transform duration-200 ease-out group-hover:-translate-y-1"
              style={{ background: s.bgStyle }}
            />
            <div className="mt-2 space-y-0.5">
              <p className="text-sm font-semibold text-[rgb(var(--color-ink))]">{s.label}</p>
              <p className="font-mono text-xs text-[rgb(var(--color-ink-muted))]">{s.hex}</p>
              <p className="font-mono text-xs text-[rgb(var(--color-ink-muted)/0.6)]">
                {s.variable}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Orange Comparison 서브섹션 */}
      <div className="mt-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--color-ink-muted))]">
          Orange Comparison
        </p>
        <p className="mb-5 text-xs text-[rgb(var(--color-ink-muted))]">
          3가지 주황 옵션을 라이트/다크 배경 양쪽에서 비교합니다.
        </p>

        {/* 라이트 배경 비교 */}
        <div className="mb-3 overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.07)] bg-white p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.5)]">
            On Light Background
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {orangeVariants.map((v) => (
              <div key={v.hex} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-10 w-10 shrink-0 rounded-lg shadow-sm"
                  style={{ background: `rgb(${v.rgb})` }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-[rgb(var(--color-ink))]">{v.label}</p>
                    {v.isCurrent && (
                      <span className="rounded-full bg-[rgb(var(--color-primary)/0.12)] px-1.5 py-0.5 text-xs font-semibold text-[rgb(var(--color-primary))]">
                        현재
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[rgb(var(--color-ink-muted))]">{v.hex}</p>
                  <p className="mt-0.5 text-xs text-[rgb(var(--color-ink-muted)/0.6)]">{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 다크 배경 비교 */}
        <div className="overflow-hidden rounded-xl bg-[rgb(var(--color-ink))] p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[rgb(255_255_255/0.3)]">
            On Dark Background
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {orangeVariants.map((v) => (
              <div key={v.hex} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-10 w-10 shrink-0 rounded-lg"
                  style={{ background: `rgb(${v.rgb})` }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">{v.label}</p>
                    {v.isCurrent && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-xs font-semibold"
                        style={{ background: `rgb(${v.rgb} / 0.2)`, color: `rgb(${v.rgb})` }}
                      >
                        현재
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[rgb(255_255_255/0.5)]">{v.hex}</p>
                  <p className="mt-0.5 text-xs text-[rgb(255_255_255/0.35)]">{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Shared section header used across all sections
export function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-[rgb(var(--color-ink)/0.08)] pb-4">
      <span className="font-mono text-xs font-semibold text-[rgb(var(--color-primary))]">
        {label}
      </span>
      <h2 className="text-xl font-bold text-[rgb(var(--color-ink))]">{title}</h2>
    </div>
  );
}
