import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ko"],
  defaultLocale: "en",
  // 모든 locale이 동일 URL을 공유 — 언어는 cookie(NEXT_LOCALE)로 결정.
  // Accept-Language 헤더로 한국어 사용자는 자동 분기.
  localeDetection: true,
  localePrefix: "never",
});
