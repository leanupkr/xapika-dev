const CORNER_POSITIONS = [
  { top: 8, left: 8 },
  { top: 8, right: 8 },
  { bottom: 8, left: 8 },
  { bottom: 8, right: 8 },
] as const;

/**
 * Four 1.5px L-shaped corner ticks, absolutely positioned 8px inside the nearest
 * `position: relative` ancestor. Purely decorative (aria-hidden).
 *
 * Consolidates the corner-tick markup that was duplicated inline across
 * SolutionDetailHero, PortfolioScrollGallery, LaunchCountdown,
 * WarsawSeasonTimeline, PortfolioHero, and PortfolioStory.
 *
 * @param size Tick arm length in px. Most call sites use 8 or 10 (default).
 */
export default function CornerTicks({ size = 10 }: { size?: number }) {
  return (
    <>
      {CORNER_POSITIONS.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute block pointer-events-none"
          style={{
            top: "top" in pos ? pos.top : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            width: size,
            height: size,
            borderTop:
              "top" in pos ? "1.5px solid rgb(var(--color-primary))" : undefined,
            borderBottom:
              "bottom" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderLeft:
              "left" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
            borderRight:
              "right" in pos
                ? "1.5px solid rgb(var(--color-primary))"
                : undefined,
          }}
        />
      ))}
    </>
  );
}
