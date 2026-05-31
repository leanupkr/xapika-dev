/** Locale-agnostic flag lookup — accepts English and Korean country names from PDF source. */
export const FLAG_BY_COUNTRY: Record<string, string> = {
  Turkiye: "🇹🇷",
  Türkiye: "🇹🇷",
  튀르키예: "🇹🇷",
  Ukraine: "🇺🇦",
  우크라이나: "🇺🇦",
  Poland: "🇵🇱",
  폴란드: "🇵🇱",
  USA: "🇺🇸",
  미국: "🇺🇸",
  "South Korea": "🇰🇷",
  Korea: "🇰🇷",
  한국: "🇰🇷",
  Uzbekistan: "🇺🇿",
  우즈베키스탄: "🇺🇿",
};

export function flagFor(country: string): string {
  return FLAG_BY_COUNTRY[country] ?? "";
}
