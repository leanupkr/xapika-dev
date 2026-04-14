import Image from "next/image";
import { SectionHeader } from "./ColorsSection";

// 기본 상태 카드 (정적)
function BaseCardDefault() {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-ink)/0.05)] bg-white p-6 shadow-[0_1px_3px_rgba(11,31,58,0.04)]">
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
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[rgb(var(--color-primary))] transition-colors duration-200 ease-out hover:text-[rgb(var(--color-primary-hover))]"
      >
        Learn more
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

// 호버 상태 카드 (정적으로 hover 상태 표현)
function BaseCardHovered() {
  return (
    <div
      className="rounded-xl border border-[rgb(var(--color-ink)/0.05)] bg-white p-6 shadow-[0_8px_24px_rgba(11,31,58,0.08)] -translate-y-0.5"
      style={{ borderBottom: "2px solid rgb(var(--color-primary))" }}
    >
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
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[rgb(var(--color-primary-hover))] transition-colors duration-200 ease-out"
      >
        Learn more
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

// 실제 인터랙티브 카드 (hover CSS 적용)
function BaseCardInteractive() {
  return (
    <div className="group relative rounded-xl border border-[rgb(var(--color-ink)/0.05)] bg-white p-6 shadow-[0_1px_3px_rgba(11,31,58,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)] overflow-hidden">
      {/* 하단 주황 라인 — hover 시 나타남 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--color-primary))] translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base font-semibold text-[rgb(var(--color-ink))]">
          Light Maintenance Program
        </h3>
        <span className="ml-2 shrink-0 rounded-full bg-[rgb(var(--color-ink)/0.06)] px-2 py-0.5 text-xs font-semibold text-[rgb(var(--color-ink-muted))]">
          Ongoing
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[rgb(var(--color-ink-muted))]">
        Scheduled maintenance operations covering brake system checks, fluid top-ups, and
        diagnostic scanning for DMU rolling stock.
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[rgb(var(--color-primary))] transition-colors duration-200 group-hover:text-[rgb(var(--color-primary-hover))]">
        Learn more
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

function StatCard() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.05)] bg-white p-6 shadow-[0_1px_3px_rgba(11,31,58,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)]">
      {/* Orange accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-[rgb(var(--color-primary))] transition-all duration-300 ease-out group-hover:w-1.5" />
      <div className="pl-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--color-primary))]">
          Total Fleet
        </p>
        <div className="mt-3">
          {/* 숫자: 최소 128px, 이상적 160px / weight 500 / tabular-nums */}
          <span
            className="block leading-none text-[rgb(var(--color-ink))]"
            style={{
              fontSize: "clamp(8rem, 15vw, 10rem)",
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            227
          </span>
          {/* 주황 언더라인 */}
          <div className="mt-2 h-0.5 w-16 bg-[rgb(var(--color-primary))]" />
        </div>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-sm font-medium text-[rgb(var(--color-ink-muted))]">vehicles</span>
        </div>
        <p className="mt-1.5 text-xs text-[rgb(var(--color-ink-muted))]">
          Under active maintenance contracts
        </p>
      </div>
    </div>
  );
}

function PortfolioCard() {
  return (
    <div className="group overflow-hidden rounded-xl border border-[rgb(var(--color-ink)/0.05)] bg-white shadow-[0_1px_3px_rgba(11,31,58,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,31,58,0.08)]">
      {/* 실제 hero-03-detail.jpg 이미지 */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src="/hero/hero-03-detail.jpg"
          alt="PKP IC Fleet Overhaul — Warsaw"
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(11,31,58,0.4)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

      {/* Base Card — Before/After 비교 */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
          Base Card — Hover State Preview
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium text-[rgb(var(--color-ink-muted)/0.5)] uppercase tracking-wider">
              Default
            </p>
            <BaseCardDefault />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-[rgb(var(--color-primary)/0.8)] uppercase tracking-wider">
              Hover State (static preview)
            </p>
            <BaseCardHovered />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-[rgb(var(--color-ink-muted)/0.5)] uppercase tracking-wider">
              Interactive (hover me)
            </p>
            <BaseCardInteractive />
          </div>
        </div>
      </div>

      {/* Stat Card + Portfolio Card */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
