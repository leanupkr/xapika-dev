import Image from "next/image";

type GearPhotoBreakProps = {
  src: string;
  alt: string;
};

export default function GearPhotoBreak({ src, alt }: GearPhotoBreakProps) {
  return (
    <section
      data-bg="light"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        height: "clamp(320px, 42vh, 540px)",
      }}
      aria-hidden="false"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Subtle vignette to anchor adjacent sections */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,248,250,0.65) 0%, rgba(247,248,250,0) 12%, rgba(247,248,250,0) 88%, rgba(247,248,250,0.6) 100%)",
        }}
      />
    </section>
  );
}
