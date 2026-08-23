// src/sanity/guide/theme.ts
//
// Self-contained styling for the Guide tool. Verified before writing a
// single line here: `ls node_modules/@sanity/` lists only `image-url` (no
// `ui`, no `icons`), and `node -e "require.resolve('@sanity/ui')"` fails
// with MODULE_NOT_FOUND — @sanity/ui is a transitive-only dependency under
// this pnpm layout (same situation @sanity/icons is already in, documented
// in ../structure.ts). Tailwind is also out: Studio's own bundle never
// loads the site's globals.css, so Tailwind utility classes silently do
// nothing here.
//
// So: one scoped CSS string, injected once via a plain <style> tag by
// GuideTool.tsx, plus a couple of raw color values other files need for
// inline styles. Everything lives under the `.xk-guide` root class so it
// can never leak into / clash with Studio's own chrome.
//
// Supports the viewer's OS light/dark preference via
// `prefers-color-scheme` — Studio itself doesn't expose its own
// light/dark toggle state to plain DOM code without @sanity/ui's theme
// context, so system preference is the only signal available here.

export const GUIDE_STYLES = `
.xk-guide {
  --xk-ink: #15171c;
  --xk-ink-soft: #4b5160;
  --xk-paper: #ffffff;
  --xk-paper-soft: #f6f6f8;
  --xk-border: rgba(21, 23, 28, 0.14);
  --xk-accent: #2f6fed;
  --xk-accent-soft: #eaf1fe;
  --xk-radius: 6px;
  --xk-code-bg: #eef0f3;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif;
  color: var(--xk-ink);
  background: var(--xk-paper);
  word-break: keep-all;
  line-height: 1.65;
  min-height: 100%;
  padding-bottom: 80px;
}

@media (prefers-color-scheme: dark) {
  .xk-guide {
    --xk-ink: #e7e9ee;
    --xk-ink-soft: #a7adba;
    --xk-paper: #14161b;
    --xk-paper-soft: #1b1e25;
    --xk-border: rgba(231, 233, 238, 0.16);
    --xk-accent: #6d9bff;
    --xk-accent-soft: rgba(109, 155, 255, 0.14);
    --xk-code-bg: #22262f;
  }
}

.xk-guide *, .xk-guide *::before, .xk-guide *::after { box-sizing: border-box; }

/* ---- environment banner ---------------------------------------------- */
.xk-guide-banner {
  margin: 20px 24px 0;
  padding: 16px 20px;
  border-radius: var(--xk-radius);
  border: 1.5px solid transparent;
}
.xk-guide-banner--practice {
  background: #fff4e2;
  border-color: #f0ad4e;
  color: #7a3e02;
}
.xk-guide-banner--live {
  background: #fdecea;
  border-color: #e5766c;
  color: #7a1712;
}
@media (prefers-color-scheme: dark) {
  .xk-guide-banner--practice { background: #3a2a10; border-color: #8a5a1c; color: #ffcf8a; }
  .xk-guide-banner--live { background: #3a1512; border-color: #9c3a32; color: #ffb3ac; }
}
.xk-guide-banner-headline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  margin-bottom: 4px;
}
.xk-guide-banner-headline strong { font-size: 16.5px; }
.xk-guide-banner-dataset {
  margin-left: auto;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  font-size: 11px;
  opacity: 0.75;
}
.xk-guide-banner p { margin: 4px 0 10px; font-size: 13.5px; }
.xk-guide-banner-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  align-items: center;
  font-size: 12.5px;
}
.xk-guide-banner-links code {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  background: rgba(0, 0, 0, 0.07);
  padding: 1px 6px;
  border-radius: 4px;
}
.xk-guide-banner-links a { color: inherit; font-weight: 700; text-decoration: underline; }

/* ---- layout ------------------------------------------------------------ */
.xk-guide-body {
  display: grid;
  grid-template-columns: 224px minmax(0, 1fr);
  gap: 36px;
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
}
@media (max-width: 760px) {
  .xk-guide-body { grid-template-columns: minmax(0, 1fr); }
  .xk-guide-toc { position: static; }
}

.xk-guide-toc { position: sticky; top: 12px; align-self: start; }
.xk-guide-toc-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--xk-ink-soft);
  margin: 0 0 8px;
}
.xk-guide-toc ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.xk-guide-toc a {
  display: block;
  padding: 6px 8px;
  border-radius: 4px;
  color: var(--xk-ink-soft);
  text-decoration: none;
  font-size: 13px;
  line-height: 1.4;
}
.xk-guide-toc a:hover, .xk-guide-toc a:focus-visible { background: var(--xk-paper-soft); color: var(--xk-ink); }

.xk-guide-section {
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid var(--xk-border);
  scroll-margin-top: 16px;
}
.xk-guide-section:first-child { border-top: none; margin-top: 0; padding-top: 0; }
.xk-guide-section h2 { font-size: 21px; margin: 0 0 14px; }

/* ---- content primitives ------------------------------------------------ */
.xk-guide-p { margin: 0 0 12px; font-size: 14.5px; color: var(--xk-ink); }
.xk-guide-code {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  background: var(--xk-code-bg);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.88em;
  white-space: nowrap;
}

.xk-guide-steps { margin: 0 0 16px; padding-left: 22px; font-size: 14.5px; }
.xk-guide-steps li { margin-bottom: 8px; }

.xk-guide-table-wrap { overflow-x: auto; margin: 12px 0 18px; border: 1px solid var(--xk-border); border-radius: var(--xk-radius); }
.xk-guide-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.xk-guide-table th, .xk-guide-table td {
  border-bottom: 1px solid var(--xk-border);
  padding: 9px 12px;
  text-align: left;
  vertical-align: top;
}
.xk-guide-table tr:last-child td { border-bottom: none; }
.xk-guide-table th { background: var(--xk-paper-soft); font-weight: 600; white-space: nowrap; }

.xk-guide-callout {
  display: flex;
  gap: 10px;
  border: 1.5px solid var(--xk-border);
  border-radius: var(--xk-radius);
  padding: 12px 14px;
  margin: 0 0 16px;
  font-size: 13.5px;
}
.xk-guide-callout-icon { flex: none; line-height: 1.4; }
.xk-guide-callout--info { background: var(--xk-accent-soft); border-color: var(--xk-accent); }
.xk-guide-callout--warning { background: #fff4e2; border-color: #f0ad4e; }
.xk-guide-callout--danger { background: #fdecea; border-color: #e5766c; }
@media (prefers-color-scheme: dark) {
  .xk-guide-callout--warning { background: #3a2a10; border-color: #8a5a1c; }
  .xk-guide-callout--danger { background: #3a1512; border-color: #9c3a32; }
}

/* ---- drawn browser address bar (kind: "urlbar") -------------------------
   Not a screenshot — see the GuideBlock union in content.tsx for why the
   two Studio URLs are drawn rather than photographed. The dev bar is
   deliberately the calm one and the prod bar the loud one: §1 is asking
   the reader to notice which of the two they are looking at, and "loud
   means live" is the association worth building. */
.xk-guide-urlbar { margin: 14px 0 20px; }
.xk-guide-urlbar-chrome {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1.5px solid var(--xk-border);
  border-radius: var(--xk-radius);
  background: var(--xk-paper-soft);
}
.xk-guide-urlbar-dots { display: flex; gap: 5px; flex: none; }
.xk-guide-urlbar-dots i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--xk-border);
}
.xk-guide-urlbar-field {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border-radius: 999px;
  background: var(--xk-paper);
  border: 1px solid var(--xk-border);
}
.xk-guide-urlbar-lock { flex: none; font-size: 10px; line-height: 1; }
.xk-guide-urlbar-url {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 12.5px;
  /* These URLs are long and must stay readable at any panel width — the
     Studio pane this renders in is resizable and often narrow. */
  overflow-wrap: anywhere;
}
.xk-guide-urlbar-badge {
  flex: none;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid transparent;
}
.xk-guide-urlbar--dev .xk-guide-urlbar-badge { background: var(--xk-accent-soft); border-color: var(--xk-accent); }
.xk-guide-urlbar--prod .xk-guide-urlbar-chrome { border-color: #e5766c; }
.xk-guide-urlbar--prod .xk-guide-urlbar-badge { background: #fdecea; border-color: #e5766c; color: #8a2c22; }
@media (prefers-color-scheme: dark) {
  .xk-guide-urlbar--prod .xk-guide-urlbar-badge { background: #3a1512; border-color: #9c3a32; color: #f0b3ab; }
}
.xk-guide-urlbar figcaption { font-size: 12.5px; color: var(--xk-ink-soft); margin-top: 6px; }

/* ---- screenshot slot ---------------------------------------------------- */
.xk-guide-shot { margin: 14px 0 20px; }
.xk-guide-shot-img {
  max-width: 100%;
  border: 1px solid var(--xk-border);
  border-radius: var(--xk-radius);
  cursor: zoom-in;
  display: block;
}
.xk-guide-shot figcaption { font-size: 12.5px; color: var(--xk-ink-soft); margin-top: 6px; }
.xk-guide-shot-placeholder {
  border: 1.5px dashed var(--xk-border);
  border-radius: var(--xk-radius);
  padding: 28px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--xk-ink-soft);
  background: var(--xk-paper-soft);
}
.xk-guide-shot-placeholder-name { display: block; margin-top: 4px; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11.5px; opacity: 0.85; }

.xk-guide-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 12, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
  padding: 40px;
}
.xk-guide-lightbox img { max-width: 100%; max-height: 100%; border-radius: 4px; cursor: default; }
.xk-guide-lightbox-close {
  position: absolute;
  top: 18px;
  right: 22px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 10px;
}
`;
