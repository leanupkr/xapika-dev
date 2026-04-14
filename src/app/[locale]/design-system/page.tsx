import { ColorsSection } from "./_sections/ColorsSection";
import { TypographySection } from "./_sections/TypographySection";
import { ButtonsSection } from "./_sections/ButtonsSection";
import { InputsSection } from "./_sections/InputsSection";
import { CardsSection } from "./_sections/CardsSection";
import { BadgesSection } from "./_sections/BadgesSection";
import { SpacingSection } from "./_sections/SpacingSection";
import { MotionSection } from "./_sections/MotionSection";

export const metadata = {
  title: "Design System — Xapika Engineering",
  description: "Internal style guide: colors, typography, components, and motion.",
};

const NAV_ITEMS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "cards", label: "Cards" },
  { id: "badges", label: "Badges" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))]">
      {/* Page header */}
      <header className="border-b border-[rgb(var(--color-ink)/0.07)] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[rgb(var(--color-primary))]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--color-primary))]">
                  Internal
                </span>
              </div>
              <h1
                className="mt-2 font-bold text-[rgb(var(--color-ink))]"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700 }}
              >
                Design System
              </h1>
              <p className="mt-1.5 text-sm text-[rgb(var(--color-ink-muted))]">
                Xapika Engineering · Style Guide · v0.1
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs text-[rgb(var(--color-ink-muted)/0.5)]">Last updated</p>
              <p className="text-xs font-semibold text-[rgb(var(--color-ink-muted))]">April 2026</p>
            </div>
          </div>

          {/* Section nav */}
          <nav className="mt-6 flex flex-wrap gap-1" aria-label="Design system sections">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-[rgb(var(--color-ink-muted))] transition-colors duration-150 hover:bg-[rgb(var(--color-ink)/0.06)] hover:text-[rgb(var(--color-ink))]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="space-y-20">
          <div id="colors">
            <ColorsSection />
          </div>

          <div id="typography">
            <TypographySection />
          </div>

          <div id="buttons">
            <ButtonsSection />
          </div>

          <div id="inputs">
            <InputsSection />
          </div>

          <div id="cards">
            <CardsSection />
          </div>

          <div id="badges">
            <BadgesSection />
          </div>

          <div id="spacing">
            <SpacingSection />
          </div>

          <div id="motion">
            <MotionSection />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-[rgb(var(--color-ink)/0.07)] pt-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-[rgb(var(--color-ink-muted)/0.6)]">
              Xapika Engineering · Design System · Internal use only
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-primary)/0.2)] bg-[rgb(var(--color-primary)/0.08)] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--color-primary))]">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
                Tailwind CSS 4
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-ink)/0.15)] bg-[rgb(var(--color-ink)/0.06)] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--color-ink-muted))]">
                Next.js 16
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-ink)/0.15)] bg-[rgb(var(--color-ink)/0.06)] px-2.5 py-0.5 text-xs font-semibold text-[rgb(var(--color-ink-muted))]">
                Inter
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
