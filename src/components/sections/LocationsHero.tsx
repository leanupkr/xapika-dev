import PageHero from "@/components/ui/PageHero";

export type HeroStat = {
  value: string;
  label: string;
};

export type LocationsHeroProps = {
  overline: string;
  title: string;
  subtitle: string;
  stats: [HeroStat, HeroStat, HeroStat];
};

export default function LocationsHero({
  overline,
  title,
  subtitle,
  stats,
}: LocationsHeroProps) {
  return (
    <PageHero
      patternId="locations-hero"
      overline={overline}
      title={title}
      subtitle={subtitle}
      variant="compact"
      rightSlot={
        <ul
          className="space-y-6"
          aria-label="Network scale summary"
        >
          {stats.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              className="flex items-baseline gap-4 border-l-2 pl-4"
              style={{
                borderColor:
                  i === 0
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.18)",
              }}
            >
              <span
                className="font-heading font-medium text-white tabular-nums leading-none"
                style={{
                  fontSize: "clamp(2.25rem, 3.2vw, 3rem)",
                  letterSpacing: "-0.03em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </span>
              <span
                className="font-heading uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      }
    />
  );
}
