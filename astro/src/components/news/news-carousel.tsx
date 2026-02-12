import type { ImageAsset } from "sanity";
import Carousel from "../embla-carousel";
import { urlFor } from "../../modules/news/image.utils";

function getOptimizedImageUrl(
  image: any,
  width: number,
  format: "webp" = "webp",
) {
  return urlFor(image).width(width).format(format).quality(85).url();
}

function generateSrcSet(image: any, format: "webp" = "webp") {
  const sizes = [400, 600, 800, 1000];
  return sizes
    .map((size) => `${getOptimizedImageUrl(image, size, format)} ${size}w`)
    .join(", ");
}

export default function NewsCarousel({
  images,
}: {
  images: ImageAsset & { alt?: string }[];
}) {
  return (
    <Carousel
      gridBreakpoint="none"
      showNavigation={true}
      showDots={true}
      autoplay={false}
      loop={true}
      align="center"
    >
      {images.map((image: any) => (
        <div className="h-80 w-full">
          <picture>
            {/* WebP */}
            <source
              type="image/webp"
              srcSet={generateSrcSet(image, "webp")}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Fallback */}
            <img
              src={getOptimizedImageUrl(image, 800)}
              srcSet={generateSrcSet(image)}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={image.alt}
              width="800"
              height="800"
              className="object-cover w-full h-full rounded-2xl"
            />
          </picture>
        </div>
      ))}
    </Carousel>
  );
}
