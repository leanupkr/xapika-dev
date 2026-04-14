import { SectionHeader } from "./ColorsSection";

type BadgeVariant = "primary" | "ink" | "accent" | "muted";

function Badge({
  children,
  variant = "primary",
  dot = false,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}) {
  const styles: Record<BadgeVariant, string> = {
    primary:
      "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))] border-[rgb(var(--color-primary)/0.2)]",
    ink: "bg-[rgb(var(--color-ink)/0.08)] text-[rgb(var(--color-ink))] border-[rgb(var(--color-ink)/0.15)]",
    accent:
      "bg-[rgb(var(--color-accent)/0.08)] text-[rgb(var(--color-accent))] border-[rgb(var(--color-accent)/0.2)]",
    muted:
      "bg-[rgb(var(--color-ink-muted)/0.1)] text-[rgb(var(--color-ink-muted))] border-[rgb(var(--color-ink-muted)/0.2)]",
  };

  const dotStyles: Record<BadgeVariant, string> = {
    primary: "bg-[rgb(var(--color-primary))]",
    ink: "bg-[rgb(var(--color-ink))]",
    accent: "bg-[rgb(var(--color-accent))]",
    muted: "bg-[rgb(var(--color-ink-muted))]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />
      )}
      {children}
    </span>
  );
}

function Tag({
  children,
  variant = "ink",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const styles: Record<BadgeVariant, string> = {
    primary:
      "bg-[rgb(var(--color-primary)/0.06)] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary)/0.12)]",
    ink: "bg-[rgb(var(--color-ink)/0.06)] text-[rgb(var(--color-ink))] hover:bg-[rgb(var(--color-ink)/0.1)]",
    accent:
      "bg-[rgb(var(--color-accent)/0.06)] text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent)/0.12)]",
    muted:
      "bg-[rgb(var(--color-bg))] text-[rgb(var(--color-ink-muted))] hover:bg-[rgb(var(--color-ink)/0.06)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150 cursor-default ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function BadgesSection() {
  return (
    <section>
      <SectionHeader label="06" title="Badges & Tags" />
      <div className="mt-8 space-y-8">
        {/* Badges */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Badges — Status indicators
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" dot>Active</Badge>
            <Badge variant="primary">New</Badge>
            <Badge variant="muted" dot>Coming Soon</Badge>
            <Badge variant="accent" dot>Critical</Badge>
            <Badge variant="ink">Certified</Badge>
            <Badge variant="accent">ISO 9001</Badge>
            <Badge variant="muted">Draft</Badge>
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Tags — Category labels
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Tag variant="ink">Heavy Maintenance</Tag>
            <Tag variant="ink">Light Maintenance</Tag>
            <Tag variant="ink">Supply Chain</Tag>
            <Tag variant="primary">MRO Services</Tag>
            <Tag variant="primary">Fleet Management</Tag>
            <Tag variant="accent">Safety Critical</Tag>
            <Tag variant="muted">NDT Inspection</Tag>
            <Tag variant="muted">Component Overhaul</Tag>
          </div>
        </div>

        {/* Color variants reference */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
            Badge color variants
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="ink">Ink</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="muted">Muted</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
