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
    hex: "#F57C00",
    variable: "--color-primary",
    bgStyle: "rgb(245 124 0)",
    textClass: "text-white",
  },
  {
    label: "Primary Hover",
    hex: "#E65100",
    variable: "--color-primary-hover",
    bgStyle: "rgb(230 81 0)",
    textClass: "text-white",
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
    textClass: "text-ink",
  },
  {
    label: "Surface",
    hex: "#FFFFFF",
    variable: "--color-surface",
    bgStyle: "rgb(255 255 255)",
    textClass: "text-ink",
  },
];

export function ColorsSection() {
  return (
    <section>
      <SectionHeader label="01" title="Colors" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {swatches.map((s) => (
          <div key={s.variable} className="group">
            <div
              className="h-20 w-full rounded-lg border border-[rgb(var(--color-ink)/0.08)] shadow-sm transition-transform duration-200 group-hover:-translate-y-1"
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
