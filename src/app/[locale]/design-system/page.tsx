import { ColorsSection } from "./_sections/ColorsSection";
import { TypographySection } from "./_sections/TypographySection";
import { ButtonsSection } from "./_sections/ButtonsSection";
import { InputsSection } from "./_sections/InputsSection";
import { CardsSection } from "./_sections/CardsSection";
import { BadgesSection } from "./_sections/BadgesSection";
import { SpacingSection } from "./_sections/SpacingSection";
import { DividersSection } from "./_sections/DividersSection";
import { HeroPreviewSection } from "./_sections/HeroPreviewSection";
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
  { id: "dividers", label: "Dividers" },
  { id: "hero-preview", label: "Hero Preview" },
  { id: "motion", label: "Motion" },
];

type SectionWrapperProps = {
  id: string;
  overline: string;
  description: string;
  children: React.ReactNode;
};

function SectionWrapper({ id, overline, description, children }: SectionWrapperProps) {
  return (
    <div id={id} className="scroll-mt-8">
      {/* Overline 라벨 */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--color-ink-muted))]">
        {overline}
      </p>
      {/* 섹션 설명 */}
      <p className="mb-6 text-sm text-[rgb(var(--color-ink-muted))]">{description}</p>
      {children}
    </div>
  );
}

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
                Xapika Engineering · Style Guide · v0.2
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
      <main className="mx-auto max-w-[1440px] px-6 py-32 lg:px-12">
        <div className="space-y-32">
          <SectionWrapper
            id="colors"
            overline="COLORS"
            description="브랜드 팔레트 — 토큰 변수로만 사용. 공식 로고 주황 #f6a317을 Primary로 적용."
          >
            <ColorsSection />
          </SectionWrapper>

          <SectionWrapper
            id="typography"
            overline="TYPOGRAPHY"
            description="타입 스케일 — Hero H1부터 Caption까지. 모든 폰트는 Inter로 통일."
          >
            <TypographySection />
          </SectionWrapper>

          <SectionWrapper
            id="buttons"
            overline="BUTTONS"
            description="인터랙션 상태별 버튼 스타일. Primary에 inner shadow와 hover lift 적용."
          >
            <ButtonsSection />
          </SectionWrapper>

          <SectionWrapper
            id="inputs"
            overline="INPUTS"
            description="폼 입력 컴포넌트 — focus ring과 validation 상태 포함."
          >
            <InputsSection />
          </SectionWrapper>

          <SectionWrapper
            id="cards"
            overline="CARDS"
            description="콘텐츠 카드 패턴 — hover 시 깊이감(lift + shadow + 주황 하단 라인)."
          >
            <CardsSection />
          </SectionWrapper>

          <SectionWrapper
            id="badges"
            overline="BADGES"
            description="상태 및 분류 배지 — compact하게 정보를 전달하는 인라인 컴포넌트."
          >
            <BadgesSection />
          </SectionWrapper>

          <SectionWrapper
            id="spacing"
            overline="SPACING"
            description="8pt 그리드 기반 스페이싱 스케일 — --space-section은 120px."
          >
            <SpacingSection />
          </SectionWrapper>

          <SectionWrapper
            id="dividers"
            overline="DIVIDERS"
            description="섹션 구분선 — default(1px), thick(2px primary), dotted 3종."
          >
            <DividersSection />
          </SectionWrapper>

          <SectionWrapper
            id="hero-preview"
            overline="HERO PREVIEW"
            description="B+A 하이브리드 톤 체감 — 실제 다크 Hero 레이아웃 프리뷰."
          >
            <HeroPreviewSection />
          </SectionWrapper>

          <SectionWrapper
            id="motion"
            overline="MOTION"
            description="모션 원칙 — ease-out 전용. 바운스 없음, 회전 없음, 플래시 없음."
          >
            <MotionSection />
          </SectionWrapper>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-[rgb(var(--color-ink)/0.07)] pt-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-[rgb(var(--color-ink-muted)/0.6)]">
              Xapika Engineering · Design System v0.2 · Internal use only
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
