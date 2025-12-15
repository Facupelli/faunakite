import type { TiendaNubeProduct } from "../../modules/store/tiendanube/types";

function formatPrice(value: string) {
  const price = parseFloat(value);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductCard({ product }: { product: TiendaNubeProduct }) {
  return (
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
  );
}
