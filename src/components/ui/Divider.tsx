type DividerVariant = "default" | "thick" | "dotted";

type DividerProps = {
  variant?: DividerVariant;
  className?: string;
  label?: string;
};

export function Divider({ variant = "default", className = "", label }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className="flex-1"
          style={getDividerStyle(variant)}
        />
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--color-ink-muted)/0.5)]">
          {label}
        </span>
        <div
          className="flex-1"
          style={getDividerStyle(variant)}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={getDividerStyle(variant)}
    />
  );
}

function getDividerStyle(variant: DividerVariant): React.CSSProperties {
  switch (variant) {
    case "thick":
      return {
        height: "2px",
        background: "rgb(var(--color-primary))",
        borderRadius: "1px",
      };
    case "dotted":
      return {
        height: "1px",
        backgroundImage: "radial-gradient(circle, rgb(var(--color-ink) / 0.2) 1px, transparent 1px)",
        backgroundSize: "8px 1px",
        backgroundRepeat: "repeat-x",
      };
    case "default":
    default:
      return {
        height: "1px",
        background: "rgb(var(--color-ink) / 0.08)",
      };
  }
}
