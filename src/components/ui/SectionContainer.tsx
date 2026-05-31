import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionContainerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Max content width. Defaults to the standard `--max-width-content` token.
   * Pass `"1360px"` for the wide gallery variant (PortfoliosPreview, SolutionsGrid).
   */
  maxWidth?: string;
};

/**
 * Standard centered content column — `mx-auto px-6 md:px-10 lg:px-16` capped at
 * `--max-width-content`. This wrapper was repeated verbatim in 40+ sections.
 *
 * Pass `className` for context classes (e.g. `"relative z-10"`) — they merge via
 * `cn`. Pass `maxWidth` for the wide variant.
 */
export default function SectionContainer({
  maxWidth = "var(--max-width-content)",
  className,
  style,
  children,
  ...rest
}: SectionContainerProps) {
  return (
    <div
      className={cn("mx-auto px-6 md:px-10 lg:px-16", className)}
      style={{ maxWidth, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
