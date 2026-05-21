import { Link } from "@/i18n/navigation";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import LiveBusinessHours from "@/components/contact/LiveBusinessHours";

export type ContactInfoProps = {
  overline: string;
  hqLabel: string;
  hqValue: string;
  hoursLabel: string;
  officeLink: string;
  openInMaps: string;
};

export default function ContactInfo({
  overline,
  hqLabel,
  hqValue,
  hoursLabel,
  officeLink,
  openInMaps,
}: ContactInfoProps) {
  return (
    <aside className="flex flex-col">
      <span
        className="flex items-center gap-3 font-heading font-medium uppercase mb-8 text-[rgb(var(--color-primary))]"
        style={{ fontSize: "13px", letterSpacing: "0.22em" }}
      >
        <span
          aria-hidden
          className="inline-block flex-shrink-0"
          style={{
            width: "24px",
            height: "2px",
            backgroundColor: "rgb(var(--color-primary))",
          }}
        />
        {overline}
      </span>

      <div className="flex flex-col gap-6">
        <InfoRow
          icon={<MapPin size={16} strokeWidth={1.75} />}
          label={hqLabel}
          value={
            <div className="flex flex-col gap-1">
              <span
                className="font-body"
                style={{
                  fontSize: "15px",
                  color: "rgba(11,31,58,0.78)",
                  lineHeight: 1.55,
                }}
              >
                {hqValue}
              </span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Xapika+Engineering+Warsaw"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body contact-maps-link"
                style={{
                  fontSize: "12px",
                  color: "rgba(11,31,58,0.48)",
                  letterSpacing: "0.02em",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(11,31,58,0.20)",
                  transition: "color 0.2s, text-decoration-color 0.2s",
                }}
              >
                {openInMaps}
              </a>
            </div>
          }
        />
        <InfoRow
          icon={<Clock size={16} strokeWidth={1.75} />}
          label={hoursLabel}
          value={<LiveBusinessHours />}
        />
      </div>

      <div
        className="mt-10 pt-8"
        style={{ borderTop: "1px solid rgba(11,31,58,0.10)" }}
      >
        <Link
          href="/locations"
          className="group inline-flex items-center gap-1.5 font-heading font-semibold contact-offices-link"
          style={{
            fontSize: "14px",
            color: "rgb(var(--color-ink))",
            letterSpacing: "0.02em",
            transition: "color 0.2s",
          }}
        >
          {officeLink}
          <ArrowUpRight
            size={14}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </aside>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden
        className="flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          backgroundColor: "rgba(246,163,23,0.10)",
          color: "rgb(var(--color-primary))",
        }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <span
          className="font-heading uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "rgba(11,31,58,0.48)",
          }}
        >
          {label}
        </span>
        {value}
      </div>
    </div>
  );
}
