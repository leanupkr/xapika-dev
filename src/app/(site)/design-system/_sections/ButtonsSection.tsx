"use client";

import { SectionHeader } from "./ColorsSection";

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium text-[rgb(var(--color-ink-muted)/0.6)] uppercase tracking-wider">
      {children}
    </p>
  );
}

// 실제 인터랙티브 Primary 버튼 (hover/active/focus 상태 실제 적용)
function PrimaryButtonLive() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out select-none"
      style={{
        background: "rgb(var(--color-primary))",
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 4px 12px rgba(246,163,23,0.25)";
        el.style.background = "rgb(var(--color-primary-hover))";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "inset 0 -1px 0 rgba(0,0,0,0.1)";
        el.style.background = "rgb(var(--color-primary))";
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.12)";
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 4px 12px rgba(246,163,23,0.25)";
      }}
    >
      Explore Solutions
    </button>
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
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out select-none";

  const variants: Record<string, { default: string; hover: string; active: string; focus: string; disabled: string }> = {
    primary: {
      default: `${base} bg-[rgb(var(--color-primary))] text-white [box-shadow:inset_0_-1px_0_rgba(0,0,0,0.1)]`,
      hover: `${base} bg-[rgb(var(--color-primary-hover))] text-white -translate-y-px [box-shadow:0_4px_12px_rgba(246,163,23,0.25)]`,
      active: `${base} bg-[rgb(var(--color-primary-hover))] text-white translate-y-0 [box-shadow:inset_0_1px_2px_rgba(0,0,0,0.12)]`,
      focus: `${base} bg-[rgb(var(--color-primary))] text-white ring-2 ring-[rgb(246_163_23/0.4)] ring-offset-2 [box-shadow:inset_0_-1px_0_rgba(0,0,0,0.1)]`,
      disabled: `${base} bg-[rgb(var(--color-ink)/0.12)] text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    secondary: {
      default: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-transparent`,
      hover: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.05)] -translate-y-px shadow-sm`,
      active: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.08)] translate-y-0`,
      focus: `${base} border border-[rgb(var(--color-ink))] text-[rgb(var(--color-ink))] bg-transparent ring-2 ring-[rgb(var(--color-ink)/0.25)] ring-offset-2`,
      disabled: `${base} border border-[rgb(var(--color-ink)/0.2)] text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    ghost: {
      default: `${base} text-[rgb(var(--color-ink))] bg-transparent`,
      hover: `${base} text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.05)] -translate-y-px`,
      active: `${base} text-[rgb(var(--color-ink))] bg-[rgb(var(--color-ink)/0.08)] translate-y-0`,
      focus: `${base} text-[rgb(var(--color-ink))] bg-transparent ring-2 ring-[rgb(var(--color-ink)/0.2)] ring-offset-2`,
      disabled: `${base} text-[rgb(var(--color-ink)/0.35)] cursor-not-allowed`,
    },
    link: {
      default: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary))] underline underline-offset-4 decoration-[rgb(var(--color-primary)/0.4)] transition-all duration-200`,
      hover: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary-hover))] underline underline-offset-4 decoration-[rgb(var(--color-primary-hover))]`,
      active: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary-hover))] underline underline-offset-4`,
      focus: `inline-flex items-center gap-1 text-sm font-semibold text-[rgb(var(--color-primary))] underline underline-offset-4 ring-2 ring-[rgb(246_163_23/0.4)] ring-offset-2 rounded-sm`,
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
        <div>
          <StateLabel>Default</StateLabel>
          <div className={v.default}>Explore Solutions</div>
        </div>
        <div>
          <StateLabel>Hover</StateLabel>
          <div className={v.hover}>Explore Solutions</div>
        </div>
        <div>
          <StateLabel>Active</StateLabel>
          <div className={v.active}>Explore Solutions</div>
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

      {/* 인터랙티브 Primary 버튼 데모 */}
      <div className="mt-6 rounded-xl border border-[rgb(var(--color-primary)/0.15)] bg-[rgb(var(--color-primary-subtle))] px-6 py-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--color-primary))]">
          Interactive Demo
        </p>
        <p className="mb-4 text-xs text-[rgb(var(--color-ink-muted))]">
          실제 hover / active / focus 상태를 직접 체험해보세요.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButtonLive />
          <span className="text-xs text-[rgb(var(--color-ink-muted))]">
            inner shadow · translateY(-1px) on hover · ring-2 on focus-visible
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <ButtonRow variant="primary" description="inner shadow + hover lift + orange glow" />
        <ButtonRow variant="secondary" description="border border-ink, transparent bg" />
        <ButtonRow variant="ghost" description="no border, subtle hover bg" />
        <ButtonRow variant="link" description="text-primary, underline offset" />
      </div>
    </section>
  );
}
