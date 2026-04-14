import { SectionHeader } from "./ColorsSection";

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium text-[rgb(var(--color-ink-muted)/0.6)] uppercase tracking-wider">
      {children}
    </p>
  );
}

function ButtonRow({
  variant,
  description,
}: {
  variant: string;
  description: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all select-none";

  const variants: Record<string, { default: string; hover: string; focus: string; disabled: string }> = {
    primary: {
      default: `${base} bg-[rgb(var(--color-primary))] text-white shadow-sm`,
      hover: `${base} bg-[rgb(var(--color-primary-hover))] text-white shadow-md -translate-y-px`,
      focus: `${base} bg-[rgb(var(--color-primary))] text-white outline outline-2 outline-offset-2 outline-[rgb(var(--color-primary))]`,
      disabled: `${base} bg-[rgb(var(--color-ink)/0.12)] text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    secondary: {
      default: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-transparent`,
      hover: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.05)] -translate-y-px`,
      focus: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-transparent outline outline-2 outline-offset-2 outline-[rgb(var(--color-ink))]`,
      disabled: `${base} border border-[rgb(var(--color-ink)/0.2)] text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    ghost: {
      default: `${base} text-[rgb(var(--color-ink))] bg-transparent`,
      hover: `${base} text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.05)]`,
      focus: `${base} text-[rgb(var(--color-ink))] bg-transparent outline outline-2 outline-offset-2 outline-[rgb(var(--color-ink)/0.4)]`,
      disabled: `${base} text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    link: {
      default: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary))] underline underline-offset-4 decoration-[rgb(var(--color-primary)/0.4)] transition-all`,
      hover: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary-hover))] underline underline-offset-4 decoration-[rgb(var(--color-primary-hover))]`,
      focus: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary))] underline underline-offset-4 outline outline-2 outline-offset-2 outline-[rgb(var(--color-primary)/0.6)] rounded-sm`,
      disabled: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed line-through`,
    },
  };

  const v = variants[variant];

  return (
    <div className="rounded-xl border border-[rgb(var(--color-ink)/0.07)] bg-[rgb(var(--color-bg))] p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-bold text-[rgb(var(--color-ink))] capitalize">{variant}</span>
        <span className="text-xs text-[rgb(var(--color-ink-muted))]">— {description}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div>
          <StateLabel>Default</StateLabel>
          <div className={v.default}>Explore Solutions</div>
        </div>
        <div>
          <StateLabel>Hover</StateLabel>
          <div className={v.hover}>Explore Solutions</div>
        </div>
        <div>
          <StateLabel>Focus</StateLabel>
          <div className={v.focus}>Explore Solutions</div>
        </div>
        <div>
          <StateLabel>Disabled</StateLabel>
          <div className={v.disabled} aria-disabled="true">
            Explore Solutions
          </div>
        </div>
      </div>
    </div>
  );
}

export function ButtonsSection() {
  return (
    <section>
      <SectionHeader label="03" title="Buttons" />
      <div className="mt-8 space-y-4">
        <ButtonRow variant="primary" description="bg-primary, text-white, rounded-lg" />
        <ButtonRow variant="secondary" description="border border-ink, transparent bg" />
        <ButtonRow variant="ghost" description="no border, subtle hover bg" />
        <ButtonRow variant="link" description="text-primary, underline offset" />
      </div>
    </section>
  );
}
