import SanityImage from "@/components/ui/SanityImage";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionOverline from "@/components/ui/SectionOverline";
import type { NewsImage } from "@/sanity/types";

type NewsGalleryProps = {
  images: ReadonlyArray<NewsImage>;
};

/** Image gallery for "own" articles — only ever rendered when `gallery` has entries. */
export default function NewsGallery({ images }: NewsGalleryProps) {
  if (images.length === 0) return null;

  return (
    <SectionContainer className="pt-6 pb-16">
      <SectionOverline>Gallery</SectionOverline>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {images.map((image, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden border border-ink/12"
          >
            <SanityImage
              image={image}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
