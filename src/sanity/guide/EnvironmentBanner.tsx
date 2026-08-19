// src/sanity/guide/EnvironmentBanner.tsx
//
// The single most important thing on this screen: which of the two Studio
// instances the editor is looking at right now, in case they land here from
// a bookmark and forget. Reads `dataset` straight from src/sanity/env.ts —
// the actual value Studio is connected to at runtime, not a guess — so this
// banner can never drift out of sync with reality.
//
// The URL pairs below are hardcoded on purpose: env.ts only ever exposes
// the Sanity *dataset* name ("development" | "production"), never the
// site's own domain — that's set per-branch in Vercel's dashboard, outside
// this repo's runtime control. The four-environment mapping matches
// .env.local.example's own table and env.ts's branch-mapping comment
// (`develop` branch -> xapika-dev-psi.vercel.app -> dataset "development";
// `main` branch -> xapika.pl / xapika.co.kr -> dataset "production") — if
// that mapping ever changes, this is the one place to update it.
//
// Fail-safe default: anything other than the literal "production" string
// (including an unset/misconfigured env) renders the orange practice
// banner, never the red live one — matching the fail-safe philosophy
// already documented in .env.local.example ("misconfigured environment
// fails safe... instead of silently reading/risking the live dataset").

import { dataset, isProductionDataset } from "../env";

const PRACTICE = {
  tone: "practice" as const,
  icon: "🧪",
  label: "연습용 (Practice)",
  message: "여기서 쓴 글은 실제 사이트에 나오지 않습니다. 마음껏 눌러보고 연습하세요.",
  site: "xapika-dev-psi.vercel.app",
  studio: "xapika-dev-psi.vercel.app/studio",
  otherLabel: "실서비스 CMS로 이동",
  otherHref: "https://xapika.pl/studio",
};

const LIVE = {
  tone: "live" as const,
  icon: "⚠️",
  label: "실서비스 (Live)",
  message: "여기서 Publish 버튼을 누르면 xapika.pl에 바로 공개됩니다.",
  site: "xapika.pl · xapika.co.kr",
  studio: "xapika.pl/studio",
  otherLabel: "연습용 CMS로 이동",
  otherHref: "https://xapika-dev-psi.vercel.app/studio",
};

export function EnvironmentBanner() {
  const env = isProductionDataset ? LIVE : PRACTICE;

  return (
    <div className={`xk-guide-banner xk-guide-banner--${env.tone}`} role="alert">
      <div className="xk-guide-banner-headline">
        <span aria-hidden="true">{env.icon}</span>
        <strong>{env.label}</strong>
        <span className="xk-guide-banner-dataset">dataset: {dataset}</span>
      </div>
      <p>{env.message}</p>
      <div className="xk-guide-banner-links">
        <span>
          사이트: <code>{env.site}</code>
        </span>
        <span>
          이 CMS: <code>{env.studio}</code>
        </span>
        <a href={env.otherHref} target="_blank" rel="noreferrer">
          {env.otherLabel} →
        </a>
      </div>
    </div>
  );
}
