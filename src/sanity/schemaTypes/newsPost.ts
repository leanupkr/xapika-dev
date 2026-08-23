// src/sanity/schemaTypes/newsPost.ts
//
// Deviation from NEWS_CMS_PLAN.md §8.6 (verified against the installed
// package, not assumed): the plan's draft does
// `import { defineField, defineType } from "sanity"` and
// `import type { SchemaTypeDefinition } from "sanity"` elsewhere. None of
// these are exported by sanity@6.9.2's public entry point — confirmed by
// reading node_modules/sanity/lib/index.d.ts directly: the only `define*`
// exports present are `defineConfig`, `definePlugin`,
// `defineDocumentFieldAction`, `defineDocumentInspector`, `defineLocale`,
// `defineLocaleResourceBundle`, `defineLocalesResources`,
// `defineSearchFilter`, `defineSearchFilterOperators`, and
// `defineSearchOperator` — never `defineField`/`defineType`/
// `defineArrayMember`/`SchemaTypeDefinition`. Those live in `@sanity/types`,
// which is only a transitive dependency here (pulled in nested inside
// `sanity`'s own dependency tree) — pnpm does not hoist it to a
// top-level, bare-importable `node_modules/@sanity/types`, so
// `import ... from "@sanity/types"` is not resolvable from this file and
// adding it as an explicit new dependency is outside this task's scope.
//
// This has zero runtime effect: `defineField`/`defineType` are pure
// identity/type-inference helpers (`<const T>(x: T): T => x`) with no
// behavior of their own — Sanity Studio consumes plain schema objects
// either way. So this file is written as plain object literals instead,
// typed with a small local `FieldRule` interface that covers only the
// validation-builder methods actually called below (`required`, `max`,
// `uri`, `custom`, `error`). The single place this loses real type-checking
// against Sanity's internal schema types is documented in
// `../../../sanity.config.ts`, where the array this file produces crosses
// into `defineConfig()`.
//
// `groups` / field-level `group` / `orderings` / `preview.prepare()` below
// are written against the real shapes in
// `@sanity/types` (`FieldGroupDefinition`, `SortOrdering`, `PreviewConfig`)
// — confirmed by reading
// node_modules/.pnpm/@sanity+types@6.9.2_*/node_modules/@sanity/types/lib/index.d.ts
// directly rather than assumed, even though nothing here imports that
// package by name (same constraint as above).

interface FieldRuleContext {
  document?: Record<string, unknown>;
  parent?: unknown;
}

interface FieldRule {
  required(): FieldRule;
  max(limit: number): FieldRule;
  uri(options: { scheme: string[] }): FieldRule;
  custom<T = unknown>(
    fn: (value: T, context: FieldRuleContext) => true | string,
  ): FieldRule;
  error(message: string): FieldRule;
}

// `alt` subfield shared by gallery photos and inline body/bodyKo images —
// same required-when-present pattern as `coverImage.alt` below (WCAG 1.1.1:
// these are content photos from the field, not decoration, so Studio must
// give editors somewhere to type alt text, and must nudge them to fill it).
const INLINE_IMAGE_FIELDS = [
  {
    name: "alt",
    title: "Photo description (alt text)",
    type: "string",
    description:
      "A short description of what's in this photo. Read aloud by screen readers for visually impaired visitors, and shown if the photo fails to load. Required once you add a photo.",
    validation: (Rule: FieldRule) =>
      Rule.custom((alt, context) => {
        const hasImage = Boolean((context.parent as { asset?: unknown })?.asset);
        if (hasImage && !alt) return "Add a short description of this photo before publishing (needed for accessibility).";
        return true;
      }),
  },
];

// Human-readable labels for the `category` list, reused in the Studio list
// preview below so editors see "Media Coverage" instead of the raw
// "media-coverage" value. Kept local to this file (rather than imported
// from `components/ui/CategoryChip.tsx`) because the Studio schema should
// not depend on site UI components — the two lists are small and easy to
// keep in sync since both come from the same four `category` options.
const CATEGORY_LABELS: Record<string, string> = {
  "company-news": "Company News",
  "project-update": "Project Update",
  "press-release": "Press Release",
  "media-coverage": "Media Coverage",
};

function formatPublishedDate(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  // Pinned to UTC to match the public site (NewsIndex/NewsHero/
  // RelatedNews/NewsPreview all format in UTC). The Studio runs in the
  // editor's *browser* timezone, so without this an editor in Seoul saw
  // "Aug 20, 2026" in this list while the live article said "Aug 19,
  // 2026" — the same document, two dates, and no way to tell which one
  // visitors get.
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const newsPost = {
  name: "newsPost",
  title: "News Post",
  type: "document",
  // Three tabs so the form doesn't dump 17 fields on the editor at once.
  // "Content" is where a real article gets published from top to bottom;
  // the other two are explicitly optional and can be skipped entirely.
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "korean", title: "Korean (optional)" },
    { name: "settings", title: "Settings (optional)" },
  ],
  fields: [
    {
      name: "kind",
      title: "Article type",
      type: "string",
      group: "content",
      description:
        'Choose how this story was made. "Own article" lets you write the full text and add photos below. "External press coverage" is for news that another outlet wrote about us — instead of body text, you add a link to their article. This choice changes which fields appear further down this tab.',
      options: {
        list: [
          { title: "Own article (written by us)", value: "own" },
          { title: "External press coverage (link out)", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "own",
      validation: (Rule: FieldRule) =>
        Rule.required().error(
          'Choose an article type — "Own article" or "External press coverage" — before continuing.',
        ),
    },
    {
      name: "title",
      title: "Title (English — required)",
      type: "string",
      group: "content",
      description:
        "The English headline. It appears on the news list, at the top of the article page, and in Google search results — every article needs one, even if you plan to translate it later.",
      validation: (Rule: FieldRule) =>
        Rule.required()
          .error("Every article needs an English title — this is what shows on the site.")
          .max(120)
          .error("Keep the title under 120 characters so it doesn't get cut off on the site."),
    },
    {
      name: "slug",
      title: "Web address (URL)",
      type: "slug",
      group: "content",
      description:
        // Says "press Generate", not "fills in automatically". Sanity's slug
        // input does NOT derive from `source` as you type — the value stays
        // empty until the button is pressed, which then reads the title.
        // Verified in the live Studio: typing a title left this field blank
        // and flagged required, and a new article cannot be published in
        // that state. The old wording promised automatic behaviour, so the
        // first thing a new editor met was a red error with no stated fix.
        'The web address for this article, e.g. xapika.pl/news/your-title-here. Write the title above first, then press "Generate" and it fills itself in — that is all this field ever needs. Press it again if you rewrite the title before the article is published.',
      options: { source: "title", maxLength: 96 },
      validation: (Rule: FieldRule) =>
        Rule.required().error(
          'Click "Generate" next to this field to create the web address from the title.',
        ),
    },
    {
      name: "excerpt",
      title: "Summary (English — required)",
      description:
        "A short summary shown on the news list, in Google search results, and — for external press coverage — as the only text visible on our site. Keep it under 240 characters, and never copy the original article's full text here.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule: FieldRule) =>
        Rule.required()
          .error("Every article needs a short English summary — this is what shows on the news list.")
          .max(240)
          .error("Keep the summary under 240 characters so it isn't cut off on the news list or in Google."),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      description:
        "Which section this story belongs to. Shown as a small colored tag on the news list and at the top of the article, and lets visitors filter the news list.",
      options: {
        list: [
          { title: "Company News", value: "company-news" },
          { title: "Project Update", value: "project-update" },
          { title: "Press Release", value: "press-release" },
          { title: "Media Coverage", value: "media-coverage" },
        ],
      },
      validation: (Rule: FieldRule) =>
        Rule.required().error("Choose a category so this article shows up in the right filter on the news list."),
    },
    {
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      group: "content",
      description:
        // The UTC note is not pedantry. Studio's datetime input runs in the
        // editor's own timezone; the site renders every news date in UTC
        // (NewsIndex/NewsHero/RelatedNews/NewsPreview all pin it, so that
        // readers in different countries see one date). For an editor in
        // Seoul, anything before 09:00 local is still the previous day in
        // UTC — which is exactly how the seeded article came to read
        // "Aug 20" here and "Aug 19" on the site. Picking a midday time
        // makes the two agree no matter where the editor is.
        "The date shown on the article and used to sort the news list (newest first). Defaults to right now — change it if you're backdating a story or preparing one to publish later. Visitors see this date in UTC, so pick a time around midday: a very early-morning time can show up as the previous day on the site.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule: FieldRule) =>
        Rule.required().error("Set a publish date so this article can be sorted into the news list."),
    },
    {
      name: "coverImage",
      title: "Cover image (optional)",
      type: "image",
      group: "content",
      description:
        "The large photo shown at the top of the article and on its card in the news list. Optional — but if you leave it empty, a plain dashed placeholder box shows instead, so add a photo whenever you have one.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Photo description (alt text)",
          type: "string",
          description:
            'A short description of what\'s in the photo, e.g. "Xapika technicians inspecting a train bogie." Read aloud by screen readers for visually impaired visitors, and shown if the photo fails to load. Required once you upload a photo above.',
          validation: (Rule: FieldRule) =>
            Rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown })?.asset);
              if (hasImage && !alt) return "Add a short description of this photo before publishing (needed for accessibility).";
              return true;
            }),
        },
      ],
    },
    {
      name: "body",
      title: "Body (English)",
      type: "array",
      group: "content",
      description:
        'The full article text, shown on the article page. Write freely and drop photos in anywhere in the text. Required for "Own article"; hidden and unused for "External press coverage" — link to the outside article instead of copying its text (see "Link to original article" below).',
      of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "own" && (!value || (Array.isArray(value) && value.length === 0))) {
            return "Own articles need body text — write a few paragraphs here before publishing.";
          }
          return true;
        }),
    },
    {
      name: "gallery",
      title: "Photo gallery (optional)",
      type: "array",
      group: "content",
      description:
        'Extra photos shown in a gallery below the article body. Optional, and only used for "Own article".',
      of: [{ type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
    },
    {
      name: "externalUrl",
      title: "Link to original article",
      type: "url",
      group: "content",
      description:
        'The web address of the original article on the outside news site, e.g. https://www.rynek-kolejowy.pl/.... Visitors click through to read the full story there. Do not copy that outlet\'s article text into this site — link to it instead, out of respect for their copyright. Only used for "External press coverage".',
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "External coverage needs a link to the original article.";
          return true;
        })
          .uri({ scheme: ["http", "https"] })
          .error("Enter a full web address starting with http:// or https://"),
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "external",
    },
    {
      name: "externalSource",
      title: "Publication name",
      type: "string",
      group: "content",
      description:
        'The name of the outside publication that wrote about us, e.g. "Rynek Kolejowy". Shown next to this article on the news list. Only used for "External press coverage".',
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "Enter the name of the publication this coverage is from.";
          return true;
        }),
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "external",
    },
    {
      name: "titleKo",
      title: "Title (Korean — optional)",
      type: "string",
      group: "korean",
      description:
        "The Korean headline. Leave this empty and the site shows English only. Fill it in — together with the Korean summary below, and the Korean body if this is an own article — and a Korean/English switch appears on this article's page.",
    },
    {
      name: "excerptKo",
      title: "Summary (Korean — optional)",
      type: "text",
      rows: 3,
      group: "korean",
      description:
        "The Korean summary, shown when a visitor switches this article to Korean. Leave empty if you aren't translating this story.",
    },
    {
      name: "bodyKo",
      title: "Body (Korean — optional)",
      type: "array",
      group: "korean",
      description:
        'The full Korean translation of the article body. Only used for "Own article". Fill in the Korean title, summary, and this together to turn on the Korean version of this article.',
      of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
    },
    {
      name: "featured",
      title: "Pin to top of list",
      type: "boolean",
      group: "settings",
      description:
        "Highlights this article in a large, pinned spot at the top of the news list. Use it for your single most important story at a time — pinning a new article does not automatically unpin the old one, so switch this off on the previous one first.",
      initialValue: false,
    },
    {
      name: "seoTitle",
      title: "SEO title override (optional)",
      type: "string",
      group: "settings",
      description:
        "Replaces the page title Google shows in search results for this article. Optional — if left empty, the English title above is used instead.",
    },
    {
      name: "seoDescription",
      title: "SEO description override (optional)",
      type: "text",
      rows: 2,
      group: "settings",
      description:
        "Replaces the short description Google shows under the title in search results. Optional — if left empty, the English summary above is used instead.",
    },
  ],
  // Extra sort options in the document list, so the editor can find an old
  // article without scrolling through everything in default order.
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Publish date, newest first",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "publishedAtAsc",
      title: "Publish date, oldest first",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      name: "titleAsc",
      title: "Title, A–Z",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      category: "category",
      publishedAt: "publishedAt",
      externalSource: "externalSource",
      featured: "featured",
      media: "coverImage",
    },
    prepare(selection: {
      title?: string;
      kind?: string;
      category?: string;
      publishedAt?: string;
      externalSource?: string;
      featured?: boolean;
      media?: unknown;
    }) {
      const { title, kind, category, publishedAt, externalSource, featured, media } = selection;
      const categoryLabel = (category && CATEGORY_LABELS[category]) || category || "No category";
      const dateLabel = formatPublishedDate(publishedAt);
      const subtitleParts = [categoryLabel];
      if (kind === "external" && externalSource) subtitleParts.push(externalSource);
      if (dateLabel) subtitleParts.push(dateLabel);
      return {
        title: `${featured ? "📌 " : ""}${title || "Untitled article"}`,
        subtitle: subtitleParts.join(" · "),
        media,
      };
    },
  },
};
