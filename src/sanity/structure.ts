// src/sanity/structure.ts
//
// Custom Studio desk structure for the News editor (see task brief: the
// non-developer content owner needs "all articles" first, then quick
// draft/published/pinned/category filters — not the bare document-type
// list `structureTool()` shows by default).
//
// API verified directly against the installed package, not assumed:
// `node_modules/sanity/lib/structure.d.ts` (re-exported names) and
// `node_modules/sanity/lib/types-VXLhvnOq.d.ts` (actual declarations,
// found by following the `structure.d.ts` re-export barrel — the real
// symbol names are mangled behind single-letter aliases there, e.g.
// `StructureBuilder as R`).
//
// - `StructureResolver` type: `(S: StructureBuilder, context) => unknown`,
//   exported from `sanity/structure` (types-VXLhvnOq.d.ts:2227-2242).
// - `S.list(spec?)` / `S.listItem(spec?)` / `S.documentList(spec?)` /
//   `S.documentTypeList(typeNameOrSpec)` / `S.divider(spec?)`: all methods
//   on the `StructureBuilder` interface (types-VXLhvnOq.d.ts:1953-2065).
// - `.id()` / `.title()` fluent setters: `GenericListBuilder` base class
//   (types-VXLhvnOq.d.ts:820-833), inherited by `ListBuilder`,
//   `DocumentListBuilder` and `DocumentTypeListBuilder`.
// - `.filter()` / `.schemaType()` / `.params()` / `.defaultOrdering()`:
//   `DocumentListBuilder` methods (types-VXLhvnOq.d.ts:986-1085). `filter`
//   takes a raw GROQ string; `params` supplies `$param` bindings for it.
// - `SortOrderingItem` (`{ field: string; direction: 'asc' | 'desc' }`)
//   comes from `@sanity/types`, re-exported through the same barrel —
//   confirmed at
//   node_modules/.pnpm/@sanity+types@6.9.2_.../lib/index.d.ts:2052-2054.
// - `.icon()` exists on `ListItemBuilder` (types-VXLhvnOq.d.ts:1215-1219)
//   and accepts `React.ComponentType | React.ReactNode`, so it *could*
//   take `@sanity/icons` components — but `@sanity/icons` is only a
//   transitive dependency of `sanity` here (confirmed: resolvable inside
//   `node_modules/.pnpm/@sanity+icons@5.2.1_.../` but not as a top-level,
//   bare-importable `node_modules/@sanity/icons` under this pnpm layout —
//   `node -e "require.resolve('@sanity/icons')"` fails). Importing it
//   directly from this file would be importing a package that isn't an
//   installed dependency, so every `.icon()` call below is intentionally
//   omitted rather than guessed at.
//
// Draft vs. published is not a schema field — Sanity's native draft
// system prefixes the *document id* with `drafts.` while the document is
// unpublished (the id reverts to bare `<type>.<key>` on publish). GROQ's
// `path()` glob matcher is the documented way to test that prefix, e.g.
// the pattern used throughout Sanity's own docs and structure-tool
// examples: `_id in path("drafts.**")`.

import type { StructureResolver } from "sanity/structure";

const NEWS_POST_TYPE = "newsPost";

const CATEGORIES: Array<{ title: string; value: string }> = [
  { title: "Company News", value: "company-news" },
  { title: "Project Update", value: "project-update" },
  { title: "Press Release", value: "press-release" },
  { title: "Media Coverage", value: "media-coverage" },
];

// Newest first everywhere — this is the 90% case for the person running
// this Studio (see task brief), so it's the shared default rather than
// something only the top-level list gets.
const LATEST_FIRST: Array<{ field: string; direction: "asc" | "desc" }> = [
  { field: "publishedAt", direction: "desc" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Xapika News")
    .items([
      S.listItem()
        .id("all-articles")
        .title("All articles")
        .child(
          S.documentTypeList(NEWS_POST_TYPE)
            .id("all-articles")
            .title("All articles")
            .defaultOrdering(LATEST_FIRST),
        ),

      S.divider(),

      S.listItem()
        .id("drafts")
        .title("Drafts")
        .child(
          S.documentList()
            .id("drafts")
            .title("Drafts")
            .schemaType(NEWS_POST_TYPE)
            .filter(`_type == "${NEWS_POST_TYPE}" && _id in path("drafts.**")`)
            .defaultOrdering(LATEST_FIRST),
        ),
      S.listItem()
        .id("published")
        .title("Published")
        .child(
          S.documentList()
            .id("published")
            .title("Published")
            .schemaType(NEWS_POST_TYPE)
            .filter(`_type == "${NEWS_POST_TYPE}" && !(_id in path("drafts.**"))`)
            .defaultOrdering(LATEST_FIRST),
        ),

      S.divider(),

      S.listItem()
        .id("pinned")
        .title("Pinned")
        .child(
          S.documentList()
            .id("pinned")
            .title("Pinned")
            .schemaType(NEWS_POST_TYPE)
            .filter(`_type == "${NEWS_POST_TYPE}" && featured == true`)
            .defaultOrdering(LATEST_FIRST),
        ),

      S.divider(),

      S.listItem()
        .id("by-category")
        .title("By category")
        .child(
          S.list()
            .id("by-category")
            .title("By category")
            .items(
              CATEGORIES.map(({ title, value }) =>
                S.listItem()
                  .id(`category-${value}`)
                  .title(title)
                  .child(
                    S.documentList()
                      .id(`category-${value}-list`)
                      .title(title)
                      .schemaType(NEWS_POST_TYPE)
                      .filter(`_type == "${NEWS_POST_TYPE}" && category == $category`)
                      .params({ category: value })
                      .defaultOrdering(LATEST_FIRST),
                  ),
              ),
            ),
        ),
    ]);
