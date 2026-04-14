import { SectionHeader } from "./ColorsSection";

function BaseCard() {
  return (
    <div className="group rounded-xl border border-[rgb(var(--color-ink)/0.08)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base font-semibold text-[rgb(var(--color-ink))]">
          Heavy Maintenance Program
        </h3>
        <span className="ml-2 shrink-0 rounded-full bg-[rgb(var(--color-primary)/0.1)] px-2 py-0.5 text-xs font-semibold text-[rgb(var(--color-primary))]">
          Active
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[rgb(var(--color-ink-muted))]">
        Comprehensive overhaul services including bogie inspection, wheel set reprofiling, and full
        interior refurbishment for EMU fleets.
      </p>
      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[rgb(var(--color-primary))] transition-colors hover:text-[rgb(var(--color-primary-hover))]"
      >
        Learn more
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

function StatCard() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.08)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Orange accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-[rgb(var(--color-primary))] transition-all duration-300 group-hover:w-1.5" />
      <div className="pl-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--color-primary))]">
          Total Fleet
        </p>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-5xl font-bold tabular-nums leading-none text-[rgb(var(--color-ink))]">
            227
          </span>
          <span className="mb-1 text-sm font-medium text-[rgb(var(--color-ink-muted))]">
            vehicles
          </span>
        </div>
        <p className="mt-2 text-xs text-[rgb(var(--color-ink-muted))]">
          Under active maintenance contracts
        </p>
      </div>
    </div>
  );
}

function PortfolioCard() {
  return (
    <div className="group overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.08)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Placeholder image area */}
      <div className="relative h-36 w-full overflow-hidden bg-[rgb(var(--color-ink)/0.06)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-[rgb(var(--color-ink)/0.2)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-ink)/0.15)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-ink))]">
          PKP IC Fleet Overhaul — Warsaw
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[rgb(var(--color-ink-muted))]">
          Intercity coach refurbishment across 42 units.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Heavy MRO", "Interior", "2024"].map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[rgb(var(--color-bg))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-ink-muted))]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardsSection() {
  return (
    <section>
      <SectionHeader label="05" title="Cards" />
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Base Card
          </p>
          <BaseCard />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Stat Card
          </p>
          <StatCard />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Portfolio Card
          </p>
          <PortfolioCard />
        </div>
      </div>
    </section>
  );
}
