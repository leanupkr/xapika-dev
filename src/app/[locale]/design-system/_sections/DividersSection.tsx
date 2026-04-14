import { Divider } from "@/components/ui/Divider";
import { SectionHeader } from "./ColorsSection";

type DividerDemo = {
  variant: "default" | "thick" | "dotted";
  label: string;
  spec: string;
};

const dividerDemos: DividerDemo[] = [
  {
    variant: "default",
    label: "Default",
    spec: "1px / rgb(var(--color-ink) / 0.08)",
  },
  {
    variant: "thick",
    label: "Thick (Primary)",
    spec: "2px / rgb(var(--color-primary))",
  },
  {
    variant: "dotted",
    label: "Dotted",
    spec: "1px dotted / rgb(var(--color-ink) / 0.2)",
  },
];

export function DividersSection() {
  return (
    <section>
      <SectionHeader label="09" title="Dividers" />
      <p className="mt-3 text-sm text-[rgb(var(--color-ink-muted))]">
        콘텐츠 섹션을 구분하는 경계선 컴포넌트. 3가지 variant를 제공합니다.
      </p>

      <div className="mt-8 space-y-6">
        {dividerDemos.map((demo) => (
          <div key={demo.variant} className="rounded-xl border border-[rgb(var(--color-ink)/0.07)] bg-[rgb(var(--color-bg))] p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block rounded bg-[rgb(var(--color-ink)/0.06)] px-2 py-0.5 font-mono text-xs font-semibold text-[rgb(var(--color-ink-muted))]">
                {demo.label}
              </span>
              <span className="font-mono text-xs text-[rgb(var(--color-ink-muted)/0.6)]">
                {demo.spec}
              </span>
            </div>

            {/* 사용 예시 — 텍스트 사이에 배치 */}
            <div className="space-y-3">
              <p className="text-sm text-[rgb(var(--color-ink))]">Section A content goes here.</p>
              <Divider variant={demo.variant} />
              <p className="text-sm text-[rgb(var(--color-ink))]">Section B content follows.</p>
            </div>

            {/* 레이블 with divider */}
            {demo.variant === "default" && (
              <div className="mt-4">
                <Divider variant="default" label="or" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
