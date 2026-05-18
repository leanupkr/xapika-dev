import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type CtaSecondaryButton = {
  label: string;
  href: string;
  external?: boolean;
};

export type CtaSectionProps = {
  overline?: string;
  title: string;
  subtitle: string;
  button: string;
  href?: string;
  titleId?: string;
  secondaryButton?: CtaSecondaryButton;
};

export default function CtaSection({
  overline = "Ready",
  title,
  subtitle,
  button,
  href = "/contact",
  titleId = "cta-title",
  secondaryButton,
}: CtaSectionProps) {
  return (
    <section
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby={titleId}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 40%, rgba(246,163,23,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-12 items-end">
          <div className="lg:col-span-8">
            <span
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "12px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden="true"
                className="inline-block flex-shrink-0"
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </span>
            <h2
              id={titleId}
              className="font-heading font-semibold text-white"
              style={{
                fontSize: "clamp(1.875rem, 3.8vw, 2.875rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: "22ch",
              }}
            >
              {title}
            </h2>
            <p
              className="font-body mt-5"
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              {subtitle}
            </p>
          </div>
          <div
            className={
              secondaryButton
                ? "lg:col-span-4 flex flex-col gap-3 lg:items-end"
                : "lg:col-span-4 lg:flex lg:justify-end"
            }
          >
            <Link
              href={href}
              className="group inline-flex items-center gap-3 px-7 py-4 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-ink))] font-heading font-semibold transition-colors duration-300 hover:bg-white"
              style={{ fontSize: "14px", letterSpacing: "0.05em" }}
            >
              {button}
              <ArrowRight
                size={16}
                strokeWidth={2.25}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            {secondaryButton ? (
              secondaryButton.external ? (
                <a
                  href={secondaryButton.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-heading font-medium transition-colors duration-300 hover:bg-white/10 hover:border-white/40"
                  style={{ fontSize: "13px", letterSpacing: "0.05em" }}
                >
                  {secondaryButton.label}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ) : (
                <Link
                  href={secondaryButton.href}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-white font-heading font-medium transition-colors duration-300 hover:bg-white/10 hover:border-white/40"
                  style={{ fontSize: "13px", letterSpacing: "0.05em" }}
                >
                  {secondaryButton.label}
                  <ArrowRight
                    size={14}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
