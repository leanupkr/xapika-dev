// src/sanity/guide/icon.tsx
//
// Icon shown next to "Guide" in Studio's top nav, alongside Structure /
// Releases. `Tool.icon` only requires `ComponentType` — no props — (see
// GuideTool.tsx's header comment for the verified `Tool` interface), and
// `@sanity/icons` isn't bare-importable under this pnpm layout (same
// situation documented in ../structure.ts), so this is a tiny inline
// component instead of an imported icon.

export function GuideIcon() {
  return (
    <span aria-hidden="true" style={{ fontSize: "1em", lineHeight: 1 }}>
      📘
    </span>
  );
}
