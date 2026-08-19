import { ExternalLink } from "lucide-react";
import CornerTicks from "@/components/ui/CornerTicks";
import SectionContainer from "@/components/ui/SectionContainer";

type NewsExternalPanelProps = {
  excerpt: string;
  externalUrl?: string;
  externalSource?: string;
};

/**
 * Renders in place of the article body for `kind === "external"` posts.
 * Deliberately does not reproduce the original article — a short in-house
 * summary plus a CTA out to the source, so we never mirror someone else's
 * copyrighted press copy.
 */
export default function NewsExternalPanel({
  excerpt,
  externalUrl,
  externalSource,
}: NewsExternalPanelProps) {
  return (
    <SectionContainer className="pt-6 pb-16">
      <div className="relative max-w-[68ch] border border-ink/15 p-8 sm:p-10">
        <CornerTicks size={10} />
        <p className="leading-relaxed text-ink/80">{excerpt}</p>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex min-h-[44px] items-center gap-2 border-b border-primary font-heading text-sm font-medium text-primary transition-colors duration-200 hover:border-ink hover:text-ink"
          >
            Read on {externalSource ?? "the original source"}
            <ExternalLink
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}
      </div>
    </SectionContainer>
  );
}
