# Xapika Engineering Homepage

Corporate website for **Xapika Engineering** (Polish HQ; Korean entity 하리카엔지니어링) — a B2B railway maintenance company operating across 5+ countries. Bilingual (EN / KO), built with Next.js 16 App Router on a custom design system.

[![Build](https://img.shields.io/badge/build-passing-success)](#) [![Next.js](https://img.shields.io/badge/Next.js-16.2-black)](https://nextjs.org) [![License](https://img.shields.io/badge/license-Proprietary-blue)](#license)

## Quick Links

- **Production:** `https://xapika.pl` (set after Vercel domain attach)
- **Preview:** Vercel auto-creates a preview URL on every PR
- **Source:** this repository
- **Design tokens & component preview:** `/en/design-system` (noindex in production)
- **PRD:** `/Users/unvisr/Downloads/xapika-dev/PRD_Xapika_Homepage.md`

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js **16.2** (App Router, Turbopack) | RSC-first; `[locale]` segment routing |
| Runtime | React **19.2** | Server Components default; Client Components gated |
| Language | TypeScript **5** | Strict mode, `tsc --noEmit` clean |
| Styling | Tailwind CSS **4** (CSS-first) | `@theme inline` in `globals.css`; tokens in `src/styles/tokens.css` |
| i18n | **next-intl 4** | `/en/*` + `/ko/*`; typed `Link` / `usePathname` / `useRouter` |
| Animation | **GSAP 3** + **Framer Motion 12** | GSAP for scroll/timeline; FM for layout/UI state |
| Maps | **react-simple-maps 3** + d3-geo + topojson | World map + hub-spoke routes |
| Forms | **react-hook-form 7** + **zod 4** | Server Actions; bilingual error messages |
| Email | **Resend 6** | Domain-verified sender; `info@xapika.pl` recipient |
| Analytics | `@vercel/speed-insights`, `@vercel/analytics` | Mounted in root layout |
| Fonts | `next/font` (Inter, Space Grotesk) + Pretendard variable | Korean uses Pretendard fallback |
| Tooling | pnpm, ESLint, Prettier, Playwright (screenshots) | |

## Project Structure

```
xapika-web/
├── src/
│   ├── app/
│   │   ├── [locale]/                  # i18n-routed pages
│   │   │   ├── layout.tsx             # locale layout (Header/Footer/JsonLd)
│   │   │   ├── page.tsx               # Home
│   │   │   ├── about/                 # About
│   │   │   ├── solutions/             # Solutions index + 5 detail pages
│   │   │   ├── portfolios/            # Portfolios index + 3 case studies
│   │   │   ├── locations/             # Global offices map
│   │   │   ├── contact/               # Form + Server Actions + thank-you
│   │   │   └── design-system/         # Self-style guide (noindex)
│   │   ├── layout.tsx                 # Root layout (fonts, Web Vitals)
│   │   ├── globals.css                # Tailwind 4 @theme + base styles
│   │   ├── sitemap.ts / robots.ts     # SEO
│   │   ├── icon.tsx / apple-icon.tsx  # Generated favicons
│   │   ├── manifest.ts                # PWA manifest
│   │   ├── opengraph-image.tsx        # Dynamic 1200×630 OG card
│   │   ├── not-found.tsx              # Branded 404
│   │   └── error.tsx                  # Branded 500
│   │
│   ├── components/
│   │   ├── layout/                    # Header, Footer, FooterCta, MobileMenu
│   │   ├── sections/                  # Hero, KeyNumbers, GlobalPresence, etc.
│   │   ├── motion/                    # GSAP / Framer Motion wrappers
│   │   ├── seo/                       # JsonLd helpers
│   │   └── ui/                        # Primitives (Button, Input, …)
│   │
│   ├── i18n/                          # next-intl config + typed navigation
│   ├── lib/                           # cn, gsap, resend, seo, contactSchema
│   ├── messages/                      # en.json, ko.json — single source of copy
│   ├── styles/                        # tokens.css, hero.css
│   └── content/                       # Static content (case studies, etc.)
│
├── public/
│   ├── hero/                          # Hero photographs
│   ├── partners/                      # Trusted-by logos (8 SVG/PNG)
│   ├── logo.png / logo-white.png      # Brand
│   └── favicon.ico
│
├── .env.local.example                 # Required env vars (copy to .env.local)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Local Development

```bash
# 1. Install dependencies (Node 20+; pnpm 9+)
pnpm install

# 2. Configure environment
cp .env.local.example .env.local
# fill in RESEND_API_KEY etc. (see "Environment Variables" below)

# 3. Start dev server
pnpm dev
# → http://localhost:3000  (auto-redirects to /en)
```

Useful scripts:

```bash
pnpm dev          # Next dev (Turbopack)
pnpm build        # Production build
pnpm start        # Serve the production build (after `pnpm build`)
```

Type-check / lint manually:

```bash
pnpm exec tsc --noEmit
pnpm exec next lint
```

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in the values. All vars are optional in dev; the site runs without them but loses some functionality.

| Variable | Required | Default / Behavior if missing | Source |
|---|---|---|---|
| `RESEND_API_KEY` | Production only | Form accepts submissions but **does not send email** (logged server-side) | [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_FROM_EMAIL` | No | `Xapika Contact <noreply@xapika.pl>` | Must be on a Resend-verified domain |
| `CONTACT_TO_EMAIL` | No | `info@xapika.pl` | Where contact submissions land |
| `CONTACT_CC_EMAIL` | No | (none) | Optional CC recipient |
| `NEXT_PUBLIC_SITE_URL` | Production only | `https://xapika.pl` | Used by sitemap, OG, JSON-LD canonical URLs |

> **Resend domain verification.** Before production deliverability works, verify `xapika.pl` in the Resend dashboard and add the SPF / DKIM DNS records they provide. Without verification, sends will silently bounce.

## Updating Content

### Copy (text)

All user-facing strings live in `src/messages/{en,ko}.json`. Edit either file directly — both must stay in sync. No code changes needed; Next.js hot-reloads on save.

| What to change | Where |
|---|---|
| Home hero headline / subhead | `home.hero.*` |
| Key numbers (5 stats) | `home.keyNumbers.*` |
| Solutions card titles / blurbs | `solutions.cards.*` |
| Solutions detail body | `solutionsDetail.<slug>.*` |
| Portfolio case studies | `portfolios.<slug>.*` |
| Office addresses (locations) | `locations.offices.*` |
| Contact form labels / errors | `contact.form.*` |
| Footer / nav | `nav.*`, `footer.*` |

### Hero photographs

Drop new files into `public/hero/`. Recommended:

- **Format:** WebP or AVIF preferred; JPEG acceptable as fallback
- **Size:** 2560×1440 (16:9), <500 KB
- **Naming:** `hero-XX-{wide|work|detail}.jpg` — referenced from `src/components/sections/Hero.tsx`

### Partner logos (Trusted By marquee)

Drop SVG (preferred) or transparent PNG into `public/partners/`. Logos are auto-discovered if added to the manifest in `TrustedBy.tsx`. Aim for similar visual weight (~32 px logo height after rendering).

### Adding new images

Always use `next/image`:

```tsx
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="meaningful description"
  width={1280}
  height={720}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Adding a New Solution / Portfolio

The 5 solutions and 3 portfolios are content-driven, but **adding a new entry requires code changes** (new route folder + i18n keys). Steps:

1. Create `src/app/[locale]/solutions/<new-slug>/page.tsx` (copy an existing one)
2. Add `solutionsDetail.<new-slug>.*` keys to both `en.json` and `ko.json`
3. Add a card to `solutions.cards` array
4. Update `src/components/sections/SolutionsGrid.tsx` to include the new slug
5. Add the route to `src/app/sitemap.ts`

For **portfolios**, mirror under `src/app/[locale]/portfolios/<slug>/` and update `portfolios.list` + `RelatedProjects.tsx`.

## Contact Form Recipient

To change where contact submissions arrive, edit `CONTACT_TO_EMAIL` in Vercel (Settings → Environment Variables) and redeploy. No code change required.

The form has built-in protection: zod validation, honeypot field, and a soft in-memory rate limit (3 submissions / minute / IP). Production-grade rate limiting (Upstash / Vercel KV) and reCAPTCHA are **not yet wired** (see [Known Limitations](#known-limitations)).

## Deployment (Vercel)

1. Connect this repo to a Vercel project (one-time)
2. Set the env vars listed above in **Production** and **Preview** scopes
3. **Push to `main`** → Vercel auto-deploys to production
4. **Open a PR** → Vercel auto-creates a preview URL (commented on the PR)
5. To roll back, use Vercel dashboard → Deployments → "Promote to Production" on a previous build

The build command is the default `next build`. Output is server + static; no special configuration needed.

## Routing & i18n

- All pages live under `src/app/[locale]/`
- `[locale]` resolves to `en` or `ko` (configured in `src/i18n/routing.ts`)
- Visiting `/` redirects to `/en` (default locale)
- Use the typed helpers from `src/i18n/navigation.ts`:
  ```tsx
  import { Link, usePathname, useRouter } from "@/i18n/navigation";
  ```
  These automatically prepend the active locale.
- Header / Footer expose a language toggle that preserves the current path.

**Adding a third language** (e.g., Polish):

1. Add `pl` to `LOCALES` in `src/i18n/routing.ts` and `src/lib/seo.ts`
2. Create `src/messages/pl.json` (copy `en.json` and translate)
3. Update `buildAlternates()` in `src/lib/seo.ts` to emit a `pl` hreflang
4. Add the locale to the language toggle in `Header.tsx`

## Design System

A self-rendering style guide lives at **`/en/design-system`** (and `/ko/design-system`). It shows the live token values, type scale, spacing, motion easings, and component primitives. The route is `noindex` in production.

Tokens are defined in **`src/styles/tokens.css`** and consumed via Tailwind 4's `@theme inline` in `globals.css`. Notable values:

- **Primary orange:** `#f6a317` (5% usage rule)
- **Ink:** `#0B1F3A` (navy text)
- **Ink-muted:** `#475569`
- **Background:** `#F7F8FA`
- **Section spacing:** `7.5rem` desktop / `4rem` mobile
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Durations:** 200 / 320 / 480 ms
- **Max content width:** 1440 px; gutter 24 px

## Design Assets

- **Logos:** `/Users/unvisr/Downloads/xapika-dev/Harika Engineering/Harika Logo(s)/`
- **Figma:** _placeholder — link to be added once handoff file is published_
- **Reference deck:** PRD §6, §17.5

## Known Limitations

These items are tracked in PRD §16 and are pending external input or business decisions:

| Item | Status | Notes |
|---|---|---|
| CEO Message body | Placeholder | Awaiting copy from leadership |
| Organization chart image | Placeholder | Awaiting org chart asset |
| 9 office addresses + contacts | Partial | Some offices have address-only data |
| Partner logos: VISION IT, MSB Housing, Intel, Cambridge | Missing | Awaiting logo files; placeholders rendered |
| reCAPTCHA site key | Not configured | Form currently uses honeypot + soft rate limit only |
| VISION IT external URL | Placeholder | Final URL pending |
| Privacy Policy / Terms of Service | Not authored | Awaiting legal copy |
| Brand naming (Xapika vs Harika) | Resolved | Site uses "Xapika Engineering"; "하리카" only where Korean entity is referenced |

## License

This repository and its contents are **proprietary to Harika Engineering / Xapika Engineering**. Unauthorized redistribution prohibited.

For dependency licenses:

```bash
pnpm licenses list
```

---

For day-to-day operational tasks (changing copy, swapping a photo, troubleshooting email delivery), see **[OPERATIONS.md](./OPERATIONS.md)**. For the chronological build history, see **[CHANGELOG.md](./CHANGELOG.md)**.
