import { SectionHeader } from "./ColorsSection";

type TypeSample = {
  tag: string;
  label: string;
  spec: string;
  sample: string;
  style: React.CSSProperties;
  className?: string;
  isHero?: boolean;
};

const heroSample: TypeSample = {
  tag: "Hero",
  label: "Hero H1",
  spec: "72–96px / 700 / letter-spacing -0.02em / line-height 1.05",
  sample: "Perfect Work. Safe Operations.",
  style: {
    fontSize: "clamp(4.5rem, 8vw, 6rem)",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
  },
  isHero: true,
};

const typeSamples: TypeSample[] = [
  {
    tag: "H1",
    label: "Heading 1",
    spec: "clamp(2rem, 4vw, 3.5rem) / 700 / line-height 1.08",
    sample: "Perfect Work. Safe Operations.",
    style: { fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, lineHeight: 1.08 },
  },
  {
    tag: "H2",
    label: "Heading 2",
    spec: "clamp(1.5rem, 2.5vw, 2.25rem) / 600",
    sample: "Delivering Precision Maintenance",
    style: { fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", fontWeight: 600, lineHeight: 1.15 },
  },
  {
    tag: "H3",
    label: "Heading 3",
    spec: "1.5rem / 600",
    sample: "Key Numbers",
    style: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25 },
  },
  {
    tag: "H4",
    label: "Heading 4",
    spec: "1.25rem / 600",
    sample: "Light Maintenance",
    style: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 },
  },
  {
    tag: "H5",
    label: "Heading 5",
    spec: "1.125rem / 600",
    sample: "Component Overhaul & Repair",
    style: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
  },
  {
    tag: "H6",
    label: "Heading 6",
    spec: "1rem / 600",
    sample: "NDT Inspection Services",
    style: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },
  },
  {
    tag: "Body",
    label: "Body",
    spec: "1rem / 400 / leading-relaxed",
    sample:
      "Xapika Engineering provides comprehensive rail vehicle maintenance services, ensuring operational excellence across 227 vehicles in our fleet portfolio.",
    style: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.65 },
  },
  {
    tag: "Caption",
    label: "Caption",
    spec: "0.8125rem / 400",
    sample: "Updated March 2026",
    style: { fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.5 },
    className: "text-[rgb(var(--color-ink-muted))]",
  },
  {
    tag: "OL",
    label: "Overline",
    spec: "0.75rem / 600 / uppercase / tracking-widest",
    sample: "SOLUTIONS",
    style: {
      fontSize: "0.75rem",
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    className: "text-[rgb(var(--color-primary))]",
  },
];

export function TypographySection() {
  return (
    <section>
      <SectionHeader label="02" title="Typography Scale" />

      {/* Hero H1 — 별도 섹션 */}
      <div className="mt-8 overflow-hidden rounded-xl border border-[rgb(var(--color-primary)/0.15)] bg-[rgb(var(--color-ink))] p-6 sm:p-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-block rounded bg-[rgb(var(--color-primary)/0.2)] px-2 py-0.5 font-mono text-xs font-semibold text-[rgb(var(--color-primary))]">
            Hero
          </span>
          <span className="text-xs text-[rgb(255_255_255/0.4)]">{heroSample.spec}</span>
        </div>
        <p
          style={{ fontFamily: "Inter, sans-serif", ...heroSample.style }}
          className="text-white"
        >
          {heroSample.sample}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-0.5 w-8 bg-[rgb(var(--color-primary))]" />
          <p className="text-xs text-[rgb(255_255_255/0.4)]">
            Hero H1 — 다크 배경 Hero 섹션 전용. 일반 H1과 구분하여 사용.
          </p>
        </div>
      </div>

      {/* 일반 타입 스케일 */}
      <div className="mt-6 divide-y divide-[rgb(var(--color-ink)/0.06)]">
        {typeSamples.map((t) => (
          <div key={t.tag} className="grid grid-cols-[4rem_1fr] gap-6 py-5 sm:grid-cols-[5rem_1fr]">
            <div className="pt-1">
              <span className="inline-block rounded bg-[rgb(var(--color-ink)/0.06)] px-1.5 py-0.5 font-mono text-xs font-semibold text-[rgb(var(--color-ink-muted))]">
                {t.tag}
              </span>
              <p className="mt-1.5 text-xs text-[rgb(var(--color-ink-muted)/0.6)]">{t.spec}</p>
            </div>
            <p
              className={t.className ?? "text-[rgb(var(--color-ink))]"}
              style={{ fontFamily: "Inter, sans-serif", ...t.style }}
            >
              {t.sample}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
