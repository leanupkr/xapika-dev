import Link from "next/link";
import { cn } from "@/lib/cn";

type NewsLangToggleProps = {
  slug: string;
  currentLang: "en" | "ko";
};

/**
 * Pure server component — no client state needed. Language is already
 * decided server-side by NewsDetailPage reading searchParams, so this just
 * renders two links (?lang present or not). No "use client"/useSearchParams
 * required (NEWS_CMS_PLAN.md §8.10 audit-2 finding 4 correction).
 */
export default function NewsLangToggle({ slug, currentLang }: NewsLangToggleProps) {
  const base =
    "min-h-[44px] px-3 inline-flex items-center text-sm font-mono border transition-colors duration-200";
  return (
    <div className="inline-flex" role="group" aria-label="Language">
      <Link
        href={`/news/${slug}`}
        hrefLang="en"
        aria-current={currentLang === "en" ? "true" : undefined}
        className={cn(
          base,
          "border-r-0",
          currentLang === "en"
            ? "border-primary text-primary"
            : "border-ink/15 text-ink/60 hover:text-ink",
        )}
      >
        EN
      </Link>
      <Link
        href={`/news/${slug}?lang=ko`}
        hrefLang="ko"
        aria-current={currentLang === "ko" ? "true" : undefined}
        className={cn(
          base,
          currentLang === "ko"
            ? "border-primary text-primary"
            : "border-ink/15 text-ink/60 hover:text-ink",
        )}
      >
        KO
      </Link>
    </div>
  );
}
