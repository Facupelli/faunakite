import Carousel from "../embla-carousel";
import { ImageCard, KitetripImageCard } from "./carousel-image-card";

export function TheSpotCarousel({
  images,
}: {
  images: { alt: string; src: string }[];
}) {
  return (
    <Carousel
      gridBreakpoint="md" // Switch to grid at medium screens
      gridCols={2} // Show 3 images in a row
      gap="gap-6"
    >
      {images?.map((image) => (
        <ImageCard src={image.src} alt={image.alt} />
      ))}
    </Carousel>
  );
}

export function KitecampsCarousel({
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

export function KitetripsCarousel({
  images,
  showDots = true,
  showNavigation = true,
  autoplay = false,
}: {
  images: {
    alt: string;
    srcDesktop: string;
    srcMobile: string;
    width: number;
    height: number;
    className?: string;
  }[];
  showDots?: boolean;
  autoplay?: boolean;
  showNavigation?: boolean;
}) {
  return (
    <Carousel
      gridBreakpoint="none"
      showDots={showDots}
      autoplay={autoplay}
      showNavigation={showNavigation}
    >
      {images?.map((image, index) => (
        <KitetripImageCard
          key={index}
          srcDesktop={image.srcDesktop}
          srcMobile={image.srcMobile}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={image.className}
        />
      ))}
    </Carousel>
  );
}
