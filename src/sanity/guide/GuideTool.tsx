// src/sanity/guide/GuideTool.tsx
//
// Registers as a custom Sanity Studio tool: "Guide" appears in the top nav
// next to Structure / Releases. Renders the operator guide for 비전잇
// 이주연 주임 (non-developer, first time using Sanity, Studio's own UI is
// all in English) — see the task brief this was built from for full
// context.
//
// --- `Tool` API, verified against the installed package (no guessing) ---
// node_modules/sanity/lib/index-DK84X4FB.d.ts:7712-7752:
//   interface Tool<Options = any> {
//     component: ComponentType<{ tool: Tool<Options> }>;
//     icon?: ComponentType;
//     name: string;
//     options?: Options;
//     router?: Router;
//     title: string;
//     controlsDocumentTitle?: boolean;
//     ...
//   }
// `Tool` itself is re-exported from sanity's public entry point — confirmed
// via `grep -oF " as Tool," node_modules/sanity/lib/index.d.ts`.
// `defineConfig()`'s `tools` field, same file line 7992:
//   tools?: Tool[] | ComposableOption<Tool[], ConfigContext>
// A plain `Tool[]` literal is valid config — there's no `defineTool()`
// helper to import (sanity@6.9.2's public entry point has no such export,
// same absence pattern as `defineField`/`defineType` documented in
// ../schemaTypes/newsPost.ts).
//
// --- Why no @sanity/ui, no Tailwind (checked, not assumed) --------------
// `ls node_modules/@sanity/` on this repo lists only `image-url` — no
// `ui`, no `icons`. `node -e "require.resolve('@sanity/ui')"` fails with
// MODULE_NOT_FOUND: both are transitive-only dependencies under this pnpm
// layout (the exact situation @sanity/icons is already documented in,
// see ../structure.ts). Tailwind is separately out because Studio's own
// bundle never loads the site's globals.css. So this whole guide/
// directory is plain HTML + inline styles, styled by the single scoped
// <style> tag in theme.ts — see that file's header for detail.
//
// --- Content contract -----------------------------------------------------
// The guide's actual text/screenshots live in ./content.tsx, which this
// file only imports and lays out — it never inspects what's inside beyond
// the shared `GuideSection`/`GuideBlock` shape that file exports (see its
// own header comment for the full contract: `GUIDE_SECTIONS: GuideSection[]`,
// each section a `{ id, title, blocks: GuideBlock[] }`). Block-level
// rendering (`text` | `steps` | `shot` | `mapping` | `callout`) lives in
// ./Block.tsx.

import type { Tool } from "sanity";
import { GUIDE_SECTIONS } from "./content";
import { GuideBlockView } from "./Block";
import { GuideIcon } from "./icon";
import { EnvironmentBanner } from "./EnvironmentBanner";
import { GUIDE_STYLES } from "./theme";

function GuideToolComponent() {
  return (
    <div className="xk-guide">
      <style>{GUIDE_STYLES}</style>

      <EnvironmentBanner />

      <div className="xk-guide-body">
        <nav className="xk-guide-toc" aria-label="가이드 목차">
          <p className="xk-guide-toc-label">목차</p>
          <ol>
            {GUIDE_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="xk-guide-content">
          {GUIDE_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="xk-guide-section">
              <h2>{section.title}</h2>
              {section.blocks.map((block, index) => (
                <GuideBlockView key={`${section.id}-${index}`} block={block} />
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

export const guideTool: Tool = {
  name: "guide",
  title: "Guide",
  icon: GuideIcon,
  component: GuideToolComponent,
};
