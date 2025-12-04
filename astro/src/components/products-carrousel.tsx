import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { TiendaNubeProduct } from "../modules/store/tiendanube/types";

interface ProductCarouselProps {
  products: TiendaNubeProduct[] | null;
}

function formatPrice(value: string): string {
  const price = parseFloat(value);
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products?.map((product, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 px-4 py-4">
                <article className="bg-white p-4 shadow-news-card rounded-2xl mx-auto max-w-xs">
                  <div className="group">
                    <div className="relative aspect-3/4 mb-4">
                      <img
                        src={product.images[0].src}
                        alt={product.name.es}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"
                      />

                      <div className="absolute z-30 -bottom-4 right-4 bg-brand-blue border-4 border-white size-10 rounded-full text-white flex items-center justify-center">
                        <a
                          href={product.canonical_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ver ${product.name.es}`}
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
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold uppercase mb-1 text-brand-blue">
                      {product.name.es}
                    </h3>
                    <p className="text-xl text-brand-blue">
                      {formatPrice(product.variants[0].price)}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-brand-blue rounded-full p-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous product"
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-brand-blue rounded-full p-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next product"
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

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {products?.map((_, index) => (
            <button
              key={index}
              className={`size-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-brand-blue w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid gap-6 md:gap-8 grid-cols-3 place-items-center">
        {products?.map((product, index) => (
          <article
            key={index}
            className="relative z-30 w-full bg-white p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-2xl"
          >
            <div className="group">
              <div className="relative aspect-3/4 mb-4">
                <img
                  src={product.images[0].src}
                  alt={product.name.es}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"
                />

                <div className="absolute z-30 -bottom-4 right-4 bg-brand-blue border-4 border-white size-10 rounded-full text-white flex items-center justify-center">
                  <a
                    href={product.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${product.name.es}`}
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
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </a>
                </div>
              </div>
              <h3 className="text-lg font-bold uppercase mb-1 text-brand-blue">
                {product.name.es}
              </h3>
              <p className="text-xl text-brand-blue">
                {formatPrice(product.variants[0].price)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
