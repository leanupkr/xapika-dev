import { SectionHeader } from "./ColorsSection";
import { FadeInDemo, SlideUpDemo, CountUpDemo } from "@/components/motion/MotionDemo";

type MotionCardProps = {
  title: string;
  spec: string;
  children: React.ReactNode;
};

function MotionCard({ title, spec, children }: MotionCardProps) {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-ink)/0.07)] bg-[rgb(var(--color-bg))] p-5">
      <div className="mb-5">
        <p className="text-sm font-bold text-[rgb(var(--color-ink))]">{title}</p>
        <p className="mt-0.5 font-mono text-xs text-[rgb(var(--color-ink-muted))]">{spec}</p>
      </div>
      {children}
    </div>
  );
}

export function MotionSection() {
  return (
    <section>
      <SectionHeader label="08" title="Motion Primitives" />
      <div className="mt-3">
        <p className="text-sm text-[rgb(var(--color-ink-muted))]">
          All transitions use{" "}
          <code className="rounded bg-[rgb(var(--color-ink)/0.06)] px-1.5 py-0.5 font-mono text-xs">
            cubic-bezier(0.16, 1, 0.3, 1)
          </code>{" "}
          (ease-out). No bounce, no rotation, no flash.
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MotionCard title="Fade In" spec="opacity: 0→1, y: 20→0 / 480ms ease-out">
          <FadeInDemo />
        </MotionCard>
        <MotionCard title="Slide Up" spec="opacity: 0→1, y: 40→0 / 480ms ease-out">
          <SlideUpDemo />
        </MotionCard>
        <MotionCard title="Count Up" spec="0 → 22,000 / 2s ease-out">
          <CountUpDemo />
        </MotionCard>
      </div>
    </section>
  );
}
