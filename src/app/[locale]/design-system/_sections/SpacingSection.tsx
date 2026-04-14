import { SectionHeader } from "./ColorsSection";

export function SpacingSection() {
  return (
    <section>
      <SectionHeader label="07" title="Section Spacing" />
      <div className="mt-8 space-y-2">
        <p className="text-sm text-[rgb(var(--color-ink-muted))]">
          <code className="rounded bg-[rgb(var(--color-ink)/0.06)] px-1.5 py-0.5 text-xs font-mono">
            --space-section
          </code>
          {" "}= 7.5rem (120px desktop) /{" "}
          <code className="rounded bg-[rgb(var(--color-ink)/0.06)] px-1.5 py-0.5 text-xs font-mono">
            --space-section-mobile
          </code>
          {" "}= 4rem (64px mobile)
        </p>

        {/* Visual representation */}
        <div className="mt-6 overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.08)]">
          {/* Dark section */}
          <div
            className="flex items-center justify-between px-8"
            style={{
              background: "rgb(var(--color-ink))",
              paddingTop: "var(--space-section)",
              paddingBottom: "var(--space-section)",
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--color-primary))]">
                SOLUTIONS
              </p>
              <h2
                className="mt-3 font-bold text-white"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700 }}
              >
                Delivering Precision Maintenance
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                End-to-end rail vehicle MRO services for operators across Central & Eastern Europe,
                delivered to EN 15085 and ISO 9001 standards.
              </p>
            </div>
            <div className="hidden items-center gap-1 text-white/30 sm:flex">
              <div className="flex h-24 w-px flex-col items-center justify-between bg-white/20">
                <span className="text-[10px] -rotate-90 translate-x-[-20px] whitespace-nowrap">120px</span>
              </div>
            </div>
          </div>

          {/* Spacing indicator */}
          <div className="flex items-center justify-center border-y border-dashed border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.04)] py-2">
            <span className="font-mono text-xs text-[rgb(var(--color-primary))]">
              ↕ var(--space-section) = 120px desktop / 64px mobile
            </span>
          </div>

          {/* Light section */}
          <div
            className="px-8"
            style={{
              background: "rgb(var(--color-surface))",
              paddingTop: "var(--space-section)",
              paddingBottom: "var(--space-section)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--color-primary))]">
              PORTFOLIO
            </p>
            <h2
              className="mt-3 font-bold text-[rgb(var(--color-ink))]"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700 }}
            >
              Recent Projects
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[rgb(var(--color-ink-muted))]">
              From fleet overhauls to component repairs, our track record speaks to our commitment
              to zero-defect delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
