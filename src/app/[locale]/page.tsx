import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";

export default async function HomePage() {
  const tHero = await getTranslations("hero");

  // headline에서 accent 부분 ("Safe Operations." / "안전한 운영.")을 분리
  const headline = tHero("headline");
  // 마지막 문장(마침표 포함)을 accent로 처리
  const headlineAccent = headline.includes("Safe Operations.")
    ? "Safe Operations."
    : headline.includes("안전한 운영.")
    ? "안전한 운영."
    : "";

  return (
    <>
      <Hero
        headline={headline}
        headlineAccent={headlineAccent}
        subheadline={tHero("subheadline")}
        overline={tHero("overline")}
        ctaSolutions={tHero("cta_solutions")}
        ctaContact={tHero("cta_contact")}
        ctaSolutionsHref="/solutions"
        ctaContactHref="/contact"
      />
    </>
  );
}
