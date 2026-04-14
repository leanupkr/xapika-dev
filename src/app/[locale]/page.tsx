import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("hero");

  return (
    <section className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center px-6">
        <h1
          className="font-heading font-bold text-ink"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
        >
          {t("headline")}
        </h1>
        <p
          className="mt-4 text-ink-muted"
          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
        >
          {t("subheadline")}
        </p>
      </div>
    </section>
  );
}
