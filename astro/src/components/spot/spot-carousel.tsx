import Carousel from "../embla-carousel";
import { ImageCard } from "./carousel-image-card";

export function TheSpotCarousel({
  images,
}: {
  images: { alt: string; src: string }[];
}) {
  return (
    <Carousel gridBreakpoint="none">
      {images?.map((image) => (
        <ImageCard src={image.src} alt={image.alt} />
      ))}
    </Carousel>
  );
}

export function CarouselWithBreakpoints({
  images,
}: {
  images: { alt: string; src: string }[];
}) {
  return (
    <Carousel gridBreakpoint="md" gridCols={4}>
      {images?.map((image) => (
        <ImageCard src={image.src} alt={image.alt} />
      ))}
    </Carousel>
  );
}
