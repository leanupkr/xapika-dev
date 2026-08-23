import type { ReactNode } from "react";
import CategoryChip from "@/components/ui/CategoryChip";
import CornerTicks from "@/components/ui/CornerTicks";
import SanityImage from "@/components/ui/SanityImage";
import SectionContainer from "@/components/ui/SectionContainer";
import type { NewsCategory, NewsImage } from "@/sanity/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC", // pinned so a date stored as midnight UTC never rolls back a day locally
});

function formatPublishedDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : DATE_FORMATTER.format(date);
}

type NewsHeroProps = {
  category: NewsCategory;
  title: string;
  publishedAt: string;
  coverImage?: NewsImage | null;
  /** Rendered top-right of the meta row — the EN/KO toggle, only when the article has a Korean translation. */
  langToggle?: ReactNode;
};

/**
 * News article hero — category/date meta row, headline, and cover image.
 * Follows PortfolioHero's corner-tick + hairline-border photo framing, but
 * stays on the light page background (no PageHero/dark-ink treatment) since
 * the article body reads directly beneath it.
 *
 * `coverImage` is passed straight through to `SanityImage` unconditionally
 * (own/external articles both may lack one) — the dashed placeholder is
 * handled entirely inside that component, matching NewsPreview/NewsIndex.
 */
export default function NewsHero({
  category,
  title,
  publishedAt,
  coverImage,
  langToggle,
}: NewsHeroProps) {
  const date = formatPublishedDate(publishedAt);

  return (
    <SectionContainer className="pt-[clamp(80px,10vw,140px)] pb-10 sm:pb-12">
      <div className="flex items-center justify-between gap-4">
        <CategoryChip category={category} />
        {langToggle}
      </div>

      <h1 className="mt-5 font-heading text-[clamp(28px,5vw,48px)] font-semibold leading-[1.08] text-ink">
        {title}
      </h1>

      {date ? (
        <time dateTime={publishedAt} className="mt-3 block text-sm text-ink/60">
          {date}
        </time>
      ) : null}

      <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-ink/15">
        <SanityImage
          image={coverImage}
          alt={coverImage?.alt || title}
          sizes="(max-width: 1024px) 100vw, 1200px"
          widths={[768, 1024, 1440, 1920]}
        />
        <CornerTicks size={10} />
      </div>
    </SectionContainer>
  );
}
