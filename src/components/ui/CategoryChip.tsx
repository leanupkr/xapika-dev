import { cn } from "@/lib/cn";

export const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  "company-news": "Company News",
  "project-update": "Project Update",
  "press-release": "Press Release",
  "media-coverage": "Media Coverage",
};

type CategoryChipProps = {
  /** A NewsCategory value, or "all" for the unfiltered chip. Unknown values fall back to the raw string. */
  category: string;
  active?: boolean;
  /** "button" for interactive filters, "span" for read-only display on a card. Defaults to "span". */
  as?: "button" | "span";
  onClick?: () => void;
  className?: string;
};

/**
 * Pill filter/label chip — rounded-full, 44px touch target.
 *
 * Styling follows the codebase's one shipped chip precedent
 * (IntentChips.tsx on /contact): hairline border by default, primary-tinted
 * border + 10%-tint fill when active — not a solid fill, so ink text stays
 * legible without a second text color per state. `--color-accent` (red) is
 * intentionally not used here; in this codebase it is reserved for
 * error/destructive states (see src/app/error.tsx), so reusing it for an
 * active filter would read as a warning rather than a selection.
 */
export default function CategoryChip({
  category,
  active = false,
  as = "span",
  onClick,
  className,
}: CategoryChipProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const classes = cn(
    "inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full border px-4 font-heading text-[13px] font-medium tracking-[0.02em] transition-colors duration-200",
    active
      ? "border-primary bg-primary/10 text-ink"
      : "border-ink/14 text-ink/70 hover:border-primary/60",
    className,
  );

  if (as === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={classes}
      >
        {label}
      </button>
    );
  }

  return <span className={classes}>{label}</span>;
}
