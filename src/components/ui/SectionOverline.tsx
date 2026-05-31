import { type ComponentProps, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const OVERLINE_CLASS =
  "flex items-center gap-3 font-heading font-medium uppercase mb-6";

type OwnProps = {
  /**
   * Element/component to render as. Defaults to `"span"`. Pass `motion.span`
   * (framer) for animated overlines, or keep `"span"` and add `data-header-item`
   * for the GSAP scroll-reveal pattern.
   */
  as?: ElementType;
  /**
   * `"primary"` — orange label text for light backgrounds (default).
   * `"onDark"` — translucent-white label text for dark (ink) backgrounds.
   * The leading accent bar is always primary orange in both tones.
   */
  tone?: "primary" | "onDark";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Allow framer-motion / data-* / aria-* passthrough without fighting the
// polymorphic element's prop union.
type SectionOverlineProps = OwnProps &
  Omit<ComponentProps<"span">, keyof OwnProps> &
  Record<string, unknown>;

/**
 * The eyebrow/overline used above section headings — a short primary accent bar
 * followed by an uppercase label. Consolidates markup that drifted across 40+
 * sections (mb-5/mb-6, 0.2/0.22em, 24/28px bar); all call sites now share one
 * canonical look.
 */
export default function SectionOverline({
  as,
  tone = "primary",
  className,
  style,
  children,
  ...rest
}: SectionOverlineProps) {
  const Tag = (as ?? "span") as ElementType;
  const color =
    tone === "onDark" ? "rgba(255,255,255,0.85)" : "rgb(var(--color-primary))";

  return (
    <Tag
      className={cn(OVERLINE_CLASS, className)}
      style={{ fontSize: "13px", letterSpacing: "0.22em", color, ...style }}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="inline-block flex-shrink-0"
        style={{
          width: "28px",
          height: "2px",
          backgroundColor: "rgb(var(--color-primary))",
        }}
      />
      {children}
    </Tag>
  );
}
