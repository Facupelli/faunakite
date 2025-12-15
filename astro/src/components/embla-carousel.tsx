import { useState, useCallback, useEffect, Children } from "react";
import useEmblaCarousel from "embla-carousel-react";

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface CarouselProps {
  children: React.ReactNode;
  gridBreakpoint?: "sm" | "md" | "lg" | "xl" | "none";
  gridCols?: 2 | 3 | 4;
  loop?: boolean;
  align?: "start" | "center" | "end";
  gap?: string;
  showNavigation?: boolean;
  showDots?: boolean;
}

export default function Carousel({
  children,
  gridBreakpoint = "md",
  gridCols = 3,
  loop = true,
  align = "center",
  gap = "gap-6",
  showNavigation = true,
  showDots = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const childrenArray = Children.toArray(children);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Map breakpoints and columns to complete Tailwind classes
  const getGridClasses = () => {
    if (gridBreakpoint === "none") return "";

    const breakpointMap = {
      sm: {
        2: "sm:grid sm:grid-cols-2",
        3: "sm:grid sm:grid-cols-3",
        4: "sm:grid sm:grid-cols-4",
      },
      md: {
        2: "md:grid md:grid-cols-2",
        3: "md:grid md:grid-cols-3",
        4: "md:grid md:grid-cols-4",
      },
      lg: {
        2: "lg:grid lg:grid-cols-2",
        3: "lg:grid lg:grid-cols-3",
        4: "lg:grid lg:grid-cols-4",
      },
      xl: {
        2: "xl:grid xl:grid-cols-2",
        3: "xl:grid xl:grid-cols-3",
        4: "xl:grid xl:grid-cols-4",
      },
    };

    return breakpointMap[gridBreakpoint][gridCols];
  };

  const getHideCarouselClass = () => {
    if (gridBreakpoint === "none") {
      return "";
    }

    const hideMap = {
      sm: "sm:hidden",
      md: "md:hidden",
      lg: "lg:hidden",
      xl: "xl:hidden",
    };

    return hideMap[gridBreakpoint];
  };

  return (
    <>
      {/* Mobile/Carousel View */}
      <div className={clsx("relative", getHideCarouselClass())}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {childrenArray.map((child, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4 py-4">
                <div className="w-full h-full">{child}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {showDots && (
          <div className="flex justify-center gap-2 mt-6">
            {childrenArray.map((_, index) => (
              <button
                key={index}
                className={clsx(
                  "size-2 rounded-full transition-all",
                  index === selectedIndex
                    ? "bg-gray-800 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Grid View */}
      {gridBreakpoint !== "none" && (
        <div
          className={clsx(
            "hidden",
            getGridClasses(),
            gap,
            "place-items-center"
          )}
        >
          {childrenArray}
        </div>
      )}
    </>
  );
}
