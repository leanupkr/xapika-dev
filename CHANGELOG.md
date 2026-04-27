# Changelog

All notable changes to the Xapika Engineering homepage build.
This file follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
Dates correspond to PRD §17.6 milestones.

---

## [1.0.0] — 2026-04-28 — Delivery

Initial production-ready release. All sections of PRD §6, §17, and §9.6 satisfied.
Pending external dependencies are documented in [README.md → Known Limitations](./README.md#known-limitations).

### Build status
- `pnpm build` — clean, Turbopack
- `pnpm tsc --noEmit` — clean (TypeScript 5, strict mode)
- Lighthouse: Performance ≥ 90 / Accessibility 95+ targets met
- WCAG 2.1 AA compliance verified for nav, forms, focus, motion

---

## W6.5 — Documentation & Handover (2026-04-28)

### Added
- `README.md` — full rewrite for Harika ops team
- `OPERATIONS.md` — non-technical day-to-day playbook
- `CHANGELOG.md` — this file
- `.env.local.example` — refreshed with all required env vars

### Verified
- Final `pnpm build` clean
- `pnpm tsc --noEmit` clean
- `pnpm start` (production mode) — server actions, Resend integration, server-rendered pages all functional

---

## W6 — Lighthouse Performance + WCAG 2.1 AA (2026-04-27)

`6b43571` — perf: lighthouse + a11y pass

### Optimized
- Header logo: removed `priority` flag (was forcing eager load above LCP element)
- Fonts: `next/font` swap strategy + variable font subsetting
- Images: explicit `sizes` props on every `next/image`; `loading="lazy"` for below-fold
- Bundle: barrel imports eliminated; heavy components dynamic-imported
- Critical CSS: inlined via Tailwind 4

### Accessibility
- `MobileMenu` now follows full WAI-ARIA dialog pattern: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, ESC dismiss, focus restoration
- Nav: `aria-current="page"`, `aria-expanded`, `aria-controls`, `aria-pressed`
- All form fields have associated labels and `aria-describedby` for hints / errors
- Focus-visible ring: dual-variant for light and dark backgrounds
- `prefers-reduced-motion`: respected in all GSAP / Framer Motion animations
- Korean text: `word-break: keep-all` to avoid mid-word breaks

### Web Vitals
- Mounted `@vercel/speed-insights` and `@vercel/analytics` in root layout

---

## W6 — Korean Copy + Design QA (2026-04-26)

`840f5a4` — chore: korean copy + design qa pass per PRD §9.6

### Polished
- Korean copy tone: removed honorifics inconsistencies, normalized terminology
- Brand: "Warsaw HQ" unified across `en.json` + `ko.json`
- Typography: `font-feature-settings: 'kern', 'ss01', 'tnum'` enabled site-wide
- Layout: `overflow-x: clip` on body to prevent horizontal scroll

### PRD §9.6 design QA checklist swept
- 8-pt grid alignment audited
- Color contrast (text on backgrounds) verified ≥ 4.5:1
- Typography hierarchy consistent across pages
- Hover / focus / active states audited

---

## W5 — SEO Foundation (2026-04-25)

`5979f33` — feat(seo): sitemap + JSON-LD + OG + 404/500 + favicon + manifest

### Added
- `src/app/sitemap.ts` — all routes × 2 locales with hreflang `<link rel="alternate">`
- `src/app/robots.ts` — sitemap pointer; `/design-system` excluded
- `src/lib/seo.ts` — `buildPageMetadata()` helper; `BASE_URL`, `SITE_NAME` constants
- `src/components/seo/JsonLd.tsx` — Organization, WebSite, Service, CreativeWork, Place schemas
- `src/app/opengraph-image.tsx` — dynamic 1200×630 OG card per page
- `src/app/icon.tsx`, `apple-icon.tsx`, `manifest.ts` — favicons + PWA manifest
- `src/app/not-found.tsx`, `src/app/error.tsx` — branded 404 / 500 with rail-grid + bilingual EN/KO

### Configured
- `viewport.themeColor = "#0B1F3A"`
- Metadata title template: `%s | Xapika Engineering`
- Hreflang alternates emitted via `buildAlternates()` per page

---

## W5 — Site-wide Consistency (2026-04-24)

`3e9c000` — chore: site-wide consistency pass after locations+contact milestone

### Polished
- Spacing rhythm normalized across all pages (`section-pad-y` token)
- Heading hierarchy unified (H1 → H2 → H3 same pattern per page)
- Component prop signatures standardized (consistent variant naming)

---

## W5 — Contact (2026-04-23)

`82280b8` — feat(contact): resend integration + rate limit + thank-you signature
`4b9c59b` — feat(contact): page + form UI + zod validation (no email send yet)

### Added
- `src/app/[locale]/contact/page.tsx` — `ContactForm` + `ContactInfo` two-column layout
- `src/app/[locale]/contact/actions.ts` — Server Action with zod validation, honeypot, soft rate limit (3/min/IP)
- `src/lib/contactSchema.ts` — bilingual zod schema with i18n error messages
- `src/lib/resend.ts` — `isResendConfigured` guard so build / dev work without API key
- `src/app/[locale]/contact/thank-you/page.tsx` — animated track-line confirmation
- `FieldShell` wrapper for label / hint / error pattern with `aria-describedby`

---

## W5 — Locations (2026-04-22)

`63c0ec6` — feat(locations): worldmap + 9 office grid

### Added
- `src/app/[locale]/locations/page.tsx`
- `LocationsWorldMap` — `react-simple-maps` + d3-geo, hub-spoke routes from Warsaw HQ to 8 offices
- `OfficeGrid` — 9 office cards with address / phone / email
- `LocationsCta` — "Talk to a regional lead" CTA strip

---

## W4 — Portfolios (2026-04-19 → 2026-04-21)

`97d7705` — feat(portfolios): uzbekistan-rail (coming 2026.05)
`245cc7d` — feat(portfolios): warsaw-tram content
`b37044f` — feat(portfolios): ukraine-emu — story + scroll-snap gallery (signature)
`4113c15` — feat(portfolios): index page + 3 detail route scaffolds

### Added
- Portfolio index page with 3 case study cards
- 3 detail pages: `ukraine-emu`, `warsaw-tram`, `uzbekistan-rail`
- `PortfolioHero`, `PortfolioStory`, `PortfolioScrollGallery` components
- Ukraine EMU: scroll-snap gallery (signature animation per PRD §6.7)
- `RelatedProjects` cross-link on each detail page

---

## W3-4 — Solutions (2026-04-15 → 2026-04-18)

`ffce4a0` — feat(solutions): commercial-services content + page polish round
`2203f7a` — feat(solutions): digital-asset-management content + VISION IT link
`1cb435a` — feat(solutions): supply-chain content
`c5b5a34` — feat(solutions): light-maintenance content
`5648c21` — feat(solutions): heavy-maintenance content + reusable detail sections
`497dba7` — feat(solutions): index page + 5 detail route scaffolds

### Added
- Solutions index page with 5 cards
- 5 detail pages: heavy-maintenance, light-maintenance, supply-chain, digital-asset-management, commercial-services
- `SolutionDetailHero`, `WhatWeDo`, `MidCta` reusable sections
- VISION IT external link integration on Digital Asset Management page

---

## W3 — About (2026-04-13 → 2026-04-14)

`c463a84` — feat(about): page 3/3 — ceo + org chart placeholders + polish
`ccbcecc` — feat(about): page 2/3 — vision + our clients
`e675506` — feat(about): page 1/3 — header + history timeline

### Added
- About page with 5 sections: `AboutHeader`, `HistoryTimeline`, `Vision`, `OurClients`, `CeoMessage`, `OrgChart`
- CEO Message and Org Chart marked as placeholder (awaiting content per PRD §16)

---

## W2 — Home Polish + Mobile (2026-04-11 → 2026-04-12)

`581b134` — fix(mobile): bento grid + hydration mismatch fix
`fb49f4e` — fix(home): reduce vertical scroll — denser sections + 2-col portfolio
`f3e3790` — fix(mobile): map sizing, 2-col list, solutions grid, default locale
`97ae269` — feat(home): mobile polish + ambient motion + quality pass

### Polished
- Mobile responsive layouts (360px / 768px breakpoints)
- Vertical density tuned (PRD §9.6 reviewer feedback: page felt too tall)
- Default locale routing fixed (`/` → `/en`)
- Bento grid hydration mismatch resolved

---

## W2 — Home Sections 1-6 (2026-04-08 → 2026-04-10)

`afffdd5` — fix: add react-simple-maps type declaration
`3abc56d` — feat(home): Section 5 Global Presence + Section 6 Mid CTA
`8d55558` — feat(home): Section 4 — Trusted By (60s infinite marquee)
`3ff2dc8` — feat(home): Section 3 — Portfolios Preview (editorial case cards)
`d5b83ec` — feat(home): Section 2 — Solutions Grid (editorial layout, photo-first)
`8ed9b5a` — fix(key-numbers): add 'countries' unit suffix
`69da18d` — feat(home): Section 1 — Key Numbers with count-up + speedometer tick

### Added
- `KeyNumbers` — 5 stats with GSAP count-up + speedometer tick animation
- `SolutionsGrid` — editorial photo-first layout
- `PortfoliosPreview` — 3 case cards with hover gallery
- `TrustedBy` — 60s infinite marquee of 8 partner logos
- `GlobalPresence` — hub-spoke world map with ambient cycle
- `MidCta` — section divider CTA

---

## W1 — Hero Section (2026-04-04 → 2026-04-07)

`eae27a4` — fix(hero): mobile CTA visibility + tablet H1 2-line layout
`159e5da` — fix(hero): 86→90 point polish — H1 linebreak, sizing, gradient, overline, footer CTA
`fa827d1` — feat(hero): Day 2 Hero section with Space Grotesk, Ken Burns, GSAP animations

### Added
- `Hero` section: Space Grotesk display type, Ken Burns photo crossfade (5 photos), GSAP intro animations, scroll indicator with rail-track motif

---

## W1 — Bootstrap + Design System (2026-04-01 → 2026-04-03)

`e6e0141` — feat(design-system): v2 upgrade — 72 → 90 point target
`e861121` — feat: Day 1 bootstrap — design system, i18n, header/footer
`022a6ea` — Initial commit from Create Next App

### Added
- Project bootstrap: Next.js 16 App Router, TypeScript 5, Tailwind 4, pnpm
- `src/styles/tokens.css` — central design tokens (color, spacing, motion, typography)
- `src/app/globals.css` — Tailwind 4 `@theme inline` mapping + base styles
- `src/i18n/` — next-intl 4 setup with `[locale]` segment routing
- `src/messages/{en,ko}.json` — i18n message bundles
- `Header`, `Footer`, `MobileMenu`, `LanguageToggle` layout components
- `/[locale]/design-system` page — self-rendering style guide (noindex)
- GSAP 3 + `@gsap/react` + ScrollTrigger initialization (`src/lib/gsap.ts`)
- `prefers-reduced-motion` global guard

---

## Pre-build — Discovery (2026-03-25 → 2026-03-31)

- Reference research: 10 B2B rail company sites analyzed (Stadler, Alstom, Siemens Mobility, Hitachi Rail, Wabtec, Knorr-Bremse, MLT Aikins, etc.)
- Animation tech evaluation: GSAP + Framer Motion role split confirmed
- Design direction: B+A hybrid (dark-cinematic + minimalist alternation) approved
- PRD finalized: `PRD_Xapika_Homepage.md` (locked scope for v1.0)

---

[Unreleased]: https://github.com/-/-/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/-/-/releases/tag/v1.0.0
