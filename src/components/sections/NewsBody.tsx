import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import SanityImage from "@/components/ui/SanityImage";
import SectionContainer from "@/components/ui/SectionContainer";
import type { NewsImage } from "@/sanity/types";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: NewsImage }) => (
      <div className="relative my-8 aspect-[16/10] overflow-hidden border border-ink/12">
        <SanityImage
          image={value}
          alt={value?.alt}
          sizes="(max-width: 768px) 100vw, 68ch"
        />
      </div>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-ink/85">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-heading text-2xl font-semibold text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-heading text-xl font-semibold text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-[1.5px] border-primary pl-6 text-ink/75 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-2 text-ink/85">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-2 text-ink/85">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors duration-200 hover:decoration-primary"
        >
          {children}
        </a>
      );
    },
  },
};

type NewsBodyProps = {
  body: PortableTextBlock[];
};

/**
 * Article body — renders Portable Text into `.prose-news` (this codebase's
 * own hand-rolled typography class; `@tailwindcss/typography` is not
 * installed). The component map above is the reason this isn't just bare
 * `.prose-news h2 {}` CSS: `types.image` has no default renderer at all
 * (Sanity's `image` block type needs an explicit component to resolve
 * through SanityImage), and the default `link` mark renders a plain `<a
 * href>` with no `target`/`rel`, which would be an unsafe default for
 * editor-authored external links.
 */
export default function NewsBody({ body }: NewsBodyProps) {
  return (
    <SectionContainer className="pb-4">
      <div className="prose-news mx-auto max-w-[68ch]">
        <PortableText value={body} components={components} />
      </div>
    </SectionContainer>
  );
}
