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
// `uri`, `custom`). The single place this loses real type-checking against
// Sanity's internal schema types is documented in `../../../sanity.config.ts`,
// where the array this file produces crosses into `defineConfig()`.

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
}

// `alt` subfield shared by gallery photos and inline body/bodyKo images —
// same required-when-present pattern as `coverImage.alt` below (WCAG 1.1.1:
// these are content photos from the field, not decoration, so Studio must
// give editors somewhere to type alt text, and must nudge them to fill it).
const INLINE_IMAGE_FIELDS = [
  {
    name: "alt",
    title: "Alt text",
    type: "string",
    validation: (Rule: FieldRule) =>
      Rule.custom((alt, context) => {
        const hasImage = Boolean((context.parent as { asset?: unknown })?.asset);
        if (hasImage && !alt) return "Alt text is required when a photo is set.";
        return true;
      }),
  },
];

export const newsPost = {
  name: "newsPost",
  title: "News Post",
  type: "document",
  fields: [
    {
      name: "kind",
      title: "Article type",
      type: "string",
      options: {
        list: [
          { title: "Own article (written by us)", value: "own" },
          { title: "External press coverage (link out)", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "own",
      validation: (Rule: FieldRule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title (English — required)",
      type: "string",
      validation: (Rule: FieldRule) => Rule.required().max(120),
    },
    {
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: FieldRule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt (English — required)",
      description:
        "Shown on cards, used as meta description, and as the summary for external articles.",
      type: "text",
      rows: 3,
      validation: (Rule: FieldRule) => Rule.required().max(240),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Company News", value: "company-news" },
          { title: "Project Update", value: "project-update" },
          { title: "Press Release", value: "press-release" },
          { title: "Media Coverage", value: "media-coverage" },
        ],
      },
      validation: (Rule: FieldRule) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule: FieldRule) => Rule.required(),
    },
    {
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule: FieldRule) =>
            Rule.custom((alt, context) => {
              const hasImage = Boolean((context.parent as { asset?: unknown })?.asset);
              if (hasImage && !alt) return "Alt text is required when a cover image is set.";
              return true;
            }),
        },
      ],
    },
    {
      name: "body",
      title: "Body (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "own" && (!value || (Array.isArray(value) && value.length === 0))) {
            return "Body is required for own articles.";
          }
          return true;
        }),
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
    },
    {
      name: "externalUrl",
      title: "External article URL",
      type: "url",
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "Required for external coverage.";
          return true;
        }).uri({ scheme: ["http", "https"] }),
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "external",
    },
    {
      name: "externalSource",
      title: "Source name (e.g. Rynek Kolejowy)",
      type: "string",
      validation: (Rule: FieldRule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string })?.kind;
          if (kind === "external" && !value) return "Required for external coverage.";
          return true;
        }),
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "external",
    },
    {
      name: "titleKo",
      title: "Title (Korean — optional)",
      description: "Fill this in to show an EN/KO toggle on this article's page.",
      type: "string",
    },
    { name: "excerptKo", title: "Excerpt (Korean — optional)", type: "text", rows: 3 },
    {
      name: "bodyKo",
      title: "Body (Korean — optional)",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: INLINE_IMAGE_FIELDS }],
      hidden: ({ document }: FieldRuleContext) => document?.kind !== "own",
    },
    { name: "featured", title: "Pin to top of list", type: "boolean", initialValue: false },
    { name: "seoTitle", title: "SEO title override", type: "string" },
    { name: "seoDescription", title: "SEO description override", type: "text", rows: 2 },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
};
